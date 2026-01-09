import { BaseAgent, AgentInput, AgentConfig } from '../_core/base-agent'
import { agentRegistry } from '../_core/agent-registry'

interface BackendArchitectInput {
  taskType: 'api-endpoint' | 'database-schema' | 'optimization' | 'security-review'
  description: string
  currentCode?: string
  requirements?: string[]
}

interface BackendArchitectOutput {
  solution: string
  code?: string
  migrations?: string
  recommendations: string[]
  securityConsiderations: string[]
}

export class BackendArchitectAgent extends BaseAgent<
  BackendArchitectInput,
  BackendArchitectOutput
> {
  constructor() {
    super({
      name: 'backend-architect',
      category: 'engineering',
      description: 'Design and optimize APIs, database schemas, and server logic',
      systemPrompt: `You are a backend architecture expert specializing in:
- Prisma ORM and PostgreSQL
- Next.js API routes
- Row-level security (RLS)
- RESTful API design
- Database optimization and indexing
- Authentication with NextAuth.js
- Data validation with Zod

Consider:
- Multi-tenant architecture (organizationId filtering)
- Performance (N+1 query prevention)
- Security (CSRF, rate limiting, input validation)
- Type safety (Prisma types, Zod schemas)

Always provide:
1. Complete implementation details
2. Security considerations
3. Performance optimization tips
4. Migration scripts when needed`,
      capabilities: [
        'Design RESTful API endpoints',
        'Optimize database queries',
        'Create Prisma schema changes',
        'Implement row-level security',
        'Review security vulnerabilities',
        'Generate migration scripts',
      ],
      outputFormat: 'json',
      maxTokens: 4096,
    })
  }

  protected async buildPrompt(input: AgentInput): Promise<string> {
    const { taskType, description, currentCode, requirements } = input.context as BackendArchitectInput

    let prompt = `Task: ${taskType}

Description:
${description}

`

    if (currentCode) {
      prompt += `\nCurrent Code:\n\`\`\`typescript\n${currentCode}\n\`\`\`\n\n`
    }

    if (requirements && requirements.length > 0) {
      prompt += `Requirements:\n${requirements.map(r => `- ${r}`).join('\n')}\n\n`
    }

    prompt += `Project Context:
- PostgreSQL database with Prisma ORM
- Multi-tenant with organizationId filtering
- NextAuth.js for authentication
- Zod for validation
- Row-level security (RLS) using prisma-rls

Return JSON:
{
  "solution": "detailed explanation of the solution",
  "code": "complete implementation code if applicable",
  "migrations": "Prisma migration SQL if needed",
  "recommendations": ["list", "of", "best", "practices"],
  "securityConsiderations": ["security", "points", "to", "consider"]
}`

    return prompt
  }

  protected async processOutput(
    response: string,
    input: AgentInput
  ): Promise<BackendArchitectOutput> {
    const parsed = JSON.parse(response)
    return {
      solution: parsed.solution,
      code: parsed.code,
      migrations: parsed.migrations,
      recommendations: parsed.recommendations || [],
      securityConsiderations: parsed.securityConsiderations || [],
    }
  }
}

// Register agent
agentRegistry.register(new BackendArchitectAgent())
