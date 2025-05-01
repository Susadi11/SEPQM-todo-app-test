import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    date: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Todo", TodoSchema);
