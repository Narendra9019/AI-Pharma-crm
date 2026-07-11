import React from 'react';

const Sidebar = ({ activePage, setActivePage }) => {
  // A clean array of our menu items
  const navItems = [
    { id: 'log', icon: '📄', label: 'Log Interaction' },
    { id: 'dashboard', icon: '📊', label: 'Dashboard Analytics' },
    { id: 'directory', icon: '👨‍⚕️', label: 'HCP Directory' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <div style={{ 
      width: '250px', 
      backgroundColor: '#1f2937', 
      color: 'white', 
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div style={{ padding: '20px', fontSize: '20px', fontWeight: 'bold', borderBottom: '1px solid #374151' }}>
        Pharma CRM
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', padding: '10px 0' }}>
        {navItems.map(item => (
          <div 
            key={item.id}
            onClick={() => setActivePage(item.id)} // Changes the screen when clicked
            style={{ 
              padding: '15px 20px', 
              cursor: 'pointer',
              display: 'flex',
              gap: '10px',
              transition: 'background-color 0.2s',
              // Dynamically highlight the active tab
              color: activePage === item.id ? '#e5e7eb' : '#9ca3af', 
              backgroundColor: activePage === item.id ? '#374151' : 'transparent', 
              borderLeft: activePage === item.id ? '4px solid #8b5cf6' : '4px solid transparent' 
            }}
          >
            <span>{item.icon}</span> {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;