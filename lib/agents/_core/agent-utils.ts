/**
 * Shared utilities for agent operations
 */

import { AgentInput, AgentOutput } from './base-agent'

/**
 * Format agent execution time
 */
export function formatExecutionTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
  return `${(ms / 60000).toFixed(2)}m`
}

/**
 * Truncate text to max length with ellipsis
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Extract code blocks from markdown
 */
export function extractCodeBlocks(markdown: string): { language: string; code: string }[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const blocks: { language: string; code: string }[] = []

  let match
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    blocks.push({
      language: match[1] || 'text',
      code: match[2].trim()
    })
  }

  return blocks
}

/**
 * Sanitize user input for safe processing
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets to prevent injection
    .substring(0, 10000) // Limit length
}

/**
 * Chain multiple agent executions
 */
export async function chainAgents<T = any>(
  agents: Array<{ agent: any; input: AgentInput }>,
  options?: { stopOnError?: boolean }
): Promise<AgentOutput<T>[]> {
  const results: AgentOutput<T>[] = []

  for (const { agent, input } of agents) {
    const result = await agent.execute(input)
    results.push(result)

    if (!result.success && options?.stopOnError) {
      break
    }
  }

  return results
}

/**
 * Merge agent outputs
 */
export function mergeOutputs<T = any>(outputs: AgentOutput<T>[]): T[] {
  return outputs
    .filter(output => output.success && output.data)
    .map(output => output.data as T)
}

/**
 * Calculate success rate from agent outputs
 */
export function calculateSuccessRate(outputs: AgentOutput[]): number {
  if (outputs.length === 0) return 0
  const successCount = outputs.filter(o => o.success).length
  return (successCount / outputs.length) * 100
}

/**
 * Format agent output for display
 */
export function formatAgentOutput(output: AgentOutput): string {
  const { success, data, error, metadata } = output

  const lines = [
    `Agent: ${metadata.agentName}`,
    `Status: ${success ? '✅ Success' : '❌ Failed'}`,
    `Time: ${formatExecutionTime(metadata.executionTime)}`,
    `Timestamp: ${metadata.timestamp}`,
  ]

  if (error) {
    lines.push(`Error: ${error}`)
  }

  if (data) {
    lines.push('\nOutput:')
    lines.push(typeof data === 'string' ? data : JSON.stringify(data, null, 2))
  }

  return lines.join('\n')
}
