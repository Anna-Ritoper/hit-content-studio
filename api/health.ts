import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({ status: hasKey ? 'ok' : 'missing_key' });
}
