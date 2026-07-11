import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  hcpName: '',
  designation: '',
  date: new Date().toISOString().split('T')[0],
  time: '',
  attendees: '',
  topicsDiscussed: '',
  sentiment: 'Neutral',
  outcomes: '',
  followUpActions: '',
  aiSuggestions: [],
  voiceNoteSummary:'',
  samplesDistributed: '',
};

export const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      if (state[field] !== undefined) {
        state[field] = value;
      }
    },
    applyAIExtractions: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateFormField, applyAIExtractions } = interactionSlice.actions;
export default interactionSlice.reducer;