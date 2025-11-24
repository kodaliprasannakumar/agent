from abc import ABC, abstractmethod
from typing import Dict, Any, List
from datetime import datetime


class BaseAgent(ABC):
    """Base class for all agents in the system"""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description
        self.created_at = datetime.now()
        self.task_history: List[Dict[str, Any]] = []

    @abstractmethod
    async def process(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process a task and return results"""
        pass

    def log_task(self, task: Dict[str, Any], result: Dict[str, Any]):
        """Log task execution"""
        self.task_history.append({
            "timestamp": datetime.now().isoformat(),
            "task": task,
            "result": result
        })

    def get_info(self) -> Dict[str, Any]:
        """Get agent information"""
        return {
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat(),
            "tasks_completed": len(self.task_history)
        }
