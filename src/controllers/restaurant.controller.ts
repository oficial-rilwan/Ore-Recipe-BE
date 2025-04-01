import { Response, Request } from "express";
import { RestaurantProps } from "../types";
import RestaurantSearch from "../models/restaurant-search.model";
import RestaurantRepository from "../repo/restaurant.repo";
import { AppResponse, NotFoundError } from "../middleware/error-handler";

class RecipeController {
  private repository: RestaurantRepository;

  constructor() {
    this.repository = new RestaurantRepository();

    this.find = this.find.bind(this);
    this.findById = this.findById.bind(this);
  }

  async find(req: any, res: Response) {
    const query = { searchFields: ["name", "location"] } as any;
    if (req.query.search) query.keyword = String(req.query.search);
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);

    if (req.query.search && req?.user) {
      await RestaurantSearch.create({ query: req.query.search, userId: req.user?._id });
    }
    const result = await this.repository.find<RestaurantProps>(query);
    new AppResponse(res).json(result);
  }

  async findById(req: Request, res: Response) {
    const id = req.params.id;
    const result = await this.repository.findById<RestaurantProps>(id);
    if (!result) throw new NotFoundError("Requested restaurant could not be found");

    new AppResponse(res).json(result);
  }
}

export default new RecipeController();
