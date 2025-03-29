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
  }

  async auth(req: Request, res: Response) {
    const error = userValidation.auth(req.body);
    if (error) return res.render("auth", { error });

    const user = await this.repository.findOne<UserProps>({ email: req.body.email });
    if (!user) {
      return res.render("auth", { error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.render("auth", { error: "Invalid email or password" });
    }

    const token = jwt.sign({ email: user.email }, this.jwtSecret, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
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
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/");
  }

  async find(req: Request, res: Response) {
    const query = req.query.search;
    const users = await this.repository.find<UserProps>({ name: query } as any);

    res.status(200).send(users);
  }

  async findByName(req: Request, res: Response) {
    const query = { name: { $regex: req.params.name, $options: "i" } } as any;
    const users = await this.repository.findOne<UserProps>(query as any);

    res.status(200).send(users);
  }

  async profile(req: Request, res: Response) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send({ error: "Authentication Required" });

    const decoded: any = jwt.verify(token, this.jwtSecret);
    const query = decoded.email;

    const user = await this.repository.findOne<UserProps>({ email: query } as any);
    res.status(200).send(user);
  }

  async signout(req: Request, res: Response) {
    res.cookie("token", "", { httpOnly: true });
    res.render("index", { user: null });
  }
}

export default new UserController();
