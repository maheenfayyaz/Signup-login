import express from "express";
import tokenVerification from "../middleware/tokenVerification.mjs";
import { createTask, getAllTask, updateTask, deleteTask } from "../controller/createTaskController.mjs";

const router = express.Router();

router.post("/create", tokenVerification, createTask);
router.get("/get", tokenVerification, getAllTask);
router.put("/update/:id", tokenVerification, updateTask);
router.delete("/delete/:id", tokenVerification, deleteTask);

export default router;