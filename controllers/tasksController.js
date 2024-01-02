const { NotFoundError } = require('../errors');
const Task = require('../models/Task');
const { StatusCodes } = require('http-status-codes');

const getAllTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json(tasks);
};


const getTaskById = async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    if (!task)
        throw new NotFoundError('Task with provided id not found');
    res.status(StatusCodes.OK).json(task);
};

const createTask = async (req, res) => {
    // Check if the request body contains an array of tasks
    const tasksData = Array.isArray(req.body) ? req.body : [req.body];

    const createdTasks = [];

    // Iterate over each task data and create a task
    for (const taskData of tasksData) {
        const { title, description, date, completed } = taskData;
        const task = await Task.create({
            title, description, date, completed, user: req.user.userId
        });
        createdTasks.push(task);
    }

    res.status(StatusCodes.CREATED).json(createdTasks);
};

const updateTask = async (req, res) => {
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.userId }, req.body, { new: true, runValidators: true });
    if (!task)
        throw new NotFoundError('Task with provided id not found');
    res.status(StatusCodes.OK).json({ task });
};

const deleteTask = async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    if (!task)
        throw new NotFoundError('Task with provided id not found');
    await Task.deleteOne({ _id: req.params.id, user: req.user.userId });
    res.status(StatusCodes.OK).json('Successfully deleted.');
};
const deleteAllTasks = async (req, res) => {
    await Task.deleteMany({ user: req.user.userId });
    res.status(StatusCodes.OK).json('All tasks deleted.');
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    deleteAllTasks
};
