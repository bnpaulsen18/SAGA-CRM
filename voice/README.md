# SAGA Cofounder — Voice

Talk to your AI cofounder out loud. The browser does speech-to-text and text-to-speech for free (Web Speech API); a tiny local Node server is the brain, calling Claude with your `cofounder/` knowledge base loaded. Your API key stays on the server — never in the browser.

## One-time setup

1. **Add your Anthropic API key.** Put it in `.env.local` at the project root (this file is git-ignored):
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```
   (Get one at https://console.anthropic.com → API keys.)

2. **Install the one dependency:**
   ```
   cd voice
   npm install
   ```

## Run it

```
cd voice
npm start
```
Then open **http://localhost:4040 in Chrome** and click the mic. (Voice input uses Chrome's Web Speech API; other browsers may not support it — you can still type.)

## Using it

- **Click the mic** and talk. It transcribes, sends to your cofounder, shows the reply, and speaks it back.
- **Hands-free** toggle: after each reply it starts listening again, so you can have a back-and-forth.
- **Type** in the box at the bottom if you'd rather not talk.
- **Stop** cancels the current speech (or just start talking — it stops to listen).

## Configuration (optional env vars)

- `PORT` — default `4040`.
- `SAGA_COFOUNDER_MODEL` — default `claude-opus-4-8`. Set to `claude-sonnet-4-6` for faster, cheaper replies (better for snappy back-and-forth).

## Notes

- **The brain** is `../cofounder/*.md`. It's loaded when the server starts — **restart the server after editing those files**.
- **Cost:** every reply is a Claude API call billed to your key (Opus 4.8 pricing by default). Sonnet is cheaper.
- **Privacy:** speech recognition runs through the browser's speech service (Google's, in Chrome). The transcript + your knowledge base are sent to Claude to generate replies.
- This is a local tool, not a deployed service. Don't expose port 4040 to the internet as-is (no auth).
