import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const agentService = {
  // System status
  getSystemStatus: async () => {
    const response = await api.get('/agents/status');
    return response.data;
  },

  // Agent info
  getAgentInfo: async (agentName) => {
    const response = await api.get(`/agents/info/${agentName}`);
    return response.data;
  },

  // KPI operations
  analyzeMetrics: async (data) => {
    const response = await api.post('/agents/kpi/analyze', data);
    return response.data;
  },

  calculateKPI: async (data) => {
    const response = await api.post('/agents/kpi/calculate', data);
    return response.data;
  },

  analyzeTrend: async (data) => {
    const response = await api.post('/agents/kpi/trend', data);
    return response.data;
  },

  generateReport: async (data) => {
    const response = await api.post('/agents/kpi/report', data);
    return response.data;
  },

  // Logs operations
  parseLogs: async (data) => {
    const response = await api.post('/agents/logs/parse', data);
    return response.data;
  },

  findErrors: async (data) => {
    const response = await api.post('/agents/logs/errors', data);
    return response.data;
  },

  analyzePatterns: async (data) => {
    const response = await api.post('/agents/logs/patterns', data);
    return response.data;
  },

  filterLogs: async (data) => {
    const response = await api.post('/agents/logs/filter', data);
    return response.data;
  },

  summarizeLogs: async (data) => {
    const response = await api.post('/agents/logs/summarize', data);
    return response.data;
  },

  // Generic task execution
  executeTask: async (task) => {
    const response = await api.post('/agents/task', task);
    return response.data;
  },
};

export default api;
