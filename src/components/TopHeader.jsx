import React, { useState } from 'react';
import './TopHeader.css';

const TopHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="top-header">
                <button
                    className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>
                <h1 className="brand-title">AllCardroom</h1>
            </header>

            {/* Navigation Sidebar */}
            <nav className={`nav-sidebar ${isMenuOpen ? 'open' : ''}`}>
                <div className="nav-content">
                    <button className="close-nav" onClick={closeMenu} aria-label="Close menu">
                        ×
                    </button>
                    <ul className="nav-menu">
                        <li><a href="#home" onClick={closeMenu}>Home</a></li>
                        <li><a href="#games" onClick={closeMenu}>Games</a></li>
                        <li><a href="#account" onClick={closeMenu}>Account</a></li>
                        <li><a href="#cashier" onClick={closeMenu}>Cashier</a></li>
                        <li><a href="#leaderboard" onClick={closeMenu}>Leaderboard</a></li>
                        <li><a href="#support" onClick={closeMenu}>Support</a></li>
                        <li><a href="#settings" onClick={closeMenu}>Settings</a></li>
                    </ul>
                </div>
            </nav>

            {/* Overlay */}
            {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
        </>
    );
};

export default TopHeader;
