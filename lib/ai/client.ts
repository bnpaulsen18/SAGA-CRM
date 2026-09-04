import Anthropic from '@anthropic-ai/sdk';

const initAnthropic = (): Anthropic | null => {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('[Anthropic] ANTHROPIC_API_KEY not configured. AI features disabled.');
    return null;
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
};

export const ai = initAnthropic();
export const isAnthropicAvailable = !!ai;

/**
 * Model used by the donor agents. Configurable via AGENT_MODEL so you can trade
 * quality vs cost without a code change:
 *   - claude-opus-5    (default) — highest quality drafts
 *   - claude-sonnet-5             — strong, cheaper
 *   - claude-haiku-4-5            — cheapest, good for high-volume drafting
 */
export const AGENT_MODEL = process.env.AGENT_MODEL || 'claude-opus-5';

/**
 * Generate text using Claude AI with a given prompt and optional system message
 * @param prompt - The user prompt to send to Claude
 * @param system - Optional system message to set context and behavior
 * @param maxTokens - Maximum tokens to generate (default: 1024)
 * @returns Generated text response from Claude
 */
export async function generateText(
  prompt: string,
  system?: string,
  maxTokens: number = 1024
): Promise<string> {
  if (!ai) {
    throw new Error('AI service not configured');
  }

  try {
    const response = await ai.messages.create({
      model: AGENT_MODEL,
      max_tokens: maxTokens,
      system: system || 'You are a helpful assistant for nonprofit organizations.',
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract text from the first content block
    const firstContent = response.content[0];
    return firstContent.type === 'text' ? firstContent.text : '';
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate AI response');
  }
}

/**
 * Generate structured JSON output from Claude
 * @param prompt - The user prompt requesting JSON output
 * @param system - Optional system message
 * @returns Parsed JSON object
 */
export async function generateJSON<T = any>(
  prompt: string,
  system?: string
): Promise<T> {
  const text = await generateText(
    `${prompt}\n\nIMPORTANT: Return ONLY valid JSON, no additional text.`,
    system,
    2048
  );

  try {
    // Try to extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text.trim();

    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parsing error:', error);
    console.error('Raw response:', text);
    throw new Error('Failed to parse JSON response from AI');
  }
}

/**
 * Stream a completion token-by-token, yielding text deltas as they arrive.
 * This powers the live "watch it run" agent test pane: an SSE route forwards
 * each yielded chunk to the browser so a draft types itself in in real time.
 */
export async function* streamCompletion(
  prompt: string,
  system?: string,
  maxTokens: number = 1024
): AsyncGenerator<string> {
  if (!ai) {
    throw new Error('AI service not configured — set ANTHROPIC_API_KEY');
  }

  const stream = ai.messages.stream({
    model: AGENT_MODEL,
    max_tokens: maxTokens,
    system: system || 'You are a helpful assistant for nonprofit organizations.',
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      yield event.delta.text;
    }
  }
}
