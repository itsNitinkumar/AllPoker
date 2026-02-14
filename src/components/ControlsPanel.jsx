
import React, { useState } from 'react';

const ControlsPanel = () => {
    const [characterView, setCharacterView] = useState('1');
    const [gesture, setGesture] = useState('0.00');
    const [betAmount, setBetAmount] = useState('150');
    const [blinds, setBlinds] = useState('none');
    const [showCards, setShowCards] = useState(false);

    const handleCharacterChange = (e) => {
        const val = e.target.value;
        setCharacterView(val);
        // Sync with legacy jQuery logic
        if (window.updateCharacterView) {
            window.updateCharacterView();
        }
    };

    const handleGestureChange = (e) => {
        const val = e.target.value;
        setGesture(val);
        // Sync with legacy jQuery logic
        if (window.triggerGesture) {
            window.triggerGesture();
        }
    };

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
                {/* Script will inject 'Control v' here */}

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
                <div id="checkboxContainer" className="d-flex flex-wrap gap-2"></div>
                {/* Script will inject checkboxes here */}
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

                {/* Script will inject more buttons here */}

                <button id="gameModeBtn" type="button">Game Mode</button>
                <button className="buy-btn" id="buyInBtn" type="button">Add Funds</button>
                <button className="time-popup" id="timeoutBtn" type="button">Timeout</button>
                <button className="exit-popup" id="exitBtn" type="button">Exit</button>
            </div>
        </div>
    );
};

export default ControlsPanel;
