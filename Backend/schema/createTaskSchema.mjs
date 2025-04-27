import joi from 'joi';

const createTaskSchema = joi.object({
    title: joi.string().min(1).required(),
    description: joi.string().min(1).required(),
    assignedTo: joi.string().min(1).required(),
    status: joi.string().valid('To Do', 'In Progress', 'Completed').optional()
});

export default createTaskSchema;
