// Import required models
const Appointment = require("../model/Appointment");
const User = require("../model/User");

/**
 * GENERATE CONFIRMATION CODE
 * Creates a unique 6-character confirmation code
 */
function generateConfirmationCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

/**
 * CREATE APPOINTMENT
 * Books a new appointment for a user
 */
const createAppointment = async (req, res) => {
  try {
    // Extract appointment data from request body
    const {
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate,
      appointmentTime,
      department,
      reason,
      notes,
    } = req.body;

    // Validate required fields
    if (
      !patientName ||
      !patientEmail ||
      !patientPhone ||
      !appointmentDate ||
      !appointmentTime ||
      !department ||
      !reason
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Validate date is in the future
    const appointmentDateTime = new Date(appointmentDate);
    if (appointmentDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Appointment date must be in the future",
      });
    }

    // Generate unique confirmation code
    let confirmationCode;
    let isUnique = false;
    while (!isUnique) {
      confirmationCode = generateConfirmationCode();
      const existing = await Appointment.findOne({ confirmationCode });
      if (!existing) isUnique = true;
    }

    // Create new appointment
    const appointment = new Appointment({
      userId: req.user._id, // From auth middleware
      patientName,
      patientEmail,
      patientPhone,
      appointmentDate: appointmentDateTime,
      appointmentTime,
      department,
      reason,
      notes: notes || "",
      confirmationCode,
      status: "pending",
    });

    // Save to database
    await appointment.save();

    // TODO: Send WhatsApp reminder (integrate with WhatsApp API)
    // TODO: Send email confirmation

    // Return success response
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: {
        appointment: {
          id: appointment._id,
          confirmationCode: appointment.confirmationCode,
          patientName: appointment.patientName,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          department: appointment.department,
          status: appointment.status,
        },
      },
    });
  } catch (error) {
    console.error("Create appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
      error: error.message,
    });
  }
};

/**
 * GET USER APPOINTMENTS
 * Retrieves all appointments for the authenticated user
 */
const getUserAppointments = async (req, res) => {
  try {
    // Find all appointments for the user
    const appointments = await Appointment.find({ userId: req.user._id })
      .sort({ appointmentDate: -1 }) // Sort by date, newest first
      .select("-__v"); // Exclude version key

    res.status(200).json({
      success: true,
      data: {
        appointments,
        count: appointments.length,
      },
    });
  } catch (error) {
    console.error("Get appointments error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve appointments",
      error: error.message,
    });
  }
};

/**
 * GET APPOINTMENT BY ID
 * Retrieves a specific appointment
 */
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find appointment
    const appointment = await Appointment.findById(id);

    // Check if appointment exists
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check if user owns this appointment
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to view this appointment",
      });
    }

    res.status(200).json({
      success: true,
      data: { appointment },
    });
  } catch (error) {
    console.error("Get appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve appointment",
      error: error.message,
    });
  }
};

/**
 * UPDATE APPOINTMENT
 * Updates an existing appointment
 */
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find appointment
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check ownership
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this appointment",
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      "patientName",
      "patientEmail",
      "patientPhone",
      "appointmentDate",
      "appointmentTime",
      "department",
      "reason",
      "notes",
    ];

    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        appointment[key] = updates[key];
      }
    });

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: { appointment },
    });
  } catch (error) {
    console.error("Update appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update appointment",
      error: error.message,
    });
  }
};

/**
 * CANCEL APPOINTMENT
 * Cancels an appointment
 */
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find appointment
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Check ownership
    if (appointment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this appointment",
      });
    }

    // Update status to cancelled
    appointment.status = "cancelled";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: { appointment },
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel appointment",
      error: error.message,
    });
  }
};

// Export controller functions
module.exports = {
  createAppointment,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
};
