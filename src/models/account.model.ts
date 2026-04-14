import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  account_id: {
    type: Number,
  },
  limit:{
    type:Number
  },
  
});
