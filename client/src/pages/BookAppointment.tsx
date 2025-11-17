import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import gsap from "gsap";
import AnimatedPage from "@/components/AnimatedPage";
import VoiceAssistant from "@/components/VoiceAssistant";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { post } from "@/lib/api";

export default function BookAppointment() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [formData, setFormData] = useState({
    patientName: user?.fullName || "",
    patientEmail: user?.email || "",
    patientPhone: "",
    department: "",
    reason: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.6,
          ease: "power2.out"
        });
      }

      const cards = cardsRef.current?.querySelectorAll(".card-item");
      if (cards && cards.length > 0) {
        gsap.from(cards, {
          opacity: 0,
          y: 30,
          stagger: 0.2,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out"
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
  const departments = [
    "General Practice",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Mental Health",
  ];
  const reasonOptions = ["Follow-up", "New Concern", "Medication Review", "Check-up"];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleConfirm = async () => {
    // Validate all required fields
    if (!date || !selectedTime || !formData.patientName || !formData.patientEmail || 
        !formData.patientPhone || !formData.department || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send appointment data to backend
      const response = await post("/appointments", {
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        patientPhone: formData.patientPhone,
        appointmentDate: date.toISOString(),
        appointmentTime: selectedTime,
        department: formData.department,
        reason: formData.reason,
        notes: formData.notes,
      });

      if (response.success) {
        toast({
          title: "Success!",
          description: `Appointment booked! Confirmation code: ${response.data.appointment.confirmationCode}`,
        });

        // Store confirmation code for the confirmation page
        localStorage.setItem("lastAppointment", JSON.stringify(response.data.appointment));

        // Navigate to confirmation page
        setLocation("/appointment-confirmed");
      }
    } catch (error: any) {
      console.error("Appointment booking error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8" ref={headerRef}>
          <div className="flex items-center justify-center gap-3 mb-3">
            <h1 className="font-heading font-bold text-3xl md:text-4xl">
              {t("dashboard.bookAppointment")}
            </h1>
            <VoiceAssistant
              textToRead={t("dashboard.bookAppointment.description")}
              ttsOnly
              size="md"
            />
          </div>
          <p className="text-muted-foreground">{t("dashboard.bookAppointment.description")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6" ref={cardsRef}>
          {/* Date & Time Selection */}
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Date & Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                data-testid="calendar-appointment"
              />
              
              <div>
                <p className="text-sm font-medium mb-2">Available time slots:</p>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => {
                        setSelectedTime(time);
                        console.log('Time selected:', time);
                      }}
                      data-testid={`button-time-${time.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Information */}
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Patient Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="patientName">Full Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => handleInputChange("patientName", e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="patientEmail">Email *</Label>
                <Input
                  id="patientEmail"
                  type="email"
                  value={formData.patientEmail}
                  onChange={(e) => handleInputChange("patientEmail", e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="patientPhone">Phone Number *</Label>
                <Input
                  id="patientPhone"
                  type="tel"
                  value={formData.patientPhone}
                  onChange={(e) => handleInputChange("patientPhone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange("department", value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  placeholder="Describe your symptoms..."
                  required
                />
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground mb-2">Quick select:</p>
                  <div className="flex flex-wrap gap-2">
                    {reasonOptions.map((option) => (
                      <Badge
                        key={option}
                        variant="outline"
                        className="cursor-pointer hover-elevate"
                        onClick={() => handleInputChange("reason", option)}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>

              <div className="pt-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-medium text-sm">Appointment Summary</h3>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      <strong>Patient:</strong> {formData.patientName || "Not entered"}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Department:</strong> {formData.department || "Not selected"}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Date:</strong> {date ? date.toLocaleDateString() : "Not selected"}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Time:</strong> {selectedTime || "Not selected"}
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Reason:</strong> {formData.reason || "Not specified"}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleConfirm}
                  disabled={isLoading || !date || !selectedTime || !formData.patientName || 
                           !formData.patientEmail || !formData.patientPhone || 
                           !formData.department || !formData.reason}
                  className="w-full mt-4"
                  data-testid="button-confirm-appointment"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Appointment"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AnimatedPage>
  );
}
