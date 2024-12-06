import mongoose from "mongoose";
import { MONGODB_URI } from "./env";
import { logger } from "../shared/providers/LoggerProvider";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Successfully connected to MongoDB");
  } catch (error) {
    logger.error("Could not connect to MongoDB", { error });
    process.exit(1);
  }
};

export default connectDB;
