#!/usr/bin/env node

import { Command } from 'commander'
import * as fs from 'fs/promises'
import * as path from 'path'
import { agentRegistry } from '@/lib/agents/_core/agent-registry'
import { formatAgentOutput } from '@/lib/agents/_core/agent-utils'

// Import all agents to register them
import '@/lib/agents/engineering/frontend-developer'
import '@/lib/agents/engineering/backend-architect'

const program = new Command()

program
  .name('saga-agent')
  .description('SAGA CRM AI Agent System')
  .version('1.0.0')

// List command
program
  .command('list')
  .description('List all available agents')
  .option('-c, --category <category>', 'Filter by category')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    try {
      let agents = options.category
        ? agentRegistry.getByCategory(options.category).map(a => a.getInfo())
        : agentRegistry.listAll()

      if (options.json) {
        console.log(JSON.stringify(agents, null, 2))
      } else {
        console.log('\n📋 Available Agents:\n')

        // Group by category
        const grouped = agents.reduce((acc, agent) => {
          if (!acc[agent.category]) acc[agent.category] = []
          acc[agent.category].push(agent)
          return acc
        }, {} as Record<string, typeof agents>)

        for (const [category, categoryAgents] of Object.entries(grouped)) {
          console.log(`\n🏷️  ${category.toUpperCase()}:`)
          categoryAgents.forEach(agent => {
            console.log(`  • ${agent.name}`)
            console.log(`    ${agent.description}`)
            console.log(`    Capabilities: ${agent.capabilities.slice(0, 2).join(', ')}${agent.capabilities.length > 2 ? '...' : ''}`)
          })
        }
        console.log(`\n✅ Total: ${agents.length} agents\n`)
      }
    } catch (error) {
      console.error('❌ Error listing agents:', error)
      process.exit(1)
    }
  })

// Info command
program
  .command('info <agent>')
  .description('Get detailed information about an agent')
  .action(async (agentName) => {
    try {
      const agent = agentRegistry.get(agentName)
      if (!agent) {
        console.error(`❌ Agent "${agentName}" not found`)
        console.log('\n💡 Run "saga-agent list" to see available agents')
        process.exit(1)
      }

      const info = agent.getInfo()
      console.log('\n📘 Agent Information:\n')
      console.log(`Name:        ${info.name}`)
      console.log(`Category:    ${info.category}`)
      console.log(`Description: ${info.description}`)
      console.log(`Output:      ${info.outputFormat}`)
      console.log('\n🎯 Capabilities:')
      info.capabilities.forEach(cap => console.log(`  • ${cap}`))
      console.log()
    } catch (error) {
      console.error('❌ Error getting agent info:', error)
      process.exit(1)
    }
  })

// Run command
program
  .command('run <agent> [task]')
  .description('Execute an agent with a task')
  .option('-f, --file <path>', 'Read task from file')
  .option('-c, --context <json>', 'Additional context as JSON')
  .option('-o, --output <path>', 'Write output to file')
  .option('-j, --json', 'Output as JSON')
  .action(async (agentName, task, options) => {
    try {
      // Get agent
      const agent = agentRegistry.get(agentName)
      if (!agent) {
        console.error(`❌ Agent "${agentName}" not found`)
        console.log('\n💡 Run "saga-agent list" to see available agents')
        process.exit(1)
      }

      // Get task input
      let taskInput: string
      if (options.file) {
        taskInput = await fs.readFile(options.file, 'utf-8')
        console.log(`📄 Reading task from: ${options.file}`)
      } else if (task) {
        taskInput = task
      } else {
        console.error('❌ Task is required. Provide task text or use --file')
        process.exit(1)
      }

      // Parse context
      let context: Record<string, any> | undefined
      if (options.context) {
        try {
          context = JSON.parse(options.context)
        } catch (error) {
          console.error('❌ Invalid JSON in --context option')
          process.exit(1)
        }
      }

      // Execute agent
      console.log(`\n🤖 Executing agent: ${agentName}`)
      console.log(`📝 Task: ${taskInput.substring(0, 100)}${taskInput.length > 100 ? '...' : ''}`)
      console.log(`⏳ Processing...\n`)

      const startTime = Date.now()
      const result = await agent.execute({ task: taskInput, context })
      const duration = Date.now() - startTime

      // Handle output
      if (options.json) {
        const output = JSON.stringify(result, null, 2)
        if (options.output) {
          await fs.writeFile(options.output, output)
          console.log(`✅ Output written to ${options.output}`)
        } else {
          console.log(output)
        }
      } else {
        if (result.success) {
          console.log('✅ Success!\n')
          console.log(formatAgentOutput(result))

          if (options.output) {
            const outputData = typeof result.data === 'string'
              ? result.data
              : JSON.stringify(result.data, null, 2)
            await fs.writeFile(options.output, outputData)
            console.log(`\n💾 Output written to ${options.output}`)
          }
        } else {
          console.log('❌ Failed!\n')
          console.log(`Error: ${result.error}`)
          process.exit(1)
        }
      }

      console.log(`\n⏱️  Duration: ${duration}ms`)
    } catch (error) {
      console.error('❌ Error executing agent:', error)
      process.exit(1)
    }
  })

// Search command
program
  .command('search <query>')
  .description('Search for agents by name, description, or capabilities')
  .action(async (query) => {
    try {
      const results = agentRegistry.search(query)

      if (results.length === 0) {
        console.log(`\n🔍 No agents found matching "${query}"`)
        console.log('\n💡 Run "saga-agent list" to see all available agents\n')
        return
      }

      console.log(`\n🔍 Search results for "${query}":\n`)
      results.forEach(agent => {
        const info = agent.getInfo()
        console.log(`  • ${info.name} (${info.category})`)
        console.log(`    ${info.description}`)
      })
      console.log(`\n✅ Found ${results.length} agent(s)\n`)
    } catch (error) {
      console.error('❌ Error searching agents:', error)
      process.exit(1)
    }
  })

// Batch command
program
  .command('batch <file>')
  .description('Execute multiple agents from a batch file')
  .option('-o, --output-dir <path>', 'Directory for output files', './output')
  .option('--stop-on-error', 'Stop execution if an agent fails')
  .action(async (file, options) => {
    try {
      const batchContent = await fs.readFile(file, 'utf-8')
      const batch = JSON.parse(batchContent)

      if (!Array.isArray(batch)) {
        console.error('❌ Batch file must contain an array of tasks')
        process.exit(1)
      }

      console.log(`\n🚀 Executing batch of ${batch.length} task(s)...\n`)

      // Create output directory
      await fs.mkdir(options.outputDir, { recursive: true })

      const results = []
      let successCount = 0
      let failureCount = 0

      for (let i = 0; i < batch.length; i++) {
        const task = batch[i]
        const { agentName, task: taskInput, context } = task

        console.log(`\n[${i + 1}/${batch.length}] 🤖 ${agentName}`)

        const agent = agentRegistry.get(agentName)
        if (!agent) {
          console.error(`  ❌ Agent "${agentName}" not found`)
          failureCount++
          if (options.stopOnError) break
          continue
        }

        const result = await agent.execute({ task: taskInput, context })
        results.push({ agentName, result })

        if (result.success) {
          console.log(`  ✅ Success (${result.metadata.executionTime}ms)`)
          successCount++

          // Write output
          const outputFile = path.join(
            options.outputDir,
            `${agentName}-${i + 1}.json`
          )
          await fs.writeFile(outputFile, JSON.stringify(result, null, 2))
        } else {
          console.log(`  ❌ Failed: ${result.error}`)
          failureCount++
          if (options.stopOnError) break
        }
      }

      // Summary
      console.log(`\n📊 Batch Execution Summary:`)
      console.log(`  ✅ Success: ${successCount}`)
      console.log(`  ❌ Failed: ${failureCount}`)
      console.log(`  📁 Output: ${options.outputDir}\n`)

      if (failureCount > 0) {
        process.exit(1)
      }
    } catch (error) {
      console.error('❌ Error executing batch:', error)
      process.exit(1)
    }
  })

program.parse()
