import { Heart, Calendar, Book, Activity, Eye, Stethoscope } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import VoiceButton from "@/components/VoiceButton";
import HealthCard from "@/components/HealthCard";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const quickActions = [
    { label: "Symptom Checker", path: "/symptoms", testId: "button-symptom-checker" },
    { label: "View Appointments", path: "/appointments", testId: "button-view-appointments" },
    { label: "Profile Settings", path: "/profile", testId: "button-profile-settings" },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-heading font-bold text-4xl md:text-5xl mb-4">
            Your Partner in <span className="text-primary">Health.</span>
            <br />
            Health. Simplified.
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Voice-guided navigation for health, and personalized guidance
          </p>
          
          <div className="flex justify-center mb-4">
            <VoiceButton size="large" onActivate={() => setLocation("/chat")} />
          </div>
          <p className="text-sm text-muted-foreground">Talk to your AI Health Companion</p>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-12">
          <h2 className="font-heading font-semibold text-2xl mb-6">Dashboard</h2>
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
        <div>
          <h2 className="font-heading font-semibold text-2xl mb-6">Quick Actions</h2>
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

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-1">AI Health Companion</h3>
              <p className="text-sm text-muted-foreground">24/7 personalized health guidance</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-1">Expert Care</h3>
              <p className="text-sm text-muted-foreground">Connect with healthcare professionals</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
              <Eye className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold mb-1">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Monitor your health journey</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
