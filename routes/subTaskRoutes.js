// subTaskRoutes.js

const express = require('express');
const router = express.Router();
const { createSubTask, getSubTasks, updateSubTask, deleteSubTask } = require('../controllers/subtaskControllers');

router.post('/', createSubTask);
router.get('/', getSubTasks);
router.put('/:subtaskId', updateSubTask);
router.delete('/:subtaskId', deleteSubTask);

module.exports = router;
