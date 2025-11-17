// Import mongoose for MongoDB schema
let mongoose = require("mongoose");

/**
 * APPOINTMENT SCHEMA
 * Stores appointment bookings for users
 */
let appointmentSchema = new mongoose.Schema(
  {
    // Reference to the user who booked the appointment
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Patient information
    patientName: {
      type: String,
      required: true,
    },
    
    patientEmail: {
      type: String,
      required: true,
    },
    
    patientPhone: {
      type: String,
      required: true,
    },
    
    // Appointment details
    appointmentDate: {
      type: Date,
      required: true,
    },
    
    appointmentTime: {
      type: String,
      required: true,
    },
    
    // Department/specialty
    department: {
      type: String,
      required: true,
    },
    
    // Reason for visit
    reason: {
      type: String,
      required: true,
    },
    
    // Additional notes
    notes: {
      type: String,
      default: "",
    },
    
    // Appointment status
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    
    // WhatsApp reminder sent
    reminderSent: {
      type: Boolean,
      default: false,
    },
    
    // Confirmation code
    confirmationCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create and export the Appointment model
let Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
