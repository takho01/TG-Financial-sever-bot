import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });

export default async function handler(req, res) {
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
  
  // Ссылка на ваш задеплоенный проект на Vercel
  const webAppUrl = "https://tg-financial-sever-bot.vercel.app";

  if (text === '/start' || text === '/app') {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: "Привет! Это твой личный финансовый помощник. Нажми на кнопку ниже, чтобы открыть кошелек и управлять расходами:",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📊 Открыть кошелек",
                web_app: { url: webAppUrl }
              }
            ]
          ]
        }
      }),
    });
  }

  return res.status(200).json({ ok: true });
}
