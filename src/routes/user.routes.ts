import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import userController from "../controllers/user.controller";
import jwtMiddleware from "../middleware/jwt.middleware";

const userRoutes = Router();

userRoutes.post("/auth", expressAsyncHandler(userController.auth as any));
userRoutes.post("/register", expressAsyncHandler(userController.signup as any));
userRoutes.post("/signout", expressAsyncHandler(userController.signout as any));
userRoutes.post(
  "/deactivate",
  expressAsyncHandler(jwtMiddleware(true)),
  expressAsyncHandler(userController.deactivate as any)
);

userRoutes.get("/me", expressAsyncHandler(jwtMiddleware(true)), expressAsyncHandler(userController.profile));
userRoutes.get("/:name", expressAsyncHandler(userController.findByName));
userRoutes.get("/", expressAsyncHandler(userController.find));

export default userRoutes;
