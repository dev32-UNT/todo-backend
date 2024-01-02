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
    const { title, description, date, completed } = req.body;
    const task = await Task.create({
        title, description, date, completed, user: req.user.userId
    });
    res.status(StatusCodes.CREATED).json(task);
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

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
