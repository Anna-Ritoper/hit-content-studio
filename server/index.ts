import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const app = express();
app.use(express.json({ limit: '10mb' }));

function getClient() {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY is not set');
  return new Anthropic({ apiKey: key });
}

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  try {
    const client = getClient();
    const { system, userMessage, stream } = req.body;

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
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
    } else {
      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system,
        messages: [{ role: 'user', content: userMessage }],
      });
      res.json(response);
    }
  } catch (err: any) {
    console.error('POST /api/generate error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/tone
app.post('/api/tone', async (req, res) => {
  try {
    const client = getClient();
    const { system, content } = req.body;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system,
      messages: [{ role: 'user', content }],
    });
    res.json(response);
  } catch (err: any) {
    console.error('POST /api/tone error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/visual
app.post('/api/visual', async (req, res) => {
  try {
    const client = getClient();
    const { prompt } = req.body;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });
    res.json(response);
  } catch (err: any) {
    console.error('POST /api/visual error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  res.json({ status: hasKey ? 'ok' : 'missing_key' });
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
