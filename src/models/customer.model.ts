import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    accounts: [
      {
        type: Number,
        required: true,
      },
    ],
    tier_and_details: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

const customerModel = model("Customer", customerSchema);
export { customerModel };
