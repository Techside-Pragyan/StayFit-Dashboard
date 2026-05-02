import React, { useState, useEffect } from 'react';
import { getLogs, getGoal, getInsights } from '../api';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Flame, Droplets, Moon, Footprints, Weight } from 'lucide-react';

function Dashboard({ user }) {
  const [logs, setLogs] = useState([]);
  const [goal, setGoal] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, goalRes, insightsRes] = await Promise.all([
          getLogs(),
          getGoal(),
          getInsights()
        ]);
        
        // Reverse logs to show chronological order for charts
        setLogs(logsRes.data.reverse());
        setGoal(goalRes.data);
        setInsights(insightsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="main-content"><p>Loading dashboard...</p></div>;

  const latestLog = logs[logs.length - 1] || {};

  // Formatter for date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const chartData = logs.map(log => ({
    ...log,
    dateStr: formatDate(log.date)
  }));

  return (
    <div className="main-content">
      <h2 style={{ marginBottom: '2rem' }}>Welcome back, <span className="gradient-text">{user.name}</span></h2>
      
      <div className="dashboard-grid">
        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-label">Daily Calories</span>
            <div className="metric-icon"><Flame /></div>
          </div>
          <div className="metric-value">{latestLog.calories_intake || 0}</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${Math.min(100, ((latestLog.calories_intake || 0) / (goal?.daily_calories || 2000)) * 100)}%` }}></div>
          </div>
          <div className="progress-text">
            <span>Progress</span>
            <span>Goal: {goal?.daily_calories || 2000} kcal</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-label">Steps</span>
            <div className="metric-icon" style={{ color: '#10b981' }}><Footprints /></div>
          </div>
          <div className="metric-value">{latestLog.steps || 0}</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ background: 'var(--gradient-2)', width: `${Math.min(100, ((latestLog.steps || 0) / (goal?.daily_steps || 10000)) * 100)}%` }}></div>
          </div>
          <div className="progress-text">
            <span>Progress</span>
            <span>Goal: {goal?.daily_steps || 10000}</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-label">Water Intake</span>
            <div className="metric-icon" style={{ color: '#3b82f6' }}><Droplets /></div>
          </div>
          <div className="metric-value">{latestLog.water_intake || 0} L</div>
          <div className="progress-container">
            <div className="progress-bar" style={{ background: '#3b82f6', width: `${Math.min(100, ((latestLog.water_intake || 0) / (goal?.daily_water || 2.5)) * 100)}%` }}></div>
          </div>
          <div className="progress-text">
            <span>Progress</span>
            <span>Goal: {goal?.daily_water || 2.5} L</span>
          </div>
        </div>

        <div className="glass-card metric-card">
          <div className="metric-header">
            <span className="metric-label">Sleep</span>
            <div className="metric-icon" style={{ color: '#a855f7' }}><Moon /></div>
          </div>
          <div className="metric-value">{latestLog.sleep_hours || 0} h</div>
        </div>
      </div>

      <div className="chart-grid">
        <div className="glass-card">
          <h3>Weight Trend</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="dateStr" stroke="var(--text-secondary)" />
                <YAxis domain={['auto', 'auto']} stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--glass-border)' }} />
                <Line type="monotone" dataKey="weight" stroke="var(--accent-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card">
          <h3>Activity & Calories</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="dateStr" stroke="var(--text-secondary)" />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--glass-border)' }} />
                <Bar yAxisId="left" dataKey="calories_intake" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {insights && insights.tips && insights.tips.length > 0 && (
        <div className="glass-card">
          <h3>AI Health Insights</h3>
          <ul className="insights-list">
            {insights.tips.map((tip, idx) => (
              <li key={idx}>
                <span>💡</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
