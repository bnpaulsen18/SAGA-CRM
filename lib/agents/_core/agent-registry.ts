import { BaseAgent, AgentCategory } from './base-agent'

class AgentRegistry {
  private agents = new Map<string, BaseAgent>()

  register(agent: BaseAgent) {
    this.agents.set(agent.getInfo().name, agent)
  }

  get(name: string): BaseAgent | undefined {
    return this.agents.get(name)
  }

  getByCategory(category: AgentCategory): BaseAgent[] {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.getInfo().category === category
    )
  }

  listAll() {
    return Array.from(this.agents.values()).map((agent) => agent.getInfo())
  }

  search(query: string): BaseAgent[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.agents.values()).filter((agent) => {
      const info = agent.getInfo()
      return (
        info.name.toLowerCase().includes(lowerQuery) ||
        info.description.toLowerCase().includes(lowerQuery) ||
        info.capabilities.some((cap) => cap.toLowerCase().includes(lowerQuery))
      )
    })
  }
}

export const agentRegistry = new AgentRegistry()
