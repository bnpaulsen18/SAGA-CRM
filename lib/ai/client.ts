import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client with API key from environment
export const ai = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
  try {
    const response = await ai.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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
