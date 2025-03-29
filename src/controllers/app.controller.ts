import { Request, Response } from "express";
import UserRepository from "../repo/users.repo";
import _ from "lodash";
import jwt from "jsonwebtoken";
import RecipeRepository from "../repo/recipe.repo";
import { RecipeProps } from "../types";
import convertCurrency from "../utils/currency-converter";

class AppController {
  private repository: UserRepository;
  private recipeRepository: RecipeRepository;

  private jwtSecret: string;

  constructor() {
    this.jwtSecret = "jwtSecret";
    this.repository = new UserRepository();
    this.recipeRepository = new RecipeRepository();

    this.home = this.home.bind(this);
    this.recipe = this.recipe.bind(this);
    this.search = this.search.bind(this);
  }

  async home(req: Request, res: Response) {
    const { data: recipes } = await this.recipeRepository.find();

    const data = { title: "Home", user: null, recipes } as any;
    const token = req.cookies.token;
    if (!token) return res.render("index", data);

    const decoded: any = jwt.verify(token, this.jwtSecret);
    if (!decoded) return res.render("index", data);

    const user = await this.repository.findOne({ email: decoded.email });
    if (!user) return res.render("index", data);

    data.user = user;
    res.render("index", data);
  }

  async search(req: Request, res: Response) {
    const query = String(req.query.search);
    const recipes = await this.recipeRepository.search(query);

    const data = { title: "Home", user: null, recipes, query } as any;
    const token = req.cookies.token;
    if (!token) return res.render("search", data);

    const decoded: any = jwt.verify(token, this.jwtSecret);
    if (!decoded) return res.render("search", data);

    const user = await this.repository.findOne({ email: decoded.email });
    if (!user) return res.render("search", data);

    data.user = user;
    res.render("search", data);
  }

  async recipe(req: Request, res: Response) {
    const id = req.params.id;
    const recipe = await this.recipeRepository.findById<RecipeProps>(id);
    const { data: recipes } = await this.recipeRepository.find();

    if (!recipe) return res.render("404");

    const USDPrice = await convertCurrency(recipe.price);
    const data = { title: "Home", user: null, recipes, recipe, USD: USDPrice } as any;

    const token = req.cookies.token;
    if (!token) return res.render("recipe", data);

    const decoded: any = jwt.verify(token, this.jwtSecret);
    if (!decoded) return res.render("recipe", data);

    const user = await this.repository.findOne({ email: decoded.email });
    if (!user) return res.render("recipe", data);

    data.user = user;
    res.render("recipe", data);
  }

  auth(req: Request, res: Response) {
    const token = req.cookies.token;
    if (!token) return res.render("auth", { error: null });

    res.redirect("/");
  }

  register(req: Request, res: Response) {
    const token = req.cookies.token;
    if (!token) return res.render("register", { error: null });

    res.redirect("/");
  }
}

export default new AppController();
