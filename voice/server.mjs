// SAGA Cofounder — voice server.
// Serves the browser voice UI and proxies chat to Claude so the API key never
// reaches the browser. The "brain" is built from ../cofounder/*.md at startup.
//
// Run:  node voice/server.mjs   (or: cd voice && npm start)
// Then open http://localhost:4040 in Chrome.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..'); // project root (SAGA-CRM)
const PORT = Number(process.env.PORT) || 4040;
// Default to Opus 4.8 (most capable). Set SAGA_COFOUNDER_MODEL=claude-sonnet-4-6
// for faster, cheaper voice replies.
const MODEL = process.env.SAGA_COFOUNDER_MODEL || 'claude-opus-4-8';

// ---- Load ANTHROPIC_API_KEY from .env.local / .env (zero-dependency) --------
function loadApiKey() {
  if (process.env.ANTHROPIC_API_KEY) return;
  for (const name of ['.env.local', '.env']) {
    let text;
    try { text = fs.readFileSync(path.join(ROOT, name), 'utf8'); } catch { continue; }
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*ANTHROPIC_API_KEY\s*=\s*(.*)$/);
      if (m) {
        const v = m[1].trim().replace(/^["']|["']$/g, '');
        if (v) { process.env.ANTHROPIC_API_KEY = v; return; }
      }
    }
  }
}
loadApiKey();
const hasKey = !!process.env.ANTHROPIC_API_KEY;
const client = hasKey ? new Anthropic() : null;

// ---- The cofounder's voice persona -----------------------------------------
const VOICE_PERSONA = `You are the founder's AI cofounder at SAGA, an AI-native donor CRM for nonprofits. The founder is talking to you OUT LOUD, by voice. You are their cofounder for the pre-seed raise: honest, direct, and focused on what actually moves the company forward. Not a cheerleader, not a yes-man.

HOW YOU TALK (this is spoken aloud — obey strictly):
- Keep it short and conversational. Usually 1 to 3 sentences. Lead with the answer.
- No markdown whatsoever: no bullet points, asterisks, headings, numbered lists, code, emojis, or links. They sound terrible read aloud.
- Speak numbers naturally ("about eleven thousand a month", not "$11,840").
- Ask only one question at a time. If a full answer is long, give the headline first and offer to go deeper.
- Respond only with your final spoken answer — no preamble, no meta-commentary about your process.

WHAT YOU MUST NEVER DO:
- Never invent metrics, traction, market sizes, investor names, or quotes. If you don't know, say so or ask.
- The SAGA product demos use FAKE sample data for a fictional customer called "Hope Foundation" (about eleven thousand in monthly recurring revenue, three hundred eighteen sustainers, forty-one percent first-year retention). Those are NOT SAGA's real numbers. Never present them as real, and warn the founder if they're about to.
- Keep it honest that five million dollars is large for a pre-seed.

Use the knowledge base below as your shared memory of the company and the raise. Anything marked "FILL IN" is unknown — don't make it up; ask the founder.`;

let SYSTEM_PROMPT = VOICE_PERSONA;
function buildSystemPrompt() {
  const dir = path.join(ROOT, 'cofounder');
  let brain = '';
  for (const f of ['company.md', 'raise.md', 'investors.md', 'pitch.md', 'tasks.md']) {
    try { brain += `\n\n===== ${f} =====\n` + fs.readFileSync(path.join(dir, f), 'utf8'); } catch { /* optional */ }
  }
  SYSTEM_PROMPT = brain ? `${VOICE_PERSONA}\n\n# SAGA cofounder knowledge base\n${brain}` : VOICE_PERSONA;
}
buildSystemPrompt();

// ---- HTTP -------------------------------------------------------------------
function send(res, status, type, body) {
  res.writeHead(status, { 'Content-Type': type });
  res.end(body);
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    let html;
    try { html = fs.readFileSync(path.join(__dirname, 'index.html')); }
    catch { return send(res, 500, 'text/plain', 'index.html not found'); }
    return send(res, 200, 'text/html; charset=utf-8', html);
  }
  if (req.method === 'POST' && req.url === '/api/chat') {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 1_000_000) req.destroy(); });
    req.on('end', () => handleChat(res, raw));
    return;
  }
  send(res, 404, 'text/plain', 'not found');
});

async function handleChat(res, raw) {
  let messages;
  try { messages = JSON.parse(raw).messages; } catch { return send(res, 400, 'text/plain', 'bad json'); }
  if (!Array.isArray(messages) || messages.length === 0) return send(res, 400, 'text/plain', 'no messages');

  if (!client) {
    return send(res, 200, 'text/plain; charset=utf-8',
      "I can't reach Claude yet — no API key is set. Add ANTHROPIC_API_KEY to your .env.local file at the project root, then restart the voice server.");
  }

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' });
  try {
    const stream = client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      messages,
    });
    stream.on('text', (t) => res.write(t));
    await stream.finalMessage();
    res.end();
  } catch (e) {
    const msg = (e && e.message) ? e.message : 'request failed';
    if (!res.writableEnded) { try { res.write(`\n[cofounder error: ${msg}]`); } catch { /* ignore */ } res.end(); }
  }
}

server.listen(PORT, () => {
  console.log(`\n  SAGA cofounder (voice)  →  http://localhost:${PORT}`);
  console.log(`  model: ${MODEL}`);
  console.log(hasKey
    ? '  API key: loaded'
    : '  API key: MISSING — add ANTHROPIC_API_KEY to .env.local at the project root, then restart');
  console.log('  open the URL above in Chrome, then click the mic.\n');
});
