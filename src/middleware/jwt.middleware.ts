import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import UserRepository from "../repo/users.repo";
import { UserProps } from "../types";
import { CONFIG } from "../config/config";
import { AuthorizationError, NotFoundError } from "./error-handler";

const userRepository = new UserRepository();

function jwtMiddleware(required = true) {
  return async function (req: any, res: Response, next: NextFunction) {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        if (required) {
          throw new AuthorizationError("No authentication token found. Please log in.");
        } else {
          return next();
        }
      }

      const decoded: any = jwt.verify(accessToken, CONFIG.JWT_SECRET);
      const user = await userRepository.findOne<UserProps>({ email: decoded.email });

      if (!user) {
        if (required) {
          throw new NotFoundError("Requested user could not be found.");
        } else {
          return next();
        }
      }

      req.user = user;
      next();
    } catch (error: any) {
      if (!required) return next();

      if (error.name === "TokenExpiredError") {
        throw new AuthorizationError("Session expired. Please log in again.");
      }
      if (error.name === "JsonWebTokenError") {
        throw new AuthorizationError("Invalid token. Please log in again.");
      }
      throw new AuthorizationError("Failed to authenticate token.");
    }
  };
}

export default jwtMiddleware;
