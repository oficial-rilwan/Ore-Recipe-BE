import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import restaurantController from "../controllers/restaurant.controller";
import jwtMiddleware from "../middleware/jwt.middleware";

const restaurantRoutes = Router();

restaurantRoutes.get(
  "/search-history",
  expressAsyncHandler(jwtMiddleware(false)),
  expressAsyncHandler(restaurantController.searchHistory as any)
);
restaurantRoutes.get(
  "/:id",
  expressAsyncHandler(jwtMiddleware(false)),
  expressAsyncHandler(restaurantController.findById as any)
);
restaurantRoutes.get("/", expressAsyncHandler(jwtMiddleware(false)), expressAsyncHandler(restaurantController.find));

export default restaurantRoutes;
