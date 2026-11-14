import sql from '../../lib/db';

export default async function handler(req, res) {
  try {
    // Получение списка транзакций (GET)
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, chat_id, type, category_key, title, amount_usd, date, timestamp 
        FROM transactions 
        ORDER BY timestamp DESC
      `;
      return res.status(200).json({ success: true, data: rows });
    }

    // Добавление новой транзакции (POST)
    if (req.method === 'POST') {
      const { chatId, type, categoryKey, title, amountUSD, date } = req.body;
      const timestamp = Date.now();

      const result = await sql`
        INSERT INTO transactions (chat_id, type, category_key, title, amount_usd, date, timestamp)
        VALUES (${chatId || 'default'}, ${type}, ${categoryKey || null}, ${title}, ${amountUSD}, ${date}, ${timestamp})
        RETURNING id, type, category_key, title, amount_usd, date, timestamp;
      `;

      return res.status(200).json({ success: true, data: result[0] });
    }

    // Удаление транзакции (DELETE)
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM transactions WHERE id = ${id}`;
      return res.status(200).json({ success: true, message: "Успешно удалено" });
    }

    return res.status(405).json({ success: false, message: "Метод не поддерживается" });
  } catch (error) {
    console.error("Ошибка API транзакций:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
