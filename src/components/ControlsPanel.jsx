
import React, { useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openAddFunds, openTimeout, openConfirmLeave, toggleGameMode, toggleShowOpenSeats, setActionButtonsHidden } from '../store/uiSlice';
import useCharacterVideos from '../hooks/useCharacterVideos';
import useGestures from '../hooks/useGestures';
import useChipSystem from '../hooks/useChipSystem';
import useChipDemotion from '../hooks/useChipDemotion';
import useEmojiGesture from '../hooks/useEmojiGesture';
import useOpenSeats from '../hooks/useOpenSeats';

const TOTAL_SEATS = 9;
const DEFAULT_SEATS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const ControlsPanel = () => {
    const dispatch = useDispatch();
    const { showOpenSeats, actionButtonsHidden } = useSelector((state) => state.ui);
    const [characterView, setCharacterView] = useState('1');
    const [gesture, setGesture] = useState('0.00');
    const [betAmount, setBetAmount] = useState('150');
    const [blinds, setBlinds] = useState('none');
    const [showCards, setShowCards] = useState(false);
    // Track which seat checkboxes are checked; initially only the selected character
    const [seatChecked, setSeatChecked] = useState(() => {
        const initial = {};
        for (let i = 1; i <= TOTAL_SEATS; i++) {
            initial[i] = i === 1; // character 1 checked by default
        }
        return initial;
    });

    const seatView = useMemo(() => DEFAULT_SEATS[Number(characterView) - 1] || '1', [characterView]);

    const handleCharacterChange = (e) => {
        const val = e.target.value;
        setCharacterView(val);
        // Reset checkboxes: only the newly selected character is checked (matches legacy behavior)
        const next = {};
        for (let i = 1; i <= TOTAL_SEATS; i++) {
            next[i] = i === Number(val);
        }
        setSeatChecked(next);
    };

    const handleSeatToggle = useCallback((seatNum) => {
        setSeatChecked((prev) => ({ ...prev, [seatNum]: !prev[seatNum] }));
    }, []);

    const handleGestureChange = (e) => {
        const val = e.target.value;
        setGesture(val);
    };

    // ---- Game engine hooks ----
    // Character videos: mount/unmount <video> elements based on seatChecked
    useCharacterVideos(seatChecked, characterView);

    // Gesture system: play character animations
    useGestures(gesture, seatChecked);

    // Chip/bet/pot system
    useChipSystem(Number(betAmount), blinds, seatChecked);

    // Chip z-index demotion for front seats
    useChipDemotion(seatChecked);

    // Emoji → gesture mapping
    useEmojiGesture(setGesture);

    // Open seats (ghost seat overlays at boot)
    useOpenSeats(seatChecked, handleSeatToggle);

    return (
        <div id="controls">
            <div className="controls-row-1 d-flex flex-wrap align-items-center gap-2">
                <label>View:
                    <select id="characterSelector" value={characterView} onChange={handleCharacterChange}>
                        <option value="1">Main View</option>
                        <option value="2">Seat 2</option>
                        <option value="3">Seat 3</option>
                        <option value="4">Seat 4</option>
                        <option value="5">Seat 5</option>
                        <option value="6">Seat 6</option>
                        <option value="7">Seat 7</option>
                        <option value="8">Seat 8</option>
                        <option value="9">Seat 9</option>
                    </select>
                </label>
                <label>Gesture:
                    <select id="gestureSelector" value={gesture} onChange={handleGestureChange}>
                        <option value="0.00">Angry (0:00.00-0:03.00)</option>
                        <option value="3.00">Bet (0:03.50-0:08.50)</option>
                        <option value="7.00">Extra (0:08.50-0:11.00)</option>
                        <option value="9.50">Disbelief (0:11.50-0:17.00)</option>
                        <option value="14.50">Look At Cards (0:17.00-0:22.00)</option>
                        <option value="18.00">Check 1 (0:22.00-0:26.00)</option>
                        <option value="21.50">Happy (0:26.00-0:30.00)</option>
                        <option value="26.00">All-In (0:30.00-0:34.00)</option>
                        <option value="30.50">Idle (0:30.00-0:34.00)</option>
                    </select>
                </label>
                {/* Seat view label */}

                <label>Bet:
                    <input
                        id="betAmount"
                        min="1"
                        placeholder="e.g. 325"
                        step="1"
                        type="number"
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                    />
                </label>
                <label>Blinds:
                    <select id="blindsSelector" value={blinds} onChange={(e) => setBlinds(e.target.value)}>
                        <option value="none">None</option>
                        <option value="sb">Small Blind</option>
                        <option value="bb">Big Blind</option>
                    </select>
                </label>

                <button id="collectBetsBtn">Collect Bets</button>
                <button id="resetPotBtn">Reset Pot</button>
            </div>

            <div className="controls-row-2 d-flex flex-wrap align-items-center gap-2 mt-1">
                <div id="checkboxContainer" className="d-flex flex-wrap gap-2">
                    {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map((seat) => (
                        <label key={seat}>
                            <input
                                type="checkbox"
                                className="seatCheckbox"
                                value={seat}
                                checked={!!seatChecked[seat]}
                                onChange={() => handleSeatToggle(seat)}
                            />
                            {` C${seat} Seat ${seatView}`}
                        </label>
                    ))}
                </div>
            </div>

            <div className="controls-row-3 d-flex flex-wrap align-items-center gap-2 mt-1">
                <label>
                    <input
                        type="checkbox"
                        id="showCardsToggle"
                        checked={showCards}
                        onChange={(e) => setShowCards(e.target.checked)}
                    /> Show Cards
                </label>

                <label>
                    <input
                        type="checkbox"
                        id="toggleOpenSeats"
                        checked={showOpenSeats}
                        onChange={() => dispatch(toggleShowOpenSeats())}
                    /> Hide OPEN on empty seats
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={actionButtonsHidden}
                        onChange={(e) => dispatch(setActionButtonsHidden(e.target.checked))}
                    /> Hide action buttons
                </label>

                <button id="gameModeBtn" type="button" onClick={() => dispatch(toggleGameMode())}>Game Mode</button>
                <button
                    className="buy-btn"
                    id="buyInBtn"
                    type="button"
                    onClick={() => {
                        dispatch(openAddFunds());
                    }}
                >
                    Add Funds
                </button>

                <button
                    className="time-popup"
                    id="timeoutBtn"
                    type="button"
                    onClick={() => {
                        dispatch(openTimeout());
                    }}
                >
                    Timeout
                </button>

                <button
                    className="exit-popup"
                    id="exitBtn"
                    type="button"
                    onClick={() => {
                        dispatch(openConfirmLeave());
                    }}
                >
                    Exit
                </button>
            </div>
        </div>
    );
};

export default ControlsPanel;
