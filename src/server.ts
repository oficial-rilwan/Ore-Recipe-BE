import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import database from "./database";
import userRoutes from "./routes/user.routes";
import cookieParser from "cookie-parser";
import appRoutes from "./routes/app.routes";
import recipeRoutes from "./routes/recipe.routes";
import restaurantRoutes from "./routes/restaurant.routes";
import errorHandler from "./middleware/error-handler";
import { CONFIG } from "./config/config";

dotenv.config();
database.connect();

const app = express();
const PORT = CONFIG.PORT || 8080;

const allowedOrigin = process.env.NODE_ENV === "production" ? "https://ore-recipe-fe.onrender.com" : true;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());

app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

app.use("/", appRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/restaurants", restaurantRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use(errorHandler);
