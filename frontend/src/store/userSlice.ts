import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  name: string | null;
  token: string | null;
}

const initialState: UserState = {
  name: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ name: string; token: string }>
    ) => {
      state.name = action.payload.name;
      state.token = action.payload.token;
    },

    logout: (state) => {
      state.name = null;
      state.token = null;
    },
  },
});

export const { setCredentials, logout } = userSlice.actions;
export default userSlice.reducer;