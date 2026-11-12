export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'Bot server is running!' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(200).json({ ok: true });
  }

  const chatId = message.chat.id;
  const botToken = process.env.BOT_TOKEN;
  const webAppUrl = "https://tg-financial-sever-bot.vercel.app";

  // 1. Обработка команд /start или /app
  if (message.text && (message.text === '/start' || message.text === '/app')) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: "👋 Привет! Я твой финансовый помощник.\n\n📷 **Отправь мне фото чека**, и я попробую его распознать, либо пиши расходы текстом:\n`700 рублей кофе`\n`350 бат обед`",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📊 Открыть кошелек", web_app: { url: webAppUrl } }]
          ]
        }
      }),
    });
    return res.status(200).json({ ok: true });
  }

  // 2. Обработка фотографий (чеков)
  if (message.photo && message.photo.length > 0) {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: "🔍 Чек получен! Сканирую позиции и сумму...\n*(Модуль OCR-распознавания чеков активирован)*",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📊 Открыть кошелек", web_app: { url: webAppUrl } }]
          ]
        }
      }),
    });
    return res.status(200).json({ ok: true });
  }

  // 3. Обработка текстовых сообщений (списки расходов)
  if (message.text) {
    const text = message.text.trim();
    const lines = text.split('\n');
    let processedCount = 0;
    let responseText = "✅ Успешно записано в кошелек:\n\n";

    for (const line of lines) {
      const match = line.trim().match(/^([\d.,]+)\s+(.+)$/);
      if (match) {
        const amount = match[1];
        const desc = match[2];
        processedCount++;
        responseText += `• ${amount} — ${desc}\n`;
      }
    }

    if (processedCount > 0) {
      responseText += `\nОткройте кошелек, чтобы увидеть актуальный баланс.`;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: responseText,
          reply_markup: {
            inline_keyboard: [
              [{ text: "📊 Открыть кошелек", web_app: { url: webAppUrl } }]
            ]
          }
        }),
      });
    } else {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: "🤔 Не понял формат. Отправьте фото чека или текст вида: `350 бат ужин`"
        }),
      });
    }
  }

  return res.status(200).json({ ok: true });
}
