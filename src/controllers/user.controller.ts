import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import _ from "lodash";
import jwt from "jsonwebtoken";

import UserRepository from "../repo/users.repo";
import userValidation from "../validations/user.validation";
import { UserProps } from "../types";

class UserController {
  private repository: UserRepository;
  private jwtSecret: string;
  constructor() {
    this.jwtSecret = "jwtSecret";
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
    if (!user) return res.render("auth", { error: "Invalid email or password" });

    if (!user.isActive) {
      return res.render("auth", { error: "Your account has been deactivated. Please contact support." });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.render("auth", { error: "Invalid email or password" });

    const token = jwt.sign({ email: user.email }, this.jwtSecret, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    res.redirect("/");
  }

  async signup(req: Request, res: Response) {
    const error = userValidation.signup(req.body);
    if (error) return res.render("register", { error });

    const user = await this.repository.findOne<UserProps>({ email: req.body.email });
    if (user) {
      return res.render("register", { error: "This account already exists. Login to continue" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.isActive = true;
    req.body.isVerified = true;
    req.body.name = `${req.body.firstName} ${req.body.lastName}`;
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const result = await this.repository.create<UserProps>(req.body);

    const token = jwt.sign({ email: result.email }, this.jwtSecret, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    res.redirect("/");
  }

  async find(req: Request, res: Response) {
    const query = req.query.search;
    const users = await this.repository.find<UserProps>({ name: query } as any);
    users.data = users.data.map((item) => _.omit(item, ["password"]) as UserProps);
    res.status(200).send(users);
  }

  async findByName(req: Request, res: Response) {
    const query = { name: { $regex: req.params.name, $options: "i" } } as any;
    const user = await this.repository.findOne<UserProps>(query as any);

    res.status(200).send(_.omit(user, ["password"]));
  }

  async profile(req: any, res: Response) {
    if (!req.isValidToken) return res.status(401).send({ error: "Authentication Required" });

    res.status(200).send(_.omit(req.user, ["password"]));
  }

  async deactivate(req: any, res: Response) {
    const error = userValidation.password<UserProps>(req.body);
    if (error) return res.status(400).send({ error });

    if (!req.isValidToken) {
      return res.status(401).send({ error: "Authentication Required" });
    }

    if (!req.user.isActive) {
      return res.status(400).send({ error: "Your account has been deactivated. Please contact support." });
    }

    const isValidPassword = await bcrypt.compare(req.body.password, req.user.password);
    if (!isValidPassword) return res.status(400).send({ error: "Password is incorrect" });

    await this.repository.update<Partial<UserProps>>({ isActive: false }, req.user._id);
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    res.status(200).send({ data: "User account deactivated successfully" });
  }

  async signout(req: Request, res: Response) {
    res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    res.render("index", { user: null });
  }
}

export default new UserController();
