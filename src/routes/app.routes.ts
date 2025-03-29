import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import appController from "../controllers/app.controller";
import isAuth from "../middleware/jwt.middleware";

const appRoutes = Router();

appRoutes.get("/recipe/:id", isAuth, expressAsyncHandler(appController.recipe));
appRoutes.get("/restaurants", isAuth, expressAsyncHandler(appController.restaurants));
appRoutes.get("/search", isAuth, expressAsyncHandler(appController.search));
appRoutes.get("/register", isAuth, expressAsyncHandler(appController.register));
appRoutes.get("/auth", isAuth, expressAsyncHandler(appController.auth));
appRoutes.get("/", isAuth, expressAsyncHandler(appController.home));

export default appRoutes;
