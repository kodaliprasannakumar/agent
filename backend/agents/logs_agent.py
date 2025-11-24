from typing import Dict, Any, List
import re
from datetime import datetime
from collections import Counter
from .base_agent import BaseAgent


class LogsAgent(BaseAgent):
    """Agent specialized in parsing and analyzing logs"""

    def __init__(self):
        super().__init__(
            name="Logs Agent",
            description="Specializes in parsing logs, finding errors, pattern matching, and troubleshooting"
        )
        self.error_patterns = [
            r"ERROR",
            r"FATAL",
            r"CRITICAL",
            r"Exception",
            r"failed",
            r"timeout",
            r"refused"
        ]

    async def process(self, task: Dict[str, Any]) -> Dict[str, Any]:
        """Process log-related tasks"""
        task_type = task.get("type", "")
        data = task.get("data", {})

        result = {}

        if task_type == "parse_logs":
            result = await self._parse_logs(data)
        elif task_type == "find_errors":
            result = await self._find_errors(data)
        elif task_type == "analyze_patterns":
            result = await self._analyze_patterns(data)
        elif task_type == "filter_logs":
            result = await self._filter_logs(data)
        elif task_type == "summarize_logs":
            result = await self._summarize_logs(data)
        else:
            result = {
                "status": "error",
                "message": f"Unknown task type: {task_type}"
            }

        self.log_task(task, result)
        return result

    async def _parse_logs(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse log entries into structured format"""
        log_lines = data.get("logs", [])

        parsed_logs = []
        for line in log_lines:
            parsed_entry = self._parse_log_line(line)
            parsed_logs.append(parsed_entry)

        return {
            "status": "success",
            "total_entries": len(parsed_logs),
            "parsed_logs": parsed_logs
        }

    def _parse_log_line(self, line: str) -> Dict[str, Any]:
        """Parse a single log line"""
        # Common log pattern: [TIMESTAMP] LEVEL: MESSAGE
        pattern = r"\[([^\]]+)\]\s+(\w+):\s+(.*)"
        match = re.match(pattern, line)

        if match:
            return {
                "timestamp": match.group(1),
                "level": match.group(2),
                "message": match.group(3),
                "raw": line
            }
        else:
            return {
                "timestamp": None,
                "level": "UNKNOWN",
                "message": line,
                "raw": line
            }

    async def _find_errors(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Find error entries in logs"""
        log_lines = data.get("logs", [])

        errors = []
        for line in log_lines:
            for pattern in self.error_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    parsed = self._parse_log_line(line)
                    errors.append(parsed)
                    break

        return {
            "status": "success",
            "total_errors": len(errors),
            "errors": errors,
            "error_rate": len(errors) / len(log_lines) * 100 if log_lines else 0
        }

    async def _analyze_patterns(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze patterns in log data"""
        log_lines = data.get("logs", [])

        # Count log levels
        levels = []
        messages = []

        for line in log_lines:
            parsed = self._parse_log_line(line)
            levels.append(parsed.get("level", "UNKNOWN"))
            messages.append(parsed.get("message", ""))

        level_distribution = dict(Counter(levels))

        # Find common keywords in messages
        all_words = " ".join(messages).lower().split()
        common_words = Counter(all_words).most_common(10)

        # Detect repeated messages
        message_counts = Counter(messages)
        repeated_messages = [
            {"message": msg, "count": count}
            for msg, count in message_counts.items() if count > 1
        ]

        return {
            "status": "success",
            "level_distribution": level_distribution,
            "common_keywords": [{"word": word, "count": count} for word, count in common_words],
            "repeated_messages": repeated_messages[:5],
            "total_analyzed": len(log_lines)
        }

    async def _filter_logs(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Filter logs based on criteria"""
        log_lines = data.get("logs", [])
        filters = data.get("filters", {})

        level_filter = filters.get("level")
        keyword_filter = filters.get("keyword")
        time_range = filters.get("time_range")

        filtered_logs = []

        for line in log_lines:
            parsed = self._parse_log_line(line)

            # Apply level filter
            if level_filter and parsed.get("level") != level_filter:
                continue

            # Apply keyword filter
            if keyword_filter and keyword_filter.lower() not in line.lower():
                continue

            filtered_logs.append(parsed)

        return {
            "status": "success",
            "filtered_count": len(filtered_logs),
            "original_count": len(log_lines),
            "filtered_logs": filtered_logs
        }

    async def _summarize_logs(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a summary of log data"""
        log_lines = data.get("logs", [])

        if not log_lines:
            return {"status": "error", "message": "No logs provided"}

        # Parse all logs
        parsed_logs = [self._parse_log_line(line) for line in log_lines]

        # Count by level
        levels = [log.get("level") for log in parsed_logs]
        level_counts = dict(Counter(levels))

        # Find errors
        error_count = sum(1 for line in log_lines if any(
            re.search(pattern, line, re.IGNORECASE) for pattern in self.error_patterns
        ))

        # Time range
        timestamps = [log.get("timestamp") for log in parsed_logs if log.get("timestamp")]

        summary = {
            "status": "success",
            "total_entries": len(log_lines),
            "level_breakdown": level_counts,
            "error_count": error_count,
            "error_percentage": round(error_count / len(log_lines) * 100, 2) if log_lines else 0,
            "time_range": {
                "start": timestamps[0] if timestamps else None,
                "end": timestamps[-1] if timestamps else None
            }
        }

        return summary
