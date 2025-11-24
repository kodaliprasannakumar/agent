import React, { useState } from 'react';
import './App.css';
import AgentStatus from './components/AgentStatus';
import KPIPanel from './components/KPIPanel';
import LogsPanel from './components/LogsPanel';
import ChatInterface from './components/ChatInterface';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Triple Agent System</h1>
          <p>AI-powered orchestration with specialized KPI and Logs agents</p>
        </header>

        <AgentStatus />

        <div className="tabs">
          <button
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat Interface
          </button>
          <button
            className={`tab-btn ${activeTab === 'panels' ? 'active' : ''}`}
            onClick={() => setActiveTab('panels')}
          >
            Agent Panels
          </button>
        </div>

        {activeTab === 'chat' ? (
          <ChatInterface />
        ) : (
          <div className="agent-panels">
            <KPIPanel />
            <LogsPanel />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
