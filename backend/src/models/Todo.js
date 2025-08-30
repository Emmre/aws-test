import pool from '../config/db.js';

export async function getTodosByUser(userId) {
  const res = await pool.query('SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
  return res.rows;
}

export async function createTodo({ user_id, text, image }) {
  const res = await pool.query(
    'INSERT INTO todos (user_id, text, image) VALUES ($1, $2, $3) RETURNING *',
    [user_id, text, image]
  );
  return res.rows[0];
}

export async function updateTodo({ id, user_id, text, image }) {
  const res = await pool.query(
    'UPDATE todos SET text = $1, image = $2 WHERE id = $3 AND user_id = $4 RETURNING *',
    [text, image, id, user_id]
  );
  return res.rows[0];
}

export async function deleteTodo({ id, user_id }) {
  const res = await pool.query('DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);
  return res.rows[0];
}

export async function findTodoById({ id, user_id }) {
  const res = await pool.query('SELECT * FROM todos WHERE id = $1 AND user_id = $2', [id, user_id]);
  return res.rows[0];
}
