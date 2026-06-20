import Task from '../models/model.task.js';

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req, res, next) => {
    try {
        if (!req.body.title) {
            res.status(400);
            throw new Error('Please provide a task title');
        }

        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        if (task.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized to update this task');
        }

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            res.status(404);
            throw new Error('Task not found');
        }

        if (task.user.toString() !== req.user.id) {
            res.status(401);
            throw new Error('User not authorized to delete this task');
        }

        await task.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        next(error);
    }
};