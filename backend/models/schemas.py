from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from datetime import datetime


class TaskRequest(BaseModel):
    type: str
    data: Dict[str, Any] = {}


class TaskResponse(BaseModel):
    status: str
    data: Dict[str, Any] = {}
    timestamp: str = datetime.now().isoformat()


class AgentInfo(BaseModel):
    name: str
    description: str
    created_at: str
    tasks_completed: int


class SystemStatus(BaseModel):
    orchestrator: AgentInfo
    agents: Dict[str, AgentInfo]
