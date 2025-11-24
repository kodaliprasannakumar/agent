import React, { useState } from 'react';
import { agentService } from '../services/api';

const LogsPanel = () => {
  const [logsType, setLogsType] = useState('parse_logs');
  const [inputData, setInputData] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let data;
      try {
        data = JSON.parse(inputData);
      } catch (err) {
        throw new Error('Invalid JSON format');
      }

      let response;
      switch (logsType) {
        case 'parse_logs':
          response = await agentService.parseLogs(data);
          break;
        case 'find_errors':
          response = await agentService.findErrors(data);
          break;
        case 'analyze_patterns':
          response = await agentService.analyzePatterns(data);
          break;
        case 'filter_logs':
          response = await agentService.filterLogs(data);
          break;
        case 'summarize_logs':
          response = await agentService.summarizeLogs(data);
          break;
        default:
          throw new Error('Unknown logs operation');
      }

      setResult(response);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getExampleData = () => {
    const sampleLogs = [
      "[2024-01-01 10:00:00] INFO: Application started",
      "[2024-01-01 10:01:00] DEBUG: Loading configuration",
      "[2024-01-01 10:02:00] INFO: Database connected",
      "[2024-01-01 10:03:00] ERROR: Failed to authenticate user",
      "[2024-01-01 10:04:00] WARN: High memory usage detected",
      "[2024-01-01 10:05:00] INFO: Request processed successfully",
      "[2024-01-01 10:06:00] ERROR: Database connection timeout"
    ];

    switch (logsType) {
      case 'parse_logs':
        return JSON.stringify({
          logs: sampleLogs
        }, null, 2);
      case 'find_errors':
        return JSON.stringify({
          logs: sampleLogs
        }, null, 2);
      case 'analyze_patterns':
        return JSON.stringify({
          logs: sampleLogs
        }, null, 2);
      case 'filter_logs':
        return JSON.stringify({
          logs: sampleLogs,
          filters: {
            level: "ERROR"
          }
        }, null, 2);
      case 'summarize_logs':
        return JSON.stringify({
          logs: sampleLogs
        }, null, 2);
      default:
        return '';
    }
  };

  return (
    <div className="panel">
      <h2>Logs Agent</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Logs Operation</label>
          <select
            value={logsType}
            onChange={(e) => {
              setLogsType(e.target.value);
              setInputData(getExampleData());
            }}
          >
            <option value="parse_logs">Parse Logs</option>
            <option value="find_errors">Find Errors</option>
            <option value="analyze_patterns">Analyze Patterns</option>
            <option value="filter_logs">Filter Logs</option>
            <option value="summarize_logs">Summarize Logs</option>
          </select>
        </div>

        <div className="form-group">
          <label>Input Data (JSON)</label>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder={getExampleData()}
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setInputData(getExampleData())}
          style={{ marginRight: '10px', background: '#6c757d', color: 'white' }}
        >
          Load Example
        </button>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Analyze'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results">
          <h3>Results</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default LogsPanel;
