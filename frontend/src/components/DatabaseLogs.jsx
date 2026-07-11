import React, { useEffect, useState } from 'react';

const DatabaseLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/logs')
      .then(res => res.json())
      .then(data => {
        // Safely extract the array whether it's in the new format or old format
        if (data && data.data && Array.isArray(data.data)) {
          setLogs(data.data);
        } else if (Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]); // Force it to be an empty array if something goes wrong
        }
      })
      .catch(err => {
        console.error("Error fetching logs:", err);
        setLogs([]); // Force it to be an empty array on fetch error
      });
  }, []);

  // Ultimate fallback: right before rendering, ensure logs is definitely an array
  const safeLogs = Array.isArray(logs) ? logs : [];

  return (
    <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
      <h2 style={{ marginTop: 0 }}>Interaction Database Logs</h2>
      
      {/* Now we check our guaranteed array: safeLogs */}
      {safeLogs.length === 0 ? <p>No logs found. Save an interaction to see it here!</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>HCP Name</th>
              <th style={{ padding: '10px' }}>Designation</th>
              <th style={{ padding: '10px' }}>Sentiment</th>
              <th style={{ padding: '10px' }}>Topics Discussed</th>
            </tr>
          </thead>
          <tbody>
            {/* Map over the safe array */}
            {safeLogs.map((log) => (
              <tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '10px' }}>{log.id}</td>
                <td style={{ padding: '10px', fontWeight: 'bold' }}>{log.hcp_name}</td>
                <td style={{ padding: '10px' }}>{log.designation || '-'}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ 
                    padding: '3px 8px', borderRadius: '12px', fontSize: '12px',
                    backgroundColor: log.sentiment === 'Positive' ? '#d1fae5' : log.sentiment === 'Negative' ? '#fee2e2' : '#f3f4f6',
                    color: log.sentiment === 'Positive' ? '#065f46' : log.sentiment === 'Negative' ? '#991b1b' : '#374151'
                  }}>
                    {log.sentiment}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{log.topics_discussed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DatabaseLogs;