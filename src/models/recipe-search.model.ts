import mongoose from "mongoose";

const RecipeSearchSchema = new mongoose.Schema(
  {
    query: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const RecipeSearch = mongoose.model("RecipeSearch", RecipeSearchSchema);
export default RecipeSearch;
