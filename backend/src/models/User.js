import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    businessName: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: String,
    gst: String,
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    sellerApproved: { type: Boolean, default: false },
    address: String,
    location: String,
    image: String,
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    return ret;
  },
});

export default mongoose.model("User", userSchema);
