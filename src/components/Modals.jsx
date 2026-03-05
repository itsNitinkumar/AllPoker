
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openConfirmLeave, closeTimeout } from '../store/uiSlice';
import { buyCoins, quitGame, clearGame } from '../store/gameSlice';
import cross from '../assets/images/cross.svg';
import alertIcon from '../assets/images/alert-icon.svg';

export const AddFundsModal = ({ onClose }) => {

    const dispatch = useDispatch();
    const [fundAmount, setFundAmount] = useState(550); // price-range5: 0–2000
    const user = useSelector((state) => state.auth.user);
    const gameUserId = useSelector((state) => state.game.gameUserId);
    console.log('Current gameUserId:', gameUserId);
    const [depositing, setDepositing] = useState(false);
    const [feedback, setFeedback] = useState('');

    // Slider percentage for handle position (relative to min/max)
    const minAmount = 100;
    const maxAmount = 2000;
    const pct = ((fundAmount - minAmount) / (maxAmount - minAmount) * 100);

    // Validate deposit amount
    const isValidAmount = fundAmount >= minAmount && fundAmount <= maxAmount;

    const handleDeposit = async () => {
        if (!gameUserId || depositing || !isValidAmount) return;
        setDepositing(true);
        setFeedback('');
        try {
            console.log('About to call gameApi.gameBuyCoin', gameApi);
            if (!gameApi || typeof gameApi.gameBuyCoin !== 'function') {
                setFeedback('gameApi.gameBuyCoin is not defined or not a function');
                console.error('gameApi.gameBuyCoin is not defined or not a function', gameApi);
                setDepositing(false);
                return;
            }
            const apiResult = await gameApi.gameBuyCoin({ game_user_id: gameUserId, amount: fundAmount });
            console.log('Direct API result:', apiResult);
            if (apiResult.data && apiResult.data.status) {
                setFeedback('Funds added successfully! (Direct API)');
            } else {
                setFeedback('Direct API failed: ' + (apiResult.data?.message || JSON.stringify(apiResult)));
            }
        } catch (err) {
            setFeedback('Direct API error: ' + (err?.message || err));
            console.error('Direct API error:', err);
        }
        setDepositing(false);
    };

    return (
        <div className="camera-setting-main enter-buy-main d-block">
            <div className="main-bg">
                <div className="text-box">
                    <h4>Add Funds</h4>
                </div>
                <div className="price-list">
                    <ul className="d-flex align-items-center justify-content-center">
                        <li>{minAmount}</li>
                        <li className="price-lst2"><span id="min-price5">{fundAmount}</span></li>
                        <li>{maxAmount}</li>
                    </ul>
                    <div className="d-flex align-items-center price-main">
                        <span>Min</span>
                        <div id="price-range5" className="ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content" style={{ position: 'relative', height: 24 }}>
                            <div
                                className="ui-slider-range ui-corner-all ui-widget-header ui-slider-range-min"
                                style={{ width: `${pct}%`, height: 6, background: '#e2b96f', position: 'absolute', top: 9, left: 0, borderRadius: 3 }}
                            ></div>
                            <input
                                type="range"
                                min={minAmount}
                                max={maxAmount}
                                value={fundAmount}
                                onChange={(e) => {
                                    setFundAmount(Number(e.target.value));
                                    setFeedback('');
                                }}
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0,
                                    width: '100%', height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer',
                                    margin: 0,
                                }}
                            />
                            <span
                                className="ui-slider-handle ui-corner-all ui-state-default"
                                style={{
                                    left: `calc(${pct}% - 12px)`,
                                    position: 'absolute',
                                    top: 0,
                                    width: 24,
                                    height: 24,
                                    background: '#e2e6f0',
                                    borderRadius: '50%',
                                    border: '2px solid #e2b96f',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                                    transition: 'left 0.1s',
                                }}
                            ></span>
                        </div>
                        <span>Max</span>
                    </div>
                    <div className="buy-btn-main">
                        <p>Available Funds: <span> {user?.cash_balance != null ? Number(user.cash_balance).toLocaleString() : '0'}</span></p>
                        <div className="d-flex align-items-center justify-content-between buy-bottom">
                            <button className="buy-watch-btn" onClick={onClose}>Cancel</button>
                            <button className="buy-play-btn" onClick={() => {
                                console.log('Deposit clicked', { fundAmount, isValidAmount, depositing });
                                handleDeposit();
                            }} disabled={depositing || !isValidAmount}>
                                {depositing ? 'Depositing…' : 'Deposit'}
                            </button>
                        </div>
                        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                            Debug: fundAmount={fundAmount}, isValidAmount={isValidAmount ? 'true' : 'false'}, depositing={depositing ? 'true' : 'false'}
                        </div>
                        {feedback && (
                            <div style={{ color: feedback.includes('success') ? 'green' : 'red', marginTop: 8, textAlign: 'center' }}>
                                {feedback}
                            </div>
                        )}
                        {!isValidAmount && (
                            <div style={{ color: 'red', marginTop: 4, textAlign: 'center', fontSize: 13 }}>
                                Enter an amount between {minAmount} and {maxAmount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <button className="buy-cross fund-cross" onClick={onClose}><img alt="" src={cross} /></button>
        </div>
    );
};


export const TimeoutModal = ({ onClose }) => {
    const dispatch = useDispatch();

    return (
    <div className="camera-setting-main time-main-2 d-block">
        <div className="main-bg">
            <div className="text-box">
                <h4>Time Out</h4>
            </div>
            <div className="price-list">
                <div className="time-inner">
                    <h2>54</h2>
                    <div className="para">
                        <p>Choose an option before time expires.</p>
                    </div>
                </div>
                <div className="buy-btn-main">
                    <div className="d-flex align-items-center justify-content-between buy-bottom">
                        <button className="buy-watch-btn leave-table" onClick={() => {
                            dispatch(closeTimeout());
                            dispatch(openConfirmLeave());
                        }}>Leave Table</button>

                        <button className="buy-play-btn" onClick={onClose}>Keep Playing</button>
                    </div>
                </div>
            </div>
        </div>
        <button className="buy-cross time-cross" onClick={onClose}><img alt="" src={cross} /></button>
    </div>
    );
};

export const ConfirmLeaveModal = ({ onClose }) => {
    const dispatch = useDispatch();
    const gameUserId = useSelector((state) => state.game.gameUserId);
    const currentGame = useSelector((state) => state.game.currentGame);

    const handleLeave = async () => {
        if (gameUserId && currentGame) {
            await dispatch(quitGame({ game_user_id: gameUserId, game_id: currentGame.id }));
            dispatch(clearGame());
        }
        // Redirect to lobby after leaving
        window.location.href = '/lobby';
    };

    return (
    <div className="camera-setting-main time-main d-block">
        <div className="main-bg1">
            <div className="price-list">
                <div className="time-inner alert-inner">
                    <div className="image-holder alert-img">
                        <img alt="" className="img-fluid" src={alertIcon} />
                    </div>
                    <div className="para">
                        <p>Are you sure you want to<br />
                            leave the game?</p>
                    </div>
                </div>
                <div className="buy-btn-main">
                    <div className="d-flex align-items-center justify-content-between buy-bottom">
                        <button className="buy-watch-btn" onClick={handleLeave}>Leave Table</button>
                        <button className="buy-play-btn" onClick={onClose}>Keep Playing</button>
                    </div>
                </div>
            </div>
        </div>
        <button className="buy-cross leave-cross" onClick={onClose}><img alt="" src={cross} /></button>
    </div>
    );
};

