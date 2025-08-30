// PostgreSQL User model utility functions
import pool from '../config/db.js';

export async function findUserByEmail(email) {
    const res = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);
    return res.rows[0];
}

export async function createUser({name, email, password}) {
    const res = await pool.query(
        'INSERT INTO public.users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, password]
    );
    return res.rows[0];
}

export async function findUserById(id) {
    const res = await pool.query('SELECT * FROM public.users WHERE id = $1', [id]);
    return res.rows[0];
}

// SQL for table creation (run this in your DB):
// CREATE TABLE users (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(100) NOT NULL,
//   email VARCHAR(100) UNIQUE NOT NULL,
//   password VARCHAR(255) NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
