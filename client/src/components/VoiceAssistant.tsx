import { useState } from "react";
import { Mic, Volume2, VolumeX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { stt, tts } from "@/lib/speech";

/**
 * VOICE ASSISTANT COMPONENT
 * Provides text-to-speech and speech-to-text functionality
 * Helps users with low literacy interact with the app
 */

interface VoiceAssistantProps {
  // Text to read aloud when TTS button is clicked
  textToRead?: string;
  // Callback when speech is recognized (STT)
  onSpeechRecognized?: (text: string) => void;
  // Show only TTS button (read aloud)
  ttsOnly?: boolean;
  // Show only STT button (voice input)
  sttOnly?: boolean;
  // Button size
  size?: "sm" | "md" | "lg";
  // Custom className
  className?: string;
}

export default function VoiceAssistant({
  textToRead,
  onSpeechRecognized,
  ttsOnly = false,
  sttOnly = false,
  size = "md",
  className = "",
}: VoiceAssistantProps) {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * TEXT-TO-SPEECH: Read text aloud
   */
  const handleReadAloud = () => {
    if (!textToRead) {
      toast({
        title: "Error",
        description: "No text to read",
        variant: "destructive",
      });
      return;
    }

    if (isSpeaking) {
      // Stop speaking
      tts.stop();
      setIsSpeaking(false);
    } else {
      // Start speaking
      setIsSpeaking(true);
      tts.speak(textToRead, language, {
        onEnd: () => setIsSpeaking(false),
        onError: (error) => {
          console.error("TTS error:", error);
          setIsSpeaking(false);
          toast({
            title: "Error",
            description: "Failed to read text aloud",
            variant: "destructive",
          });
        },
      });
    }
  };

  /**
   * SPEECH-TO-TEXT: Listen for voice input
   */
  const handleVoiceInput = () => {
    if (isListening) {
      // Stop listening
      stt.stopListening();
      setIsListening(false);
      setIsProcessing(false);
      return;
    }

    // Start listening
    setIsListening(true);
    
    stt.startListening(language, {
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setIsProcessing(true);
          // Call callback with recognized text
          onSpeechRecognized?.(transcript);
          setIsListening(false);
          setIsProcessing(false);
        }
      },
      onEnd: () => {
        setIsListening(false);
        setIsProcessing(false);
      },
      onError: (error) => {
        console.error("STT error:", error);
        setIsListening(false);
        setIsProcessing(false);
        
        // Show user-friendly error message
        let errorMessage = "Failed to recognize speech";
        if (error.error === "not-allowed") {
          errorMessage = "Microphone access denied. Please allow microphone access.";
        } else if (error.error === "no-speech") {
          errorMessage = "No speech detected. Please try again.";
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
    });
  };

  // Button size classes
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* TEXT-TO-SPEECH BUTTON */}
      {!sttOnly && textToRead && (
        <Button
          variant={isSpeaking ? "default" : "outline"}
          size="icon"
          className={`${sizeClasses[size]} rounded-full transition-all ${
            isSpeaking ? "animate-pulse" : ""
          }`}
          onClick={handleReadAloud}
          title={isSpeaking ? t("voice.stopReading") : t("voice.tapToRead")}
        >
          {isSpeaking ? (
            <VolumeX className={iconSizeClasses[size]} />
          ) : (
            <Volume2 className={iconSizeClasses[size]} />
          )}
        </Button>
      )}

      {/* SPEECH-TO-TEXT BUTTON */}
      {!ttsOnly && onSpeechRecognized && (
        <Button
          variant={isListening ? "default" : "outline"}
          size="icon"
          className={`${sizeClasses[size]} rounded-full transition-all ${
            isListening ? "animate-pulse bg-red-500 hover:bg-red-600" : ""
          }`}
          onClick={handleVoiceInput}
          title={isListening ? t("voice.listening") : t("voice.speak")}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className={`${iconSizeClasses[size]} animate-spin`} />
          ) : (
            <Mic className={iconSizeClasses[size]} />
          )}
        </Button>
      )}
    </div>
  );
}
