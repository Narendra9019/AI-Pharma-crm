import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateFormField } from '../interactionSlice';

const InteractionForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.interaction);

  const handleChange = (field, value) => {
    dispatch(updateFormField({ field, value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Updated payload to include all the new state fields!
        body: JSON.stringify({
          hcpName: formData.hcpName || '',
          designation: formData.designation || '',
          date: formData.date || '',
          time: formData.time || '',
          attendees: formData.attendees || '',
          topicsDiscussed: formData.topicsDiscussed || '',
          sentiment: formData.sentiment || 'Neutral',
          outcomes: formData.outcomes || '',
          followUpActions: formData.followUpActions || '',
          aiSuggestions: formData.aiSuggestions || []
        }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        alert('Interaction logged successfully! Refresh to see it below.');
        window.location.reload(); // Quick way to update the dashboard & logs
      }
    } catch (error) {
      alert('Failed to save interaction.');
    }
  };

  return (
    <div className="interaction-form-details">
      
      {/* AI Confidence Badge (Moved inside the return block so React can render it) */}
      {formData.confidenceScore && (
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '5px', 
          backgroundColor: formData.confidenceScore > 85 ? '#d1fae5' : '#fef3c7', 
          color: formData.confidenceScore > 85 ? '#065f46' : '#92400e', 
          padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', marginBottom: '15px' 
        }}>
          ✨ AI Confidence: {formData.confidenceScore}%
        </div>
      )}

      <div style={{ display: 'flex', gap: '15px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>HCP Name</label>
          <input type="text" value={formData.hcpName || ''} onChange={(e) => handleChange('hcpName', e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Designation</label>
          <input type="text" placeholder="e.g., Oncologist" value={formData.designation || ''} onChange={(e) => handleChange('designation', e.target.value)} />
        </div>
      </div>

      {/* NEW ROW: Date, Time, and Attendees */}
      <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '5px' }}>Date</label>
          <input 
            type="date" 
            value={formData.date || ''}
            onChange={(e) => handleChange('date', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '5px' }}>Time</label>
          <input 
            type="time" 
            value={formData.time || ''}
            onChange={(e) => handleChange('time', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '5px' }}>Attendees</label>
          <input 
            type="text" 
            placeholder="e.g., Dr. Sharma, Nurse Jane"
            value={formData.attendees || ''}
            onChange={(e) => handleChange('attendees', e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '15px' }}>
        <label>Topics Discussed</label>
        <textarea value={formData.topicsDiscussed || ''} onChange={(e) => handleChange('topicsDiscussed', e.target.value)} />
      </div>

      <div className="form-group" style={{ marginTop: '15px' }}>
        <label>Sentiment</label>
        <div className="sentiment-radio-group">
          {['Positive', 'Neutral', 'Negative'].map((s) => (
            <label key={s}>
              <input type="radio" name="sentiment" value={s} checked={formData.sentiment === s} onChange={() => handleChange('sentiment', s)} /> {s}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group" style={{ marginTop: '15px' }}>
        <label>Outcomes</label>
        <textarea value={formData.outcomes || ''} onChange={(e) => handleChange('outcomes', e.target.value)} />
      </div>

      {/* NEW ROW: Follow-Up Actions */}
      <div className="form-group" style={{ marginTop: '15px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#374151', marginBottom: '5px' }}>Follow-Up Actions</label>
        <textarea 
          rows="2"
          placeholder="Next steps to take after this interaction..."
          value={formData.followUpActions || ''}
          onChange={(e) => handleChange('followUpActions', e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
        />
      </div>

      {/* NEW ROW: AI Suggestions Display (Only shows if the AI returned an array of suggestions) */}
      {formData.aiSuggestions && formData.aiSuggestions.length > 0 && (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#166534', marginBottom: '10px', fontWeight: 'bold' }}>
            💡 AI Suggested Next Steps
          </label>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#15803d', fontSize: '14px' }}>
            {formData.aiSuggestions.map((suggestion, index) => (
              <li key={index} style={{ marginBottom: '6px' }}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      <button type="button" onClick={handleSave} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
        Save Interaction
      </button>
    </div>
  );
};

export default InteractionForm;