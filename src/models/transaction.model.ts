import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema(
  {
    account_id: {
      type: Number,
      required: true,
    },
    transaction_count: {
      type: Number,
      required: true,
    },
    bucket_start_date: {
      type: Date,
      required: true,
    },
    bucket_end_date: {
      type: Date,
      required: true,
    },
    transactions: [
      {
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
        transaction_code: { type: String, required: true }, // "buy" | "sell"
        symbol: { type: String, required: true },
        price: { type: String }, // stored as string (high precision decimal)
        total: { type: String }, // stored as string (high precision decimal)
      },
    ],
  },
  { timestamps: true },
);

const transactionModel = model("Transaction", transactionSchema);
export { transactionModel };
