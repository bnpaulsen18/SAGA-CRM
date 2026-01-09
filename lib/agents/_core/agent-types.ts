/**
 * Centralized type definitions for the SAGA CRM Agent System
 */

export type {
  AgentConfig,
  AgentCategory,
  AgentInput,
  AgentOutput,
} from './base-agent'

export type { BaseAgent } from './base-agent'

/**
 * Agent execution context
 */
export interface AgentContext {
  organizationId?: string
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
}

/**
 * Agent execution history
 */
export interface AgentExecutionHistory {
  id: string
  agentName: string
  input: any
  output: any
  success: boolean
  executionTime: number
  timestamp: string
  context?: AgentContext
}

/**
 * Agent validation result
 */
export interface ValidationResult {
  valid: boolean
  errors?: string[]
  warnings?: string[]
}
