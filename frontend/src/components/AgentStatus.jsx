import React, { useState, useEffect } from 'react';
import { agentService } from '../services/api';

const AgentStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await agentService.getSystemStatus();
      setStatus(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch status:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading system status...</div>;
  }

  if (!status) {
    return <div className="error">Failed to load system status</div>;
  }

  return (
    <div className="dashboard">
      <div className="agent-card">
        <h3>{status.orchestrator?.name || 'Orchestrator'}</h3>
        <p>{status.orchestrator?.description || 'Main coordinator'}</p>
        <div className="agent-stats">
          <div className="stat">
            <span className="stat-value">{status.orchestrator?.tasks_completed || 0}</span>
            <span className="stat-label">Tasks</span>
          </div>
          <div className="stat">
            <span className="stat-value">Active</span>
            <span className="stat-label">Status</span>
          </div>
        </div>
      </div>

      {status.agents?.kpi && (
        <div className="agent-card">
          <h3>{status.agents.kpi.name}</h3>
          <p>{status.agents.kpi.description}</p>
          <div className="agent-stats">
            <div className="stat">
              <span className="stat-value">{status.agents.kpi.tasks_completed}</span>
              <span className="stat-label">Tasks</span>
            </div>
            <div className="stat">
              <span className="stat-value">Active</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>
      )}

      {status.agents?.logs && (
        <div className="agent-card">
          <h3>{status.agents.logs.name}</h3>
          <p>{status.agents.logs.description}</p>
          <div className="agent-stats">
            <div className="stat">
              <span className="stat-value">{status.agents.logs.tasks_completed}</span>
              <span className="stat-label">Tasks</span>
            </div>
            <div className="stat">
              <span className="stat-value">Active</span>
              <span className="stat-label">Status</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentStatus;
