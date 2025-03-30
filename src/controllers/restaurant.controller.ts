import { Response, Request } from "express";
import RecipeRepository from "../repo/recipe.repo";
import { RestaurantProps } from "../types";
import RestaurantSearch from "../models/restaurant-search.model";

class RecipeController {
  private repository: RecipeRepository;

  constructor() {
    this.repository = new RecipeRepository();

    this.find = this.find.bind(this);
    this.findById = this.findById.bind(this);
  }

  async find(req: any, res: Response) {
    const query = { searchFields: ["name"] } as any;
    if (req.query.search) query.keyword = String(req.query.search);
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);
    if (req.query.search && req?.user) {
      await RestaurantSearch.create({ query: req.query.search, userId: req.user?._id });
    }
    const result = await this.repository.find<RestaurantProps>(query);
    res.status(200).send(result);
  }

  async findById(req: Request, res: Response) {
    const id = req.params.id;
    const result = await this.repository.findById<RestaurantProps>(id);
    if (!result) return res.status(404).send({ error: "Recipe could not be found" });
    res.status(200).send(result);
  }
}

export default new RecipeController();
