import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import userController from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.post("/auth", expressAsyncHandler(userController.auth as any));
userRoutes.post("/register", expressAsyncHandler(userController.signup as any));
userRoutes.post("/signout", expressAsyncHandler(userController.signout as any));

userRoutes.get("/:name", expressAsyncHandler(userController.findByName));
userRoutes.get("/", expressAsyncHandler(userController.find));

export default userRoutes;
