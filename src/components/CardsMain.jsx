
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleHandRank } from '../store/uiSlice';

const card1 = '/images/card1.svg';
const card2 = '/images/card2.svg';
const card3 = '/images/card3.svg';
const card4 = '/images/card4.svg';
const card5 = '/images/card5.svg';

const CardsMain = () => {
    const dispatch = useDispatch();

    return (
        <div className="cards-main" id="cardsSection">
            <div className="cards-main-inner">
                <div className="cards-main-inner2">
                    <ul>
                        <li><button className="cards-list"><img src={card1} alt="" className="img-fluid" /></button></li>
                        <li><button className="cards-list"><img src={card2} alt="" className="img-fluid" /></button></li>
                        <li><button className="cards-list"><img src={card3} alt="" className="img-fluid" /></button></li>
                        <li><button className="cards-list"><img src={card4} alt="" className="img-fluid" /></button></li>
                        <li><button className="cards-list"><img src={card5} alt="" className="img-fluid" /></button></li>
                    </ul>
                </div>
                <button className="quesion" onClick={() => dispatch(toggleHandRank())} aria-label="Hand rankings">?</button>
            </div>
        </div>
    );
};

export default CardsMain;
