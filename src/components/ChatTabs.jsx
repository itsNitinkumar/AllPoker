
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeEmojiPanel } from '../store/uiSlice';

// Icons
const snd = '/images/snd.svg';
const sadEmoji = '/images/sad-emoji.svg';
const sadEmoji2 = '/images/sad-emoji2.svg';
const illEmoji = '/images/ill-emoji.svg';
const brainEmoji = '/images/brain-emoji.svg';
const dolarEmoji = '/images/dolar-emoji.svg';
const smilyEmoji2 = '/images/smily-emoji2.svg';
const blindEmoji = '/images/blind-emoji.svg';
const sadEmoji3 = '/images/sad-emoji3.svg';
const silenceEmoji = '/images/silence-emoji.svg';
const thumbupEmoji = '/images/thumbup-emoji.svg';
const gProof = '/images/g-proof.svg';
const cross = '/images/cross.svg';

const ChatTabs = () => {
    const dispatch = useDispatch();
    const { emojiPanelOpen, emojiActiveSource } = useSelector((state) => state.ui);
    const [activeTab, setActiveTab] = useState('chat');

    // When the panel opens via proof/support, switch to that tab
    useEffect(() => {
        if (emojiPanelOpen && emojiActiveSource === 'proof') setActiveTab('proof');
        else if (emojiPanelOpen && emojiActiveSource === 'support') setActiveTab('support');
        else if (emojiPanelOpen && emojiActiveSource === 'chat') setActiveTab('chat');
    }, [emojiPanelOpen, emojiActiveSource]);

    if (!emojiPanelOpen) return null;

    return (
        <div className="emoji-main-inner add-after d-block">
            <div className="emoji-main">
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
                            id="home-tab"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'chat'}
                            onClick={() => setActiveTab('chat')}
                        >
                            Chat
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'emojis' ? 'active' : ''}`}
                            id="profile-tab"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'emojis'}
                            onClick={() => setActiveTab('emojis')}
                        >
                            Emojis
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'support' ? 'active' : ''}`}
                            id="contact-tab"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'support'}
                            onClick={() => setActiveTab('support')}
                        >
                            Support
                        </button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button
                            className={`nav-link ${activeTab === 'proof' ? 'active' : ''}`}
                            id="info-tab"
                            type="button"
                            role="tab"
                            aria-selected={activeTab === 'proof'}
                            onClick={() => setActiveTab('proof')}
                        >
                            Proof
                        </button>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className={`tab-pane fade ${activeTab === 'chat' ? 'show active' : ''}`} id="home-tab-pane" role="tabpanel">
                        <div className="chat-main">
                            <ul>
                                <li>Lorem Ipsum Dolor Sit Amet.</li>
                                <li className="dealer-msg">Dealer: Lorem Ipsum Dolor Sit Amet.</li>
                                <li>Lorem Ipsum Dolor Sit Amet.</li>
                            </ul>
                            <div className="chat-input">
                                <input type="text" placeholder="Input text" />
                                <button><img src={snd} alt="" className="img-fluid" /></button>
                            </div>
                        </div>
                    </div>
                    <div className={`tab-pane fade ${activeTab === 'emojis' ? 'show active' : ''}`} id="profile-tab-pane" role="tabpanel">
                        <ul className="d-flex align-items-center justify-content-center">
                            <li><button className="hurt"><img src={sadEmoji} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={sadEmoji2} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={illEmoji} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={brainEmoji} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={dolarEmoji} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={smilyEmoji2} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={blindEmoji} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={sadEmoji3} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={silenceEmoji} alt="" className="img-fluid" /></button></li>
                            <li><button><img src={thumbupEmoji} alt="" className="img-fluid" /></button></li>
                        </ul>
                    </div>
                    <div className={`tab-pane fade ${activeTab === 'support' ? 'show active' : ''}`} id="contact-tab-pane" role="tabpanel">
                        <div className="support-main">
                            <button>Floorman</button>
                            <button>Chat</button>
                        </div>
                    </div>
                    <div className={`tab-pane fade ${activeTab === 'proof' ? 'show active' : ''}`} id="info-tab-pane" role="tabpanel">
                        <div className="info-main">
                            <div className="verification-slider">
                                <button className="slide-arrow prev" aria-label="Previous"></button>
                                <div className="slide-stage">
                                    <a href="https://www.google.com/" target="_blank" rel="noreferrer">
                                        <img id="verificationCard" src={gProof} alt="Hand Verification" />
                                    </a>
                                </div>
                                <button className="slide-arrow next" aria-label="Next"></button>
                            </div>
                        </div>
                    </div>
                    <button className="buy-cross buy-cross4" onClick={() => dispatch(closeEmojiPanel())}><img src={cross} alt="" /></button>
                </div>
            </div>
        </div>
    );
};

export default ChatTabs;
