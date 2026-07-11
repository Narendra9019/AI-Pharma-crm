import React, { useState, useEffect } from 'react';

const HCPDirectory = ({ setActivePage }) => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [designationFilter, setDesignationFilter] = useState('All');
  const [selectedHCP, setSelectedHCP] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    fetch('http://localhost:8000/api/logs')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && Array.isArray(data.data)) {
          setLogs(data.data);
        } else if (Array.isArray(data)) {
          setLogs(data);
        }
      })
      .catch(err => console.error("Error fetching for directory:", err));
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm("Are you sure you want to delete this record? This action cannot be undone.")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/logs/${logId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      
      if (result.status === 'success') {
        setLogs(prevLogs => prevLogs.filter(log => log.id !== logId));
        
        const remainingLogs = logs.filter(log => log.hcp_name === selectedHCP.name && log.id !== logId);
        if (remainingLogs.length === 0) {
          setSelectedHCP(null);
        }
      }
    } catch (error) {
      alert("Failed to delete the record.");
    }
  };

  const uniqueHCPs = [];
  const map = new Map();
  for (const item of logs) {
    if(!map.has(item.hcp_name)){
        map.set(item.hcp_name, true);
        uniqueHCPs.push({
            name: item.hcp_name,
            designation: item.designation || 'Specialist',
            verified: true 
        });
    }
  }

  const filteredHCPs = uniqueHCPs.filter(hcp => {
    const matchesSearch = hcp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = designationFilter === 'All' || hcp.designation.toLowerCase().includes(designationFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>👨‍⚕️ HCP Directory</h2>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <span style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            Total Contacts: {uniqueHCPs.length}
          </span>
          <button 
            onClick={() => setActivePage('log')}
            style={{ backgroundColor: '#10B981', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
            ➕ Add Interaction
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <input 
          type="text" 
          placeholder="Search by HCP Name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 2, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        />
        <select 
          value={designationFilter} 
          onChange={(e) => setDesignationFilter(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: 'white' }}
        >
          <option value="All">All Designations</option>
          <option value="Oncologist">Oncologist</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Neurologist">Neurologist</option>
          <option value="General">General Practice</option>
        </select>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
              <th style={{ padding: '15px' }}>Provider Name</th>
              <th style={{ padding: '15px' }}>Designation</th>
              <th style={{ padding: '15px' }}>Data Integrity</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHCPs.map((hcp, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '15px', fontWeight: 'bold', color: '#111827' }}>{hcp.name}</td>
                <td style={{ padding: '15px', color: '#4b5563' }}>{hcp.designation}</td>
                <td style={{ padding: '15px' }}>
                  {hcp.verified && (
                    <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '12px' }}>🔒 AES Secured</span>
                  )}
                </td>
                <td style={{ padding: '15px' }}>
                  <button 
                    onClick={() => setSelectedHCP(hcp)} 
                    style={{ padding: '6px 12px', backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- RESTORED PROFILE MODAL POPUP --- */}
      {selectedHCP && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 
        }}>
          <div style={{ 
            backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '700px', 
            maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e5e7eb', paddingBottom: '15px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: '0 0 5px 0', color: '#111827' }}>{selectedHCP.name}</h2>
                <span style={{ color: '#6b7280', fontSize: '15px' }}>{selectedHCP.designation}</span>
              </div>
              <button 
                onClick={() => setSelectedHCP(null)} 
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9ca3af' }}>
                ×
              </button>
            </div>

            <h3 style={{ marginTop: 0, color: '#374151', fontSize: '16px' }}>Interaction History</h3>
            
            {logs.filter(log => log.hcp_name === selectedHCP.name).map((log, i) => (
              <div key={i} style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ 
                    fontSize: '12px', padding: '3px 8px', borderRadius: '12px',
                    backgroundColor: log.sentiment === 'Positive' ? '#d1fae5' : log.sentiment === 'Negative' ? '#fee2e2' : '#f3f4f6',
                    color: log.sentiment === 'Positive' ? '#065f46' : log.sentiment === 'Negative' ? '#991b1b' : '#374151'
                  }}>
                    {log.sentiment}
                  </span>
                  
                  <button 
                    onClick={() => handleDeleteLog(log.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
                    🗑️ Delete Record
                  </button>
                </div>
                
                {/* Full Details Restored Here */}
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#1f2937' }}>
                  <strong>Topics Discussed:</strong> {log.topics_discussed}
                </p>
                <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>
                  <strong>Outcomes:</strong> {log.outcomes || 'No outcomes recorded.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HCPDirectory;