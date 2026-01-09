import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { agentRegistry } from '@/lib/agents/_core/agent-registry'

// Import all agents to register them
import '@/lib/agents/engineering/frontend-developer'
import '@/lib/agents/engineering/backend-architect'

export const runtime = 'nodejs'

/**
 * GET /api/agents/[name]
 * Get detailed information about a specific agent
 *
 * Response:
 * {
 *   name: string
 *   category: string
 *   description: string
 *   capabilities: string[]
 *   outputFormat: string
 * }
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    // Require authentication
    await requireAuth()

    const { name } = await params

    // Get agent
    const agent = agentRegistry.get(name)
    if (!agent) {
      return NextResponse.json(
        { error: `Agent "${name}" not found` },
        { status: 404 }
      )
    }

    // Return agent info
    return NextResponse.json(agent.getInfo())
  } catch (error) {
    console.error(`GET /api/agents/[name] error:`, error)
    return NextResponse.json(
      { error: 'Failed to get agent information' },
      { status: 500 }
    )
  }
}
