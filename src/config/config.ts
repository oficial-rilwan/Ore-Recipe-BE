import dotenv from "dotenv";

dotenv.config();

export const CONFIG = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET as string,
} as const;
