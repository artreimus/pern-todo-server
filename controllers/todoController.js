import asyncHandler from 'express-async-handler';
import pool from '../db/index.js';

// @desc GET all to dos
// @route /api/v1/todos
// @access public
const getAllTodos = asyncHandler(async (req, res) => {
  const allTodos = await pool.query('SELECT * FROM todo');

  res.status(200).json({ data: allTodos.rows });
});

// @desc GET a to do
// @route /api/v1/todo/:id
// @access public
const getTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1', [id]);
  res.status(200).json({ data: todo.rows });
});

// @desc POST a to do
// @route /api/v1/todo
// @access public
const createTodo = asyncHandler(async (req, res) => {
  const { description } = req.body;
  const newTodo = await pool.query(
    'INSERT INTO todo (description) VALUES($1) RETURNING *',
    [description]
  );
  res.status(200).json({ success: true, data: newTodo.rows[0] });
});

// @access PATCH a to do
// @route /api/v1/todo/:id
// @access public
const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const updatedTodo = await pool.query(
    'UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *',
    [description, id]
  );
  res.status(200).json({ success: true, data: updatedTodo.rows });
});

// @access DELETE a to do
// @route /api/v1/todo/:id
// @access public
const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedTodo = await pool.query(
    'DELETE FROM todo WHERE todo_id = $1  RETURNING *',
    [id]
  );
  res.status(200).json({ success: true, data: deletedTodo.rows });
});

export { createTodo, getAllTodos, getTodo, updateTodo, deleteTodo };
