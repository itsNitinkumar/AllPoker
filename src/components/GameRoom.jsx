
import React from 'react';
import Pot from './Pot';
import ZoomArea from './ZoomArea';
const glass = '/video/glass.png';

const GameRoom = ({
    id,
    bgData,
    roomData,
    tableData,
    bgVideoId,
    faderId,
    chairsId,
    containerId,
    zoomId,
    potId,
    potImgId,
    potLayersId,
    potTargetId,
    overlaySrc,
    hasGlass = true,
    hasFocusOverlay = true
}) => {
    return (
        <div
            aria-hidden="true"
            className="room-section"
            data-bg={bgData}
            data-room={roomData}
            data-table={tableData}
            id={id}
        >
            <div className="bg-stack focus-soft">
                <video id={bgVideoId} loop muted playsInline preload="none"></video>
                {overlaySrc && <img alt="" className="bg-overlay-image bgs" src={overlaySrc} />}
                {hasGlass && <img alt="" className="glass" src={glass} />}
                {faderId && <div aria-hidden="true" className="bg-fader" id={faderId}></div>}
                {hasFocusOverlay && <div aria-hidden="true" className="focus-overlay"></div>}
            </div>
            <img alt="room" className="room" />
            <img alt="Table" className="table-media tabletop" />
            <div aria-hidden="true" className="chairs-layer" id={chairsId}></div>
            <div className="video-container" id={containerId}></div>
            <ZoomArea id={zoomId} />
            <Pot
                id={potId}
                imgId={potImgId}
                layersId={potLayersId}
                targetId={potTargetId}
            />
        </div>
    );
};

export default GameRoom;
