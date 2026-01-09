# Backend Architect Agent

**Category:** Engineering
**Output Format:** JSON
**Max Tokens:** 4096

## Description

Design and optimize APIs, database schemas, and server logic. Specializes in Prisma ORM, PostgreSQL, Next.js API routes, row-level security (RLS), and database optimization.

## Capabilities

- Design RESTful API endpoints
- Optimize database queries
- Create Prisma schema changes
- Implement row-level security (RLS)
- Review security vulnerabilities
- Generate migration scripts
- Prevent N+1 query problems
- Design multi-tenant architecture

## System Prompt

```
You are a backend architecture expert specializing in:
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
4. Migration scripts when needed
```

## Input Schema

```typescript
interface BackendArchitectInput {
  taskType: 'api-endpoint' | 'database-schema' | 'optimization' | 'security-review'
  description: string
  currentCode?: string
  requirements?: string[]
}
```

## Output Schema

```typescript
interface BackendArchitectOutput {
  solution: string
  code?: string
  migrations?: string
  recommendations: string[]
  securityConsiderations: string[]
}
```

## Example Usage

### CLI

```bash
npm run agent:run backend-architect "Design a user profile update endpoint" \
  --context '{"taskType":"api-endpoint","description":"Users update name, email, phone with validation","requirements":["Zod validation","Email uniqueness","Audit logging","Rate limiting"]}'
```

### Programmatic

```typescript
import { agentRegistry } from '@/lib/agents/_core/agent-registry'

const agent = agentRegistry.get('backend-architect')
const result = await agent.execute({
  task: 'Optimize slow query',
  context: {
    taskType: 'optimization',
    description: 'Contact list query slow with 10,000+ records',
    currentCode: `
      const contacts = await prisma.contact.findMany({
        include: { donations: true }
      })
    `
  }
})

console.log('Solution:', result.data.solution)
console.log('Recommendations:', result.data.recommendations)
```

### API

```typescript
const response = await fetch('/api/agents/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentName: 'backend-architect',
    task: 'Review API security',
    context: {
      taskType: 'security-review',
      description: 'Check donation endpoints for vulnerabilities',
      currentCode: donationApiCode
    }
  })
})
```

## Best Practices

1. **Multi-Tenant Security**: Always filter by organizationId
2. **Query Optimization**: Use includes and selects strategically
3. **N+1 Prevention**: Fetch related data in single query
4. **Input Validation**: Use Zod schemas for all inputs
5. **Audit Logging**: Log all destructive operations

## Common Tasks

- Design CRUD API endpoints
- Optimize database queries (N+1 fixes)
- Create Prisma migrations
- Implement authentication flows
- Add row-level security
- Review code for vulnerabilities
- Design database indexes
- Implement rate limiting

## Integration Notes

- Automatically registers with agent registry
- Located at: `lib/agents/engineering/backend-architect.ts`
- Integrates with: Prisma, Zod, NextAuth.js
- Follows SAGA multi-tenant patterns
