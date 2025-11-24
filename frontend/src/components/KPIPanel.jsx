import React, { useState } from 'react';
import { agentService } from '../services/api';

const KPIPanel = () => {
  const [kpiType, setKpiType] = useState('analyze_metrics');
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
      switch (kpiType) {
        case 'analyze_metrics':
          response = await agentService.analyzeMetrics(data);
          break;
        case 'calculate_kpi':
          response = await agentService.calculateKPI(data);
          break;
        case 'trend_analysis':
          response = await agentService.analyzeTrend(data);
          break;
        case 'performance_report':
          response = await agentService.generateReport(data);
          break;
        default:
          throw new Error('Unknown KPI type');
      }

      setResult(response);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getExampleData = () => {
    switch (kpiType) {
      case 'analyze_metrics':
        return JSON.stringify({
          metrics: [100, 150, 120, 180, 200, 175, 190]
        }, null, 2);
      case 'calculate_kpi':
        return JSON.stringify({
          kpi_type: "conversion_rate",
          values: {
            conversions: 250,
            total: 1000
          }
        }, null, 2);
      case 'trend_analysis':
        return JSON.stringify({
          time_series: [
            { timestamp: "2024-01-01", value: 100 },
            { timestamp: "2024-01-02", value: 120 },
            { timestamp: "2024-01-03", value: 115 },
            { timestamp: "2024-01-04", value: 140 },
            { timestamp: "2024-01-05", value: 150 }
          ]
        }, null, 2);
      case 'performance_report':
        return JSON.stringify({
          metrics: {
            response_time: [200, 250, 180, 300, 220],
            error_rate: [2, 1, 3, 2, 1]
          }
        }, null, 2);
      default:
        return '';
    }
  };

  return (
    <div className="panel">
      <h2>KPI Data Agent</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>KPI Operation</label>
          <select
            value={kpiType}
            onChange={(e) => {
              setKpiType(e.target.value);
              setInputData(getExampleData());
            }}
          >
            <option value="analyze_metrics">Analyze Metrics</option>
            <option value="calculate_kpi">Calculate KPI</option>
            <option value="trend_analysis">Trend Analysis</option>
            <option value="performance_report">Performance Report</option>
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

export default KPIPanel;
