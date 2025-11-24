from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from models.schemas import TaskRequest, TaskResponse
from agents.orchestrator_agent import OrchestratorAgent

router = APIRouter(prefix="/api/agents", tags=["agents"])

# Initialize the orchestrator
orchestrator = OrchestratorAgent()


@router.post("/task", response_model=TaskResponse)
async def execute_task(task: TaskRequest):
    """Execute a task through the orchestrator"""
    try:
        result = await orchestrator.process(task.dict())
        return TaskResponse(
            status="success",
            data=result
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def get_system_status():
    """Get status of all agents"""
    return orchestrator._get_system_status()


@router.get("/info/{agent_name}")
async def get_agent_info(agent_name: str):
    """Get information about a specific agent"""
    result = orchestrator._get_agent_info(agent_name)
    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result.get("message"))
    return result


@router.post("/kpi/analyze")
async def analyze_kpi(request: Dict[str, Any]):
    """Analyze KPI metrics"""
    task = {
        "type": "analyze_metrics",
        "data": request
    }
    result = await orchestrator.process(task)
    return result


@router.post("/kpi/calculate")
async def calculate_kpi(request: Dict[str, Any]):
    """Calculate specific KPI"""
    task = {
        "type": "calculate_kpi",
        "data": request
    }
    result = await orchestrator.process(task)
    return result


@router.post("/kpi/trend")
async def analyze_trend(request: Dict[str, Any]):
    """Analyze trends in KPI data"""
    task = {
        "type": "trend_analysis",
        "data": request
    }
    result = await orchestrator.process(task)
    return result


@router.post("/kpi/report")
async def generate_report(request: Dict[str, Any]):
    """Generate performance report"""
    task = {
        "type": "performance_report",
        "data": request
    }
    result = await orchestrator.process(task)
    return result


@router.post("/logs/parse")
async def parse_logs(request: Dict[str, Any]):
    """Parse log entries"""
    task = {
        "type": "parse_logs",
        "data": request
    }
    result = await orchestrator.process(task)
    return result


@router.post("/logs/errors")
async def find_errors(request: Dict[str, Any]):
    """Find errors in logs"""
    task = {
        "type": "find_errors",
        "data": request
    }
    result = await orchestrator.process(task)
    return result


@router.post("/logs/patterns")
async def analyze_patterns(request: Dict[str, Any]):
    """Analyze patterns in logs"""
    task = {
        "type": "analyze_patterns",
        "data": request
    }
    result = await orchestrator.process(task)
    return result


@router.post("/logs/filter")
async def filter_logs(request: Dict[str, Any]):
    """Filter logs based on criteria"""
    task = {
        "type": "filter_logs",
        "data": request
    }
    result = await orchestrator.process(task)
    return result


@router.post("/logs/summarize")
async def summarize_logs(request: Dict[str, Any]):
    """Summarize log data"""
    task = {
        "type": "summarize_logs",
        "data": request
    }
    result = await orchestrator.process(task)
    return result
