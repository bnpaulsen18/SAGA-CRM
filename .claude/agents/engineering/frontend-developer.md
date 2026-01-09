# Frontend Developer Agent

**Category:** Engineering
**Output Format:** JSON
**Max Tokens:** 4096

## Description

Generates React/Next.js components and frontend code following modern best practices. Specializes in Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui integration.

## Capabilities

- Generate Next.js pages and layouts
- Create reusable React components
- Build custom hooks
- Write API routes
- Style with Tailwind CSS
- Integrate shadcn/ui components
- Ensure accessibility (WCAG 2.1 AA)
- Optimize performance

## System Prompt

```
You are an expert Next.js 16 and React 19 developer. You write clean, type-safe TypeScript code following modern best practices.

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
4. Usage examples in documentation
```

## Input Schema

```typescript
interface FrontendDeveloperInput {
  componentType: 'page' | 'component' | 'hook' | 'api-route'
  name: string
  requirements: string
  existingPatterns?: string // Code samples to match style
}
```

## Output Schema

```typescript
interface FrontendDeveloperOutput {
  code: string
  imports: string[]
  tests?: string
  documentation: string
}
```

## Example Usage

### CLI

```bash
npm run agent:run frontend-developer "Create a search input component with autocomplete" \
  --context '{"componentType":"component","name":"SearchInput","requirements":"Debounced input, dropdown suggestions, keyboard navigation"}'
```

### Programmatic

```typescript
import { agentRegistry } from '@/lib/agents/_core/agent-registry'

const agent = agentRegistry.get('frontend-developer')
const result = await agent.execute({
  task: 'Create a reusable button component',
  context: {
    componentType: 'component',
    name: 'Button',
    requirements: 'Primary, secondary, and ghost variants. Include loading state. Use Phosphor icons.'
  }
})

console.log(result.data.code)
```

### API

```typescript
const response = await fetch('/api/agents/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    agentName: 'frontend-developer',
    task: 'Create a data table component',
    context: {
      componentType: 'component',
      name: 'DataTable',
      requirements: 'Support sorting, pagination, and row selection'
    }
  })
})
```

## Best Practices

1. **Follow Project Patterns**: Reference existing components for styling consistency
2. **Type Safety**: Always use TypeScript strict mode with proper types
3. **Accessibility**: Include ARIA labels and keyboard navigation
4. **Performance**: Use React.memo, useMemo, useCallback appropriately
5. **Dark Theme**: Match SAGA's dark gradient design system

## Common Tasks

- Create form components with validation
- Build data visualization components
- Generate modal/dialog components
- Create navigation components
- Build card/list components
- Generate search/filter interfaces

## Integration Notes

- Automatically registers with agent registry
- Located at: `lib/agents/engineering/frontend-developer.ts`
- Uses existing AI client: `lib/ai/client.ts`
- Follows SAGA design system conventions
