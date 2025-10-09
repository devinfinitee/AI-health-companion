import { User, Globe, Bell, Volume2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import AnimatedPage from "@/components/AnimatedPage";

export default function Profile() {
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
          stagger: 0.15,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out"
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <AnimatedPage className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8" ref={headerRef}>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">Profile Settings</h1>
          <p className="text-muted-foreground">Personalized Guidance, Simplified Care</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6" ref={cardsRef}>
          {/* Account Information */}
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    JD
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Full Name</label>
                <Input defaultValue="John Doe" data-testid="input-full-name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email Address</label>
                <Input defaultValue="john@example.com" type="email" data-testid="input-email" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone Number</label>
                <Input defaultValue="+1 234 567 8900" type="tel" data-testid="input-phone" />
              </div>
            </CardContent>
          </Card>

          {/* Language & Region */}
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Preferred Language</label>
                <Select defaultValue="english">
                  <SelectTrigger data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Country/Region</label>
                <Select defaultValue="us">
                  <SelectTrigger data-testid="select-region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">SMS Reminders</p>
                  <p className="text-xs text-muted-foreground">Get text notifications</p>
                </div>
                <Switch defaultChecked data-testid="switch-sms" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email Updates</p>
                  <p className="text-xs text-muted-foreground">Receive health tips</p>
                </div>
                <Switch data-testid="switch-email" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">High Contrast Mode</p>
                  <p className="text-xs text-muted-foreground">Improve visibility</p>
                </div>
                <Switch data-testid="switch-contrast" />
              </div>
            </CardContent>
          </Card>

          {/* Voice Assistant */}
          <Card className="card-item">
            <CardHeader>
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Volume2 className="w-5 h-5" />
                Voice Assistant
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Voice Assistant Speed</p>
                  <p className="text-xs text-muted-foreground">Adjust speaking rate</p>
                </div>
                <Switch defaultChecked data-testid="switch-voice-speed" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Voice Gender</label>
                <Select defaultValue="female">
                  <SelectTrigger data-testid="select-voice-gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" data-testid="button-save-settings">
            Save Changes
          </Button>
          <Button variant="destructive" className="flex-1" data-testid="button-delete-account">
            Delete Account
          </Button>
        </div>
      </div>
    </AnimatedPage>
  );
}
