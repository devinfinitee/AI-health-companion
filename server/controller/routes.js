// Import express and create router instance
let express = require("express");
let Router = express.Router();

// Import authentication controller functions
const { signup, login } = require("./authController");

// Import appointment controller functions
const {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} = require("./appointmentController");

// Import authentication middleware for protecting routes
const authMiddleware = require("../middleware/authMiddleware");
const Conversation = require("../model/Convo");
const Disease = require("../model/Disease");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINIAPIKEY,
});

const OPENAI_API_KEY = process.env.OPENAIKEY;

// Authentication routes
// POST /signup - Register a new user
Router.post("/signup", signup);

// POST /login - Authenticate existing user
Router.post("/login", login);

// Protected routes - require authentication
// These routes use authMiddleware to verify JWT token
// The authenticated user data is available in req.user

// GET /dashboard/health/summary - Get user's health summary (protected)
Router.get("/dashboard/health/summary", authMiddleware, (req, res) => {
  // TODO: Implement health summary logic
  // Access authenticated user via req.user
  res.json({
    success: true,
    message: "Health summary endpoint",
    user: req.user,
  });
});

// Helper to map app language codes to human-readable names for prompts
const LANGUAGE_LABELS = {
  en: "English",
  es: "Spanish",
  fr: "French",
  ar: "Arabic",
  zh: "Chinese",
  hi: "Hindi",
  pt: "Portuguese",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
};

// POST /dashboard/symptoms - Submit symptoms (protected)
Router.post("/dashboard/symptoms", authMiddleware, async (req, res) => {
  try {
    const { symptoms, language } = req.body || {};

    if (!symptoms || typeof symptoms !== "string" || !symptoms.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a symptoms description as a non-empty string",
      });
    }

    if (!process.env.GEMINIAPIKEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured on the server",
      });
    }

    const langCode = typeof language === "string" ? language : "en";
    const langLabel = LANGUAGE_LABELS[langCode] || "English";

    const prompt = `You are the AI Health Pal inside a friendly mobile health app. A user has described their symptoms.

Symptoms (user's own words): "${symptoms}"

Your task (answer in ${langLabel}, and keep your wording simple and clear):
1. Explain in simple, reassuring language what these symptoms *might* indicate, using plain English.
2. Emphasize that you are not a doctor and this is not a diagnosis.
3. Suggest a short, clear next-step plan (e.g., when to seek urgent care vs. routine checkup).
4. Use short paragraphs and bullet points where helpful.
5. Avoid technical jargon as much as possible.
6. Never claim certainty or give specific prescriptions/medications.
`;
    let reply;

    try {
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      // Depending on SDK version, text may be a property or a method.
      // Try property first, then method as a fallback.
      if (typeof geminiResponse.text === "function") {
        reply = geminiResponse.text().trim();
      } else if (typeof geminiResponse.text === "string") {
        reply = geminiResponse.text.trim();
      } else {
        reply = "I'm sorry, I couldn't generate an explanation right now. Please try again in a moment.";
      }

      if (reply) {
        reply = reply.replace(/\*/g, "");
      }
    } catch (geminiError) {
      console.error("Gemini API error (symptoms):", geminiError);
      return res.status(502).json({
        success: false,
        message: "Failed to get response from Gemini API",
        error: geminiError.message || String(geminiError),
      });
    }

    try {
      await Conversation.create({
        question: symptoms,
        reply,
      });
    } catch (dbError) {
      console.error("Failed to save conversation:", dbError);
    }

    return res.status(200).json({
      success: true,
      message: "Symptoms analyzed successfully",
      data: {
        reply,
      },
    });
  } catch (error) {
    console.error("Symptoms analysis error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while analyzing symptoms",
      error: error.message,
    });
  }
});

// HEALTH EDUCATION ROUTES

// GET /health/diseases - List all stored diseases (public for now)
Router.get("/health/diseases", async (req, res) => {
  try {
    const diseases = await Disease.find().sort({ name: 1 }).select("-__v");

    return res.status(200).json({
      success: true,
      data: {
        diseases,
      },
    });
  } catch (error) {
    console.error("Get diseases error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch diseases",
      error: error.message,
    });
  }
});

// POST /health/diseases/sync - Generate/update common diseases from Gemini (protected)
Router.post("/health/diseases/sync", authMiddleware, async (req, res) => {
  try {
    if (!process.env.GEMINIAPIKEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured on the server",
      });
    }

    const existingCount = await Disease.estimatedDocumentCount();
    if (existingCount > 0) {
      const diseases = await Disease.find().sort({ name: 1 }).select("-__v");
      return res.status(200).json({
        success: true,
        message: "Diseases already exist in the database. Skipping Gemini sync.",
        data: {
          diseases,
        },
      });
    }

    const prompt = `You are helping to build educational content for a health app.

Return ONLY valid JSON (no markdown, no comments, no extra text) in this exact format:
[
  {
    "name": "Disease name",
    "category": "Short category like 'Infectious', 'Chronic', 'Lifestyle', etc.",
    "description": "A brief, friendly overview in simple language.",
    "symptoms": ["symptom 1", "symptom 2", "..."],
    "treatments": "Simple explanation of common treatment approaches, without specific prescriptions or drug names.",
    "prevention": "Practical prevention tips in everyday language."
  }
]

Now fill this JSON array with around 10–15 of the most common illnesses and diseases globally.
Focus on being clear, reassuring, and easy to understand. Avoid giving specific medical prescriptions, dosages, or guarantees.
`;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const rawText =
      typeof geminiResponse.text === "function"
        ? geminiResponse.text().trim()
        : typeof geminiResponse.text === "string"
        ? geminiResponse.text.trim()
        : "";

    let parsed;
    try {
      // Gemini might sometimes wrap JSON in code fences; strip them if present
      const cleaned = rawText
        .replace(/^```json/iu, "")
        .replace(/^```/iu, "")
        .replace(/```$/iu, "")
        .trim();

      parsed = JSON.parse(cleaned || rawText || "[]");
    } catch (parseError) {
      console.error("Failed to parse diseases JSON from Gemini:", parseError, rawText);
      return res.status(502).json({
        success: false,
        message: "Gemini returned an invalid JSON format for diseases",
      });
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return res.status(502).json({
        success: false,
        message: "Gemini did not return a valid list of diseases",
      });
    }

    const now = new Date();

    const operations = parsed.map((item) => {
      if (!item || !item.name || !item.description) return null;

      const slug = item.name
        .toString()
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return {
        updateOne: {
          filter: { slug },
          update: {
            $set: {
              name: item.name,
              slug,
              category: item.category || "General",
              description: item.description,
              symptoms: Array.isArray(item.symptoms)
                ? item.symptoms.map((s) => s.toString())
                : [],
              treatments: item.treatments || "",
              prevention: item.prevention || "",
              source: "gemini",
              lastSyncedAt: now,
            },
          },
          upsert: true,
        },
      };
    }).filter(Boolean);

    if (!operations.length) {
      return res.status(502).json({
        success: false,
        message: "No valid disease records were generated from Gemini",
      });
    }

    const bulkResult = await Disease.bulkWrite(operations);

    const diseases = await Disease.find().sort({ name: 1 }).select("-__v");

    return res.status(200).json({
      success: true,
      message: "Diseases synced from Gemini successfully",
      data: {
        summary: bulkResult,
        diseases,
      },
    });
  } catch (error) {
    console.error("Diseases sync error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while syncing diseases from Gemini",
      error: error.message,
    });
  }
});

// GEMINI CHAT ROUTE (replaces OpenAI)

Router.post("/chat", authMiddleware, async (req, res) => {
  try {
    if (!process.env.GEMINIAPIKEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is not configured on the server",
      });
    }

    const { message, history, language } = req.body || {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide a non-empty message",
      });
    }

    const langCode = typeof language === "string" ? language : "en";
    const langLabel = LANGUAGE_LABELS[langCode] || "English";

    const systemPrompt = `You are "Health Pal", the built-in assistant for the StoryGenius mobile health companion app. Your role is to:

1. Provide general health information and wellness advice
2. Help users understand their symptoms (but always recommend seeing a doctor for diagnosis)
3. Offer emotional support and encouragement
4. Answer health-related questions in simple, easy-to-understand language
5. Be culturally sensitive and respectful
6. Never provide specific medical diagnoses or prescribe treatments or dosages
7. Always encourage users to consult healthcare professionals for serious concerns
8. Keep responses concise and friendly (about 2–3 short paragraphs, with bullet points when helpful)
9. Use simple language suitable for users with varying literacy levels

Important disclaimers to remember in your own words (not as a list):
- You are not a replacement for professional medical advice
- Always recommend consulting a doctor for persistent or serious symptoms
- In emergencies, advise calling emergency services immediately

Be warm, supportive, and helpful while maintaining appropriate boundaries.

Always respond in ${langLabel} for this conversation.`;

    const historyText = Array.isArray(history)
      ? history
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string"
          )
          .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
          .join("\n")
      : "";

    const prompt = `${systemPrompt}

Conversation so far (if any):
${historyText || "(No previous conversation, this is the first message.)"}

New user message:
User: ${message}

Now reply as the Health Pal assistant. Keep the tone friendly, clear, and reassuring.`;

    let reply;

    try {
      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (typeof geminiResponse.text === "function") {
        reply = geminiResponse.text().trim();
      } else if (typeof geminiResponse.text === "string") {
        reply = geminiResponse.text.trim();
      } else {
        reply =
          "I'm sorry, I couldn't generate a response right now. Please try again in a moment.";
      }

      if (reply) {
        reply = reply.replace(/\*/g, "");
      }
    } catch (geminiError) {
      console.error("Gemini API error (chat):", geminiError);
      return res.status(502).json({
        success: false,
        message: "Failed to get response from Gemini API",
        error: geminiError.message || String(geminiError),
      });
    }

    try {
      await Conversation.create({
        question: message,
        reply,
      });
    } catch (dbError) {
      console.error("Failed to save chat conversation:", dbError);
    }

    return res.status(200).json({
      success: true,
      data: {
        reply,
      },
    });
  } catch (error) {
    console.error("Chat endpoint error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the chat message",
      error: error.message,
    });
  }
});

// GET /dashboard/previous/conversation - Get user's conversation history (protected)
Router.get("/dashboard/previous/conversation", authMiddleware, (req, res) => {
  // TODO: Implement conversation history logic
  // Access authenticated user via req.user
  res.json({
    success: true,
    message: "Conversation history endpoint",
    user: req.user,
  });
});

// Appointment routes - all protected with authentication
// POST /appointments - Create a new appointment
Router.post("/appointments", authMiddleware, createAppointment);

// GET /appointments - Get all appointments for the authenticated user
Router.get("/appointments", authMiddleware, getUserAppointments);

// GET /appointments/:id - Get a specific appointment by ID
Router.get("/appointments/:id", authMiddleware, getAppointmentById);

// PUT /appointments/:id - Update an appointment
Router.put("/appointments/:id", authMiddleware, updateAppointment);

// DELETE /appointments/:id - Cancel an appointment
Router.delete("/appointments/:id", authMiddleware, cancelAppointment);

// Health check route
Router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StoryGenius API is running",
  });
});

// Export the router
module.exports = Router;
