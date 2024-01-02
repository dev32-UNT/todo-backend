const { NotFoundError } = require('../errors');
const Task = require('../models/Task');
const { StatusCodes } = require('http-status-codes');

const getAllTasks = async (req, res) => {
    const tasks = await Task.find({ user: req.user.userId });
    res.status(StatusCodes.OK).json(tasks);
};

const getAllTasksPaginated = async (req, res) => {
    const { sort } = req.query;

    let result = Task.find({ user: req.user.userId });

    if (sort) {
        let sortColumn = sort.split('|')[0];
        let sortDirection = sort.split('|')[1] === 'DESC' ? '-' : '';
        result = result.sort(`${sortDirection}${sortColumn}`);
    } else {
        result = result.sort('-createdAt');
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    result = result.skip(skip).limit(limit);

    const tasks = await result;

    const totalTasks = await Task.countDocuments({ user: req.user.userId });
    const numOfPages = Math.ceil(totalTasks / limit);
    res.status(StatusCodes.OK).json({ tasks, totalTasks, numOfPages });
};

const getTaskById = async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.userId });
    if (!task)
        throw new NotFoundError('Task with provided id not found');
    res.status(StatusCodes.OK).json(task);
};

const createTask = async (req, res) => {
    const { title, description, date } = req.body;
    const task = await Task.create({
        title, description, date, user: req.user.userId
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
    getAllTasksPaginated,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
};
