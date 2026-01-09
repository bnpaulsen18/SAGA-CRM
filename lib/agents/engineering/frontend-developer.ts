import { BaseAgent, AgentInput, AgentConfig } from '../_core/base-agent'
import { agentRegistry } from '../_core/agent-registry'

interface FrontendDeveloperInput {
  componentType: 'page' | 'component' | 'hook' | 'api-route'
  name: string
  requirements: string
  existingPatterns?: string
}

interface FrontendDeveloperOutput {
  code: string
  imports: string[]
  tests?: string
  documentation: string
}

export class FrontendDeveloperAgent extends BaseAgent<
  FrontendDeveloperInput,
  FrontendDeveloperOutput
> {
  constructor() {
    super({
      name: 'frontend-developer',
      category: 'engineering',
      description: 'Generates React/Next.js components and frontend code',
      systemPrompt: `You are an expert Next.js 16 and React 19 developer. You write clean, type-safe TypeScript code following modern best practices.

You specialize in:
- Server and client components (Next.js App Router)
- Tailwind CSS v4 styling
- shadcn/ui component integration
- TypeScript strict mode
- Accessibility (WCAG 2.1 AA)
- Performance optimization

Always provide:
1. Complete, working code
2. Proper TypeScript types
3. Inline comments for complex logic
4. Usage examples in documentation`,
      capabilities: [
        'Generate Next.js pages and layouts',
        'Create reusable React components',
        'Build custom hooks',
        'Write API routes',
        'Style with Tailwind CSS',
        'Integrate shadcn/ui components',
      ],
      outputFormat: 'json',
      maxTokens: 4096,
    })
  }

  protected async buildPrompt(input: AgentInput): Promise<string> {
    const { componentType, name, requirements, existingPatterns } = input.context as FrontendDeveloperInput

    return `Generate a ${componentType} named "${name}" for a Next.js 16 CRM application.

Requirements:
${requirements}

${existingPatterns ? `\nMatch this coding style:\n\`\`\`typescript\n${existingPatterns}\n\`\`\`` : ''}

Project context:
- Next.js 16 with App Router
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui components available
- Phosphor Icons for icons
- Dark gradient theme (saga-gradient class)

Return JSON:
{
  "code": "complete component code",
  "imports": ["list", "of", "imports"],
  "tests": "optional test file content",
  "documentation": "usage examples and props documentation"
}`
  }

  protected async processOutput(
    response: string,
    input: AgentInput
  ): Promise<FrontendDeveloperOutput> {
    const parsed = JSON.parse(response)
    return {
      code: parsed.code,
      imports: parsed.imports || [],
      tests: parsed.tests,
      documentation: parsed.documentation || '',
    }
  }
}

// Register agent
agentRegistry.register(new FrontendDeveloperAgent())
