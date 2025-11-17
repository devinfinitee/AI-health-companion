/**
 * OPENAI API INTEGRATION
 * Handles communication with OpenAI API for AI health companion chat
 */

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Message interface for chat
 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Send a message to OpenAI and get a response
 * @param messages - Array of chat messages (conversation history)
 * @param onStream - Optional callback for streaming responses
 * @returns Promise with the assistant's response
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  onStream?: (chunk: string) => void
): Promise<string> {
  try {
    // Validate API key
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "your_openai_api_key_here") {
      throw new Error(
        "OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file"
      );
    }

    // Prepare the request
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Using GPT-3.5 for cost efficiency
        messages: messages,
        temperature: 0.7, // Balance between creativity and consistency
        max_tokens: 500, // Limit response length
        stream: !!onStream, // Enable streaming if callback provided
      }),
    });

    // Check for errors
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to get response from OpenAI");
    }

    // Handle streaming response
    if (onStream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                fullResponse += content;
                onStream(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      return fullResponse;
    }

    // Handle non-streaming response
    const data = await response.json();
    return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

/**
 * Create a system message for health companion context
 * This sets the AI's behavior and personality
 */
export function createSystemMessage(): ChatMessage {
  return {
    role: "system",
    content: `You are a helpful and empathetic AI health companion assistant. Your role is to:

1. Provide general health information and wellness advice
2. Help users understand their symptoms (but always recommend seeing a doctor for diagnosis)
3. Offer emotional support and encouragement
4. Answer health-related questions in simple, easy-to-understand language
5. Be culturally sensitive and respectful
6. Never provide specific medical diagnoses or prescribe treatments
7. Always encourage users to consult healthcare professionals for serious concerns
8. Keep responses concise and friendly (2-3 paragraphs maximum)
9. Use simple language suitable for users with varying literacy levels

Important disclaimers to remember:
- You are not a replacement for professional medical advice
- Always recommend consulting a doctor for persistent or serious symptoms
- In emergencies, advise calling emergency services immediately

Be warm, supportive, and helpful while maintaining appropriate boundaries.`,
  };
}

/**
 * Format user message with context (optional)
 * @param message - User's message
 * @param context - Optional context (e.g., user's health history)
 */
export function formatUserMessage(message: string, context?: string): ChatMessage {
  let content = message;
  
  if (context) {
    content = `Context: ${context}\n\nUser message: ${message}`;
  }

  return {
    role: "user",
    content,
  };
}

/**
 * Check if OpenAI API is configured
 */
export function isOpenAIConfigured(): boolean {
  return !!(OPENAI_API_KEY && OPENAI_API_KEY !== "your_openai_api_key_here");
}
