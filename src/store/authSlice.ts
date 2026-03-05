import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { accountApi } from '../services/api';

// ─── Types ─────────────────────────────────────────────────
export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  phone?: string;
  avatar?: string;
  cash_balance?: number;
  [key: string]: unknown;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ─── Hydrate from localStorage ─────────────────────────────
const storedToken = localStorage.getItem('user_access_token');
const storedUser = localStorage.getItem('user_data');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

// ─── Async thunks ──────────────────────────────────────────
export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await accountApi.login(
        credentials.username,
        credentials.password
      );
      if (!data.status) {
        return rejectWithValue(data.message || 'Login failed');
      }
      // Persist
      localStorage.setItem('user_access_token', data.token);
      localStorage.setItem('user_data', JSON.stringify(data.data));
      return { token: data.token, user: data.data };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Network error';
      return rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (
    payload: {
      first_name: string;
      last_name: string;
      email_address: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await accountApi.register(payload);
      if (!data.status) {
        return rejectWithValue(data.message || 'Registration failed');
      }
      return data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Network error';
      return rejectWithValue(msg);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await accountApi.profileDetails();
      if (!data.status) {
        return rejectWithValue(data.message || 'Failed to load profile');
      }
      // Update stored user data
      localStorage.setItem('user_data', JSON.stringify(data.data));
      return data.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Network error';
      return rejectWithValue(msg);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user_access_token');
      localStorage.removeItem('user_data');
    },
    clearError(state) {
      state.error = null;
    },
    setAuthFromLinkingToken(
      state,
      action: PayloadAction<{ token: string; user: UserData }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem('user_access_token', action.payload.token);
      localStorage.setItem('user_data', JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setAuthFromLinkingToken } =
  authSlice.actions;
export default authSlice.reducer;
