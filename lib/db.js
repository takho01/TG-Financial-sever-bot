import postgres from 'postgres';

// Подключение к Neon с помощью библиотеки postgres
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export default sql;
