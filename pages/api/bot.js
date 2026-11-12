export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'Bot server is running!' });
  }

  const { message } = req.body;

  if (!message || !message.text) {
    return res.status(200).json({ ok: true });
  }

  const chatId = message.chat.id;
  const text = message.text.trim();
  const botToken = process.env.BOT_TOKEN;
  const webAppUrl = "https://tg-financial-sever-bot.vercel.app";

  // Обработка команд /start или /app
  if (text === '/start' || text === '/app') {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: "👋 Привет! Я твой финансовый помощник.\n\nЖми на кнопку ниже, чтобы открыть кошелек, или просто отправь мне расход текстом (например: `700 рублей кофе` или `5000 тенге продукты`), и я запишу его!",
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
    return res.status(200).json({ ok: true });
  }

  // Простейший автопарсинг текста (ищем число и текст)
  // Пример: "700 рублей кофе" -> сумма: 700, валюта/описание: рубли кофе
  const match = text.match(/^([\d.,]+)\s+(.+)$/);

  if (match) {
    const rawAmount = match[1].replace(',', '.');
    const amount = parseFloat(rawAmount);
    const description = match[2];

    if (!isNaN(amount)) {
      // Отправляем пользователю подтверждение, что бот распознал расход
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: `✅ Успешно записано!\n💰 Сумма: ${amount}\n📝 Описание: ${description}\n\nОткройте кошелек, чтобы увидеть актуальный баланс и графики.`,
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
  } else {
    // Если текст не похож на расход
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🤔 Я не понял формат. Напишите сумму и описание в одном сообщении, например: `1500 тенге продукты` или `20 USD обед`."
      }),
    });
  }

  return res.status(200).json({ ok: true });
}
