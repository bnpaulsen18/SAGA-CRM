import { generateText, generateJSON } from '@/lib/ai/client'
import { SYSTEM_PROMPTS } from '@/lib/ai/prompts'

export interface AgentConfig {
  name: string
  category: AgentCategory
  description: string
  systemPrompt: string
  capabilities: string[]
  outputFormat: 'text' | 'json' | 'markdown' | 'code'
  maxTokens?: number
}

export type AgentCategory =
  | 'engineering'
  | 'product'
  | 'marketing'
  | 'design'
  | 'project-management'
  | 'studio-operations'
  | 'testing'

export interface AgentInput {
  task: string
  context?: Record<string, any>
  previousOutput?: string
}

export interface AgentOutput<T = any> {
  success: boolean
  data?: T
  error?: string
  metadata: {
    agentName: string
    timestamp: string
    tokensUsed?: number
    executionTime: number
  }
}

export abstract class BaseAgent<TInput = any, TOutput = any> {
  protected config: AgentConfig

  constructor(config: AgentConfig) {
    this.config = config
  }

  /**
   * Execute the agent with given input
   */
  async execute(input: AgentInput): Promise<AgentOutput<TOutput>> {
    const startTime = Date.now()

    try {
      // Validate input
      const validationError = await this.validateInput(input)
      if (validationError) {
        return this.errorOutput(validationError, startTime)
      }

      // Build the full prompt with context
      const prompt = await this.buildPrompt(input)

      // Execute AI generation
      const result = await this.generateResponse(prompt)

      // Process and validate output
      const processedOutput = await this.processOutput(result, input)

      return {
        success: true,
        data: processedOutput,
        metadata: {
          agentName: this.config.name,
          timestamp: new Date().toISOString(),
          executionTime: Date.now() - startTime,
        },
      }
    } catch (error) {
      console.error(`[${this.config.name}] Execution error:`, error)
      return this.errorOutput(
        error instanceof Error ? error.message : 'Unknown error',
        startTime
      )
    }
  }

  /**
   * Build the complete prompt from input and context
   */
  protected abstract buildPrompt(input: AgentInput): Promise<string>

  /**
   * Process the AI response into the desired output format
   */
  protected abstract processOutput(response: string, input: AgentInput): Promise<TOutput>

  /**
   * Validate input before execution (optional override)
   */
  protected async validateInput(input: AgentInput): Promise<string | null> {
    if (!input.task || input.task.trim().length === 0) {
      return 'Task description is required'
    }
    return null
  }

  /**
   * Generate response using AI
   */
  protected async generateResponse(prompt: string): Promise<string> {
    if (this.config.outputFormat === 'json') {
      const json = await generateJSON(prompt, this.config.systemPrompt)
      return JSON.stringify(json)
    }

    return generateText(
      prompt,
      this.config.systemPrompt,
      this.config.maxTokens || 2048
    )
  }

  /**
   * Helper to create error output
   */
  protected errorOutput(error: string, startTime: number): AgentOutput<TOutput> {
    return {
      success: false,
      error,
      metadata: {
        agentName: this.config.name,
        timestamp: new Date().toISOString(),
        executionTime: Date.now() - startTime,
      },
    }
  }

  /**
   * Get agent info
   */
  getInfo() {
    return {
      name: this.config.name,
      category: this.config.category,
      description: this.config.description,
      capabilities: this.config.capabilities,
      outputFormat: this.config.outputFormat,
    }
  }
}
