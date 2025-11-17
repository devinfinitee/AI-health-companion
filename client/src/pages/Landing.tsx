import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Book, MessageCircle, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import doctorImage from "@assets/Gemini_Generated_Image_ne4wtgne4wtgne4w_1759860122103.png";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      const heroTitle = heroRef.current?.querySelector("h1");
      if (heroTitle) {
        gsap.from(heroTitle, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out"
        });
      }

      const heroDesc = heroRef.current?.querySelector("p");
      if (heroDesc) {
        gsap.from(heroDesc, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out"
        });
      }

      const heroButtons = heroRef.current?.querySelectorAll("button");
      if (heroButtons && heroButtons.length > 0) {
        gsap.from(heroButtons, {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.6,
          delay: 0.4,
          ease: "power3.out"
        });
      }

      const heroImage = heroRef.current?.querySelector("img");
      if (heroImage) {
        gsap.from(heroImage, {
          opacity: 0,
          x: 100,
          duration: 1,
          delay: 0.3,
          ease: "power3.out"
        });
      }

      // Features animation
      const featureCards = featuresRef.current?.querySelectorAll(".feature-card");
      if (featureCards && featureCards.length > 0) {
        gsap.from(featureCards, {
          opacity: 0,
          y: 50,
          stagger: 0.15,
          duration: 0.8,
          delay: 0.6,
          ease: "power3.out"
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selector - Fixed Position */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <LanguageSelector />
        <VoiceAssistant
          textToRead={t("landing.hero.description")}
          ttsOnly
          size="md"
        />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-purple-950/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center" ref={heroRef}>
            {/* Left Content */}
            <div>
              <h1 className="font-heading font-bold text-[#2D3B6F] dark:text-primary text-5xl md:text-6xl mb-6 leading-tight">
                {t("landing.hero.title")}
                <br />
                <span className="text-purple-600 dark:text-purple-400">{t("landing.hero.subtitle")}</span>
              </h1>
              <p className="text-[#6B7280] dark:text-muted-foreground text-lg mb-8 leading-relaxed">
                {t("landing.hero.description")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => setLocation("/signup")}
                  className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {t("landing.hero.getStarted")}
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => setLocation("/login")}
                  className="text-lg px-8 py-6"
                >
                  {t("landing.hero.signIn")}
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative flex justify-center md:justify-end">
              <img 
                src={doctorImage} 
                alt="Healthcare professionals" 
                className="w-full max-w-md rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h2 className="font-heading font-bold text-[#2D3B6F] dark:text-foreground text-3xl md:text-4xl mb-4">
            {t("landing.features.title")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("landing.features.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={featuresRef}>
          <Card className="feature-card hover-elevate border-0 shadow-lg">
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground text-xl mb-3 text-center">
                {t("landing.feature.aiCompanion.title")}
              </h3>
              <p className="text-muted-foreground text-center">
                {t("landing.feature.aiCompanion.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card hover-elevate border-0 shadow-lg">
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground text-xl mb-3 text-center">
                {t("landing.feature.appointments.title")}
              </h3>
              <p className="text-muted-foreground text-center">
                {t("landing.feature.appointments.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card hover-elevate border-0 shadow-lg">
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground text-xl mb-3 text-center">
                {t("landing.feature.tracking.title")}
              </h3>
              <p className="text-muted-foreground text-center">
                {t("landing.feature.tracking.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card hover-elevate border-0 shadow-lg">
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center">
                  <Book className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground text-xl mb-3 text-center">
                {t("landing.feature.resources.title")}
              </h3>
              <p className="text-muted-foreground text-center">
                {t("landing.feature.resources.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card hover-elevate border-0 shadow-lg">
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground text-xl mb-3 text-center">
                {t("landing.feature.secure.title")}
              </h3>
              <p className="text-muted-foreground text-center">
                {t("landing.feature.secure.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card hover-elevate border-0 shadow-lg">
            <CardContent className="pt-8 pb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/20 dark:to-indigo-800/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h3 className="font-heading font-semibold text-[#2D3B6F] dark:text-foreground text-xl mb-3 text-center">
                {t("landing.feature.family.title")}
              </h3>
              <p className="text-muted-foreground text-center">
                {t("landing.feature.family.description")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading font-bold text-white text-3xl md:text-4xl mb-4">
            {t("landing.cta.title")}
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            {t("landing.cta.subtitle")}
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/signup")}
            className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
          >
            {t("landing.cta.button")}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p>{t("landing.footer.copyright")}</p>
        </div>
      </footer>
    </div>
  );
}
