import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserRepository from "../repo/users.repo";

const userRepository = new UserRepository();

export default async function isAuth(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;
    const decoded: any = jwt.verify(token, "jwtSecret");

    const user = await userRepository.findOne({ email: decoded.email });
    if (!user) res.status(401).send({ error: "User not found" }).end();

    req.user = user;
    next();
  } catch (error) {
    req.isValidToken = false;
    next();
  }
}
