import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
});

const RecipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageURL: { type: String, required: true },
    ingredients: { type: [IngredientSchema], required: true },
    price: { type: Number, required: true, min: 0 },
    categories: [{ type: String }],
    calories: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);
export default Recipe;
