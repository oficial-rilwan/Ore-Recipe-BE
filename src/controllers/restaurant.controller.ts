import { Response, Request } from "express";
import RecipeRepository from "../repo/recipe.repo";
import { RestaurantProps } from "../types";

class RecipeController {
  private repository: RecipeRepository;

  constructor() {
    this.repository = new RecipeRepository();

    this.find = this.find.bind(this);
    this.findById = this.findById.bind(this);
  }

  async find(req: Request, res: Response) {
    const query = { searchFields: ["name"] } as {
      page: number;
      limit: number;
      searchFields: string[];
      keyword: string;
    };
    if (req.query.keyword) query.keyword = String(req.query.search);
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);

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
