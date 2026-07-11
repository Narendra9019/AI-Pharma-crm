import React from 'react';
import InteractionForm from './InteractionForm'; 
import AIAssistantChat from './AIAssistantChat'; 
import DashboardSummary from './DashboardSummary';
import './LogInteractionScreen.css'; 

const LogInteractionScreen = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <DashboardSummary />
      
      <div className="log-screen-container">
        <div className="form-column">
          <h2>Log HCP Interaction</h2>
          <InteractionForm />
        </div>
        <div className="chat-column">
          <AIAssistantChat />
        </div>
      </div>
    </div>
  );
};

export default LogInteractionScreen;