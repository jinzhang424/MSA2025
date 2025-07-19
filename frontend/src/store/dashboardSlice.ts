import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type DashboardTab =
  | 'overview'
  | 'discover-projects'
  | 'create-project'
  | 'my-projects'
  | 'joined-projects'
  | 'applications'
  | 'chat'
  | 'settings';

interface DashboardState {
  activeTab: DashboardTab;
}

const initialState: DashboardState = {
  activeTab: 'overview',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<DashboardTab>) {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = dashboardSlice.actions;
export default dashboardSlice.reducer;