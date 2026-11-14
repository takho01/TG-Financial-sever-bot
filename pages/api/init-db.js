import sql from '../../lib/db';

export default async function handler(req, res) {
  try {
    // Создаем защищенную таблицу transactions в базе Neon
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        chat_id TEXT,
        type VARCHAR(20) NOT NULL,
        category_key VARCHAR(50),
        title TEXT NOT NULL,
        amount_usd DECIMAL(12, 2) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    return res.status(200).json({ success: true, message: "Таблица успешно создана в Neon!" });
  } catch (error) {
    console.error("Ошибка инициализации БД:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
