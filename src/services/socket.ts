import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3200';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// ─── Emit helpers (client → server) ───────────────────────

// Camera
export const sendCameraControl = (data: unknown) =>
  getSocket().emit('cameraControlSend', data);
export const sendCameraSettings = (data: unknown) =>
  getSocket().emit('cameraSettingsSend', data);

// Poker table join
export const pokerTableGroupJoin = (data: {
  gameId: number;
  userId: number;
  name: string;
}) => getSocket().emit('pokerTableGroupJoin', data);

export const pokerJoinGame = (data: {
  gameId: number;
  userId: number;
  sittingPosition: number;
  buyInAmount: number;
  name: string;
  gameUserId: number;
}) => getSocket().emit('pokerJoinGame', data);

// Poker actions
export const pokerBlindSend = (data: {
  gameId: number;
  userId: number;
  amount: number;
  type: string;
}) => getSocket().emit('pokerBlindSend', data);

export const pokerCallSend = (data: {
  gameId: number;
  userId: number;
  amount: number;
}) => getSocket().emit('pokerCallSend', data);

export const pokerCheckSend = (data: {
  gameId: number;
  userId: number;
}) => getSocket().emit('pokerCheckSend', data);

export const pokerFoldSend = (data: {
  gameId: number;
  userId: number;
}) => getSocket().emit('pokerFoldSend', data);

export const pokerAllInSend = (data: {
  gameId: number;
  userId: number;
  amount: number;
}) => getSocket().emit('pokerAllInSend', data);

export const pokerStraddleSend = (data: {
  gameId: number;
  userId: number;
  amount: number;
}) => getSocket().emit('pokerStraddleSend', data);

// Sitting out / timed out
export const sittingOutSet = (data: {
  gameId: number;
  userId: number;
  sittingOut: boolean;
}) => getSocket().emit('sittingOutSet', data);

export const timedOutPopupSet = (data: {
  gameId: number;
  userId: number;
}) => getSocket().emit('timedOutPopupSet', data);

// Webcam
export const webcamToggleSend = (data: {
  gameId: number;
  userId: number;
  webcamOn: boolean;
}) => getSocket().emit('webcamToggleSend', data);

// Peer
export const pokerPeerIdSend = (data: {
  gameId: number;
  odIndex: number;
  odPeerId: string;
}) => getSocket().emit('pokerPeerIdSend', data);

export const peerIdSend = (data: {
  gameId: number;
  odIndex: number;
  odPeerId: string;
}) => getSocket().emit('peerIdSend', data);

// Chat
export const sendChatMessage = (data: {
  gameId: number;
  userId: number;
  message: string;
  name: string;
}) => getSocket().emit('sendChatMessage', data);

// Gestures
export const gestureSend = (data: unknown) =>
  getSocket().emit('gestureSend', data);

// Reload
export const reloadPageSend = (data: unknown) =>
  getSocket().emit('reloadPageSend', data);

// Reset Game
export const resetGameSend = (data: { gameId: number }) =>
  getSocket().emit('resetGameSend', data);

// ─── Listener names (server → client) ─────────────────────
// Use these with socket.on(EVENT_NAME, callback)
export const SOCKET_EVENTS = {
  // Camera
  CAMERA_CONTROL_RECEIVE: 'cameraControlReceive',
  CAMERA_SETTINGS_RECEIVE: 'cameraSettingsReceive',

  // Game state
  POKER_GAME_DETAILS: 'pokerGameDetails',
  PEER_USER_LIST: 'peerUserList',

  // Cards
  CARD_TABLE_RECEIVE: 'cardTableReceive',
  CARD_PLAYER_RECEIVE: 'cardPlayerReceive',

  // Actions
  POKER_BET_RECEIVE: 'pokerBetReceive',
  POKER_CALL_RECEIVE: 'pokerCallReceive',
  POKER_CHECK_RECEIVE: 'pokerCheckReceive',
  POKER_FOLD_RECEIVE: 'pokerFoldReceive',
  POKER_RAISE_RECEIVE: 'pokerRaiseReceive',

  // Audio / Turn
  POKER_AUDIO: 'pokerAudio',
  POKER_TURN_PLAY: 'pokerTurnPlay',

  // Gesture
  GESTURE_RECEIVE: 'gestureReceive',

  // MQTT
  MQTT_COMPLETE: 'mqttComplete',

  // Webcam
  GET_CAM_DETAILS: 'getCamDetails',

  // Peer
  PEER_ID_RECEIVED: 'peerIdReceived',

  // Dealer
  DEALER_GAME_RESET: 'dealerGameReset',

  // Chat
  RECEIVE_CHAT_MESSAGE: 'receiveChatMessage',

  // System
  RELOAD_PAGE: 'reloadPage',
  GET_SOCKET_ID: 'getSocketId',
} as const;
