import React, { useState, useEffect } from 'react';
import DatabaseLogs from './DatabaseLogs'; // <-- NEW IMPORT

const AnalyticsDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [selectedHCP, setSelectedHCP] = useState('All');

  useEffect(() => {
    fetch('http://localhost:8000/api/logs')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && Array.isArray(data.data)) setLogs(data.data);
        else if (Array.isArray(data)) setLogs(data);
      })
      .catch(err => console.error(err));
  }, []);

  const uniqueHCPNames = [...new Set(logs.map(log => log.hcp_name))];

  const dashboardData = selectedHCP === 'All' 
    ? logs 
    : logs.filter(log => log.hcp_name === selectedHCP);

  const totalInteractions = dashboardData.length;
  const positiveCount = dashboardData.filter(l => l.sentiment === 'Positive').length;
  const neutralCount = dashboardData.filter(l => l.sentiment === 'Neutral').length;
  const negativeCount = dashboardData.filter(l => l.sentiment === 'Negative').length;

  const posPercent = totalInteractions ? Math.round((positiveCount / totalInteractions) * 100) : 0;
  const neuPercent = totalInteractions ? Math.round((neutralCount / totalInteractions) * 100) : 0;
  const negPercent = totalInteractions ? Math.round((negativeCount / totalInteractions) * 100) : 0;

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>📊 Analytics Dashboard</h2>
          <p style={{ margin: 0, color: '#6b7280' }}>Visualize interaction data and AI sentiment trends.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', color: '#374151' }}>View Data For:</label>
          <select 
            value={selectedHCP} 
            onChange={(e) => setSelectedHCP(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white', minWidth: '200px', fontWeight: 'bold' }}
          >
            <option value="All">🌐 System Wide (All HCPs)</option>
            {uniqueHCPNames.map(name => (
              <option key={name} value={name}>👨‍⚕️ {name}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '15px', textTransform: 'uppercase' }}>Total Interactions</h3>
          <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827' }}>{totalInteractions}</span>
        </div>
        <div style={{ flex: 1, backgroundColor: '#f0fdf4', padding: '25px', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#166534', fontSize: '15px', textTransform: 'uppercase' }}>Positive Outcomes</h3>
          <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#15803d' }}>{positiveCount}</span>
        </div>
        <div style={{ flex: 1, backgroundColor: '#fef2f2', padding: '25px', borderRadius: '12px', border: '1px solid #fecaca', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#991b1b', fontSize: '15px', textTransform: 'uppercase' }}>Attention Needed</h3>
          <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#b91c1c' }}>{negativeCount}</span>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 20px 0' }}>AI Sentiment Distribution</h3>
        
        {totalInteractions === 0 ? (
          <p style={{ color: '#6b7280' }}>No data available for this selection.</p>
        ) : (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                <span style={{ color: '#15803d' }}>Positive</span>
                <span>{posPercent}% ({positiveCount})</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '10px', height: '12px' }}>
                <div style={{ width: `${posPercent}%`, backgroundColor: '#22c55e', height: '100%', borderRadius: '10px', transition: 'width 0.5s ease-in-out' }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                <span style={{ color: '#4b5563' }}>Neutral</span>
                <span>{neuPercent}% ({neutralCount})</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '10px', height: '12px' }}>
                <div style={{ width: `${neuPercent}%`, backgroundColor: '#9ca3af', height: '100%', borderRadius: '10px', transition: 'width 0.5s ease-in-out' }}></div>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                <span style={{ color: '#b91c1c' }}>Negative</span>
                <span>{negPercent}% ({negativeCount})</span>
              </div>
              <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '10px', height: '12px' }}>
                <div style={{ width: `${negPercent}%`, backgroundColor: '#ef4444', height: '100%', borderRadius: '10px', transition: 'width 0.5s ease-in-out' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- REUSED DATABASE LOGS COMPONENT --- */}
      <DatabaseLogs />
      
    </div>
  );
};

export default AnalyticsDashboard;