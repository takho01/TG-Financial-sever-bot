import sql from '../../lib/db';
import { getTelegramUserId } from '../../lib/auth';

const mapRow = (r) => ({
  id: Number(r.id),
  type: r.type,
  category_key: r.category_key,
  title: r.title,
  amount_usd: Number(r.amount_usd),
  date: r.date,
  timestamp: Number(r.timestamp),
});

export default async function handler(req, res) {
  const tgId = getTelegramUserId(req);
  if (!tgId) {
    return res.status(401).json({ success: false, error: 'unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, type, category_key, title, amount_usd, date, timestamp
        FROM transactions
        WHERE telegram_id = ${tgId}
        ORDER BY timestamp DESC
        LIMIT 1000
      `;
      return res.status(200).json({ success: true, data: rows.map(mapRow) });
    }

    if (req.method === 'POST') {
      const { type, categoryKey, title, amountUSD } = req.body || {};
      const amount = Number(amountUSD);
      if (!type || !Number.isFinite(amount)) {
        return res.status(400).json({ success: false, error: 'bad input' });
      }

      const result = await sql`
        INSERT INTO transactions (telegram_id, type, category_key, title, amount_usd, date, timestamp)
        VALUES (${tgId}, ${String(type)}, ${categoryKey ? String(categoryKey) : null},
                ${String(title ?? '')}, ${amount}, ${'Только что'}, ${Date.now()})
        RETURNING id, type, category_key, title, amount_usd, date, timestamp
      `;
      return res.status(200).json({ success: true, data: mapRow(result[0]) });
    }

    if (req.method === 'DELETE') {
      const id = Number(req.query.id);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ success: false, error: 'bad id' });
      }
      const rows = await sql`
        DELETE FROM transactions
        WHERE id = ${id} AND telegram_id = ${tgId}
        RETURNING id
      `;
      if (!rows.length) {
        return res.status(404).json({ success: false, error: 'not found' });
      }
      return res.status(200).json({ success: true, message: 'Успешно удалено' });
    }

    return res.status(405).json({ success: false, message: 'Метод не поддерживается' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, error: 'server error' });
  }
}
