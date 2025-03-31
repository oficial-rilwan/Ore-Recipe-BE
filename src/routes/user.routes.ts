import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import userController from "../controllers/user.controller";
import isAuth from "../middleware/jwt.middleware";

const userRoutes = Router();

userRoutes.post("/signout", expressAsyncHandler(userController.signout as any));
userRoutes.post("/deactivate", isAuth, expressAsyncHandler(userController.deactivate as any));

userRoutes.get("/profile", isAuth, expressAsyncHandler(userController.profile));
userRoutes.get("/:name", expressAsyncHandler(userController.findByName));
userRoutes.get("/", expressAsyncHandler(userController.find));

export default userRoutes;
