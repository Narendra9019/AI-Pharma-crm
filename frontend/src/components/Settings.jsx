import React, { useState, useEffect } from 'react';

const Settings = () => {
  // 1. API Key State
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // 2. Security Toggles State
  const [aesEnabled, setAesEnabled] = useState(true);
  const [blockchainEnabled, setBlockchainEnabled] = useState(false);
  const [anonymizeData, setAnonymizeData] = useState(true);

  // 3. UI Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved settings when component mounts
  useEffect(() => {
    const savedKey = localStorage.getItem('groqApiKey');
    if (savedKey) setApiKey(savedKey);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  // Handle saving API Key
  const handleSaveKey = () => {
    localStorage.setItem('groqApiKey', apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Handle Dark Mode Toggle
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  // Reusable toggle switch UI component
  const ToggleSwitch = ({ label, description, checked, onChange }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #e5e7eb' }}>
      <div>
        <div style={{ fontWeight: '600' }}>{label}</div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{description}</div>
      </div>
      <button 
        onClick={onChange}
        style={{
          width: '50px', height: '26px', borderRadius: '15px', cursor: 'pointer', position: 'relative', border: 'none',
          backgroundColor: checked ? '#10B981' : '#d1d5db',
          transition: 'background-color 0.3s'
        }}
      >
        <div style={{
          width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px',
          left: checked ? '27px' : '3px', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
      </button>
    </div>
  );

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px' }}>⚙️ System Settings</h2>

      {/* API Configuration Section */}
      <div className="settings-card" style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <h3>API Configuration</h3>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Configure your Large Language Model endpoints.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter Groq API Key (gsk_...)"
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
          />
          <button 
            onClick={handleSaveKey}
            style={{ padding: '10px 20px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isSaved ? 'Saved! ✓' : 'Save Key'}
          </button>
        </div>
      </div>

      {/* Data Security Section */}
      <div className="settings-card" style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '20px' }}>
        <h3>Security & Privacy</h3>
        <ToggleSwitch 
          label="AES-256 Database Encryption" 
          description="Encrypt patient and HCP data at rest in the SQLite database."
          checked={aesEnabled} 
          onChange={() => setAesEnabled(!aesEnabled)} 
        />
        <ToggleSwitch 
          label="Blockchain-Backed Sync" 
          description="Enable immutable ledger logging for healthcare information exchange."
          checked={blockchainEnabled} 
          onChange={() => setBlockchainEnabled(!blockchainEnabled)} 
        />
        <ToggleSwitch 
          label="Anonymize Patient Data" 
          description="Automatically scrub PHI (Protected Health Information) before AI processing."
          checked={anonymizeData} 
          onChange={() => setAnonymizeData(!anonymizeData)} 
        />
      </div>

      {/* UI Preferences Section */}
      <div className="settings-card" style={{ backgroundColor: 'white', padding: '25px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <h3>Appearance</h3>
        <ToggleSwitch 
          label="Dark Mode" 
          description="Toggle the application theme for low-light environments."
          checked={isDarkMode} 
          onChange={toggleDarkMode} 
        />
      </div>
    </div>
  );
};

export default Settings;