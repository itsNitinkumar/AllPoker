import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { gameApi } from '../services/api';
import { findOrCreateGame, setGameDetails, clearGame } from '../store/gameSlice';
import { joinGameTable } from '../store/gameSlice';

const LobbyPage: React.FC = () => {

  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const [games, setGames] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const fetchGames = () => {
    if (!user) return;
    setLoading(true);
    setError('');
    gameApi.gameList({ token: '123123123' })
      .then((res) => {
        if (res.data.status) {
          setGames(res.data.data);
        } else {
          setError(res.data.message || 'No games found');
        }
      })
      .catch(() => setError('Failed to load games'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGames();
    // eslint-disable-next-line
  }, [user]);

  const handleJoin = (game: any) => {
    dispatch(clearGame());
    dispatch(findOrCreateGame({ token: game.token }))
      .then((res: any) => {
        if (res && res.payload && res.payload.id) {
          // You may want to choose a sitting_position and buy_in_amount dynamically
          const sitting_position = 1;
          const buy_in_amount = 500;
          dispatch(
            joinGameTable({
              game_id: res.payload.id,
              user_id: game.user_id || (user && user.id),
              sitting_position,
              buy_in_amount,
            })
          ).then(() => {
            navigate('/game');
          });
        } else {
          navigate('/game'); // fallback
        }
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Lobby</h2>
      <p style={styles.subtitle}>Select a table to join:</p>
      <button style={styles.refreshBtn} onClick={fetchGames} disabled={loading}>
        {loading ? 'Refreshing…' : 'Refresh List'}
      </button>
      {loading && <div style={styles.loading}><span className="loader" /> Loading games…</div>}
      {error && <div style={styles.error}>{error}</div>}
      <ul style={styles.list}>
        {games.length === 0 && !loading && !error && (
          <div style={styles.empty}>No tables available.</div>
        )}
        {games.map((game) => (
          <li key={game.id} style={styles.item}>
            <div style={styles.gameInfo}>
              <strong>Table #{game.id}</strong> &nbsp; <span style={styles.token}>Token: {game.token}</span>
              <br />
              <span>Players: {game.game_users?.length || 0} / 9</span>
              {game.stakes && (
                <span style={styles.stakes}> | Stakes: {game.stakes}</span>
              )}
              {game.buy_in && (
                <span style={styles.stakes}> | Buy-in: {game.buy_in}</span>
              )}
              <br />
              {game.game_users?.length > 0 && (
                <span style={styles.players}>
                  Players: {game.game_users.map((u: any) => u.name || u.user_id).join(', ')}
                </span>
              )}
              {game.status && (
                <span style={styles.status}>Status: {game.status === 1 ? 'Active' : 'Waiting'}</span>
              )}
            </div>
            <button style={styles.joinBtn} onClick={() => handleJoin(game)}>
              Join Table
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 540,
    margin: '40px auto',
    padding: 32,
    background: 'rgba(0,0,0,0.8)',
    borderRadius: 18,
    color: '#fff',
    fontFamily: 'Segoe UI, system-ui, sans-serif',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  },
  title: {
    fontSize: 34,
    fontWeight: 700,
    marginBottom: 8,
    color: '#e2b96f',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 18,
    color: 'rgba(255,255,255,0.7)',
  },
  refreshBtn: {
    background: 'linear-gradient(135deg, #e2b96f, #c9952e)',
    color: '#222',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 15,
    marginBottom: 18,
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
  },
  loading: {
    color: '#e2b96f',
    marginBottom: 16,
    fontWeight: 500,
  },
  error: {
    color: '#ff6b6b',
    marginBottom: 16,
    fontWeight: 500,
  },
  empty: {
    color: '#bbb',
    margin: '32px 0',
    textAlign: 'center',
    fontSize: 17,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    padding: '18px 22px',
    marginBottom: 18,
    boxShadow: '0 2px 12px rgba(0,0,0,0.13)',
    transition: 'background 0.2s',
  },
  gameInfo: {
    flex: 1,
    fontSize: 16,
    lineHeight: 1.5,
  },
  token: {
    color: '#e2b96f',
    fontWeight: 500,
    fontSize: 15,
  },
  stakes: {
    color: '#e2b96f',
    marginLeft: 8,
    fontSize: 15,
  },
  players: {
    color: '#b3e2ff',
    fontSize: 14,
    marginLeft: 4,
  },
  status: {
    color: '#e2b96f',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 500,
  },
  joinBtn: {
    background: 'linear-gradient(135deg, #e2b96f, #c9952e)',
    color: '#222',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 15,
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    marginLeft: 18,
  },
};
export default LobbyPage;
