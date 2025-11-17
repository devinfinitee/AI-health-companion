let mongoose = require("mongoose");

let conversation = new mongoose.Schema(
  {
    question: { type: String, required: true },
    reply: { type: String, required: true },
  },
  { timestamps: true }
);

let Conversation = mongoose.model("Conversation", conversation);

module.exports = Conversation;
