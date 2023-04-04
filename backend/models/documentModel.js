import mongoose from "mongoose";
import { typeVehicle, STATUS_DOCUMENT } from "../constant/index.js";
import User from "./userModel.js";

const { Schema } = mongoose;

const documentSchema = new Schema(
  {
    licensePlate: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    serial: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    issueDate: Date,
    expỉreDate: Date,
    taxCode: String,
    receiveDate: Date,
    returnDate: Date,
    status: {
      type: String,
      enum: STATUS_DOCUMENT,
      default: STATUS_DOCUMENT[0],
    },
    hasError: { type: Boolean, default: true },
    belongTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    typeVehicle: {
      type: String,
      enum: Object.values(typeVehicle),
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

documentSchema.pre("save", async function (next) {
  if (this.licensePlate && this.isModified("licensePlate")) {
    this.licensePlate = this.licensePlate.toUpperCase();
  }
  next();
});

documentSchema.pre("save", async function (next) {
  if (this.serial && this.isModified("serial")) {
    const typeCode = this.serial.slice(0, 2);
    this.typeVehicle = typeVehicle[typeCode] || undefined;
  }
  next();
});

documentSchema.pre("save", async function (next) {
  if (this.taxCode && this.isModified("taxCode")) {
    // check if user have taxCode
    const user = await User.findOne({ taxCode: this.taxCode });
    if (user) {
      this.belongTo = user._id;
      this.hasError = false;
    }
  }
  next();
});

const Document = mongoose.model("Document", documentSchema);

export default Document;
