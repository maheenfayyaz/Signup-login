import mongoose from "mongoose";
import "dotenv/config"
import chalk from 'chalk'

const dbUserName = `${process.env.DB_User_Name}`;
const url = `${process.env.URL}/${dbUserName}`

const connectToUserDb = async()=>{
    mongoose.connection.on("open", () => {
         console.log(chalk.blue.bold("MongoDB connected"))
    });
    mongoose.connection.on ("error", () => {
        console.error(chalk.red.bold('Error in connecting MongoDB'))
    })
}

mongoose.connect(url)
export default connectToUserDb