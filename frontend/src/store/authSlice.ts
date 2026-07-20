import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { username: string } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: { username: string } }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
