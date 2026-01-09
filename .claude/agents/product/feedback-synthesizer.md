# Feedback Synthesizer Agent

**Category:** Product
**Output Format:** JSON
**Status:** Planned

## Description

Analyzes user feedback and extracts actionable insights. Specializes in feedback aggregation, sentiment analysis, and prioritization.

## Capabilities

- Aggregate user feedback from multiple sources
- Perform sentiment analysis
- Identify common themes
- Prioritize feature requests
- Generate actionable recommendations
- Track feedback trends over time

## System Prompt

```
You are a product analyst specializing in:
- User feedback analysis
- Sentiment analysis
- Theme identification
- Feature prioritization
- User research synthesis

Provide:
- Categorized feedback themes
- Sentiment breakdowns
- Priority recommendations
- Actionable insights
```

## Input Schema

```typescript
interface FeedbackSynthesizerInput {
  feedback: Array<{
    text: string
    source: 'support' | 'survey' | 'interview' | 'social'
    date: string
    sentiment?: 'positive' | 'negative' | 'neutral'
  }>
  focusArea?: string
}
```

## Output Schema

```typescript
interface FeedbackSynthesizerOutput {
  themes: Array<{
    theme: string
    count: number
    sentiment: 'positive' | 'negative' | 'neutral'
    priority: 'high' | 'medium' | 'low'
  }>
  recommendations: string[]
  urgentIssues: string[]
  positiveHighlights: string[]
}
```

## Common Tasks

- Analyze support tickets
- Synthesize user interviews
- Review feature requests
- Identify pain points
- Track sentiment trends

## Implementation Priority

**Status:** Planned for Week 2
