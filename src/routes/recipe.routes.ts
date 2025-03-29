import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import recipeController from "../controllers/recipe.controller";

const recipeRoutes = Router();

recipeRoutes.get("/:id", expressAsyncHandler(recipeController.findById as any));
recipeRoutes.get("/", expressAsyncHandler(recipeController.find));

export default recipeRoutes;
