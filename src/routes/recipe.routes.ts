import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import recipeController from "../controllers/recipe.controller";
import jwtMiddleware from "../middleware/jwt.middleware";

const recipeRoutes = Router();

recipeRoutes.get(
  "/search-history",
  expressAsyncHandler(jwtMiddleware(false)),
  expressAsyncHandler(recipeController.searchHistory as any)
);
recipeRoutes.get(
  "/:id",
  expressAsyncHandler(jwtMiddleware(false)),
  expressAsyncHandler(recipeController.findById as any)
);
recipeRoutes.get("/", expressAsyncHandler(jwtMiddleware(false)), expressAsyncHandler(recipeController.find));

export default recipeRoutes;
