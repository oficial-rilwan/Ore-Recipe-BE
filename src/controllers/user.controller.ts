import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import _ from "lodash";
import jwt from "jsonwebtoken";

import UserRepository from "../repo/users.repo";
import userValidation from "../validations/user.validation";
import { UserProps } from "../types";
import {
  ApplicationError,
  AuthorizationError,
  NotFoundError,
  AppResponse,
  ValidationError,
} from "../middleware/error-handler";
import { CONFIG } from "../config/config";

class UserController {
  private repository: UserRepository;
  private jwtSecret: string;
  constructor() {
    this.jwtSecret = CONFIG.JWT_SECRET;
    this.repository = new UserRepository();
    this.auth = this.auth.bind(this);
    this.signup = this.signup.bind(this);
    this.deactivate = this.deactivate.bind(this);
    this.find = this.find.bind(this);
    this.findByName = this.findByName.bind(this);
    this.profile = this.profile.bind(this);
    this.signout = this.signout.bind(this);
  }

  async auth(req: Request, res: Response) {
    const error = userValidation.auth(req.body);
    if (error) return res.render("auth", { error });

    const user = await this.repository.findOne<UserProps>({ email: req.body.email });
    if (!user) return new AppResponse(res).render("auth", { error: "Invalid email or password" });

    if (!user.isActive) return new AppResponse(res).render("auth", { error: "Your account has been deactivated." });

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return new AppResponse(res).render("auth", { error: "Invalid email or password" });

    const token = jwt.sign({ email: user.email }, this.jwtSecret, { expiresIn: "1h" });
    new AppResponse(res).cookie("token", token).redirect("/");
  }

  async signup(req: Request, res: Response) {
    const error = userValidation.signup(req.body);
    if (error) return new AppResponse(res).render("register", { error });

    const user = await this.repository.findOne<UserProps>({ email: req.body.email });
    if (user) return new AppResponse(res).render("register", { error: "This account already exists." });

    const salt = await bcrypt.genSalt(10);
    req.body.isActive = true;
    req.body.isVerified = true;
    req.body.name = `${req.body.firstName} ${req.body.lastName}`;
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const result = await this.repository.create<UserProps>(req.body);

    const token = jwt.sign({ email: result.email }, this.jwtSecret, { expiresIn: "1h" });
    new AppResponse(res).cookie("token", token).redirect("/");
  }

  async find(req: Request, res: Response) {
    const query = req.query.search;
    const users = await this.repository.find<UserProps>({ name: query } as any);
    users.data = users.data.map((item) => _.omit(item, ["password"]) as UserProps);

    new AppResponse(res, 200).json(users);
  }

  async findByName(req: Request, res: Response) {
    const query = { name: { $regex: req.params.name, $options: "i" } } as any;
    const user = await this.repository.findOne<UserProps>(query as any);
    if (!user) throw new NotFoundError("The requested user could not be found.");

    new AppResponse(res, 200).json(_.omit(user, ["password"]));
  }

  async profile(req: any, res: Response) {
    if (!req.isValidToken) throw new AuthorizationError("Authentication Required");
    new AppResponse(res, 200).json(_.omit(req.user, ["password"]));
  }

  async deactivate(req: any, res: Response) {
    const { isActive } = req.user;
    const error = userValidation.password<UserProps>(req.body);
    if (error) throw new ValidationError(error);

    if (!req.isValidToken) throw new AuthorizationError("Authentication Required");
    if (!isActive) throw new ApplicationError("Your account has been deactivated. Please contact support.");

    const isValidPassword = await bcrypt.compare(req.body.password, req.user.password);
    if (!isValidPassword) throw new ApplicationError("Password is incorrect");

    await this.repository.update<Partial<UserProps>>({ isActive: false }, req.user._id);
    new AppResponse(res, 200)
      .cookie("token", "", 0, new Date(0))
      .json({ data: "User account deactivated successfully" });
  }

  async signout(req: Request, res: Response) {
    new AppResponse(res, 200).cookie("token", "", 0, new Date(0)).render("index", { user: null });
  }
}

export default new UserController();
