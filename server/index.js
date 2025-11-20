// Load environment variables from .env file
require("dotenv").config();

// Import required packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Router = require("./controller/routes.js");
const Disease = require("./model/Disease");
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINIAPIKEY,
});

// Initialize express app
const app = express();

// Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5001;

// MIDDLEWARE CONFIGURATION

// Enable CORS (Cross-Origin Resource Sharing) to allow frontend to communicate with backend
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5000", "https://yourhealthpal.vercel.app/"], // Allow both Vite ports
  credentials: true, // Allow cookies and authentication headers
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// DATABASE CONNECTION

// Connect to MongoDB using connection string from environment variables
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");

    // After successful DB connection, try to sync common diseases from Gemini once
    (async () => {
      try {
        if (!process.env.GEMINIAPIKEY) {
          console.warn("⚠️ GEMINIAPIKEY is not set. Skipping disease sync on startup.");
          return;
        }

        const existingCount = await Disease.estimatedDocumentCount();
        if (existingCount > 0) {
          console.log("ℹ️ Diseases already present in database. Skipping Gemini sync on startup.");
          return;
        }

        console.log("🩺 No diseases found. Syncing common diseases from Gemini on startup...");

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
          const cleaned = rawText
            .replace(/^```json/iu, "")
            .replace(/^```/iu, "")
            .replace(/```$/iu, "")
            .trim();

          parsed = JSON.parse(cleaned || rawText || "[]");
        } catch (parseError) {
          console.error("❌ Failed to parse diseases JSON from Gemini on startup:", parseError, rawText);
          return;
        }

        if (!Array.isArray(parsed) || parsed.length === 0) {
          console.warn("⚠️ Gemini did not return a valid diseases list on startup.");
          return;
        }

        const now = new Date();

        const operations = parsed
          .map((item) => {
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
          })
          .filter(Boolean);

        if (!operations.length) {
          console.warn("⚠️ No valid disease records generated from Gemini on startup.");
          return;
        }

        const bulkResult = await Disease.bulkWrite(operations);

        console.log("✅ Diseases synced from Gemini on startup.", {
          matched: bulkResult.matchedCount,
          modified: bulkResult.modifiedCount,
          upserted: bulkResult.upsertedCount,
        });
      } catch (error) {
        console.error("❌ Disease sync error on startup:", error.message || error);
      }
    })();
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Exit process if database connection fails
  });

// ROUTES

// Mount all API routes with /api prefix
app.use("/api", Router);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// START SERVER

// Start listening on specified port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
});
