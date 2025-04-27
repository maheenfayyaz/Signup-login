import mongoose from "mongoose";
import "dotenv/config";
import chalk from "chalk";

const url = process.env.URL;

const connectToUserDb = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      // Removed useUnifiedTopology as it is deprecated warning
    });
    console.log(chalk.blue.bold("MongoDB connected"));
  } catch (error) {
    console.error(chalk.red.bold("Error in connecting MongoDB:", error));
  }
};

export default connectToUserDb;
