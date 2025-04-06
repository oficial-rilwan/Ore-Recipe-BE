import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import UserRepository from "../repo/users.repo";
import { UserProps } from "../types";
import { CONFIG } from "../config/config";
import { AuthorizationError, NotFoundError } from "./error-handler";
import expressAsyncHandler from "express-async-handler";

const userRepository = new UserRepository();

async function jwtMiddleware(req: any, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) throw new AuthorizationError("No authentication token found. Please log in.");

    const decoded: any = jwt.verify(accessToken, CONFIG.JWT_SECRET);
    const user = await userRepository.findOne<UserProps>({ email: decoded.email });
    if (!user) throw new NotFoundError("Requested user could not be found.");

    if (user) req.user = user;
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new AuthorizationError("Session expired. Please log in again.");
    }
    if (error.name === "JsonWebTokenError") {
      throw new AuthorizationError("Invalid token. Please log in again.");
    }
    throw new AuthorizationError("Failed to authenticate token.");
  }
}

const isAuth = expressAsyncHandler(jwtMiddleware);
export default isAuth;
