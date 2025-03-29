import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import restaurantController from "../controllers/restaurant.controller";

const restaurantRoutes = Router();

restaurantRoutes.get("/:id", expressAsyncHandler(restaurantController.findById as any));
restaurantRoutes.get("/", expressAsyncHandler(restaurantController.find));

export default restaurantRoutes;
