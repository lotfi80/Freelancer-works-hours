import User from "../models/User.js";
import TimeEntry from "../models/TimeEntry.js";
import Client from "../models/Client.js";
console.log(TimeEntry);

export const addTimeEntry = async (req, res) => {
  const {
    userId,
    clientId,
    startTime,
    endTime,
    breakBeginn,
    breakEnd,
    project,
    description,
  } = req.body;
  if (!userId || !clientId || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: "Required fields: userId, clientId, startTime, endTime",
    });
  }

  try {
    const user = await User.findById(userId);
    const client = await Client.findById(clientId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }
    const newEntry = new TimeEntry({
      user: userId,
      client: clientId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      breakBeginn: breakBeginn ? new Date(breakBeginn) : undefined,
      breakEnd: breakEnd ? new Date(breakEnd) : undefined,
      project: project || undefined,
      description: description || undefined,
    });
    const savedEntry = await newEntry.save();
    // Optional: Update user's time entries array
    await User.findByIdAndUpdate(userId, {
      $push: { timeEntries: savedEntry._id },
    });
    // Optional: Update client's time entries array
    await Client.findByIdAndUpdate(clientId, {
      $push: { timeEntries: savedEntry._id },
    });
    return res.status(201).json({
      success: true,
      message: "Time entry created successfully",
      data: savedEntry,
    });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const getTimeEntries = async (req, res) => {
  try {
    // User-ID aus URL-Parametern
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required in URL path",
      });
    }

    const entries = await TimeEntry.find({ user: userId })

      .populate("client", "client_name")
      .sort({ startTime: -1 });

    return res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const getTimeEntryByClient = async (req, res) => {
  const { clientId } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required in request body",
    });
  }

  if (!clientId) {
    return res.status(400).json({
      success: false,
      message: "Client ID is required in URL path",
    });
  }

  try {
    const entries = await TimeEntry.find({ client: clientId }).sort({
      startTime: -1,
    });

    return res.status(200).json({
      success: true,
      data: entries,
    });
  } catch (error) {
    console.error("Error fetching time entries by client:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
