import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import appController from "../controllers/app.controller";

const appRoutes = Router();

appRoutes.get("/recipe/:id", expressAsyncHandler(appController.recipe));
appRoutes.get("/search", expressAsyncHandler(appController.search));
appRoutes.get("/register", expressAsyncHandler(appController.register));
appRoutes.get("/auth", expressAsyncHandler(appController.auth));
appRoutes.get("/", expressAsyncHandler(appController.home));

export default appRoutes;
