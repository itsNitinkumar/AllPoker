
import React from 'react';
import card1 from '../assets/images/card1.svg';
import card2 from '../assets/images/card2.svg';
import card3 from '../assets/images/card3.svg';
import card4 from '../assets/images/card4.svg';
import card5 from '../assets/images/card5.svg';

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
