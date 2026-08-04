import { requireAuth } from '@/lib/permissions'
import { getPrismaWithRLS } from '@/lib/prisma-rls'
import AgentDetail from '@/components/agents/AgentDetail'
import { AGENTS } from '@/lib/donors/agent-catalog'
import { buildAgentPreview } from '@/lib/donors/agent-preview'

export const runtime = 'nodejs'
export const metadata = { title: 'morning-brief · SAGA' }

export default async function Page() {
  const session = await requireAuth()
  const prisma = await getPrismaWithRLS()
  const orgId = session.user.organizationId ?? '__no_such_org__'
  const preview = await buildAgentPreview(prisma, orgId, 'morning-brief')
  return <AgentDetail copy={AGENTS['morning-brief']} preview={preview} />
}
