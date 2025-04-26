import bcrypt from "bcrypt";
import UserData from "../models/user/index.mjs";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import schema from "../schema/userSchema.mjs";
import chalk from "chalk";

const signUp = async (req, res) => {
    console.log(chalk.cyan("Incoming call to signup API"));

    if (!req.body) {
        return res.status(400).json({ message: "Bad request" });
    }

    try {
        await schema.validateAsync(req.body);
        const password = bcrypt.hashSync(req.body.password, 10);
        const user = await UserData.create({ ...req.body, password });

        await user.save();

        res.status(201).json({
            message: "User  created successfully",
            user: { id: user.id, email: user.email }
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                message: "Duplicate email - Email already exists",
                error: error.message,
            });
        }
        console.error(chalk.red("Signup Error:"), error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
};
const logIn = async (req, res) => {
    try {
        console.log(chalk.yellow("Incoming login request:"), req.body);
        const { email, password } = req.body
        console.log("Login attempt with email:", email);
        const user = await UserData.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials', status: 401 });
        }
        const checkPassword = bcrypt.compareSync(password, user.password);
        if (checkPassword) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SCERET_KEY);
            res.status(200).json({success: true, status: 200, message: "Login Successful", user, token });
        } else {
            res.status(401).json({success: false, status: 401, message: "Incorrect Password" });
        }
    
    }

     catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message, status: 500 });
    }
};

// const forget = async(req, res)=>{
//     const {email} = req.body
//     try {
//         const seasonedUser = await user.findOne({email});
//         if(!seasonedUser){
//             return res.status(404).json({message: "user not found", status: 404})
//         }

//         const secret = process.env.JWT_SCERET_KEY + seasonedUser.password;
//         const token = jwt.sign({email: seasonedUser.email, id: seasonedUser.id}, secret, {expiresIn: '30min'})
//         const link = `http://localhost:5000/resetpassword/${seasonedUser.id}/${token}`
//         console.log(link);
//     } catch (error) {
//         console.log(err);
//         res.status(400).json({ error: err, status: 400 });
//     }
// }

// const resetPassword = async(req, res)=>{
//     const {id, token} = req.params;
//     console.log(req.params);
// }

export { signUp, logIn };