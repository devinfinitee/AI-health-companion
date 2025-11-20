import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import gsap from "gsap";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { post } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function Symptoms() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const [symptoms, setSymptoms] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiReply, setAiReply] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

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

      if (cardRef.current) {
        gsap.from(cardRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out"
        });
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (analyzed && resultRef.current) {
      gsap.from(resultRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [analyzed]);

  const commonSymptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Fatigue",
    "Nausea",
    "Dizziness",
    "Chest Pain",
    "Shortness of Breath",
  ];

  const handleAnalyze = async () => {
    if (!symptoms) return;

    setLoading(true);
    setError(null);
    setAiReply(null);

    try {
      const res = await post("/dashboard/symptoms", { symptoms, language });
      const reply = res?.data?.reply || null;
      setAiReply(reply);
      setAnalyzed(true);
    } catch (err: any) {
      console.error("Failed to analyze symptoms:", err);
      setError(err?.message || "Failed to analyze symptoms. Please try again.");
      setAnalyzed(false);
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = (symptom: string) => {
    setSymptoms(prev => prev ? `${prev}, ${symptom}` : symptom);
    console.log('Added symptom:', symptom);
  };

  return (
    <AnimatedPage className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)] pb-20 md:pb-8">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8" ref={headerRef}>
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">Symptom Checker</h1>
          <p className="text-muted-foreground">
            Describe your symptoms and get personalized health insights
          </p>
        </div>

        <Card className="mb-6" ref={cardRef}>
          <CardContent className="pt-6">
            <label className="block text-sm font-medium mb-2">
              Describe your symptoms...
            </label>
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="I've been experiencing..."
              className="min-h-[120px] mb-4"
              data-testid="input-symptoms"
            />

            <div className="flex justify-between items-center mb-4">
              <p className="text-xs text-muted-foreground">
                You can speak your symptoms or type them above.
              </p>
              <VoiceAssistant
                sttOnly
                onSpeechRecognized={(text) => setSymptoms((prev) => (prev ? `${prev}, ${text}` : text))}
                size="sm"
              />
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Common symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <Badge
                    key={symptom}
                    variant="outline"
                    className="cursor-pointer hover-elevate"
                    onClick={() => addSymptom(symptom)}
                    data-testid={`badge-symptom-${symptom.toLowerCase()}`}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              className="w-full"
              disabled={!symptoms || loading}
              data-testid="button-analyze-symptoms"
            >
              {loading ? "Analyzing..." : "Analyze Symptoms"}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/20 bg-destructive/5 mb-4">
            <CardContent className="pt-4 pb-4 text-sm text-destructive">
              {error}
            </CardContent>
          </Card>
        )}

        {analyzed && aiReply && (
          <Card className="border-primary/20 bg-primary/5" ref={resultRef}>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-heading font-semibold mb-2">AI Assessment</h3>
                  <div className="mb-3">
                    <VoiceAssistant textToRead={aiReply} ttsOnly size="sm" />
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap mb-4">
                    {aiReply}
                  </div>
                  <Button
                    onClick={() => setLocation("/book-appointment")}
                    className="mt-4"
                    data-testid="button-book-from-symptoms"
                  >
                    Book an Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AnimatedPage>
  );
}
