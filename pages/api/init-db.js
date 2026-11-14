import sql from '../../lib/db';

export default async function handler(req, res) {
  try {
    // 1. Создаем таблицу, если её еще нет
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        chat_id TEXT,
        type TEXT,
        category_key TEXT,
        title TEXT,
        amount_usd NUMERIC,
        date TEXT,
        timestamp BIGINT
      );
    `;

    // 2. Безопасно добавляем колонки на случай, если таблица была создана ранее без них
    await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS timestamp BIGINT;`;
    await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS category_key TEXT;`;
    await sql`ALTER TABLE transactions ADD COLUMN IF NOT EXISTS chat_id TEXT;`;

    return res.status(200).json({ 
      success: true, 
      message: "Таблица и все необходимые колонки (timestamp, category_key и др.) успешно проверены в Neon!" 
    });
  } catch (error) {
    console.error("Ошибка при проверке базы:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
