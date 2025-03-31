import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import appController from "../controllers/app.controller";
import isAuth from "../middleware/jwt.middleware";
import userController from "../controllers/user.controller";

const appRoutes = Router();

appRoutes.get("/recipe/:id", isAuth, expressAsyncHandler(appController.recipe));
appRoutes.get("/restaurants", isAuth, expressAsyncHandler(appController.restaurants));
appRoutes.get("/search", isAuth, expressAsyncHandler(appController.search));
appRoutes.get("/register", isAuth, expressAsyncHandler(appController.register as any));
appRoutes.get("/auth", isAuth, expressAsyncHandler(appController.auth as any));
appRoutes.get("/", isAuth, expressAsyncHandler(appController.home));

appRoutes.post("/auth", expressAsyncHandler(userController.auth as any));
appRoutes.post("/register", expressAsyncHandler(userController.signup as any));

export default appRoutes;
