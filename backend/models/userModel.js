import bcrypt from "bcryptjs";
import "dotenv/config";
import { USER } from "../constant/index.js";
import mongoose from "mongoose";
import validator from "validator";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      select: false,
      validator: [
        validator.isStrongPassword,
        "Password must be at least 8  characters long, with at least 1 uppercase and lowercase letters and at least 1 symbol",
      ],
    },
    passwordConfirm: {
      type: String,
      select: false,
      validator: {
        validator: function (el) {
          return el === this.password;
        },
      },
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        "First Name can only have Alphanumeric values. No special characters allowed",
      ],
    },
    taxCode: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isAlphanumeric, "Please provide a valid tax code"],
    },
    role: {
      type: [String],
      eumm: [USER],
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
    next();
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
