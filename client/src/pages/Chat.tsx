import { useState, useEffect, useRef } from "react";
import { Send, Mic, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import gsap from "gsap";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { sendChatMessage, createSystemMessage, formatUserMessage, isOpenAIConfigured, ChatMessage } from "@/lib/openai";
import { stt, tts } from "@/lib/speech";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: t("dashboard.talkToAI"),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const chatMessages = chatRef.current?.querySelectorAll("[data-testid^='message-']");
      if (chatMessages && chatMessages.length > 0) {
        gsap.from(chatMessages, {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out"
        });
      }

      if (actionsRef.current) {
        gsap.from(actionsRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          delay: 0.3,
          ease: "power2.out"
        });
      }

      if (inputRef.current) {
        gsap.from(inputRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          delay: 0.4,
          ease: "power2.out"
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Send message to OpenAI and get response
   */
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check if OpenAI is configured
    if (!isOpenAIConfigured()) {
      toast({
        title: "Configuration Required",
        description: "Please add your OpenAI API key to the .env file",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare conversation history for OpenAI
      const chatHistory: ChatMessage[] = [
        createSystemMessage(),
        ...messages.slice(1).map((msg) => ({
          role: msg.type === "user" ? "user" as const : "assistant" as const,
          content: msg.content,
        })),
        formatUserMessage(input),
      ];

      // Get AI response
      const aiResponseText = await sendChatMessage(chatHistory);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiResponseText,
        timestamp: new Date(),
      };

      // Add AI response to chat
      setMessages((prev) => [...prev, aiMessage]);

      // Optionally read response aloud
      if (isSpeaking) {
        tts.speak(aiResponseText, language);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get response. Please try again.",
        variant: "destructive",
      });

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle voice input
   */
  const handleVoiceInput = () => {
    if (isListening) {
      stt.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    stt.startListening(language, {
      onResult: (transcript, isFinal) => {
        if (isFinal) {
          setInput(transcript);
          setIsListening(false);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (error) => {
        console.error("Voice input error:", error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  /**
   * Toggle auto-read responses
   */
  const toggleAutoRead = () => {
    setIsSpeaking(!isSpeaking);
    if (isSpeaking) {
      tts.stop();
    }
  };

  const quickActions = [
    { label: t("dashboard.bookAppointment"), onClick: () => setLocation("/book-appointment") },
    { label: t("dashboard.symptomChecker"), onClick: () => setLocation("/symptoms") },
    { label: t("dashboard.healthResources"), onClick: () => setLocation("/resources") },
  ];

  return (
    <AnimatedPage className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4" ref={chatRef}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            data-testid={`message-${message.type}-${message.id}`}
          >
            {message.type === "ai" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-3 ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.type === "user" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">U</AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">AI</AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-t" ref={actionsRef}>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={action.onClick}
              data-testid={`button-quick-action-${index}`}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t p-4" ref={inputRef}>
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Button
            size="icon"
            variant={isSpeaking ? "default" : "ghost"}
            onClick={toggleAutoRead}
            title={isSpeaking ? "Auto-read ON" : "Auto-read OFF"}
            className={isSpeaking ? "animate-pulse" : ""}
          >
            <Volume2 className="w-5 h-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSend()}
            placeholder={isListening ? t("voice.listening") : t("voice.speak")}
            data-testid="input-chat-message"
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant={isListening ? "default" : "ghost"}
            onClick={handleVoiceInput}
            data-testid="button-voice-input"
            className={isListening ? "animate-pulse bg-red-500 hover:bg-red-600" : ""}
            disabled={isLoading}
          >
            <Mic className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            data-testid="button-send-message"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </AnimatedPage>
  );
}
