import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { agentRegistry } from '@/lib/agents/_core/agent-registry'

// Import all agents to register them
import '@/lib/agents/engineering/frontend-developer'
import '@/lib/agents/engineering/backend-architect'

export const runtime = 'nodejs'

/**
 * POST /api/agents/execute
 * Execute an AI agent with given input
 *
 * Request body:
 * {
 *   agentName: string
 *   task: string
 *   context?: Record<string, any>
 * }
 *
 * Response:
 * {
 *   success: boolean
 *   data?: any
 *   error?: string
 *   metadata: {
 *     agentName: string
 *     timestamp: string
 *     executionTime: number
 *   }
 * }
 */
export async function POST(req: Request) {
  try {
    // Require authentication
    const session = await requireAuth()

    // Only allow admins to execute agents (for now)
    if (session.user.role !== 'PLATFORM_ADMIN' && session.user.role !== 'ORG_ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only administrators can execute agents.' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { agentName, task, context } = body

    // Validate input
    if (!agentName || typeof agentName !== 'string') {
      return NextResponse.json(
        { error: 'Agent name is required and must be a string' },
        { status: 400 }
      )
    }

    if (!task || typeof task !== 'string') {
      return NextResponse.json(
        { error: 'Task is required and must be a string' },
        { status: 400 }
      )
    }

    // Get agent
    const agent = agentRegistry.get(agentName)
    if (!agent) {
      return NextResponse.json(
        { error: `Agent "${agentName}" not found` },
        { status: 404 }
      )
    }

    // Execute agent
    const result = await agent.execute({ task, context })

    // Return result
    return NextResponse.json(result)
  } catch (error) {
    console.error('POST /api/agents/execute error:', error)
    return NextResponse.json(
      { error: 'Failed to execute agent', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
