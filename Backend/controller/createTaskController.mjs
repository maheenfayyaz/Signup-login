import Task from '../models/user/task.mjs';
import createTaskSchema from '../schema/createTaskSchema.mjs';

const createTask = async (req, res) => {
    try {
        console.log("Received create task request with body:", req.body);
        await createTaskSchema.validateAsync(req.body);
        const { title, description, assignedTo, status } = req.body;
        const task = new Task({ title, description, assignedTo, status });
        console.log("Saving task to database:", task);
        await task.save();
        console.log("Task saved successfully:", task);
        console.log("Saved task document:", task);
        res.status(201).send({ status: 201, message: "Task created successfully", task });
    } catch (error) {
        console.error("Error in createTask:", error);
        res.status(400).send({ error: error.message || "Validation failed", status: 400 });
    }
};

const getAllTask = async (req, res) => {
    try {
        console.log("Received get all tasks request");
        const tasks = await Task.find();
        console.log("Tasks retrieved:", tasks);
        res.status(200).send(tasks);
    } catch (error) {
        console.error("Error in getAllTask:", error);
        res.status(500).send({ error: error.message || "Something went wrong", status: 500 });
    }
};

const updateTask = async (req, res) => {
    try {
        console.log("Received update task request for id:", req.params.id, "with body:", req.body);
        const { id } = req.params;
        await createTaskSchema.validateAsync(req.body);
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTask) {
            console.log("Task not found for id:", id);
            return res.status(404).send({ error: "Task not found", status: 404 });
        }
        console.log("Task updated successfully:", updatedTask);
        res.status(200).send({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.error("Error in updateTask:", error);
        res.status(400).send({ error: error.message || "Validation failed", status: 400 });
    }
};

const deleteTask = async (req, res) => {
    try {
        console.log("Received delete task request for id:", req.params.id);
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            console.log("Task not found for id:", id);
            return res.status(404).send({ error: "Task not found", status: 404 });
        }
        console.log("Task deleted successfully for id:", id);
        res.status(200).send({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error in deleteTask:", error);
        res.status(500).send({ error: error.message || "Something went wrong", status: 500 });
    }
};

export { createTask, getAllTask, updateTask, deleteTask };
