import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeAddFunds, closeTimeout, closeConfirmLeave, toggleMenu, setMenuOpen, closeEmojiPanel, closeHandRank } from './store/uiSlice';
import useBodyClass from './hooks/useBodyClass';
import useOverlays from './hooks/useOverlays';
import useVideoDrag from './hooks/useVideoDrag';
import useZoom from './hooks/useZoom';
import useTimeOfDay from './hooks/useTimeOfDay';
import useLiveCamera from './hooks/useLiveCamera';
import useRoomSwitcher from './hooks/useRoomSwitcher';
import useRoomPotAlign from './hooks/useRoomPotAlign';
import useRoom3Speed from './hooks/useRoom3Speed';
import useDeviceCheck from './hooks/useDeviceCheck';
import useLobbyHoverCard from './hooks/useLobbyHoverCard';
import usePipMirror from './hooks/usePipMirror';

// Components
import Header from './components/Header';
import LobbyMenu from './components/LobbyMenu';
import ControlsPanel from './components/ControlsPanel';
import Pot from './components/Pot';
import ZoomArea from './components/ZoomArea';
import GameRoom from './components/GameRoom';
import CardsMain from './components/CardsMain';
import ActionsPanel from './components/ActionsPanel';
import { AddFundsModal, TimeoutModal, ConfirmLeaveModal } from './components/Modals';

// Images for Main Room
const room1VideoImg = '/video/room1.webp';
const table4 = '/video/table4.png';
const glass = '/video/glass.png';

const PokerInterface = () => {
    const dispatch = useDispatch();
    const { addFundsOpen, timeoutOpen, confirmLeaveOpen, videoPanelOpen, handRankOpen, activeRoom } = useSelector((state) => state.ui);
    const anyModalOpen = addFundsOpen || timeoutOpen || confirmLeaveOpen;

    // Single hook that syncs all Redux-driven body classes (menu-open, game-mode-active)
    useBodyClass();

    // ---- Game engine hooks ----
    // Overlay system: creates/positions .overlay-box elements over character videos
    useOverlays();

    // Video container drag: pointer-drag to nudge all character videos
    useVideoDrag();

    // Hold-to-zoom on #zoomArea with character hide + chip/pot fade
    useZoom();

    // Time-of-day background video cycling
    useTimeOfDay();

    // Live camera PIP (getUserMedia)
    useLiveCamera();

    // Room switching (rooms 1–4)
    useRoomSwitcher(activeRoom);

    // Pot alignment for rooms 2–4
    useRoomPotAlign(activeRoom);

    // Room 3 playback speed
    useRoom3Speed();

    // Device size check (rotate/too-small message)
    useDeviceCheck();

    // Lobby hover cards (preview on lobby button hover)
    useLobbyHoverCard();

    // PIP mirror (for .live-pip videos)
    usePipMirror();

    // ESC key closes menu and panels
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                dispatch(setMenuOpen(false));
                dispatch(closeEmojiPanel());
                dispatch(closeHandRank());
                if (addFundsOpen) dispatch(closeAddFunds());
                if (timeoutOpen) dispatch(closeTimeout());
                if (confirmLeaveOpen) dispatch(closeConfirmLeave());
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [dispatch, addFundsOpen, timeoutOpen, confirmLeaveOpen]);

    // Click outside emoji panel closes it.
    // We listen on the *capture* phase so the handler sees the original target
    // before React can reconcile and potentially detach the node.
    const emojiPanelOpen = useSelector((state) => state.ui.emojiPanelOpen);

    useEffect(() => {
        if (!emojiPanelOpen) return;           // only attach while panel is open

        const onClickOutside = (e) => {
            const target = e.target;
            // If the click is inside the emoji panel or a trigger button, ignore
            const insidePanel = target.closest('.emoji-main-inner, .emoji-main');
            const isTrigger = target.closest(
                '.smily, #proofBtn, #btnLiveC1, .video-icon, a.support, .buy-cross4, .hurt'
            );
            if (insidePanel || isTrigger) return;
            dispatch(closeEmojiPanel());
        };

        // Delay one frame so the same click that opened the panel
        // doesn't also trigger the outside-click handler.
        const raf = requestAnimationFrame(() => {
            document.addEventListener('click', onClickOutside, true);
        });

        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener('click', onClickOutside, true);
        };
    }, [dispatch, emojiPanelOpen]);

    return (
        <div className={`poker-interface buy-hero${anyModalOpen ? ' z-up' : ''}`}>
            {/* (A) THIS WILL SHOW ON THE WRONG ORIENTATION */}
            <div id="turn"> Please rotate your device! </div>

            <Header />

            {/* Top-left hamburger */}
            <button
                aria-label="Open controls"
                className="menu-btn"
                id="menuButton"
                title="Open controls"
                onClick={() => {
                    dispatch(toggleMenu());
                    window.scrollTo(0, 0);
                }}
            >
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
                // Room 2 HTML provided has no fader and no glass
                faderId={undefined} // No fader
                hasGlass={false}
                hasFocusOverlay={true} // Default HTML has focus-overlay
                chairsId="chairsLayer_2"
                containerId="videoContainer_2"
                zoomId="zoomArea_2"
                potId="pot_2"
                potImgId="potImg_2"
                potLayersId="potLayers_2"
                potTargetId="potTarget_2"
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
                overlaySrc="../assets/video/1167.png" // Check path validity
                hasFocusOverlay={true}
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
                hasFocusOverlay={true}
            />

            <LobbyMenu />

            {/* Modals — rendered conditionally via Redux state */}
            {addFundsOpen && (
                <AddFundsModal onClose={() => dispatch(closeAddFunds())} />
            )}

            {timeoutOpen && (
                <TimeoutModal onClose={() => dispatch(closeTimeout())} />
            )}

            {confirmLeaveOpen && (
                <ConfirmLeaveModal onClose={() => dispatch(closeConfirmLeave())} />
            )}


            {/* Cards and Actions */}
            <CardsMain />

            {/* Fold/Action Panel */}
            <ActionsPanel />

            {/* Live video feed — toggled via camera icon in game header */}
            {videoPanelOpen && (
                <div className="react-video d-block opacity-100" style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '200px',
                    height: '150px',
                    zIndex: 9997,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,.5)',
                    border: '2px solid rgba(255,255,255,.15)',
                }}>
                    <div className="image-holder react-video-main" style={{ minHeight: 'auto', width: '100%', height: '100%' }}>
                        <video autoPlay muted playsInline id="localVideo" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                    </div>
                </div>
            )}

            {/* Hand Rank Reference — toggled via ? button in CardsMain */}
            {handRankOpen && (
                <div className="hand-rank d-block">
                    <div className="hand-rank-inner">
                        <h4>Hand Rankings</h4>
                        <ol>
                            <li>Royal Flush</li>
                            <li>Straight Flush</li>
                            <li>Four of a Kind</li>
                            <li>Full House</li>
                            <li>Flush</li>
                            <li>Straight</li>
                            <li>Three of a Kind</li>
                            <li>Two Pair</li>
                            <li>One Pair</li>
                            <li>High Card</li>
                        </ol>
                    </div>
                    <button className="buy-cross" onClick={() => dispatch(closeHandRank())}>
                        <img alt="Close" src="/images/cross.svg" />
                    </button>
                </div>
            )}

        </div>
    );
};

export default PokerInterface;
