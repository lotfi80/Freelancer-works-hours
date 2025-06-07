import mongoose, { Schema, Types } from "mongoose";

const ClientSchema = new Schema(
  {
    client_name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      //   unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Ungültige E-Mail",
      ],
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    zip: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    timeEntries: [
      {
        type: Types.ObjectId,
        ref: "TimeEntry",
      },
    ],
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Client = mongoose.model("Client", ClientSchema);
export default Client;
