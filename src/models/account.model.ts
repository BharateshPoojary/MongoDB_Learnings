import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    account_id: {
      type: Number,
      required: true,
      unique: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    products: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const accountModel = mongoose.model("Account", accountSchema);
export { accountModel };
