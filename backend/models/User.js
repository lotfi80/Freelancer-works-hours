import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";
const UserSchema = new Schema(
  {
    user_name: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    birth_date: {
      type: Date,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Ungültige E-Mail",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      description: "Gibt Administratorrechte",
    },
    clients: [{ type: Types.ObjectId, ref: "Client" }],
    timeEntries: [{ type: Types.ObjectId, ref: "TimeEntry" }],
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    verificationToken: String,
    verificationExpiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// muss ich beim testen wieder checken
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
