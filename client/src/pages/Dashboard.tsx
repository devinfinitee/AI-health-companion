import { Heart, Calendar, Book } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import VoiceButton from "@/components/VoiceButton";
import HealthCard from "@/components/HealthCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const quickActions = [
    { label: "Symptom Checker", path: "/symptoms", testId: "button-symptom-checker" },
    { label: "View Appointments", path: "/appointments", testId: "button-view-appointments" },
    { label: "Profile Settings", path: "/profile", testId: "button-profile-settings" },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-purple-950/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight">
              Your Partner in <span className="text-primary">Health.</span>
              <br />
              Health. Simplified
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Voice-guided navigation for health, and
            </p>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
                <div className="relative">
                  <VoiceButton size="large" onActivate={() => setLocation("/chat")} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Talk to your AI</p>
                <p className="text-sm text-muted-foreground">Health Companion</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Dashboard Cards */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HealthCard
              title="My Health Summary"
              description="View recent activity"
              icon={Heart}
              onClick={() => setLocation("/health-summary")}
            />
            <HealthCard
              title="Book an Appointment"
              description="Schedule next visit, get reminders via WhatsApp"
              icon={Calendar}
              onClick={() => setLocation("/book-appointment")}
            />
            <HealthCard
              title="Health Resources"
              description="Explore articles & tips"
              icon={Book}
              onClick={() => setLocation("/resources")}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="font-heading font-semibold text-xl mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.path}
                onClick={() => setLocation(action.path)}
                data-testid={action.testId}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Footer Info Section */}
        <div className="border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AI
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-heading font-semibold mb-1">AI Health Companion</h3>
                <p className="text-sm text-muted-foreground">Choele Nkolifi Ronnev</p>
                <p className="text-sm text-muted-foreground">Koron Cstibrn 02 ssmagsd</p>
                <p className="text-sm text-muted-foreground">Bristol</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Contact Information</p>
              <p className="text-sm text-muted-foreground">Hesolo msvpiscormot.com</p>
              <p className="text-sm text-muted-foreground">Ostexdis 269 3283 7333</p>
              <p className="text-sm text-muted-foreground">tomog bliostel's Companionsol.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
