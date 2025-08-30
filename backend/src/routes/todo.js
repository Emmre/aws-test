import express from 'express';
import auth from '../middleware/auth.js';
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  upload
} from '../controllers/todoController.js';

const router = express.Router();

router.get('/', auth, getTodos);
router.post('/', auth, upload.single('image'), addTodo);
router.put('/:id', auth, upload.single('image'), updateTodo);
router.delete('/:id', auth, deleteTodo);

export default router;
