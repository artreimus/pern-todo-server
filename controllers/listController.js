import asyncHandler from 'express-async-handler';
import pool from '../db/index.js';
import CustomError from '../error/index.js';

// @desc GET all lists
// @route /api/v1/lists
// @access public
const getAllLists = asyncHandler(async (req, res) => {
  const allLists = await pool.query('SELECT * FROM list');
  res.status(200).json({ data: allLists.rows });
});

// @desc GET a list
// @route /api/v1/lists/:id
// @access private
const getList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user_id } = req;

  const list = await pool.query(
    'SELECT * FROM list WHERE list_id = $1 AND user_id = $2',
    [id, user_id]
  );

  if (!list.rows.length) {
    throw new CustomError.NotFoundError(`List with id ${id} was not found`);
  }
  res.status(200).json({ data: list.rows });
});

// @desc GET user list
// @route /api/v1/lists/user
// @access private
const getUserLists = asyncHandler(async (req, res) => {
  const { user_id } = req;
  const lists = await pool.query('SELECT * FROM list WHERE user_id = $1', [
    user_id,
  ]);

  res.status(200).json({ data: lists.rows });
});

// @desc POST a list
// @route /api/v1/lists
// @access private
const createList = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const { user_id } = req;

  const newList = await pool.query(
    'INSERT INTO list (title, user_id) VALUES($1, $2) RETURNING *',
    [title, user_id]
  );
  res.status(200).json({ success: true, data: newList.rows[0] });
});

// @access PATCH a list
// @route /api/v1/lists/:id
// @access public
const updateList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const { user_id } = req;

  const updatedList = await pool.query(
    'UPDATE list SET title = $1 WHERE list_id = $2 AND user_id = $3 RETURNING *',
    [title, id, user_id]
  );
  res.status(200).json({ success: true, data: updatedList.rows });
});

// @access DELETE a list
// @route /api/v1/lists/:id
// @access public
const deleteList = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { user_id } = req;

  const deletedList = await pool.query(
    'DELETE FROM list WHERE list_id = $1 AND user_id = $2 RETURNING *',
    [id, user_id]
  );
  res.status(200).json({ success: true, data: deletedList.rows });
});

export {
  createList,
  getAllLists,
  getUserLists as getUserList,
  getList,
  updateList,
  deleteList,
};
