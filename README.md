# Triple Agent System

An AI-powered multi-agent system with FastAPI backend and React frontend. The system consists of three specialized agents:

- **Orchestrator Agent**: Coordinates tasks and delegates to specialized agents
- **KPI Data Agent**: Analyzes metrics, performance data, and generates reports
- **Logs Agent**: Parses logs, finds errors, analyzes patterns, and troubleshoots issues

## Architecture

```
┌─────────────────────────┐
│  Orchestrator Agent     │
│  (Coordinator)          │
└───────┬─────────────────┘
        │
        ├──────────────┬──────────────┐
        │              │              │
┌───────▼──────┐  ┌───▼──────┐  ┌───▼──────┐
│  KPI Agent   │  │   Logs   │  │  Future  │
│  (Metrics)   │  │  Agent   │  │  Agents  │
└──────────────┘  └──────────┘  └──────────┘
```

## Features

### KPI Data Agent
- Analyze metrics (mean, median, std dev)
- Calculate specific KPIs (conversion rate, response time, uptime)
- Trend analysis on time-series data
- Generate comprehensive performance reports

### Logs Agent
- Parse log entries into structured format
- Find and categorize errors
- Analyze patterns and common keywords
- Filter logs by level, keyword, or time range
- Summarize log data

## Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
python main.py
```

The API will be available at [http://localhost:8000](http://localhost:8000)
API documentation at [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## API Endpoints

### System
- `GET /` - API information
- `GET /health` - Health check
- `GET /api/agents/status` - Get all agents status
- `GET /api/agents/info/{agent_name}` - Get specific agent info

### KPI Agent
- `POST /api/agents/kpi/analyze` - Analyze metrics
- `POST /api/agents/kpi/calculate` - Calculate KPI
- `POST /api/agents/kpi/trend` - Analyze trends
- `POST /api/agents/kpi/report` - Generate performance report

### Logs Agent
- `POST /api/agents/logs/parse` - Parse logs
- `POST /api/agents/logs/errors` - Find errors
- `POST /api/agents/logs/patterns` - Analyze patterns
- `POST /api/agents/logs/filter` - Filter logs
- `POST /api/agents/logs/summarize` - Summarize logs

## Usage Examples

### Analyze Metrics
```bash
curl -X POST "http://localhost:8000/api/agents/kpi/analyze" \
  -H "Content-Type: application/json" \
  -d '{"metrics": [100, 150, 120, 180, 200]}'
```

### Calculate Conversion Rate
```bash
curl -X POST "http://localhost:8000/api/agents/kpi/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "kpi_type": "conversion_rate",
    "values": {
      "conversions": 250,
      "total": 1000
    }
  }'
```

### Find Errors in Logs
```bash
curl -X POST "http://localhost:8000/api/agents/logs/errors" \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      "[2024-01-01 10:00:00] INFO: Application started",
      "[2024-01-01 10:01:00] ERROR: Failed to connect"
    ]
  }'
```

### Summarize Logs
```bash
curl -X POST "http://localhost:8000/api/agents/logs/summarize" \
  -H "Content-Type: application/json" \
  -d '{
    "logs": [
      "[2024-01-01 10:00:00] INFO: Application started",
      "[2024-01-01 10:01:00] DEBUG: Loading config",
      "[2024-01-01 10:02:00] ERROR: Connection failed"
    ]
  }'
```

## Project Structure

```
triple-agent/
├── backend/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base_agent.py
│   │   ├── orchestrator_agent.py
│   │   ├── kpi_agent.py
│   │   └── logs_agent.py
│   ├── models/
│   │   └── schemas.py
│   ├── routes/
│   │   └── agent_routes.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentStatus.jsx
│   │   │   ├── KPIPanel.jsx
│   │   │   └── LogsPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Technologies Used

### Backend
- FastAPI - Modern Python web framework
- Pydantic - Data validation
- Uvicorn - ASGI server

### Frontend
- React 18 - UI library
- Vite - Build tool
- Axios - HTTP client

## Future Enhancements

- Add authentication and user management
- Implement real-time WebSocket updates
- Add more specialized agents (database, security, etc.)
- Implement agent learning and optimization
- Add task queuing and scheduling
- Create dashboards with data visualization
- Add export functionality for reports
- Implement agent collaboration patterns

## License

MIT
