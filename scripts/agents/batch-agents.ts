/**
 * Batch agent execution from JSON file
 * Example batch file format:
 * [
 *   {
 *     "agentName": "frontend-developer",
 *     "task": "Create a button component",
 *     "context": { "componentType": "component", "name": "Button" }
 *   },
 *   {
 *     "agentName": "backend-architect",
 *     "task": "Design API endpoint",
 *     "context": { "taskType": "api-endpoint", "description": "User CRUD" }
 *   }
 * ]
 */

import * as fs from 'fs/promises'
import * as path from 'path'
import { runAgent } from './run-agent'

interface BatchTask {
  agentName: string
  task: string
  context?: Record<string, any>
}

export async function executeBatch(
  batchFilePath: string,
  options?: {
    outputDir?: string
    stopOnError?: boolean
    verbose?: boolean
  }
) {
  const {
    outputDir = './output',
    stopOnError = false,
    verbose = true,
  } = options || {}

  // Read batch file
  const batchContent = await fs.readFile(batchFilePath, 'utf-8')
  const tasks: BatchTask[] = JSON.parse(batchContent)

  if (!Array.isArray(tasks)) {
    throw new Error('Batch file must contain an array of tasks')
  }

  // Create output directory
  await fs.mkdir(outputDir, { recursive: true })

  console.log(`\n🚀 Executing batch of ${tasks.length} task(s)...\n`)

  const results = []
  let successCount = 0
  let failureCount = 0

  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i]
    const { agentName, task: taskInput, context } = task

    if (verbose) {
      console.log(`\n[${i + 1}/${tasks.length}] 🤖 ${agentName}`)
      console.log(`  Task: ${taskInput.substring(0, 80)}${taskInput.length > 80 ? '...' : ''}`)
    }

    try {
      const result = await runAgent({
        agentName,
        input: { task: taskInput, context },
        verbose: false,
      })

      results.push({ agentName, result })

      if (result.success) {
        successCount++
        if (verbose) {
          console.log(`  ✅ Success (${result.metadata.executionTime}ms)`)
        }

        // Write output
        const outputFile = path.join(outputDir, `${agentName}-${i + 1}.json`)
        await fs.writeFile(outputFile, JSON.stringify(result, null, 2))
      } else {
        failureCount++
        if (verbose) {
          console.log(`  ❌ Failed: ${result.error}`)
        }
        if (stopOnError) break
      }
    } catch (error) {
      failureCount++
      if (verbose) {
        console.error(`  ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
      if (stopOnError) break
    }
  }

  // Summary
  if (verbose) {
    console.log(`\n📊 Batch Execution Summary:`)
    console.log(`  ✅ Success: ${successCount}`)
    console.log(`  ❌ Failed: ${failureCount}`)
    console.log(`  📁 Output: ${outputDir}\n`)
  }

  return {
    results,
    successCount,
    failureCount,
    totalCount: tasks.length,
  }
}

// CLI usage
if (require.main === module) {
  const batchFile = process.argv[2]
  const outputDir = process.argv[3] || './output'

  if (!batchFile) {
    console.error('Usage: npx tsx scripts/agents/batch-agents.ts <batch-file.json> [output-dir]')
    process.exit(1)
  }

  executeBatch(batchFile, { outputDir })
    .then(({ successCount, failureCount }) => {
      if (failureCount > 0) {
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error('❌ Batch execution failed:', error)
      process.exit(1)
    })
}
