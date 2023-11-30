const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

  reviewSchema.pre(/^find/, function (next) {
    console.log("Populating 'user' field...");
    this.populate({
      path: "user",
      select: "name photo",
    });
    next();
  });
module.exports = mongoose.model("Review", reviewSchema);