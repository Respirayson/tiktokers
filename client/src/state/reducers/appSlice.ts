import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    selectedButton: 'Data',
    dataBody: [],
    displayName: '',
  },
  reducers: {
    setSelectedButton(state, action) {
      state.selectedButton = action.payload;
    },
    setDataBody(state, action) {
      state.dataBody = action.payload;
    },
    setDisplayName(state, action) {
      state.displayName = action.payload;
    },
  },
});

export const { setSelectedButton, setDataBody, setDisplayName } = appSlice.actions;

export default appSlice.reducer;