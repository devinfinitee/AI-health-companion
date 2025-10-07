import { Heart, Calendar, Book, Facebook, Twitter, Instagram } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import doctorImage from "@assets/Gemini_Generated_Image_ne4wtgne4wtgne4w_1759860122103.png";
import { Mic } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      {/* Hero Section with Background */}
      <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-purple-950/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div>
              <h1 className="font-heading font-bold text-[#2D3B6F] dark:text-primary text-4xl md:text-5xl mb-3 leading-tight">
                Your Partner in Health.
                <br />
                Health. Simplified
              </h1>
              <p className="text-[#6B7280] dark:text-muted-foreground text-base mb-6">
                Voice-guided navigation for health, and
              </p>
            </div>

            {/* Right Image with Voice Button */}
            <div className="relative flex justify-center md:justify-end">
              <img 
                src={doctorImage} 
                alt="Healthcare professionals" 
                className="w-full max-w-md"
              />
              <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-3xl"></div>
                  <button
                    onClick={() => setLocation("/chat")}
                    data-testid="button-voice-assistant"
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center justify-center text-white shadow-2xl hover:scale-105 transition-transform"
                  >
                    <Mic className="w-12 h-12 mb-2" />
                    <span className="text-xs text-center px-4">Talk to your AI<br />Health Companion</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Dashboard Cards */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover-elevate cursor-pointer border-0 shadow-sm" onClick={() => setLocation("/health-summary")} data-testid="card-my-health-summary">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground mb-2">My Health Summary</h3>
                <p className="text-sm text-muted-foreground">View recent activity</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate cursor-pointer border-0 shadow-sm" onClick={() => setLocation("/book-appointment")} data-testid="card-book-an-appointment">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground mb-2">Book an Appointment</h3>
                <p className="text-sm text-muted-foreground">Schedule next visit, get reminders via WhatsApp</p>
              </CardContent>
            </Card>

            <Card className="hover-elevate cursor-pointer border-0 shadow-sm" onClick={() => setLocation("/resources")} data-testid="card-health-resources">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Book className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground mb-2">Health Resources</h3>
                <p className="text-sm text-muted-foreground">Explore articles & tips</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 text-center">
          <div className="flex justify-center flex-wrap gap-3">
            <Button onClick={() => setLocation("/symptoms")} data-testid="button-symptom-checker">
              Symptom Checker
            </Button>
            <Button onClick={() => setLocation("/appointments")} data-testid="button-view-appointments">
              View Appointments
            </Button>
            <Button variant="outline" onClick={() => setLocation("/profile")} data-testid="button-profile-settings">
              Profile Settings
            </Button>
          </div>
        </div>

        {/* Footer Info Section */}
        <div className="border-t pt-8">
          <h2 className="font-heading font-semibold text-lg text-[#2D3B6F] dark:text-foreground mb-6">Quick Actions</h2>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex items-start gap-4">
              <Avatar className="w-14 h-14">
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white">
                  AI
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-[#2D3B6F] dark:text-foreground">AI Health Companion</h3>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Choele Nkolifi Ronnev</p>
              <p>Koron Cstibrn 02 ssmagsd</p>
              <p>Bristol</p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Hesolo msvpiscormot.com</p>
              <p>Ostexdis 269 3283 7333</p>
              <p>tomog bliostel's Companionsol.com</p>
            </div>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
