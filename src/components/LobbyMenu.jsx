
import React, { useState } from 'react';
import lCity from '../assets/video/l-city.png';
import lGame from '../assets/video/l-game.png';
import lSky from '../assets/video/l-sky.png';
import lBaller from '../assets/video/l-baller.png';

const LobbyMenu = ({ onGameSelect }) => {
    const [activeGame, setActiveGame] = useState('tableMedia1');

    const handleGameSelect = (targetId) => {
        setActiveGame(targetId);
        if (onGameSelect) {
            onGameSelect(targetId);
        }
    };

    return (
        <>
            {/* Hidden media targets used by hover cards */}
            <div aria-hidden="true" style={{ display: 'none' }}>
                <div data-media={lCity} data-title="City Room" data-type="image" id="tableMedia1"></div>
                <div data-media={lGame} data-title="Game Room" data-type="image" id="tableMedia2"></div>
                <div data-media={lSky} data-title="Private Room" data-type="image" id="tableMedia3"></div>
                <div data-media={lBaller} data-title="Poker Room" data-type="image" id="tableMedia4"></div>
            </div>

            {/* Bottom Lobby Section */}
            <div className="lobby-section">
                <h2 className="lobby-title">SELECT A GAME</h2>
                <div aria-label="Game lobby menu" className="lobby-menu" id="lobbyMenu" role="tablist">
                    <button
                        aria-selected={activeGame === 'tableMedia1'}
                        className={`lobby-btn ${activeGame === 'tableMedia1' ? 'is-active' : ''}`}
                        data-target="#tableMedia1"
                        role="tab"
                        onClick={() => handleGameSelect('tableMedia1')}
                    >
                        $5-10 NLH
                    </button>
                    <button
                        aria-selected={activeGame === 'tableMedia2'}
                        className={`lobby-btn ${activeGame === 'tableMedia2' ? 'is-active' : ''}`}
                        data-target="#tableMedia2"
                        role="tab"
                        onClick={() => handleGameSelect('tableMedia2')}
                    >
                        $10-20 NLH
                    </button>
                    <button
                        aria-selected={activeGame === 'tableMedia3'}
                        className={`lobby-btn ${activeGame === 'tableMedia3' ? 'is-active' : ''}`}
                        data-target="#tableMedia3"
                        role="tab"
                        onClick={() => handleGameSelect('tableMedia3')}
                    >
                        $50-100 NLH
                    </button>
                    <button
                        aria-selected={activeGame === 'tableMedia4'}
                        className={`lobby-btn ${activeGame === 'tableMedia4' ? 'is-active' : ''}`}
                        data-target="#tableMedia4"
                        role="tab"
                        onClick={() => handleGameSelect('tableMedia4')}
                    >
                        $100-200 NLH
                    </button>
                </div>
            </div>
        </>
    );
};

export default LobbyMenu;
