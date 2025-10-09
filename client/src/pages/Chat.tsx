import { useState, useEffect, useRef } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import gsap from "gsap";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hello! I'm your AI Health Companion. How can I help you today? You can describe your symptoms or ask any health-related questions.",
    },
  ]);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

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

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "ai",
      content: "I understand. Let me help you with that. Based on your symptoms, I recommend scheduling an appointment with a healthcare professional.",
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInput("");
    console.log('Message sent:', input);
  };

  const quickActions = [
    { label: "Book an Appointment Now", onClick: () => setLocation("/book-appointment") },
    { label: "Learn More About Headaches", onClick: () => setLocation("/resources") },
    { label: "Connect to Doctor", onClick: () => console.log("Connect to doctor") },
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
            </div>
            {message.type === "user" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">U</AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}
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
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message or ask via voice..."
            data-testid="input-chat-message"
            className="flex-1"
          />
          <Button size="icon" variant="ghost" data-testid="button-voice-input">
            <Mic className="w-5 h-5" />
          </Button>
          <Button size="icon" onClick={handleSend} data-testid="button-send-message">
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </AnimatedPage>
  );
}
