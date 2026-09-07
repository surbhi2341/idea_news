import { createSlice } from '@reduxjs/toolkit';

const getInitialAuth = () => {
  try {
    const token = localStorage.getItem('bh_token');
    const user = JSON.parse(localStorage.getItem('bh_user'));
    return { token, user, isAuthenticated: !!token, loading: false, error: null };
  } catch {
    return { token: null, user: null, isAuthenticated: false, loading: false, error: null };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialAuth(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('bh_token', action.payload.token);
      localStorage.setItem('bh_user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('bh_token');
      localStorage.removeItem('bh_user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('bh_user', JSON.stringify(state.user));
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
