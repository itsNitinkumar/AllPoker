import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        addFundsOpen: false,
        timeoutOpen: false,
        confirmLeaveOpen: false,
        menuOpen: false,
        gameModeActive: false,
        emojiPanelOpen: false,
        emojiActiveSource: null as string | null, // 'chat' | 'proof' | 'support' | null
        videoPanelOpen: false,
        handRankOpen: false,
        activeRoom: 1,
        showOpenSeats: true,
        actionButtonsHidden: false,
    },
    reducers: {
        openAddFunds(state) {
            state.addFundsOpen = true;
        },
        closeAddFunds(state) {
            state.addFundsOpen = false;
        },
        openTimeout(state) {
            state.timeoutOpen = true;
        },
        closeTimeout(state) {
            state.timeoutOpen = false;
        },
        openConfirmLeave(state) {
            state.confirmLeaveOpen = true;
        },
        closeConfirmLeave(state) {
            state.confirmLeaveOpen = false;
        },
        toggleMenu(state) {
            state.menuOpen = !state.menuOpen;
        },
        setMenuOpen(state, action: PayloadAction<boolean>) {
            state.menuOpen = action.payload;
        },
        toggleGameMode(state) {
            state.gameModeActive = !state.gameModeActive;
            // Auto-close the controls menu when entering game mode
            // so it doesn't cover the game header
            if (state.gameModeActive) {
                state.menuOpen = false;
            }
        },
        toggleEmojiPanel(state) {
            state.emojiPanelOpen = !state.emojiPanelOpen;
            if (!state.emojiPanelOpen) {
                state.emojiActiveSource = null;
            }
        },
        openEmojiPanel(state, action: PayloadAction<string>) {
            state.emojiPanelOpen = true;
            state.emojiActiveSource = action.payload;
        },
        closeEmojiPanel(state) {
            state.emojiPanelOpen = false;
            state.emojiActiveSource = null;
        },
        toggleVideoPanel(state) {
            state.videoPanelOpen = !state.videoPanelOpen;
        },
        toggleHandRank(state) {
            state.handRankOpen = !state.handRankOpen;
        },
        closeHandRank(state) {
            state.handRankOpen = false;
        },
        setActiveRoom(state, action: PayloadAction<number>) {
            state.activeRoom = action.payload;
        },
        toggleShowOpenSeats(state) {
            state.showOpenSeats = !state.showOpenSeats;
        },
        setActionButtonsHidden(state, action: PayloadAction<boolean>) {
            state.actionButtonsHidden = action.payload;
        },
    },
});

export const {
    openAddFunds,
    closeAddFunds,
    openTimeout,
    closeTimeout,
    openConfirmLeave,
    closeConfirmLeave,
    toggleMenu,
    setMenuOpen,
    toggleGameMode,
    toggleEmojiPanel,
    openEmojiPanel,
    closeEmojiPanel,
    toggleVideoPanel,
    toggleHandRank,
    closeHandRank,
    setActiveRoom,
    toggleShowOpenSeats,
    setActionButtonsHidden,
} = uiSlice.actions;

export default uiSlice.reducer;
