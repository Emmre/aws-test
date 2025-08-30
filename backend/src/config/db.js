import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.PG_URI,
    options: '-c search_path=public',
    ssl: {
        rejectUnauthorized: false
    }
});


export default pool;
