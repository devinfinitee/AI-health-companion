import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import gsap from "gsap";

export default function BookAppointment() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [reason, setReason] = useState("");
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

  const timeSlots = ["9:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"];
  const reasonOptions = ["Follow-up", "New Concern", "Medication Review"];

  const handleConfirm = () => {
    if (date && selectedTime && reason) {
      setLocation("/appointment-confirmed");
      console.log('Appointment booked:', { date, selectedTime, reason });
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8" ref={headerRef}>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground">Voice-guided navigation enabled</p>
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

          {/* Reason for Visit */}
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="font-heading text-lg">Reason for Visit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Describe your symptoms or reason for visit..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                data-testid="input-appointment-reason"
              />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-2">
                  {reasonOptions.map((option) => (
                    <Badge
                      key={option}
                      variant="outline"
                      className="cursor-pointer hover-elevate"
                      onClick={() => {
                        setReason(option);
                        console.log('Reason selected:', option);
                      }}
                      data-testid={`badge-reason-${option.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <h3 className="font-medium text-sm">Appointment Summary</h3>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      Date: {date ? date.toLocaleDateString() : "Not selected"}
                    </p>
                    <p className="text-muted-foreground">
                      Time: {selectedTime || "Not selected"}
                    </p>
                    <p className="text-muted-foreground">
                      Reason: {reason || "Not specified"}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleConfirm}
                  disabled={!date || !selectedTime || !reason}
                  className="w-full mt-4"
                  data-testid="button-confirm-appointment"
                >
                  Confirm Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
