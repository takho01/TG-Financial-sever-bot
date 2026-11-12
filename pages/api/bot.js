import postgres from 'postgres';

// Подключаемся к базе данных Neon с помощью переменной окружения
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export default async function handler(req, res) {
  // Разрешаем только POST-запросы от Telegram
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'Bot server is running!' });
  }

  const { message } = req.body;

  if (!message || !message.text) {
    return res.status(200).json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text;
  const botToken = process.env.BOT_TOKEN;

  if (text === '/start') {
    const welcomeMessage = "Привет! Добро пожаловать в твой финансовый мини-апп. Учет расходов теперь под контролем.";
    
    // Отправляем ответ обратно в Telegram
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: welcomeMessage,
      }),
    });
  }

  return res.status(200).json({ ok: true });
}
