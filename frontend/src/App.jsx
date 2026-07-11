import React, { useState } from 'react';
import LogInteractionScreen from './components/LogInteractionScreen';
import Sidebar from './components/Sidebar';
import HCPDirectory from './components/HCPDirectory';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Settings from './components/Settings';

function App() {
  // We set the default active page to 'log'
  const [activePage, setActivePage] = useState('log');

  return (
    <div style={{ display: 'flex' }}>
      {/* Pass the state to the Sidebar so it knows which button to highlight */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      <div style={{ marginLeft: '250px', width: '100%', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
        
        {/* If 'log' is active, show your main screen */}
        {activePage === 'log' && <LogInteractionScreen />}
        
        {/* If 'dashboard' is active, show a placeholder screen */}
        {activePage === 'dashboard' && <AnalyticsDashboard />}

        {/* If 'directory' is active */}
        {activePage === 'directory' && <HCPDirectory setActivePage={setActivePage} />}

        {/* If 'settings' is active */}
        {activePage === 'settings' && <Settings />}

      </div>
    </div>
  );
}

export default App;