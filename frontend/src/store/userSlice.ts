import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type User } from '../types/dashboard';

const initialState: User = {
  id: 0,
  firstName: '',
  lastName: '',
  email: '',
  bio: '',
  token: '',
  skills: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<User>
    ) => {
      state.id = action.payload.id;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.email = action.payload.email;
      state.bio = action.payload.bio;
      state.token = action.payload.token;
      state.skills = action.payload.skills;
    },

    logout: (state) => {
      state.id = 0;
      state.firstName = '';
      state.lastName = '';
      state.email = '';
      state.bio = '';
      state.token = '';
      state.skills = [];
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;