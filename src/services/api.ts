import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3200/api/';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user_access_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth / Account ────────────────────────────────────────
export const accountApi = {
  login: (username: string, password: string) =>
    api.post('user/account/login', { username, password }),

  register: (data: {
    first_name: string;
    last_name: string;
    email_address: string;
    password: string;
  }) => api.post('user/account/register', data),

  profileDetails: () => api.get('user/account/profile-details'),

  validateSession: () => api.get('user/account/validate-session'),

  logout: () => api.get('user/account/logout'),

  checkLinkingToken: (token: string) =>
    api.post('user/account/check-linking-token', { token }),
};

// ─── Game ──────────────────────────────────────────────────
export const gameApi = {
  findGameOrCreate: (data: { token?: string }) =>
    api.post('user/game/findGameOrCreate', data),

  gameList: (data: { token: string }) =>
    api.post('user/game/game-list', data),

  gameChats: (data: { game_id: number }) =>
    api.post('user/game/game-chats', data),

  gameEmojis: (data: { game_id: number }) =>
    api.post('user/game/game-emojis', data),

  gameUserCreate: (data: {
    game_id: number;
    user_id: number;
    sitting_position: number;
    buy_in_amount: number;
  }) => api.post('user/game/game-user-create', data),

  gameBuyCoin: (data: { game_user_id: number; amount: number }) =>
    api.post('user/game/game-buy-coin', data),

  gameUserQuit: (data: { game_user_id: number; game_id: number }) =>
    api.post('user/game/game-user-quit', data),

  gamePeerUpdate: (data: { game_user_id: number; peer_id: string }) =>
    api.post('user/game/game-peer-update', data),

  gameSittingUpdate: (data: {
    game_user_id: number;
    sitting_position: number;
  }) => api.post('user/game/game-sitting-update', data),
};

export default api;
