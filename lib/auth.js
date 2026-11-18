import crypto from 'crypto';

export function getTelegramUserId(req, maxAgeSec = 86400) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('tma ')) return null;
  const initData = header.slice(4);

  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secret = crypto.createHmac('sha256', 'WebAppData')
    .update(process.env.BOT_TOKEN).digest();
  const calc = crypto.createHmac('sha256', secret)
    .update(dataCheckString).digest('hex');

  const a = Buffer.from(calc, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  const authDate = Number(params.get('auth_date'));
  if (!authDate || Date.now() / 1000 - authDate > maxAgeSec) return null;

  try {
    return Number(JSON.parse(params.get('user')).id);
  } catch {
    return null;
  }
}
