import React, { useState, useRef, useEffect } from 'react';
import { agentService } from '../services/api';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m the Triple Agent System. I can help you with KPI analysis and log management. Try asking me to:\n\n- Analyze metrics: "Analyze these metrics: 100, 150, 120, 180, 200"\n- Calculate KPIs: "Calculate conversion rate for 250 conversions out of 1000 total"\n- Find errors in logs\n- Summarize log data\n\nWhat would you like me to help you with?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseUserIntent = (message) => {
    const lowerMessage = message.toLowerCase();

    // KPI-related keywords
    if (lowerMessage.includes('analyze') && (lowerMessage.includes('metric') || lowerMessage.includes('number'))) {
      const numbers = message.match(/\d+/g);
      if (numbers) {
        return {
          type: 'analyze_metrics',
          data: { metrics: numbers.map(Number) }
        };
      }
    }

    if (lowerMessage.includes('conversion rate')) {
      const numbers = message.match(/\d+/g);
      if (numbers && numbers.length >= 2) {
        return {
          type: 'calculate_kpi',
          data: {
            kpi_type: 'conversion_rate',
            values: {
              conversions: Number(numbers[0]),
              total: Number(numbers[1])
            }
          }
        };
      }
    }

    if (lowerMessage.includes('response time') || lowerMessage.includes('avg response')) {
      const numbers = message.match(/\d+/g);
      if (numbers) {
        return {
          type: 'calculate_kpi',
          data: {
            kpi_type: 'average_response_time',
            values: {
              response_times: numbers.map(Number)
            }
          }
        };
      }
    }

    if (lowerMessage.includes('trend') || lowerMessage.includes('trending')) {
      const numbers = message.match(/\d+/g);
      if (numbers) {
        const time_series = numbers.map((val, idx) => ({
          timestamp: `2024-01-0${idx + 1}`,
          value: Number(val)
        }));
        return {
          type: 'trend_analysis',
          data: { time_series }
        };
      }
    }

    if (lowerMessage.includes('report') || lowerMessage.includes('performance')) {
      return {
        type: 'performance_report',
        data: {
          metrics: {
            response_time: [200, 250, 180, 300, 220],
            error_rate: [2, 1, 3, 2, 1]
          }
        }
      };
    }

    // Logs-related keywords
    if (lowerMessage.includes('parse log') || lowerMessage.includes('parse these log')) {
      return {
        type: 'parse_logs',
        data: {
          logs: extractLogsFromMessage(message)
        }
      };
    }

    if (lowerMessage.includes('find error') || lowerMessage.includes('show error')) {
      return {
        type: 'find_errors',
        data: {
          logs: extractLogsFromMessage(message)
        }
      };
    }

    if (lowerMessage.includes('analyze pattern') || lowerMessage.includes('log pattern')) {
      return {
        type: 'analyze_patterns',
        data: {
          logs: extractLogsFromMessage(message)
        }
      };
    }

    if (lowerMessage.includes('summarize log') || lowerMessage.includes('log summary')) {
      return {
        type: 'summarize_logs',
        data: {
          logs: extractLogsFromMessage(message)
        }
      };
    }

    // Default: provide help
    return null;
  };

  const extractLogsFromMessage = (message) => {
    // Check if message contains log-like patterns
    const logPattern = /\[.*?\].*?:/g;
    if (logPattern.test(message)) {
      return message.split('\n').filter(line => line.trim());
    }

    // Return sample logs for demo
    return [
      "[2024-01-01 10:00:00] INFO: Application started",
      "[2024-01-01 10:01:00] DEBUG: Loading configuration",
      "[2024-01-01 10:02:00] INFO: Database connected",
      "[2024-01-01 10:03:00] ERROR: Failed to authenticate user",
      "[2024-01-01 10:04:00] WARN: High memory usage detected"
    ];
  };

  const formatResponse = (result, taskType) => {
    if (!result) return 'No response from agent';

    if (result.status === 'error') {
      return `Error: ${result.message}`;
    }

    let response = '';

    switch (taskType) {
      case 'analyze_metrics':
        response = `Metrics Analysis:\n`;
        response += `- Average: ${result.average}\n`;
        response += `- Median: ${result.median}\n`;
        response += `- Min: ${result.min}\n`;
        response += `- Max: ${result.max}\n`;
        response += `- Standard Deviation: ${result.std_dev?.toFixed(2)}`;
        break;

      case 'calculate_kpi':
        response = `${result.kpi_type.replace('_', ' ').toUpperCase()}:\n`;
        response += `Value: ${result.value}${result.unit}`;
        break;

      case 'trend_analysis':
        response = `Trend Analysis:\n`;
        response += `- Trend: ${result.trend}\n`;
        response += `- Change: ${result.change_percentage}%\n`;
        response += `- First Half Average: ${result.first_half_avg}\n`;
        response += `- Second Half Average: ${result.second_half_avg}`;
        break;

      case 'performance_report':
        response = `Performance Report:\n`;
        response += `Generated at: ${result.generated_at}\n\n`;
        if (result.summary) {
          for (const [metric, data] of Object.entries(result.summary)) {
            response += `${metric}:\n`;
            response += `  - Average: ${data.average}\n`;
            response += `  - Min: ${data.min}, Max: ${data.max}\n`;
          }
        }
        if (result.recommendations?.length > 0) {
          response += `\nRecommendations:\n`;
          result.recommendations.forEach(rec => {
            response += `- ${rec}\n`;
          });
        }
        break;

      case 'find_errors':
        response = `Found ${result.total_errors} errors (${result.error_rate?.toFixed(2)}% error rate)\n\n`;
        if (result.errors?.length > 0) {
          response += result.errors.slice(0, 5).map(err => err.raw).join('\n');
        }
        break;

      case 'analyze_patterns':
        response = `Log Pattern Analysis:\n`;
        response += `Total logs analyzed: ${result.total_analyzed}\n\n`;
        if (result.level_distribution) {
          response += `Level Distribution:\n`;
          for (const [level, count] of Object.entries(result.level_distribution)) {
            response += `- ${level}: ${count}\n`;
          }
        }
        break;

      case 'summarize_logs':
        response = `Log Summary:\n`;
        response += `- Total Entries: ${result.total_entries}\n`;
        response += `- Errors: ${result.error_count} (${result.error_percentage}%)\n`;
        if (result.level_breakdown) {
          response += `\nLevel Breakdown:\n`;
          for (const [level, count] of Object.entries(result.level_breakdown)) {
            response += `- ${level}: ${count}\n`;
          }
        }
        break;

      default:
        response = JSON.stringify(result, null, 2);
    }

    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const task = parseUserIntent(input);

      if (!task) {
        const helpMessage = {
          role: 'assistant',
          content: 'I can help you with:\n\n' +
            '1. KPI Analysis:\n' +
            '   - "Analyze metrics: 100, 150, 120, 180"\n' +
            '   - "Calculate conversion rate for 250 conversions out of 1000"\n' +
            '   - "Analyze trend: 100, 120, 115, 140, 150"\n' +
            '   - "Generate performance report"\n\n' +
            '2. Log Analysis:\n' +
            '   - "Find errors in logs"\n' +
            '   - "Summarize logs"\n' +
            '   - "Analyze log patterns"\n\n' +
            'Please try one of these commands!',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, helpMessage]);
        setLoading(false);
        return;
      }

      const result = await agentService.executeTask(task);

      const assistantMessage = {
        role: 'assistant',
        content: formatResponse(result.data, task.type),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: `Error: ${error.message || 'Failed to process request'}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Analyze Metrics', prompt: 'Analyze these metrics: 100, 150, 120, 180, 200' },
    { label: 'Calculate KPI', prompt: 'Calculate conversion rate for 250 conversions out of 1000 total' },
    { label: 'Find Errors', prompt: 'Find errors in logs' },
    { label: 'Generate Report', prompt: 'Generate performance report' }
  ];

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with Agents</h2>
        <p>Ask questions or give commands to the agent system</p>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            <div className="message-avatar">
              {message.role === 'user' ? 'You' : 'AI'}
            </div>
            <div className="message-content">
              <pre>{message.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">AI</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="quick-action-btn"
            onClick={() => setInput(action.prompt)}
          >
            {action.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message or command..."
          disabled={loading}
          className="chat-input"
        />
        <button type="submit" disabled={loading || !input.trim()} className="chat-send-btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
