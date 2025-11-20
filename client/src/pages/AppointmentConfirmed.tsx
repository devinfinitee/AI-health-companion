import { CheckCircle2, Calendar, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { get } from "@/lib/api";
import gsap from "gsap";

export default function AppointmentConfirmed() {
  const [, setLocation] = useLocation();
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [appointment, setAppointment] = useState<{
    confirmationCode?: string;
    patientName?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    department?: string;
    reason?: string;
  } | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [isLoadingUpcoming, setIsLoadingUpcoming] = useState(false);
  const [upcomingError, setUpcomingError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastAppointment");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAppointment(parsed);
      } catch (e) {
        console.error("Failed to parse lastAppointment from localStorage", e);
      }
    }

    const loadUpcoming = async () => {
      try {
        setIsLoadingUpcoming(true);
        setUpcomingError(null);
        const res = await get("/appointments");
        const list = res?.data?.appointments || [];

        const now = new Date();
        const upcoming = list
          .filter((apt: any) => apt.appointmentDate && new Date(apt.appointmentDate) >= now)
          .sort(
            (a: any, b: any) =>
              new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime()
          )
          .slice(0, 5);

        setUpcomingAppointments(upcoming);
      } catch (error: any) {
        console.error("Failed to load upcoming appointments:", error);
        setUpcomingError(error?.message || "Failed to load upcoming appointments.");
      } finally {
        setIsLoadingUpcoming(false);
      }
    };

    loadUpcoming();

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.6,
          ease: "back.out(1.7)"
        });
      }

      if (cardRef.current) {
        gsap.from(cardRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: 0.3,
          ease: "power2.out"
        });
      }

      const listItems = listRef.current?.querySelectorAll(".appointment-item");
      if (listItems && listItems.length > 0) {
        gsap.from(listItems, {
          opacity: 0,
          x: -30,
          stagger: 0.1,
          duration: 0.5,
          delay: 0.5,
          ease: "power2.out"
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <AnimatedPage className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8" ref={headerRef}>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">
            Appointment Confirmed!
          </h1>
        </div>

        <Card className="mb-8 border-primary/20 bg-primary/5" ref={cardRef}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-3">
                  Your appointment is scheduled.
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Patient:</span>{" "}
                    {appointment?.patientName || "Not available"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Department:</span>{" "}
                    {appointment?.department || "Not specified"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Date:</span>{" "}
                    {appointment?.appointmentDate
                      ? new Date(appointment.appointmentDate).toLocaleDateString()
                      : "Not available"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Time:</span>{" "}
                    {appointment?.appointmentTime || "Not available"}
                  </p>
                  {appointment?.confirmationCode && (
                    <p className="text-sm">
                      <span className="font-medium">Confirmation Code:</span>{" "}
                      {appointment.confirmationCode}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" data-testid="button-add-to-calendar">
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button size="sm" variant="outline" data-testid="button-whatsapp-reminder">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Get WhatsApp Reminder
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-6" ref={listRef}>
          <h2 className="font-heading font-semibold text-xl mb-4">Upcoming Appointments</h2>
          {upcomingError && (
            <p className="text-sm text-red-500 mb-2">{upcomingError}</p>
          )}
          {isLoadingUpcoming ? (
            <p className="text-sm text-muted-foreground">Loading your upcoming appointments...</p>
          ) : upcomingAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">You have no upcoming appointments yet.</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt: any) => (
                <Card
                  key={apt._id}
                  className="appointment-item hover-elevate"
                  data-testid={`card-appointment-${apt._id}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {apt.department
                            ? apt.department
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                            : "AP"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{apt.department || "Appointment"}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.appointmentDate
                            ? new Date(apt.appointmentDate).toLocaleDateString()
                            : ""}
                          {apt.appointmentTime ? ` at ${apt.appointmentTime}` : ""}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={() => setLocation("/")}
          variant="outline"
          className="w-full"
          data-testid="button-back-to-dashboard"
        >
          Back to Dashboard
        </Button>
      </div>
    </AnimatedPage>
  );
}
