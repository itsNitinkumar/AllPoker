
import React, { useEffect, useState } from 'react';

// CSS Imports
import './assets/css/style.css';
import './assets/css/responsive.css';
import './assets/fonts/opensans/stylesheet.css';
import './assets/fonts/glacial/stylesheet.css';
import './assets/fonts/linearicons/stylesheet.css';
import './assets/fonts/ionicons.min.css';

// Components
import Header from './components/Header';
import LobbyMenu from './components/LobbyMenu';
import ControlsPanel from './components/ControlsPanel';
import ChatTabs from './components/ChatTabs';
import Pot from './components/Pot';
import ZoomArea from './components/ZoomArea';
import GameRoom from './components/GameRoom';
import CardsMain from './components/CardsMain';
import ActionsPanel from './components/ActionsPanel';
import { AddFundsModal, TimeoutModal, ConfirmLeaveModal } from './components/Modals';

// Images for Main Room
import room1VideoImg from './assets/video/room1.webp';
import table4 from './assets/video/table4.png';
import glass from './assets/video/glass.png';

const PokerInterface = () => {
    // State to toggle modals for demonstration
    const [showAddFunds, setShowAddFunds] = useState(false);

    // Load existing scripts
    useEffect(() => {
        // This is where you might load external scripts if they can't be modules
        // import('../assets/js/custom.js');
        // import('../assets/js/app/ui-inline-bundle.js');
    }, []);

    return (
        <div className="poker-interface">
            {/* (A) THIS WILL SHOW ON THE WRONG ORIENTATION */}
            <div id="turn"> Please rotate your device! </div>

            <Header />

            {/* Top-left hamburger */}
            <button aria-label="Open controls" className="menu-btn" id="menuButton" title="Open controls">
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            {/* ================================================================
            BACKGROUND STACK (character video + tint + glass + table) 
            (ROOM 1 MAIN)
            ================================================================ */}
            <div className="bg-stack focus-soft">
                <video
                    autoPlay decoding="async" disablePictureInPicture
                    id="backgroundVideo" loop muted playsInline preload="auto"
                ></video>
                <img alt="" className="glass" src={glass} />
                <div aria-hidden="true" className="bg-fader" id="bgFader"></div>
                <div aria-hidden="true" className="focus-overlay"></div>
            </div>

            <img alt="room" className="room" src={room1VideoImg} />
            <img alt="" className="bg-overlay-image" id="sceneOverlay" style={{ display: 'none' }} />

            {/* Table overlay media */}
            <img
                alt="Table A"
                className="table-media tabletop"
                data-media={table4}
                data-title="City Room"
                data-type="image"
                src={table4}
            />

            {/* CHARACTER VIDEO STAGE */}
            <div aria-hidden="true" className="chairs-layer" id="chairsLayer"></div>
            <div className="video-container" id="videoContainer">
                {/* Character videos injected here */}
            </div>

            <ControlsPanel />

            <ZoomArea id="zoomArea" />

            <Pot id="pot" imgId="potImg" layersId="potLayers" targetId="potTarget" />

            {/* Rooms 2, 3, 4 */}
            <GameRoom
                id="room2Section"
                bgData="video/09.mp4"
                roomData="video/room11.png"
                tableData={table4} // assuming reuse
                bgVideoId="backgroundVideo_2"
                faderId="bgFader_2" // Not in original HTML snippet but likely needed? Wait, original didn't have bgFader for room 2. 
                // Original Room 2 snippet: 
                // <div class="bg-stack focus-soft"><video ...></video></div> ... No fader?
                // Room 3 has fader.
                chairsId="chairsLayer_2"
                containerId="videoContainer_2"
                zoomId="zoomArea_2"
                potId="pot_2"
                potImgId="potImg_2"
                potLayersId="potLayers_2"
                potTargetId="potTarget_2"
                hasGlass={false} // Room 2 snippet didn't show glass
            />

            <GameRoom
                id="room3Section"
                bgData="video/bg-sky.mp4"
                roomData="video/room3.png"
                tableData={table4}
                bgVideoId="backgroundVideo_3"
                faderId="bgFader_3"
                chairsId="chairsLayer_3"
                containerId="videoContainer_3"
                zoomId="zoomArea_3"
                potId="pot_3"
                potImgId="potImg_3"
                potLayersId="potLayers_3"
                potTargetId="potTarget_3"
                hasGlass={true}
                overlaySrc="../assets/video/1167.png" // Check path
            />

            <GameRoom
                id="room4Section"
                bgData="video/lv.webm"
                roomData="video/room4b.png"
                tableData={table4}
                bgVideoId="backgroundVideo_4"
                faderId="bgFader_4"
                chairsId="chairsLayer_4"
                containerId="videoContainer_4"
                zoomId="zoomArea_4"
                potId="pot_4"
                potImgId="potImg_4"
                potLayersId="potLayers_4"
                potTargetId="potTarget_4"
                hasGlass={true}
            />

            <LobbyMenu />

            {/* Modals */}
            <AddFundsModal onClose={() => setShowAddFunds(false)} />
            <TimeoutModal onClose={() => { }} />
            <ConfirmLeaveModal onClose={() => { }} />

            {/* Cards and Actions */}
            <CardsMain />

            {/* Fold/Action Panel. Note HTML IDs duplicate "gameHeader" here. We kept it in component. */}
            <ActionsPanel />

            <ChatTabs />

        </div>
    );
};

export default PokerInterface;
