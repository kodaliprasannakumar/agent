from typing import Dict, Any, List
import statistics
from datetime import datetime, timedelta
from .base_agent import BaseAgent


class KPIAgent(BaseAgent):
    """Agent specialized in analyzing KPI data and metrics"""

    def __init__(self):
        super().__init__(
            name="KPI Data Agent",
            description="Specializes in analyzing metrics, performance data, and KPI tracking"
        )

    async def process(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process KPI-related tasks"""
        task_type = task.get("type", "")
        data = task.get("data", {})

        result = {}

        if task_type == "analyze_metrics":
            result = await self._analyze_metrics(data)
        elif task_type == "calculate_kpi":
            result = await self._calculate_kpi(data)
        elif task_type == "trend_analysis":
            result = await self._trend_analysis(data)
        elif task_type == "performance_report":
            result = await self._generate_performance_report(data)
        else:
            result = {
                "status": "error",
                "message": f"Unknown task type: {task_type}"
            }

        self.log_task(task, result)
        return result

    async def _analyze_metrics(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze general metrics"""
        metrics = data.get("metrics", [])

        if not metrics:
            return {"status": "error", "message": "No metrics provided"}

        analysis = {
            "status": "success",
            "total_metrics": len(metrics),
            "average": statistics.mean(metrics) if metrics else 0,
            "median": statistics.median(metrics) if metrics else 0,
            "min": min(metrics) if metrics else 0,
            "max": max(metrics) if metrics else 0,
            "std_dev": statistics.stdev(metrics) if len(metrics) > 1 else 0
        }

        return analysis

    async def _calculate_kpi(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate specific KPIs"""
        kpi_type = data.get("kpi_type", "")
        values = data.get("values", {})

        if kpi_type == "conversion_rate":
            conversions = values.get("conversions", 0)
            total = values.get("total", 0)
            rate = (conversions / total * 100) if total > 0 else 0
            return {
                "status": "success",
                "kpi_type": kpi_type,
                "value": round(rate, 2),
                "unit": "%"
            }
        elif kpi_type == "average_response_time":
            response_times = values.get("response_times", [])
            avg = statistics.mean(response_times) if response_times else 0
            return {
                "status": "success",
                "kpi_type": kpi_type,
                "value": round(avg, 2),
                "unit": "ms"
            }
        elif kpi_type == "uptime_percentage":
            uptime = values.get("uptime_minutes", 0)
            total_time = values.get("total_minutes", 0)
            percentage = (uptime / total_time * 100) if total_time > 0 else 0
            return {
                "status": "success",
                "kpi_type": kpi_type,
                "value": round(percentage, 2),
                "unit": "%"
            }
        else:
            return {
                "status": "error",
                "message": f"Unknown KPI type: {kpi_type}"
            }

    async def _trend_analysis(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze trends in time-series data"""
        time_series = data.get("time_series", [])

        if len(time_series) < 2:
            return {"status": "error", "message": "Need at least 2 data points for trend analysis"}

        values = [point.get("value", 0) for point in time_series]

        # Simple trend calculation
        first_half = values[:len(values)//2]
        second_half = values[len(values)//2:]

        avg_first = statistics.mean(first_half)
        avg_second = statistics.mean(second_half)

        trend = "increasing" if avg_second > avg_first else "decreasing" if avg_second < avg_first else "stable"
        change_percentage = ((avg_second - avg_first) / avg_first * 100) if avg_first != 0 else 0

        return {
            "status": "success",
            "trend": trend,
            "change_percentage": round(change_percentage, 2),
            "first_half_avg": round(avg_first, 2),
            "second_half_avg": round(avg_second, 2)
        }

    async def _generate_performance_report(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a comprehensive performance report"""
        metrics = data.get("metrics", {})

        report = {
            "status": "success",
            "generated_at": datetime.now().isoformat(),
            "summary": {},
            "recommendations": []
        }

        # Analyze each metric
        for metric_name, metric_values in metrics.items():
            if isinstance(metric_values, list) and metric_values:
                avg = statistics.mean(metric_values)
                report["summary"][metric_name] = {
                    "average": round(avg, 2),
                    "min": min(metric_values),
                    "max": max(metric_values),
                    "count": len(metric_values)
                }

        # Generate simple recommendations
        if "response_time" in report["summary"]:
            if report["summary"]["response_time"]["average"] > 1000:
                report["recommendations"].append("Response time is high. Consider optimization.")

        if "error_rate" in report["summary"]:
            if report["summary"]["error_rate"]["average"] > 5:
                report["recommendations"].append("Error rate is above threshold. Investigation needed.")

        return report
