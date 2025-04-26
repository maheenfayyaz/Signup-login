import bcrypt from "bcrypt";
import UserData from "../models/user/index.mjs";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import schema from "../schema/userSchema.mjs";
import chalk from "chalk";
import nodemailer from "nodemailer";

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
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
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
const forget = async (req, res) => {
    const { email } = req.body;
    try {
        const seasonedUser = await UserData.findOne({ email });
        if (!seasonedUser) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        const secret = process.env.JWT_SECRET_KEY + seasonedUser.password;
        const token = jwt.sign({ email: seasonedUser.email, id: seasonedUser._id }, secret, { expiresIn: '30m' });
        const link = `http://localhost:5173/resetpassword?id=${seasonedUser._id}&token=${token}`;
        console.log("Password reset link:", link);

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true', 
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"No Reply" <${process.env.SMTP_USER}>`,
            to: seasonedUser.email,
            subject: "Password Reset Request",
            html: `<p>You requested a password reset. Click the link below to reset your password:</p>
                   <a href="${link}">${link}</a>
                   <p>This link will expire in 30 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link has been sent to your email" });
    } catch (error) {
        console.error("Forget password error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message, stack: error.stack });
    }
};

const resetPassword = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const user = await UserData.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found", status: 404 });
        }

        const secret = process.env.JWT_SECRET_KEY + user.password;
        try {
            const payload = jwt.verify(token, secret);
            if (payload.id !== id) {
                return res.status(401).json({ message: "Invalid token" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user.password = hashedPassword;
            await user.save();

            res.status(200).json({ message: "Password has been reset successfully" });
        } catch (err) {
            console.error("Token verification error:", err);
            res.status(401).json({ message: "Invalid or expired token" });
        }
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export { signUp, logIn, forget, resetPassword };
