from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agent_routes import router as agent_router

app = FastAPI(
    title="Triple Agent System",
    description="AI agent system with orchestrator, KPI analyzer, and log analyzer",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(agent_router)


@app.get("/")
async def root():
    return {
        "message": "Triple Agent System API",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "agents": "/api/agents"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
