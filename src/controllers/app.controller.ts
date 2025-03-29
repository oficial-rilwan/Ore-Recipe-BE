import { Request, Response } from "express";
import UserRepository from "../repo/users.repo";
import _ from "lodash";
import jwt from "jsonwebtoken";
import RecipeRepository from "../repo/recipe.repo";
import { RecipeProps } from "../types";
import convertCurrency from "../utils/currency-converter";
import RestaurantRepository from "../repo/restaurant.repo";

class AppController {
  private repository: UserRepository;
  private recipeRepository: RecipeRepository;
  private restaurantRepository: RestaurantRepository;

  private jwtSecret: string;

  constructor() {
    this.jwtSecret = "jwtSecret";
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

    const { data: recipes } = await this.recipeRepository.find(query);
    const { data: restaurants } = await this.restaurantRepository.find(query);

    const data = { title: "Home", user: null, recipes, restaurants } as any;

    data.user = req.user;
    res.render("index", data);
  }

  async search(req: any, res: Response) {
    const query = String(req.query.search);
    const recipes = await this.recipeRepository.search(query);

    const data = { title: "Home", user: null, recipes, query } as any;

    data.user = req.user;
    res.render("search", data);
  }

  async recipe(req: any, res: Response) {
    const id = req.params.id;
    const recipe = await this.recipeRepository.findById<RecipeProps>(id);
    const { data: recipes } = await this.recipeRepository.find();

    if (!recipe) return res.render("404");

    const USDPrice = await convertCurrency(recipe.price);
    const data = { title: "Home", user: null, recipes, recipe, USD: USDPrice } as any;

    data.user = req.user;
    res.render("recipe", data);
  }

  async restaurants(req: any, res: Response) {
    const query: any = { searchFields: ["name", "location"] };
    if (req.query.search) query["keyword"] = req.query.search;

    const { data: restaurants } = await this.restaurantRepository.find(query);
    const data = { title: "Home", user: null, restaurants, query: req.query.search } as any;

    data.user = req.user;
    res.render("restaurants", data);
  }

  auth(req: any, res: Response) {
    if (!req.isValidToken) return res.render("auth", { error: null });

    res.redirect("/");
  }

  register(req: any, res: Response) {
    if (!req.isValidToken) return res.render("register", { error: null });

    res.redirect("/");
  }
}

export default new AppController();
