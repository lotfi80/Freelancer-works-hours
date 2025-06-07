import Client from "../models/Client.js";
import User from "../models/User.js";
console.log(Client);

export const createClient = async (req, res) => {
  const { name } = req.body;
  try {
    const clientExist = await Client.findOne({
      client_name: { $regex: new RegExp(`^${name}$`, "i") },
      user: req.userId,
    });

    if (clientExist) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const newClient = await Client.create({
      client_name: name,
      user: req.userId,
      ...(req.body.email && { email: req.body.email }),
      ...(req.body.phone && { phone: req.body.phone }),
      ...(req.body.address && { address: req.body.address }),
      ...(req.body.city && { city: req.body.city }),
      ...(req.body.state && { state: req.body.state }),
      ...(req.body.zip && { zip: req.body.zip }),
      ...(req.body.country && { country: req.body.country }),
      ...(req.body.notes && { notes: req.body.notes }),
    });
    console.log("New Client ID:", newClient._id);

    await User.findByIdAndUpdate(req.userId, {
      $push: { clients: newClient._id },
    });

    return res.status(201).json({
      success: true,
      client: newClient,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const getClientById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await Client.findOne({ _id: id, user: req.userId });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Error fetching client by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, city, state, zip, country, notes } =
    req.body;

  try {
    const client = await Client.findOneAndUpdate(
      { _id: id, user: req.userId },
      {
        client_name: name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        country,
        notes,
      },
      { new: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await Client.findOneAndDelete({ _id: id, user: req.userId });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    // Remove client ID from user's clients array
    await User.findByIdAndUpdate(req.userId, {
      $pull: { clients: id },
    });
    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
