import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 30;
const rateTimestamps: number[] = [];

function checkRateLimit(): boolean {
  const now = Date.now();
  while (rateTimestamps.length > 0 && rateTimestamps[0] < now - RATE_WINDOW_MS) {
    rateTimestamps.shift();
  }
  if (rateTimestamps.length >= RATE_MAX) return false;
  rateTimestamps.push(now);
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!checkRateLimit()) {
    return res.status(429).json({ error: 'Limite de generations atteinte. Reessayez dans quelques minutes.' });
  }

  try {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set' });

    const client = new Anthropic({ apiKey: key });
    const { system, userMessage, stream, maxTokens } = req.body;
    const safeMaxTokens = Math.min(Math.max(parseInt(maxTokens) || 1000, 100), 2000);

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      try {
        const response = await client.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: safeMaxTokens,
          system,
          messages: [{ role: 'user', content: userMessage }],
          stream: true,
        });

        for await (const chunk of response) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
          }
        }
        res.write('data: [DONE]\n\n');
        res.end();
      } catch (streamErr: any) {
        // If streaming fails mid-way, try to send an error event
        try {
          res.write(`data: ${JSON.stringify({ error: streamErr.message })}\n\n`);
          res.end();
        } catch {
          res.end();
        }
      }
    } else {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system,
        messages: [{ role: 'user', content: userMessage }],
      });
      res.json(response);
    }
  } catch (err: any) {
    if (!res.headersSent) {
      res.status(500).json({ error: err.message });
    }
  }
}
