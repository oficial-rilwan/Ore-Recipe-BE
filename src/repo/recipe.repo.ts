import _ from "lodash";
import Repository from ".";
import Recipe from "../models/recipe.model";
import { RecipeProps } from "../types";

class RecipeRepository extends Repository {
  constructor() {
    super(Recipe);
  }

  async groupByCategories() {
    const recipes = await this.find<RecipeProps>({ limit: 50 } as any);
    return _.groupBy(recipes.data, (item) => {
      return item.categories[0];
    });
  }
  async search(keyword: string) {
    const result: any = await Recipe.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { "ingredients.name": { $regex: keyword, $options: "i" } },
        { categories: { $regex: keyword, $options: "i" } },
      ],
    });
    return result as RecipeProps[];
  }
}

export default RecipeRepository;
