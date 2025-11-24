from typing import Dict, Any, List
from datetime import datetime
from .base_agent import BaseAgent
from .kpi_agent import KPIAgent
from .logs_agent import LogsAgent


class OrchestratorAgent(BaseAgent):
    """Orchestrator agent that coordinates and delegates tasks to specialized agents"""

    def __init__(self):
        super().__init__(
            name="Orchestrator Agent",
            description="Coordinates tasks and delegates to specialized agents"
        )
        self.kpi_agent = KPIAgent()
        self.logs_agent = LogsAgent()
        self.agents = {
            "kpi": self.kpi_agent,
            "logs": self.logs_agent
        }

    async def process(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a task by routing it to the appropriate agent"""
        task_type = task.get("type", "")

        # Determine which agent should handle this task
        agent_type = self._determine_agent(task_type)

        if agent_type == "orchestrator":
            # Handle orchestrator-specific tasks
            return await self._handle_orchestrator_task(task)
        elif agent_type in self.agents:
            # Delegate to specialized agent
            agent = self.agents[agent_type]
            result = await agent.process(task)

            # Log the delegation
            delegation_record = {
                "delegated_to": agent.name,
                "task": task,
                "result": result,
                "timestamp": datetime.now().isoformat()
            }
            self.log_task(task, delegation_record)

            return result
        else:
            return {
                "status": "error",
                "message": f"Unknown agent type: {agent_type}"
            }

    def _determine_agent(self, task_type: str) -> str:
        """Determine which agent should handle a task based on task type"""
        kpi_tasks = [
            "analyze_metrics",
            "calculate_kpi",
            "trend_analysis",
            "performance_report"
        ]

        logs_tasks = [
            "parse_logs",
            "find_errors",
            "analyze_patterns",
            "filter_logs",
            "summarize_logs"
        ]

        if task_type in kpi_tasks:
            return "kpi"
        elif task_type in logs_tasks:
            return "logs"
        elif task_type in ["multi_agent", "status", "agent_info"]:
            return "orchestrator"
        else:
            # Try to infer from keywords
            if any(keyword in task_type.lower() for keyword in ["kpi", "metric", "performance", "trend"]):
                return "kpi"
            elif any(keyword in task_type.lower() for keyword in ["log", "error", "parse", "filter"]):
                return "logs"
            else:
                return "orchestrator"

    async def _handle_orchestrator_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Handle tasks that require orchestrator-level processing"""
        task_type = task.get("type", "")

        if task_type == "multi_agent":
            # Execute multiple agent tasks in sequence or parallel
            return await self._execute_multi_agent_task(task)
        elif task_type == "status":
            # Return status of all agents
            return self._get_system_status()
        elif task_type == "agent_info":
            # Return information about a specific agent
            agent_name = task.get("data", {}).get("agent")
            return self._get_agent_info(agent_name)
        else:
            return {
                "status": "error",
                "message": f"Unknown orchestrator task type: {task_type}"
            }

    async def _execute_multi_agent_task(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a task that involves multiple agents"""
        subtasks = task.get("data", {}).get("subtasks", [])

        results = []
        for subtask in subtasks:
            agent_type = self._determine_agent(subtask.get("type", ""))

            if agent_type in self.agents:
                agent = self.agents[agent_type]
                result = await agent.process(subtask)
                results.append({
                    "agent": agent.name,
                    "subtask": subtask,
                    "result": result
                })
            else:
                results.append({
                    "agent": "unknown",
                    "subtask": subtask,
                    "result": {
                        "status": "error",
                        "message": "Could not determine appropriate agent"
                    }
                })

        return {
            "status": "success",
            "total_subtasks": len(subtasks),
            "completed": len([r for r in results if r["result"].get("status") == "success"]),
            "results": results
        }

    def _get_system_status(self) -> Dict[str, Any]:
        """Get status of all agents in the system"""
        return {
            "status": "success",
            "orchestrator": self.get_info(),
            "agents": {
                name: agent.get_info()
                for name, agent in self.agents.items()
            }
        }

    def _get_agent_info(self, agent_name: str) -> Dict[str, Any]:
        """Get information about a specific agent"""
        if agent_name == "orchestrator":
            return {
                "status": "success",
                "info": self.get_info()
            }
        elif agent_name in self.agents:
            return {
                "status": "success",
                "info": self.agents[agent_name].get_info()
            }
        else:
            return {
                "status": "error",
                "message": f"Agent not found: {agent_name}"
            }

    def get_all_agents_info(self) -> Dict[str, Any]:
        """Get information about all agents"""
        return {
            "orchestrator": self.get_info(),
            "specialized_agents": {
                name: agent.get_info()
                for name, agent in self.agents.items()
            }
        }
