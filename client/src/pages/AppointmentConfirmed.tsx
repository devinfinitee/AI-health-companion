import { CheckCircle2, Calendar, Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

export default function AppointmentConfirmed() {
  const [, setLocation] = useLocation();

  // todo: remove mock functionality
  const upcomingAppointments = [
    { id: "1", date: "Oct 26, 2024", time: "9:00 AM", doctor: "Dr. Jill Moe" },
    { id: "2", date: "Oct 30, 2024", time: "2:00 PM", doctor: "Dr. Tim Noe" },
    { id: "3", date: "Nov 3, 2024", time: "10:00 AM", doctor: "Dr. Popular" },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">
            Appointment Confirmed!
          </h1>
        </div>

        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm mb-3">
                  Your appointment with <span className="font-semibold">Dr. Anya Sharma</span> is scheduled.
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Date:</span> Tuesday, Oct 26, 2024
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Reason for Visit:</span> Follow-up on headaches
                  </p>
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

        <div className="mb-6">
          <h2 className="font-heading font-semibold text-xl mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {upcomingAppointments.map((apt) => (
              <Card key={apt.id} className="hover-elevate" data-testid={`card-appointment-${apt.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {apt.doctor.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{apt.doctor}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.date} at {apt.time}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-view-${apt.id}`}>
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
    </div>
  );
}
