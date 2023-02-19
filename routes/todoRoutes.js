import express from 'express';
import {
  createTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  deleteTodo,
} from '../controllers/todoController.js';

const router = express.Router();

router.route('/').post(createTodo).get(getAllTodos);
router.route('/:id').get(getTodo).patch(updateTodo).delete(deleteTodo);

export default router;
