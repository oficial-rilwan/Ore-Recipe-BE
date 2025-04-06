import { Response, Request } from "express";
import RecipeRepository from "../repo/recipe.repo";
import { RecipeProps } from "../types";
import RecipeSearch from "../models/recipe-search.model";
import { AppResponse, NotFoundError } from "../middleware/error-handler";
import convertCurrency from "../utils/currency-converter";

class RecipeController {
  private repository: RecipeRepository;

  constructor() {
    this.repository = new RecipeRepository();

    this.find = this.find.bind(this);
    this.findById = this.findById.bind(this);
  }

  async find(req: any, res: Response) {
    const query = { searchFields: ["name", "ingredients.name", "categories"] } as any;
    if (req.query.search) query.keyword = String(req.query.search);
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);

    if (req.query.search && req?.user) {
      await RecipeSearch.create({ query: req.query.search, userId: req.user?._id });
    }

    const result = await this.repository.find<RecipeProps>(query);
    new AppResponse(res).json(result);
  }

  async findById(req: Request, res: Response) {
    const id = req.params.id;
    const result = await this.repository.findById<RecipeProps>(id);
    if (!result) throw new NotFoundError("Requested recipe could not be found");

    result["USDPrice"] = (await convertCurrency(result.price)) || 0;
    new AppResponse(res).json(result);
  }
}

export default new RecipeController();
