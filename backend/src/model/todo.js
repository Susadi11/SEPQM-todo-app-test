const mongoose = require("mongoose");

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
    },
    status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Todo", TodoSchema);
