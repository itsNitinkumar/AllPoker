
import React from 'react';
import cross from '../assets/images/cross.svg';
import alertIcon from '../assets/images/alert-icon.svg';

export const AddFundsModal = ({ onClose }) => (
    <div className="camera-setting-main enter-buy-main">
        <div className="main-bg">
            <div className="text-box">
                <h4>Add Funds</h4>
            </div>
            <div className="price-list">
                <ul className="d-flex align-items-center justify-content-center">
                    <li>5000</li>
                    <li className="price-lst2"><span id="min-price5">$5000</span></li>
                    <li>55K</li>
                </ul>
                <div className="d-flex align-items-center price-main">
                    <span>Min</span>
                    <div id="price-range5"></div> {/* Placeholder for slider */}
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

export const TimeoutModal = ({ onClose }) => (
    <div className="camera-setting-main time-main-2">
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
                        <button className="buy-watch-btn leave-table">Leave Table</button>
                        <button className="buy-play-btn" onClick={onClose}>Keep Playing</button>
                    </div>
                </div>
            </div>
        </div>
        <button className="buy-cross time-cross" onClick={onClose}><img alt="" src={cross} /></button>
    </div>
);

export const ConfirmLeaveModal = ({ onClose }) => (
    <div className="camera-setting-main time-main">
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

