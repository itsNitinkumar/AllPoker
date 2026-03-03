
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openConfirmLeave, closeTimeout } from '../store/uiSlice';
import cross from '../assets/images/cross.svg';
import alertIcon from '../assets/images/alert-icon.svg';

export const AddFundsModal = ({ onClose }) => {
    const [fundAmount, setFundAmount] = useState(550); // price-range5: 0–2000

    const pct = ((fundAmount / 2000) * 100).toFixed(2);

    return (
    <div className="camera-setting-main enter-buy-main d-block">
        <div className="main-bg">
            <div className="text-box">
                <h4>Add Funds</h4>
            </div>
            <div className="price-list">
                <ul className="d-flex align-items-center justify-content-center">
                    <li>5000</li>
                    <li className="price-lst2"><span id="min-price5">${fundAmount}</span></li>
                    <li>55K</li>
                </ul>
                <div className="d-flex align-items-center price-main">
                    <span>Min</span>
                    <div id="price-range5" className="ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content" style={{ position: 'relative' }}>
                        <div
                            className="ui-slider-range ui-corner-all ui-widget-header ui-slider-range-min"
                            style={{ width: `${pct}%` }}
                        ></div>
                        <input
                            type="range"
                            min={0}
                            max={2000}
                            value={fundAmount}
                            onChange={(e) => setFundAmount(Number(e.target.value))}
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
                            style={{ left: `${pct}%` }}
                        ></span>
                    </div>
                    <span>Max</span>
                </div>
                <div className="buy-btn-main">
                    <p>Available Funds: <span> $55,000.00</span></p>
                    <div className="d-flex align-items-center justify-content-between buy-bottom">
                        <button className="buy-watch-btn" onClick={onClose}>Cancel</button>
                        <button className="buy-play-btn">Deposit</button>
                    </div>
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

export const ConfirmLeaveModal = ({ onClose }) => (
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
                        <button className="buy-watch-btn" onClick={onClose}>Leave Table</button>
                        <button className="buy-play-btn" onClick={onClose}>Keep Playing</button>
                    </div>
                </div>
            </div>
        </div>
        <button className="buy-cross leave-cross" onClick={onClose}><img alt="" src={cross} /></button>
    </div>
);

