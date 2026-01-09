import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/permissions'
import { agentRegistry } from '@/lib/agents/_core/agent-registry'

// Import all agents to register them
import '@/lib/agents/engineering/frontend-developer'
import '@/lib/agents/engineering/backend-architect'

export const runtime = 'nodejs'

/**
 * GET /api/agents/list
 * List all available AI agents
 *
 * Query params:
 * - category?: string - Filter by category
 * - search?: string - Search agents by name/description/capabilities
 *
 * Response:
 * {
 *   agents: Array<{
 *     name: string
 *     category: string
 *     description: string
 *     capabilities: string[]
 *     outputFormat: string
 *   }>
 *   count: number
 * }
 */
export async function GET(req: Request) {
  try {
    // Require authentication
    const session = await requireAuth()

    // Parse query params
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let agents

    if (search) {
      // Search agents
      agents = agentRegistry.search(search).map(agent => agent.getInfo())
    } else if (category) {
      // Filter by category
      agents = agentRegistry.getByCategory(category as any).map(agent => agent.getInfo())
    } else {
      // List all agents
      agents = agentRegistry.listAll()
    }

    return NextResponse.json({
      agents,
      count: agents.length,
    })
  } catch (error) {
    console.error('GET /api/agents/list error:', error)
    return NextResponse.json(
      { error: 'Failed to list agents' },
      { status: 500 }
    )
  }
}
