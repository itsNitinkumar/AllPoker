import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  findOrCreateGame,
  loadChatHistory,
  setGameUserId,
} from '../store/gameSlice';
import { fetchProfile } from '../store/authSlice';
import { pokerTableGroupJoin } from '../services/socket';

/**
 * Manages the game lifecycle:
 * 1. On auth → fetch profile + find/create game
 * 2. On game found → join socket room
 * 3. On game found → load chat history
 *
 * Mount once alongside useSocket (e.g. in PokerInterface or App).
 */
const useGameConnection = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const currentGame = useSelector((state) => state.game.currentGame);
  const joined = useRef(false);

  // Step 1: fetch profile when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, dispatch]);

  // Step 2: find or create a game once we have user data
  useEffect(() => {
    if (isAuthenticated && user && !currentGame) {
      dispatch(findOrCreateGame({ token: '123123123' }));
    }
  }, [isAuthenticated, user, currentGame, dispatch]);

  // Step 3: join the socket room + load chats once game is available
  useEffect(() => {
    if (currentGame && user && !joined.current) {
      joined.current = true;

      // Join the socket room for this game
      pokerTableGroupJoin({
        gameId: currentGame.id,
        userId: user.id,
        name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      });

      // Load existing chat messages
      dispatch(loadChatHistory({ game_id: currentGame.id }));
    }
  }, [currentGame, user, dispatch]);

  // Cleanup on unmount / logout
  useEffect(() => {
    if (!isAuthenticated) {
      joined.current = false;
    }
  }, [isAuthenticated]);
};

export default useGameConnection;
