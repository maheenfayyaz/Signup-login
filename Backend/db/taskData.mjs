import mongoose from "mongoose";
import "dotenv/config";
import chalk from "chalk";

const taskDbUrl = process.env.TASK_URL;

const connectToTaskDb = async () => {
  try {
    await mongoose.connect(taskDbUrl, {
      useNewUrlParser: true,
    });
    console.log(chalk.green.bold("Task MongoDB connected"));
  } catch (error) {
    console.error(chalk.red.bold("Error connecting to Task MongoDB:", error));
  }
};

export default connectToTaskDb;
