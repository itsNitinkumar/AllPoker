
import React from 'react';
const card1 = '/images/card1.svg';
const card2 = '/images/card2.svg';
const card3 = '/images/card3.svg';
const card4 = '/images/card4.svg';
const card5 = '/images/card5.svg';

const CardsMain = () => {
    return (
        <div className="cards-main" id="gameHeader"> {/* ID duplicated in original HTML */}
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
            </div>
        </div>
    );
};

export default CardsMain;
