import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// Using the exact action we know exists in your slice!
import { updateFormField } from '../interactionSlice';

const AIAssistantChat = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { text: "Log interaction details here or ask for help.", sender: "ai" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to UI
    const newMessages = [...messages, { text: inputMessage, sender: "user" }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send to backend
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });
      
      const data = await response.json();
      
      // Safely loop through the AI's extracted data and update the form fields
      if (data.form_data) {
        Object.keys(data.form_data).forEach(key => {
          dispatch(updateFormField({ field: key, value: data.form_data[key] }));
        });
      }

      // Add AI response to UI
      setMessages([...newMessages, { text: "Data extracted and form updated! Is there anything else you'd like to add?", sender: "ai" }]);
    } catch (error) {
      console.error("Error communicating with AI:", error);
      setMessages([...newMessages, { text: "Sorry, I encountered an error connecting to the server.", sender: "ai" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      
      {/* Chat Header */}
      <div style={{ padding: '15px 20px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', color: '#374151', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>✨</span> AI Extraction Assistant
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ 
            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: msg.sender === 'user' ? '#2563EB' : '#f3f4f6',
            color: msg.sender === 'user' ? 'white' : '#1f2937',
            padding: '12px 16px',
            borderRadius: msg.sender === 'user' ? '16px 16px 0px 16px' : '16px 16px 16px 0px',
            maxWidth: '80%',
            fontSize: '14px',
            lineHeight: '1.5',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div style={{ alignSelf: 'flex-start', color: '#6b7280', fontSize: '13px', fontStyle: 'italic', padding: '10px' }}>
            AI is thinking...
          </div>
        )}
      </div>

      {/* Modern Input Area */}
      <div style={{ padding: '15px', borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your interaction notes here..."
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              borderRadius: '24px', 
              border: '1px solid #d1d5db', 
              outline: 'none', 
              fontSize: '14px',
              transition: 'border-color 0.2s',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)'
            }}
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim()}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: inputMessage.trim() ? '#2563EB' : '#9ca3af', 
              color: 'white', 
              border: 'none', 
              borderRadius: '24px', 
              cursor: inputMessage.trim() ? 'pointer' : 'not-allowed', 
              fontWeight: 'bold',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            Send <span>🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantChat;