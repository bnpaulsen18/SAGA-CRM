/**
 * Programmatic agent execution helper
 * Use this in other scripts to run agents without CLI
 */

import { agentRegistry } from '@/lib/agents/_core/agent-registry'
import { AgentInput, AgentOutput } from '@/lib/agents/_core/base-agent'

// Import all agents to register them
import '@/lib/agents/engineering/frontend-developer'
import '@/lib/agents/engineering/backend-architect'

export interface RunAgentOptions {
  agentName: string
  input: AgentInput
  verbose?: boolean
}

export async function runAgent<T = any>(
  options: RunAgentOptions
): Promise<AgentOutput<T>> {
  const { agentName, input, verbose = false } = options

  // Get agent
  const agent = agentRegistry.get(agentName)
  if (!agent) {
    throw new Error(`Agent "${agentName}" not found`)
  }

  // Log if verbose
  if (verbose) {
    console.log(`Executing agent: ${agentName}`)
    console.log(`Task: ${input.task}`)
  }

  // Execute
  const result = await agent.execute(input)

  // Log result if verbose
  if (verbose) {
    if (result.success) {
      console.log(`✅ Success (${result.metadata.executionTime}ms)`)
    } else {
      console.log(`❌ Failed: ${result.error}`)
    }
  }

  return result
}

export async function runAgentChain<T = any>(
  agents: RunAgentOptions[],
  options?: { stopOnError?: boolean; verbose?: boolean }
): Promise<AgentOutput<T>[]> {
  const results: AgentOutput<T>[] = []
  const { stopOnError = false, verbose = false } = options || {}

  for (const agentOptions of agents) {
    const result = await runAgent<T>({ ...agentOptions, verbose })
    results.push(result)

    if (!result.success && stopOnError) {
      break
    }
  }

  return results
}

// Example usage in other scripts:
// import { runAgent } from './scripts/agents/run-agent'
//
// const result = await runAgent({
//   agentName: 'frontend-developer',
//   input: {
//     task: 'Create a button component',
//     context: { componentType: 'component', name: 'Button' }
//   },
//   verbose: true
// })
