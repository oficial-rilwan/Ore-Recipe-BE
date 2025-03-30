import { Request, Response } from "express";
import UserRepository from "../repo/users.repo";
import _ from "lodash";
import jwt from "jsonwebtoken";
import RecipeRepository from "../repo/recipe.repo";
import { RecipeProps } from "../types";
import convertCurrency from "../utils/currency-converter";
import RestaurantRepository from "../repo/restaurant.repo";
import RestaurantSearch from "../models/restaurant-search.model";
import RecipeSearch from "../models/recipe-search.model";
import { AppResponse, NotFoundError } from "../middleware/error-handler";

class AppController {
  private repository: UserRepository;
  private recipeRepository: RecipeRepository;
  private restaurantRepository: RestaurantRepository;

  constructor() {
    this.repository = new UserRepository();
    this.recipeRepository = new RecipeRepository();
    this.restaurantRepository = new RestaurantRepository();

    this.home = this.home.bind(this);
    this.recipe = this.recipe.bind(this);
    this.search = this.search.bind(this);
    this.restaurants = this.restaurants.bind(this);
    this.register = this.register.bind(this);
    this.auth = this.auth.bind(this);
  }

  async home(req: any, res: Response) {
    const query: any = {};
    if (req.query.search) query["keyword"] = req.query.search;
    const data = { title: "Home", user: null, recipes: [], restaurants: [] } as any;

    const { data: recipes } = await this.recipeRepository.find(query);
    const { data: restaurants } = await this.restaurantRepository.find(query);

    data.user = req.user;
    data.recipes = recipes;
    data.restaurants = restaurants;
    new AppResponse(res).render("index", data);
  }

  async search(req: any, res: Response) {
    const query = String(req.query.search);
    const data = { title: "Home", user: null, recipes: [], query } as any;

    const recipes = await this.recipeRepository.search(query);
    if (req.query.search && req?.user) {
      await RecipeSearch.create({ query: req.query.search, userId: req.user?._id });
    }

    data.user = req.user;
    data.recipes = recipes;
    new AppResponse(res).render("search", data);
  }

  async recipe(req: any, res: Response) {
    const id = req.params.id;
    const data = { title: "Home", user: null, recipes: [], recipe: null, USD: 0 } as any;

    const { data: recipes } = await this.recipeRepository.find();
    const recipe = await this.recipeRepository.findById<RecipeProps>(id);
    if (!recipe) throw new NotFoundError("Requested recipe could not be found");

    const USDPrice = await convertCurrency(recipe.price);

    data.user = req.user;
    data.USD = USDPrice;
    data.recipe = recipe;
    data.recipes = recipes;
    new AppResponse(res).render("recipe", data);
  }

  async restaurants(req: any, res: Response) {
    const query: any = { searchFields: ["name", "location"] };
    if (req.query.search) query["keyword"] = req.query.search;
    const data = { title: "Home", user: null, restaurants: [], query: req.query.search } as any;

    const { data: restaurants } = await this.restaurantRepository.find(query);
    if (req.query.search && req?.user) {
      await RestaurantSearch.create({ query: req.query.search, userId: req.user?._id });
    }

    data.user = req.user;
    data.restaurants = restaurants;
    new AppResponse(res).render("restaurants", data);
  }

  auth(req: any, res: Response) {
    if (!req.isValidToken) return new AppResponse(res).render("auth", { error: null });
    new AppResponse(res).redirect("/");
  }

  register(req: any, res: Response) {
    if (!req.isValidToken) return new AppResponse(res).render("register", { error: null });
    new AppResponse(res).redirect("/");
  }
}

export default new AppController();
