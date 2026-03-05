import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { gameApi } from '../services/api';

// ─── Types ─────────────────────────────────────────────────
export interface GameUser {
  id: number;
  game_id: number;
  user_id: number;
  sitting_position: number;
  buy_in_amount: number;
  current_amount: number;
  status: number;
  peer_id?: string;
  name?: string;
  [key: string]: unknown;
}

export interface Game {
  id: number;
  token: string;
  status: number;
  game_users?: GameUser[];
  [key: string]: unknown;
}

export interface ChatMessage {
  id?: number;
  game_id: number;
  user_id: number;
  message: string;
  name?: string;
  createdAt?: string;
}

export interface CardData {
  [seatIndex: number]: { EPC: string }[];
}

export interface GameDetails {
  gameId: number;
  round?: string;
  pot?: number;
  currentTurn?: number;
  currentBet?: number;
  players?: Record<string, unknown>;
  [key: string]: unknown;
}

interface GameState {
  currentGame: Game | null;
  gameUserId: number | null;
  gameDetails: GameDetails | null;
  playerCards: CardData;
  tableCards: CardData;
  chatMessages: ChatMessage[];
  peerList: Record<string, string>;
  loading: boolean;
  error: string | null;
}

const initialState: GameState = {
  currentGame: null,
  gameUserId: null,
  gameDetails: null,
  playerCards: {},
  tableCards: {},
  chatMessages: [],
  peerList: {},
  loading: false,
  error: null,
};

// ─── Async thunks ──────────────────────────────────────────
export const findOrCreateGame = createAsyncThunk(
  'game/findOrCreate',
  async (data: { token?: string }, { rejectWithValue }) => {
    try {
      const res = await gameApi.findGameOrCreate(data);
      if (!res.data.status) {
        return rejectWithValue(res.data.message || 'Failed to find/create game');
      }
      return res.data.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Network error';
      return rejectWithValue(msg);
    }
  }
);

export const joinGameTable = createAsyncThunk(
  'game/joinTable',
  async (
    data: {
      game_id: number;
      user_id: number;
      sitting_position: number;
      buy_in_amount: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await gameApi.gameUserCreate(data);
      if (!res.data.status) {
        return rejectWithValue(res.data.message || 'Failed to join game');
      }
      return res.data.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Network error';
      return rejectWithValue(msg);
    }
  }
);

export const buyCoins = createAsyncThunk(
  'game/buyCoins',
  async (
    data: { game_user_id: number; amount: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await gameApi.gameBuyCoin(data);
      if (!res.data.status) {
        return rejectWithValue(res.data.message || 'Failed to buy coins');
      }
      return res.data.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Network error';
      return rejectWithValue(msg);
    }
  }
);

export const quitGame = createAsyncThunk(
  'game/quit',
  async (
    data: { game_user_id: number; game_id: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await gameApi.gameUserQuit(data);
      if (!res.data.status) {
        return rejectWithValue(res.data.message || 'Failed to quit game');
      }
      return res.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Network error';
      return rejectWithValue(msg);
    }
  }
);

export const loadChatHistory = createAsyncThunk(
  'game/loadChats',
  async (data: { game_id: number }, { rejectWithValue }) => {
    try {
      const res = await gameApi.gameChats(data);
      if (!res.data.status) {
        return rejectWithValue(res.data.message || 'Failed to load chats');
      }
      return res.data.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Network error';
      return rejectWithValue(msg);
    }
  }
);

// ─── Slice ─────────────────────────────────────────────────
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Socket-driven updates
    setGameDetails(state, action: PayloadAction<GameDetails>) {
      state.gameDetails = action.payload;
    },
    setPlayerCards(state, action: PayloadAction<CardData>) {
      state.playerCards = action.payload;
    },
    setTableCards(state, action: PayloadAction<CardData>) {
      state.tableCards = action.payload;
    },
    setPeerList(state, action: PayloadAction<Record<string, string>>) {
      state.peerList = action.payload;
    },
    addChatMessage(state, action: PayloadAction<ChatMessage>) {
      state.chatMessages.push(action.payload);
    },
    setGameUserId(state, action: PayloadAction<number>) {
      state.gameUserId = action.payload;
    },
    clearGame(state) {
      state.currentGame = null;
      state.gameUserId = null;
      state.gameDetails = null;
      state.playerCards = {};
      state.tableCards = {};
      state.chatMessages = [];
      state.peerList = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Find or create game
    builder
      .addCase(findOrCreateGame.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findOrCreateGame.fulfilled, (state, action) => {
        state.loading = false;
        state.currentGame = action.payload;
      })
      .addCase(findOrCreateGame.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Join game
    builder
      .addCase(joinGameTable.pending, (state) => {
        state.loading = true;
      })
      .addCase(joinGameTable.fulfilled, (state, action) => {
        state.loading = false;
        state.gameUserId = action.payload.id;
      })
      .addCase(joinGameTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Buy coins
    builder
      .addCase(buyCoins.fulfilled, (state, action) => {
        // Update current game user's amount if needed
        if (state.currentGame?.game_users) {
          const gu = state.currentGame.game_users.find(
            (u) => u.id === action.meta.arg.game_user_id
          );
          if (gu) {
            gu.current_amount += action.meta.arg.amount;
          }
        }
      });

    // Quit game
    builder
      .addCase(quitGame.fulfilled, (state) => {
        state.gameUserId = null;
      });

    // Load chat history
    builder
      .addCase(loadChatHistory.fulfilled, (state, action) => {
        state.chatMessages = action.payload || [];
      });
  },
});

export const {
  setGameDetails,
  setPlayerCards,
  setTableCards,
  setPeerList,
  addChatMessage,
  setGameUserId,
  clearGame,
} = gameSlice.actions;

export default gameSlice.reducer;
