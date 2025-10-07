import { useState } from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

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
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
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
              <p className="text-sm">{message.content}</p>
            </div>
            {message.type === "user" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">U</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-t">
        <p className="text-sm text-muted-foreground mb-2">Quick Actions</p>
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
      <div className="border-t p-4">
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
    </div>
  );
}
