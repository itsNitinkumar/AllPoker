import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import uiReducer from './uiSlice';
import authReducer from './authSlice';
import gameReducer from './gameSlice';

const store = configureStore({
    reducer: {
        ui: uiReducer,
        auth: authReducer,
        game: gameReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed dispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
