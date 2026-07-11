import React, { useEffect, useState } from 'react';

const DashboardSummary = () => {
  // Initialize to 0 so it never starts as undefined
  const [totalLogs, setTotalLogs] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8000/api/logs')
      .then(res => res.json())
      .then(data => {
        // Bulletproof check: Look at the actual data array regardless of format
        if (data && data.data && Array.isArray(data.data)) {
          setTotalLogs(data.data.length); 
        } else if (Array.isArray(data)) {
          setTotalLogs(data.length);
        } else if (data && typeof data.total_records === 'number') {
          setTotalLogs(data.total_records);
        } else {
          setTotalLogs(0); // Fallback to 0 if the data is completely unrecognizable 
        }
      })
      .catch(err => {
        console.error("Error fetching dashboard logs:", err);
        setTotalLogs(0); // Fallback to 0 on network error
      });
  }, []);

  return (
    <div className="dashboard-summary">
      <div style={{ backgroundColor: '#7C3AED', color: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>AI-First CRM HCP Module</h1>
        <p style={{ margin: '5px 0 0 0' }}>Healthcare Professional Interaction Logging</p>
      </div>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
          <p style={{ margin: 0, color: '#6b7280' }}>Total DB Logs</p>
          {/* Added minHeight to ensure the card doesn't collapse if data is loading */}
          <h2 style={{ margin: '5px 0', color: '#2563EB', minHeight: '35px' }}>
            {totalLogs}
          </h2>
          <small style={{ color: '#10B981' }}>Live from SQLite</small>
        </div>
        <div style={{ flex: 1, padding: '20px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
          <p style={{ margin: 0, color: '#6b7280' }}>LangGraph State</p>
          <h2 style={{ margin: '5px 0', color: '#9333EA', minHeight: '35px' }}>Active</h2>
          <small style={{ color: '#10B981' }}>Agent connected</small>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;