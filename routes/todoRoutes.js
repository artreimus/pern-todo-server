import express from 'express';
import {
  createTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  getListTodos,
  getTodosDueToday,
  getTodosDueThisWeek,
} from '../controllers/todoController.js';
import verifyJWT from '../middlewares/verifyJWT.js';

const router = express.Router();

router.use(verifyJWT);
router.route('/').post(createTodo).get(getAllTodos);
router.route('/today').get(getTodosDueToday);
router.route('/this-week').get(getTodosDueThisWeek);
router.route('/:id').get(getTodo).patch(updateTodo).delete(deleteTodo);
router.route('/list/:id').get(getListTodos);

export default router;
