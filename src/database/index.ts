import mongoose from "mongoose";
import dotenv from "dotenv";
import { CONFIG } from "../config/config";

class DatabaseConnection {
  private connection_string?: string;
  constructor() {
    this.connection_string = CONFIG.MONGO_URI;
  }
  async connect() {
    try {
      await mongoose.connect(this.connection_string as string);
      console.log("MongoDB connected successfully");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    }
  }
}

export default new DatabaseConnection();
