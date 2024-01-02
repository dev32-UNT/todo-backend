const express = require('express');
const { getAllTasks, createTask, deleteTask, updateTask, getTaskById, deleteAllTasks } = require('../controllers/tasksController');
const router = express.Router();

router.route('/').get(getAllTasks).post(createTask).delete(deleteAllTasks); 
router.route('/:id').get(getTaskById).patch(updateTask).delete(deleteTask);

module.exports = router;
