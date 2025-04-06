import { Response, Request } from "express";
import RecipeRepository, { RecipeSearchRepository } from "../repo/recipe.repo";
import { RecipeProps, SearchHistoryProps } from "../types";
import { AppResponse, NotFoundError } from "../middleware/error-handler";
import convertCurrency from "../utils/currency-converter";

class RecipeController {
  private repository: RecipeRepository;
  private searchRepository: RecipeSearchRepository;

  constructor() {
    this.repository = new RecipeRepository();
    this.searchRepository = new RecipeSearchRepository();

    this.find = this.find.bind(this);
    this.findById = this.findById.bind(this);
    this.searchHistory = this.searchHistory.bind(this);
  }

  async find(req: any, res: Response) {
    const query = { searchFields: ["name", "ingredients.name", "categories"] } as any;
    if (req.query.search) query.keyword = String(req.query.search);
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);

    if (req.query.search && req?.user) {
      const q = { query: req.query.search, userId: req.user?._id };
      const isExist = await this.searchRepository.findOne(q);
      if (!isExist) await this.searchRepository.create(q);
    }

    const result = await this.repository.find<RecipeProps>(query);
    new AppResponse(res).json(result);
  }

  async searchHistory(req: any, res: Response) {
    const query = { searchFields: ["query"], filters: {} } as any;
    if (req.query.search) query.keyword = String(req.query.search);
    if (req.query.page) query.page = Number(req.query.page);
    if (req.query.limit) query.limit = Number(req.query.limit);
    if (req.user) query.filters.userId = req.user._id;

    const result = await this.searchRepository.find<SearchHistoryProps>(query);
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
