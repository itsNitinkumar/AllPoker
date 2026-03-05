
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openConfirmLeave, openAddFunds, openEmojiPanel, closeEmojiPanel, toggleVideoPanel } from '../store/uiSlice';
import { logout } from '../store/authSlice';
import ChatTabs from './ChatTabs';
const logo = '/img/logo@2x.png';
const cameraIcon = '/images/camera.svg';
const messageIcon = '/images/message.svg';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { emojiPanelOpen, emojiActiveSource, videoPanelOpen } = useSelector((state) => state.ui);
    const user = useSelector((state) => state.auth.user);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Main Header */}
            <header className="header-top landing-header">
                <div className="logo-wrapper">
                    <h2 className="logo"><img alt="Logo" src={logo} /></h2>
                </div>
                <button
                    aria-label="Toggle menu"
                    className="menu-icon clearfix"
                    onClick={toggleMenu}
                    tabIndex="0"
                >
                    <div className="bars">
                        <div className="bar1"></div>
                        <div className="bar2"></div>
                        <div className="bar3"></div>
                    </div>
                </button>
                <nav className={`site-nav ${isMenuOpen ? 'active' : ''}`} id="site-nav">
                    <ul className="menu clearfix qmenu">
                        <li data-menuanchor="account"><a href="#account">
                            {user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Account'}
                        </a></li>
                        <li data-menuanchor="cashier"><a href="#cashier">
                            {user?.cash_balance != null ? `$${Number(user.cash_balance).toLocaleString()}` : 'Cashier'}
                        </a></li>
                        <li><a href="#" onClick={(e) => { e.preventDefault(); dispatch(logout()); }}>Logout</a></li>
                    </ul>
                </nav>
            </header>

            {/* Game Header */}
            <header aria-label="Game Header" className="landing-header header-top game-header" id="gameHeader" style={{ overflow: 'visible' }}>
                <div className="logo-wrapper">
                </div>

                <div className="header-2">
                    <div className="container-fluid">
                        <div className="header-main d-flex align-items-center justify-content-between">
                            <div className="left-list">
                                <ul className="d-flex align-items-center justify-content-center">
                                    <li><button id="exitBtnHeader" className="leave-table" onClick={() => {
                                        dispatch(openConfirmLeave());
                                    }}>Lobby</button></li>
                                    <li><button id="buyInBtn" onClick={() => {
                                        dispatch(openAddFunds());
                                    }}>Add Funds</button></li>

                                    <li><button id="proofBtn" className={emojiPanelOpen && emojiActiveSource === 'proof' ? 'icon-bg' : ''} onClick={() => {
                                        if (emojiPanelOpen && emojiActiveSource === 'proof') {
                                            dispatch(closeEmojiPanel());
                                        } else {
                                            dispatch(openEmojiPanel('proof'));
                                        }
                                    }}>Proof</button></li>
                                </ul>
                            </div>

                            <div className="right-list">
                                <ol className="d-flex align-items-center justify-content-center">
                                    <li><button id="btnLiveC1" className={`video-icon${videoPanelOpen ? ' icon-bg' : ''}`} onClick={() => dispatch(toggleVideoPanel())}><img src={cameraIcon} alt="" className="img-fluid" /></button></li>
                                    <li><button className={`smily${emojiPanelOpen && emojiActiveSource === 'chat' ? ' icon-bg' : ''}`} onClick={() => {
                                        if (emojiPanelOpen && emojiActiveSource === 'chat') {
                                            dispatch(closeEmojiPanel());
                                        } else {
                                            dispatch(openEmojiPanel('chat'));
                                        }
                                    }}><img src={messageIcon} alt="" className="img-fluid" /></button></li>
                                </ol>
                            </div>

                            <ChatTabs />
                        </div>
                    </div>
                </div>

            </header>
        </>
    );
};

export default Header;
