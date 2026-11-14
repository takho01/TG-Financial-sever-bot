import { neon } from '@neondatabase/serverless';

// Подключение к Neon по защищенному протоколу с использованием переменной из Vercel
const sql = neon(process.env.DATABASE_URL);

export default sql;
