
import React from 'react';
import potImgSrc from '../assets/img/chips/p-blinds.png';

const Pot = ({ id, imgId, layersId, targetId }) => {
    return (
        <div aria-label="Pot" className="pot-container" id={id}>
            <img alt="Pot" className="pot-img" id={imgId} src={potImgSrc} />
            <div aria-hidden="true" id={layersId}></div>
            <div aria-hidden="true" id={targetId}></div>
        </div>
    );
};

export default Pot;
