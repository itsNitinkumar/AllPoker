
import React, { useState } from 'react';

const ActionsPanel = () => {
    // State for sliders (values are illustrative, assuming range 0-100 or actual amounts)
    const [sliderValue2, setSliderValue2] = useState(33.7748);
    const [sliderValue3, setSliderValue3] = useState(27.5);

    // Helper to render slider structure for CSS compatibility
    const renderSlider = (id, value) => (
        <div id={id} className="ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content">
            <div
                className="ui-slider-range ui-corner-all ui-widget-header ui-slider-range-min"
                style={{ width: `${value}%` }}
            ></div>
            <span
                tabIndex="0"
                className="ui-slider-handle ui-corner-all ui-state-default"
                style={{ left: `${value}%` }}
            // Add onDrag logic here if needed, or simple onClick for demo
            ></span>
        </div>
    );

    return (
        <div className="fold-main" id="gameHeader"> {/* ID duplicated */}
            <ul className="d-flex align-items-center justify-content-center">
                <li>Min</li>
                <li>1/2</li>
                <li>Pot</li>
                <li>Max</li>
            </ul>

            <div className="d-flex align-items-center price-main price-main2">
                <div><span id="min-price2">$2550</span></div>
                {renderSlider('price-range2', sliderValue2)}
            </div>

            <div className="price-range-inner">
                <div className="pricerange"><span id="min-price3">$550</span></div>
                <div className="price-main price-main3">
                    {renderSlider('price-range3', sliderValue3)}
                    <span>ALL IN</span>
                </div>
            </div>

            <div className="fold-btn-main">
                <ol className="d-flex align-items-center">
                    <li className="show-cards-wrapper">
                        {/* <label className="d-flex align-items-center gap-2" style={{ color: '#FFF', cursor: 'pointer', fontWeight: '700' }}>
                            <input type="checkbox" id="userShowCardsToggle" />
                            <span>Show Cards</span>
                        </label> */}
                    </li>
                    <li><button className="fold-btn">Fold</button></li>
                    <li><button className="call-btn">Call</button></li>
                    <li><button className="raise-btn time-popup" onClick={() => {
                        window.$('.time-main-2').addClass('d-block');
                        window.$('.buy-hero').addClass('z-up');
                    }}>Raise</button></li>

                </ol>
            </div>
        </div>
    );
};

export default ActionsPanel;
