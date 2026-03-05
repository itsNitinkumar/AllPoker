import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  SOCKET_EVENTS,
} from '../services/socket';
import {
  setGameDetails,
  setPlayerCards,
  setTableCards,
  setPeerList,
  addChatMessage,
} from '../store/gameSlice';

/**
 * Central socket hook. Mount this once (e.g. in App or PokerInterface).
 * It auto-connects when the user is authenticated and registers all
 * server→client listeners, dispatching into Redux.
 */
const useSocket = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const connected = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      connected.current = false;
      return;
    }

    const socket = connectSocket();

    if (connected.current) return;
    connected.current = true;

    // ── Game state ──────────────────────────────────────────
    socket.on(SOCKET_EVENTS.POKER_GAME_DETAILS, (data: unknown) => {
      dispatch(setGameDetails(data as ReturnType<typeof setGameDetails>['payload']));
    });

    socket.on(SOCKET_EVENTS.PEER_USER_LIST, (data: unknown) => {
      dispatch(setPeerList(data as Record<string, string>));
    });

    // ── Cards ───────────────────────────────────────────────
    socket.on(SOCKET_EVENTS.CARD_PLAYER_RECEIVE, (data: unknown) => {
      dispatch(setPlayerCards(data as ReturnType<typeof setPlayerCards>['payload']));
    });

    socket.on(SOCKET_EVENTS.CARD_TABLE_RECEIVE, (data: unknown) => {
      dispatch(setTableCards(data as ReturnType<typeof setTableCards>['payload']));
    });

    // ── Chat ────────────────────────────────────────────────
    socket.on(SOCKET_EVENTS.RECEIVE_CHAT_MESSAGE, (data: unknown) => {
      dispatch(addChatMessage(data as ReturnType<typeof addChatMessage>['payload']));
    });

    // ── Audio cues ──────────────────────────────────────────
    socket.on(SOCKET_EVENTS.POKER_AUDIO, (data: unknown) => {
      // Play audio cue (check, fold, chips, etc.)
      const audioData = data as { sound?: string };
      if (audioData.sound) {
        try {
          const audio = new Audio(`/audio/${audioData.sound}.mp3`);
          audio.volume = 0.5;
          audio.play().catch(() => {});
        } catch {
          // ignore audio errors
        }
      }
    });

    // ── Reload page (server-initiated) ──────────────────────
    socket.on(SOCKET_EVENTS.RELOAD_PAGE, () => {
      window.location.reload();
    });

    // ── Dealer reset ────────────────────────────────────────
    socket.on(SOCKET_EVENTS.DEALER_GAME_RESET, () => {
      // Game was reset by dealer — could trigger a state refresh
      console.log('[Socket] Dealer reset game');
    });

    // ── Poker action receives (for UI animations) ──────────
    socket.on(SOCKET_EVENTS.POKER_BET_RECEIVE, (data: unknown) => {
      console.log('[Socket] Bet received', data);
      // Dispatch custom event for UI components to animate
      window.dispatchEvent(
        new CustomEvent('poker:bet', { detail: data })
      );
    });

    socket.on(SOCKET_EVENTS.POKER_CALL_RECEIVE, (data: unknown) => {
      console.log('[Socket] Call received', data);
      window.dispatchEvent(
        new CustomEvent('poker:call', { detail: data })
      );
    });

    socket.on(SOCKET_EVENTS.POKER_CHECK_RECEIVE, (data: unknown) => {
      console.log('[Socket] Check received', data);
      window.dispatchEvent(
        new CustomEvent('poker:check', { detail: data })
      );
    });

    socket.on(SOCKET_EVENTS.POKER_FOLD_RECEIVE, (data: unknown) => {
      console.log('[Socket] Fold received', data);
      window.dispatchEvent(
        new CustomEvent('poker:fold', { detail: data })
      );
    });

    socket.on(SOCKET_EVENTS.POKER_RAISE_RECEIVE, (data: unknown) => {
      console.log('[Socket] Raise received', data);
      window.dispatchEvent(
        new CustomEvent('poker:raise', { detail: data })
      );
    });

    socket.on(SOCKET_EVENTS.POKER_TURN_PLAY, (data: unknown) => {
      console.log('[Socket] Turn play', data);
      window.dispatchEvent(
        new CustomEvent('poker:turnPlay', { detail: data })
      );
    });

    // ── Gesture receive ─────────────────────────────────────
    socket.on(SOCKET_EVENTS.GESTURE_RECEIVE, (data: unknown) => {
      window.dispatchEvent(
        new CustomEvent('poker:gesture', { detail: data })
      );
    });

    // ── MQTT data ───────────────────────────────────────────
    socket.on(SOCKET_EVENTS.MQTT_COMPLETE, (data: unknown) => {
      window.dispatchEvent(
        new CustomEvent('poker:mqtt', { detail: data })
      );
    });

    // ── Webcam / Cam details ────────────────────────────────
    socket.on(SOCKET_EVENTS.GET_CAM_DETAILS, (data: unknown) => {
      window.dispatchEvent(
        new CustomEvent('poker:camDetails', { detail: data })
      );
    });

    // ── Camera control/settings ─────────────────────────────
    socket.on(SOCKET_EVENTS.CAMERA_CONTROL_RECEIVE, (data: unknown) => {
      window.dispatchEvent(
        new CustomEvent('poker:cameraControl', { detail: data })
      );
    });
    socket.on(SOCKET_EVENTS.CAMERA_SETTINGS_RECEIVE, (data: unknown) => {
      window.dispatchEvent(
        new CustomEvent('poker:cameraSettings', { detail: data })
      );
    });

    // ── Peer ID received ────────────────────────────────────
    socket.on(SOCKET_EVENTS.PEER_ID_RECEIVED, (data: unknown) => {
      window.dispatchEvent(
        new CustomEvent('poker:peerId', { detail: data })
      );
    });

    // ── Socket ID ───────────────────────────────────────────
    socket.on(SOCKET_EVENTS.GET_SOCKET_ID, (data: unknown) => {
      console.log('[Socket] My socket ID:', data);
    });

    return () => {
      const s = getSocket();
      // Remove all listeners for our events
      Object.values(SOCKET_EVENTS).forEach((event) => {
        s.off(event);
      });
      connected.current = false;
    };
  }, [isAuthenticated, dispatch]);
};

export default useSocket;
