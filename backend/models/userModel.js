import bcrypt from "bcryptjs";
import crypto from "crypto";
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
      validate: {
        validator: function (value) {
          return /^[A-z][A-z0-9-_\s]{3,60}$/.test(value);
        },
        message:
          "username must be alphanumeric, without special characters. Hyphens and underscores allowed",
      },
    },
    taxCode: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isAlphanumeric, "Please provide a valid tax code"],
    },
    roles: {
      type: [String],
      eumm: [USER],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
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
//generate forgot password token (string)
userSchema.methods.getForgotPasswordToken = async function () {
  // generate a long and randomg string
  const forgotToken = await crypto.randomBytes(20).toString("hex");

  // getting a hash - make sure to get a hash on backend
  this.forgotPasswordToken = await crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  //time of token
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};
const User = mongoose.model("User", userSchema);

export default User;
