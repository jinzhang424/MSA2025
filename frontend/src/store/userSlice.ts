import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type User } from '../types/user';

const initialState: User = {
  name: null,
  email: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<User>
    ) => {
      state.name = action.payload.name;
      state.email = action.payload.email
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.name = null;
      state.email = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;