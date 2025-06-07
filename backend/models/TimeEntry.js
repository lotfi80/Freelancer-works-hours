import mongoose, { Schema, Types } from "mongoose";

const TimeEntrySchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: Types.ObjectId,
      ref: "Client",
      required: true,
    },
    project: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.startTime;
        },
        message: "endTime must be after startTime",
      },
    },
    breakBeginn: {
      type: Date,
      required: false,
    },
    breakEnd: {
      type: Date,
      required: false,
      validate: {
        validator: function (value) {
          if (!this.breakBeginn) return true;
          return value > this.breakBeginn;
        },
        message: "breakEnd must be after breakBeginn",
      },
    },
    duration: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

TimeEntrySchema.pre("save", function (next) {
  if (
    this.isModified("startTime") ||
    this.isModified("endTime") ||
    this.isModified("breakBeginn") ||
    this.isModified("breakEnd")
  ) {
    const totalMilliseconds = this.endTime - this.startTime;
    let breakMilliseconds = 0;

    if (this.breakBeginn && this.breakEnd) {
      breakMilliseconds = this.breakEnd - this.breakBeginn;
    }

    this.duration = (totalMilliseconds - breakMilliseconds) / (1000 * 60 * 60); // Millisekunden → Stunden
  }
  next();
});
const TimeEntry = mongoose.model("TimeEntry", TimeEntrySchema);
export default TimeEntry;
