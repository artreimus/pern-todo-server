import asyncHandler from 'express-async-handler';
import pool from '../db/index.js';
import CustomError from '../error/index.js';

// @desc GET all to dos
// @route /api/v1/todos
// @access public
const getAllTodos = asyncHandler(async (req, res) => {
  const allTodos = await pool.query('SELECT * FROM todo');
  res.status(200).json({ data: allTodos.rows });
});

// @desc GET a to do
// @route /api/v1/todos/:id
// @access public
const getTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id]);

  if (!todo.rows.length) {
    throw new CustomError.NotFoundError(`Todo with id ${id} was not found`);
  }
  res.status(200).json({ data: todo.rows });
});

// @desc GET all the todos in a list
// @route /api/v1/todos/list/:id
// @access public
const getListTodos = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await pool.query('SELECT * FROM todo WHERE list_id = $1', [id]);
  res.status(200).json({ data: todo.rows });
});

// @desc POST a to do
// @route /api/v1/todos
// @access public
const createTodo = asyncHandler(async (req, res) => {
  const { description, due_date, list_id } = req.body;
  let newTodo;
  if (due_date) {
    newTodo = await pool.query(
      'INSERT INTO todo (description, due_date, list_id) VALUES($1, $2, $3) RETURNING *',
      [description, due_date, list_id]
    );
  } else {
    newTodo = await pool.query(
      'INSERT INTO todo (description, list_id) VALUES($1, $2) RETURNING *',
      [description, list_id]
    );
  }

  res.status(200).json({ success: true, data: newTodo.rows[0] });
});

// @access PATCH a to do
// @route /api/v1/todos/:id
// @access public
const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, completed, due_date } = req.body;

  const updatedTodo = await pool.query(
    'UPDATE todo SET description = $1, completed= $2, due_date = $3 WHERE todo_id = $4 RETURNING *',
    [description, completed, due_date, id]
  );
  res.status(200).json({ success: true, data: updatedTodo.rows });
});

// @access DELETE a to do
// @route /api/v1/todos/:id
// @access public
const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await pool.query(
    'DELETE FROM todo WHERE todo_id = $1  RETURNING *',
    [id]
  );
  res.status(200).json({ success: true, data: deletedTodo.rows });
});

export {
  createTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  deleteTodo,
  getListTodos,
};
