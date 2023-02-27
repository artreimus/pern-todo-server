import express from 'express';
import {
  getAllLists,
  getList,
  createList,
  updateList,
  deleteList,
  getUserList,
} from '../controllers/listController.js';

import verifyJWT from '../middlewares/verifyJWT.js';
const router = express.Router();

router.use(verifyJWT);
router.route('/').post(createList).get(getAllLists);
router.route('/:id').get(getList).patch(updateList).delete(deleteList);
router.route('/user/:id').get(getUserList);

export default router;
