import mongoose from "mongoose";

const RestaurantSearchSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    query: { type: String, required: true },
  },
  { timestamps: true }
);

const RestaurantSearch = mongoose.model("RestaurantSearch", RestaurantSearchSchema);
export default RestaurantSearch;
