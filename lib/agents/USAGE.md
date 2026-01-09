# Agent System - Usage Examples

This guide shows you how to use the SAGA CRM AI Agent System in different contexts.

## Table of Contents

1. [CLI Usage](#cli-usage)
2. [Programmatic Usage](#programmatic-usage)
3. [API Usage](#api-usage)
4. [Batch Execution](#batch-execution)
5. [CI/CD Integration](#cicd-integration)
6. [Creating Custom Agents](#creating-custom-agents)

---

## CLI Usage

### List All Agents

```bash
# List all available agents
npm run agent:list

# List agents in a specific category
npm run agent -- list --category engineering

# Output as JSON
npm run agent -- list --json
```

### Get Agent Information

```bash
npm run agent -- info frontend-developer
```

### Run an Agent

```bash
# Basic usage
npm run agent:run frontend-developer "Create a login form component"

# With context
npm run agent:run frontend-developer "Create a button" \
  --context '{"componentType":"component","name":"Button","requirements":"Primary and secondary variants"}'

# Read task from file
npm run agent:run backend-architect --file requirements.txt

# Save output to file
npm run agent:run frontend-developer "Create navbar" --output navbar.tsx

# JSON output
npm run agent:run frontend-developer "Create card" --json
```

### Search Agents

```bash
npm run agent -- search "api"
npm run agent -- search "design"
```

### Batch Execution

```bash
# Run multiple agents from a batch file
npm run agent:batch scripts/agents/examples/batch-example.json

# Specify output directory
npm run agent -- batch tasks.json --output-dir ./results

# Stop on first error
npm run agent -- batch tasks.json --stop-on-error
```

---

## Programmatic Usage

### Basic Agent Execution

```typescript
import { agentRegistry } from '@/lib/agents/_core/agent-registry'

// Get an agent
const agent = agentRegistry.get('frontend-developer')

// Execute
const result = await agent.execute({
  task: 'Create a search input component with autocomplete',
  context: {
    componentType: 'component',
    name: 'SearchInput',
    requirements: 'Debounced input, dropdown suggestions, keyboard navigation'
  }
})

if (result.success) {
  console.log('Generated code:', result.data.code)
  console.log('Imports needed:', result.data.imports)
  console.log('Execution time:', result.metadata.executionTime + 'ms')
} else {
  console.error('Error:', result.error)
}
```

### Using the Run Agent Helper

```typescript
import { runAgent } from '@/scripts/agents/run-agent'

const result = await runAgent({
  agentName: 'backend-architect',
  input: {
    task: 'Optimize this database query',
    context: {
      taskType: 'optimization',
      description: 'Users query is slow with 10,000+ records',
      currentCode: `
        const users = await prisma.user.findMany({
          include: { posts: true, comments: true }
        })
      `
    }
  },
  verbose: true
})

console.log('Solution:', result.data?.solution)
console.log('Recommendations:', result.data?.recommendations)
```

### Chaining Multiple Agents

```typescript
import { runAgentChain } from '@/scripts/agents/run-agent'

const results = await runAgentChain([
  {
    agentName: 'frontend-developer',
    input: {
      task: 'Create a user profile component',
      context: { componentType: 'component', name: 'UserProfile' }
    }
  },
  {
    agentName: 'backend-architect',
    input: {
      task: 'Design API endpoint for user profile',
      context: { taskType: 'api-endpoint', description: 'CRUD for user profiles' }
    }
  }
], { stopOnError: true, verbose: true })

results.forEach((result, index) => {
  console.log(`Agent ${index + 1}:`, result.success ? '✅' : '❌')
})
```

### Batch Execution in Code

```typescript
import { executeBatch } from '@/scripts/agents/batch-agents'

const { successCount, failureCount, results } = await executeBatch(
  'tasks.json',
  {
    outputDir: './output',
    stopOnError: false,
    verbose: true
  }
)

console.log(`Completed: ${successCount}/${successCount + failureCount}`)
```

---

## API Usage

### List Agents (GET /api/agents/list)

```typescript
// In a Next.js component
const fetchAgents = async () => {
  const response = await fetch('/api/agents/list')
  const { agents, count } = await response.json()

  console.log(`Found ${count} agents:`, agents)
}

// Filter by category
const fetchEngineeringAgents = async () => {
  const response = await fetch('/api/agents/list?category=engineering')
  const { agents } = await response.json()
  return agents
}

// Search agents
const searchAgents = async (query: string) => {
  const response = await fetch(`/api/agents/list?search=${encodeURIComponent(query)}`)
  const { agents } = await response.json()
  return agents
}
```

### Get Agent Info (GET /api/agents/[name])

```typescript
const getAgentInfo = async (agentName: string) => {
  const response = await fetch(`/api/agents/${agentName}`)

  if (!response.ok) {
    throw new Error(`Agent "${agentName}" not found`)
  }

  const agentInfo = await response.json()
  return agentInfo
}
```

### Execute Agent (POST /api/agents/execute)

```typescript
const executeAgent = async (
  agentName: string,
  task: string,
  context?: Record<string, any>
) => {
  const response = await fetch('/api/agents/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentName, task, context })
  })

  const result = await response.json()

  if (!result.success) {
    throw new Error(result.error)
  }

  return result.data
}

// Usage in a component
const handleGenerate = async () => {
  try {
    setLoading(true)

    const data = await executeAgent(
      'frontend-developer',
      'Create a modal dialog component',
      {
        componentType: 'component',
        name: 'Modal',
        requirements: 'Responsive, accessible, with backdrop and close button'
      }
    )

    setGeneratedCode(data.code)
    toast.success('Component generated successfully!')
  } catch (error) {
    toast.error(error.message)
  } finally {
    setLoading(false)
  }
}
```

### React Hook for Agent Execution

```typescript
import { useState } from 'react'

export function useAgent(agentName: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const execute = async (task: string, context?: Record<string, any>) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/agents/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentName, task, context })
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error)
      }

      setData(result.data)
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { execute, loading, error, data }
}

// Usage in component
function MyComponent() {
  const agent = useAgent('frontend-developer')

  const handleClick = async () => {
    const result = await agent.execute('Create a header component', {
      componentType: 'component',
      name: 'Header'
    })
    console.log('Generated:', result.code)
  }

  return (
    <button onClick={handleClick} disabled={agent.loading}>
      {agent.loading ? 'Generating...' : 'Generate Component'}
    </button>
  )
}
```

---

## Batch Execution

### Batch File Format

Create a JSON file with an array of tasks:

```json
[
  {
    "agentName": "frontend-developer",
    "task": "Create button component",
    "context": {
      "componentType": "component",
      "name": "Button"
    }
  },
  {
    "agentName": "backend-architect",
    "task": "Design user API",
    "context": {
      "taskType": "api-endpoint",
      "description": "CRUD for users"
    }
  }
]
```

### Execute Batch

```bash
# CLI
npm run agent:batch tasks.json

# Programmatic
import { executeBatch } from '@/scripts/agents/batch-agents'

const result = await executeBatch('tasks.json', {
  outputDir: './output',
  stopOnError: false,
  verbose: true
})
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Agent Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install

      - name: Review API changes
        run: |
          npm run agent:run backend-architect \
            "Review the API changes in this PR for security issues" \
            --file PR_DIFF.txt \
            --output review.json
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Post review comment
        uses: actions/github-script@v6
        with:
          script: |
            const review = require('./review.json')
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## AI Code Review\n\n${review.data.solution}`
            })
```

### Pre-commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run agent to check for common issues
npm run agent:run backend-architect \
  "Review staged changes for security vulnerabilities" \
  --file <(git diff --staged) \
  --json > /tmp/review.json

# Check if any issues found
if grep -q '"securityConsiderations"' /tmp/review.json; then
  echo "⚠️  Security concerns found. Review before committing:"
  cat /tmp/review.json
  exit 1
fi
```

---

## Creating Custom Agents

### 1. Create Agent File

Create `lib/agents/your-category/your-agent.ts`:

```typescript
import { BaseAgent, AgentInput } from '../_core/base-agent'
import { agentRegistry } from '../_core/agent-registry'

interface YourAgentInput {
  // Define your input structure
  requirement: string
  options?: Record<string, any>
}

interface YourAgentOutput {
  // Define your output structure
  result: string
  recommendations: string[]
}

export class YourCustomAgent extends BaseAgent<YourAgentInput, YourAgentOutput> {
  constructor() {
    super({
      name: 'your-custom-agent',
      category: 'engineering', // or product, marketing, etc.
      description: 'What your agent does',
      systemPrompt: `You are an expert at...

Provide detailed, actionable output.`,
      capabilities: [
        'Capability 1',
        'Capability 2',
        'Capability 3'
      ],
      outputFormat: 'json', // or 'text', 'markdown', 'code'
      maxTokens: 2048,
    })
  }

  protected async buildPrompt(input: AgentInput): Promise<string> {
    const { requirement, options } = input.context as YourAgentInput

    return `Task: ${requirement}

Options: ${JSON.stringify(options)}

Return JSON:
{
  "result": "your result here",
  "recommendations": ["recommendation 1", "recommendation 2"]
}`
  }

  protected async processOutput(
    response: string,
    input: AgentInput
  ): Promise<YourAgentOutput> {
    const parsed = JSON.parse(response)
    return {
      result: parsed.result,
      recommendations: parsed.recommendations || [],
    }
  }
}

// Register agent
agentRegistry.register(new YourCustomAgent())
```

### 2. Import in CLI/API

Add to `scripts/agents/cli.ts` and `app/api/agents/*/route.ts`:

```typescript
import '@/lib/agents/your-category/your-agent'
```

### 3. Use Your Agent

```typescript
const agent = agentRegistry.get('your-custom-agent')
const result = await agent.execute({
  task: 'Do something',
  context: {
    requirement: 'Build X',
    options: { mode: 'fast' }
  }
})
```

---

## Best Practices

1. **Always validate input** before execution
2. **Handle errors gracefully** with try-catch
3. **Use appropriate token limits** to control costs
4. **Chain agents** for complex multi-step tasks
5. **Log execution metadata** for debugging
6. **Test agents** with various inputs before production use
7. **Monitor API usage** to stay within quotas

---

## Troubleshooting

### Agent Not Found

```typescript
const agent = agentRegistry.get('my-agent')
if (!agent) {
  console.error('Agent not registered. Did you import it?')
}
```

### API Permission Error

Ensure user has `PLATFORM_ADMIN` or `ORG_ADMIN` role to execute agents via API.

### ANTHROPIC_API_KEY Not Set

Add to `.env`:
```bash
ANTHROPIC_API_KEY=your_key_here
```

### Validation Errors

Check that your context matches the agent's expected input structure.

---

## Examples

See `scripts/agents/examples/` for complete working examples:
- `batch-example.json` - Batch execution example
- `component-generation.ts` - Component generation example
- `api-design.ts` - API design example

---

For more information, see [lib/agents/README.md](./README.md)
