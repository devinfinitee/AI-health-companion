let mongoose = require("mongoose");

let diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String },
    description: { type: String, required: true },
    symptoms: { type: [String], default: [] },
    treatments: { type: String },
    prevention: { type: String },
    source: { type: String, default: "gemini" },
    lastSyncedAt: { type: Date },
  },
  { timestamps: true }
);

let Disease = mongoose.model("Disease", diseaseSchema);

module.exports = Disease;
