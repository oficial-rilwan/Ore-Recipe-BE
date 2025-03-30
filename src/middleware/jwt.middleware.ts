import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserRepository from "../repo/users.repo";
import { UserProps } from "../types";
import { CONFIG } from "../config/config";

const userRepository = new UserRepository();

export default async function isAuth(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;
    const decoded: any = jwt.verify(token, CONFIG.JWT_SECRET);

    const user = await userRepository.findOne<UserProps>({ email: decoded.email });

    if (user) req.user = user;
    req.isValidToken = true;
    next();
  } catch (error) {
    req.isValidToken = false;
    next();
  }
}
