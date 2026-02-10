function App() {
  return (
    <>
      {/* <!-- (A) THIS WILL SHOW ON THE WRONG ORIENTATION --> */}
      <div id="turn">Please rotate your device!</div>
      {/* <!-- Header --> */}
      <header className="header-top landing-header">
        <div className="logo-wrapper">
          <h2 className="logo">
            <img alt="Logo" src="src/assets/img/logo@2x-.png" />
          </h2>
        </div>
        <a
          aria-label="Toggle menu"
          className="menu-icon clearfix"
          role="button"
          // tabindex="0"
        >
          <div className="bars">
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </a>
        <nav className="site-nav" id="site-nav">
          <ul className="menu clearfix qmenu">
            <li data-menuanchor="account">
              <a href="#account">Account</a>
            </li>
            <li data-menuanchor="cashier">
              <a href="#cashier">Cashier</a>
            </li>
          </ul>
        </nav>
      </header>
      <header
        aria-label="Game Header"
        className="landing-header header-top game-header"
        id="gameHeader"
      >
        <div className="logo-wrapper"></div>

        <div className="header-2">
          <div className="container-fluid">
            <div className="header-main d-flex align-items-center justify-content-between">
              <div className="left-list">
                <ul className="d-flex align-items-center justify-content-center">
                  <li>
                    <a href="#" id="exitBtn">
                      Lobby
                    </a>
                  </li>
                  <li>
                    <a href="#" id="buyInBtn">
                      Add Funds
                    </a>
                  </li>
                  <li>
                    <a href="#" id="proofBtn">
                      Proof
                    </a>
                  </li>
                </ul>
              </div>
              <div className="right-list">
                <ol className="d-flex align-items-center justify-content-center">
                  <li>
                    <a href="#" id="btnLiveC1" className="video-icon">
                      <img
                        src="images/camera.svg "
                        alt=""
                        className="img-fluid"
                      />
                    </a>
                  </li>
                  <li>
                    <a href="#" className="smily">
                      <img
                        src="images/message.svg"
                        alt=""
                        className="img-fluid"
                      />
                    </a>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Top-left hamburger --> */}
      <button
        aria-label="Open controls"
        className="menu-btn"
        id="menuButton"
        title="Open controls"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>
    </>
  );
}

export default App;
