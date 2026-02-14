
import React, { useState } from 'react';
const logo = '/img/logo@2x.png';
const cameraIcon = '/images/camera.svg';
const messageIcon = '/images/message.svg';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        <li data-menuanchor="account"><a href="#account">Account</a></li>
                        <li data-menuanchor="cashier"><a href="#cashier">Cashier</a></li>
                    </ul>
                </nav>
            </header>

            {/* Game Header */}
            <header aria-label="Game Header" className="landing-header header-top game-header" id="gameHeader">
                <div className="logo-wrapper">
                </div>

                <div className="header-2">
                    <div className="container-fluid">
                        <div className="header-main d-flex align-items-center justify-content-between">
                            <div className="left-list">
                                <ul className="d-flex align-items-center justify-content-center">
                                    <li><button id="exitBtn">Lobby</button></li>
                                    <li><button id="buyInBtn">Add Funds</button></li>
                                    <li><button id="proofBtn">Proof</button></li>
                                </ul>
                            </div>

                            <div className="right-list">
                                <ol className="d-flex align-items-center justify-content-center">
                                    <li><button id="btnLiveC1" className="video-icon"><img src={cameraIcon} alt="" className="img-fluid" /></button></li>
                                    <li><button className="smily"><img src={messageIcon} alt="" className="img-fluid" /></button></li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
