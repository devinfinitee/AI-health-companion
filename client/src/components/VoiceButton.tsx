import { Mic } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface VoiceButtonProps {
  size?: "default" | "large";
  onActivate?: () => void;
}

export default function VoiceButton({ size = "default", onActivate }: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);

  const handleClick = () => {
    setIsListening(!isListening);
    onActivate?.();
    console.log('Voice button toggled:', !isListening);
  };

  const buttonSize = size === "large" ? "w-24 h-24 md:w-32 md:h-32" : "w-16 h-16";
  const iconSize = size === "large" ? "w-10 h-10 md:w-12 md:h-12" : "w-6 h-6";

  return (
    <Button
      onClick={handleClick}
      data-testid="button-voice-assistant"
      className={`${buttonSize} rounded-full bg-primary hover:bg-primary/90 transition-all ${
        isListening ? "animate-pulse scale-105" : ""
      }`}
    >
      <Mic className={`${iconSize} text-primary-foreground`} />
    </Button>
  );
}
