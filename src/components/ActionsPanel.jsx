
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openTimeout } from '../store/uiSlice';
import {
    pokerFoldSend,
    pokerCallSend,
    pokerCheckSend,
    pokerAllInSend,
} from '../services/socket';

const ActionsPanel = () => {
    const dispatch = useDispatch();
    const actionButtonsHidden = useSelector((state) => state.ui.actionButtonsHidden);
    const user = useSelector((state) => state.auth.user);
    const gameDetails = useSelector((state) => state.game.gameDetails);
    const currentGame = useSelector((state) => state.game.currentGame);

    // Slider state — actual dollar amounts matching legacy config
    const [raiseAmount, setRaiseAmount] = useState(2550);   // price-range2: 0–7550
    const [betAmount, setBetAmount] = useState(550);         // price-range3: 0–2000

    // Convert value to percentage for the custom track fill
    const pct = (val, max) => ((val / max) * 100).toFixed(2);

    // Render a range slider styled to match the legacy jQuery UI slider
    const renderSlider = (id, value, min, max, onChange) => (
        <div id={id} className="ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content" style={{ position: 'relative' }}>
            <div
                className="ui-slider-range ui-corner-all ui-widget-header ui-slider-range-min"
                style={{ width: `${pct(value, max)}%` }}
            ></div>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
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
                style={{ left: `${pct(value, max)}%` }}
            ></span>
        </div>
    );

    return (
        <div className={`fold-main${actionButtonsHidden ? ' is-hidden' : ''}`} id="actionsPanel" aria-hidden={actionButtonsHidden ? 'true' : 'false'}>
            <ul className="d-flex align-items-center justify-content-center">
                <li><button type="button" onClick={() => setRaiseAmount(0)}>Min</button></li>
                <li><button type="button" onClick={() => setRaiseAmount(Math.round(7550 / 2))}>1/2</button></li>
                <li><button type="button" onClick={() => setRaiseAmount(5000)}>Pot</button></li>
                <li><button type="button" onClick={() => setRaiseAmount(7550)}>Max</button></li>
            </ul>

            <div className="d-flex align-items-center price-main price-main2">
                <div><span id="min-price2">${raiseAmount}</span></div>
                {renderSlider('price-range2', raiseAmount, 0, 7550, setRaiseAmount)}
            </div>

            <div className="price-range-inner">
                <div className="pricerange"><span id="min-price3">${betAmount}</span></div>
                <div className="price-main price-main3">
                    {renderSlider('price-range3', betAmount, 0, 2000, setBetAmount)}
                    <span>ALL IN</span>
                </div>
            </div>

            <div className="fold-btn-main">
                <ol className="d-flex align-items-center">
                    <li className="show-cards-wrapper">
                    </li>
                    <li><button className="fold-btn" onClick={() => {
                        if (currentGame && user) {
                            pokerFoldSend({ gameId: currentGame.id, userId: user.id });
                        }
                    }}>Fold</button></li>
                    <li><button className="call-btn" onClick={() => {
                        if (currentGame && user && gameDetails) {
                            pokerCallSend({
                                gameId: currentGame.id,
                                userId: user.id,
                                amount: gameDetails.currentBet || 0,
                            });
                        }
                    }}>Call</button></li>
                    <li><button className="raise-btn time-popup" onClick={() => {
                        dispatch(openTimeout());
                    }}>Raise</button></li>
                </ol>
            </div>
        </div>
    );
};

export default ActionsPanel;
