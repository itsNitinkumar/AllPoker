import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

/**
 * Syncs Redux-driven UI flags to document.body CSS classes
 * and manages the hamburger button auto-show/hide on mouse movement.
 *
 * This is the ONLY place document.body.classList is used in the app.
 * <body> lives outside React's root so we must touch the DOM here,
 * but the source of truth is Redux state — not the DOM.
 */
const useBodyClass = () => {
    const menuOpen = useSelector((state) => state.ui.menuOpen);
    const gameModeActive = useSelector((state) => state.ui.gameModeActive);
    const showOpenSeats = useSelector((state) => state.ui.showOpenSeats);
    const hideTimerRef = useRef(null);

    useEffect(() => {
        if (menuOpen) document.body.classList.add('menu-open');
        else document.body.classList.remove('menu-open');
    }, [menuOpen]);

    useEffect(() => {
        if (gameModeActive) document.body.classList.add('game-mode-active');
        else document.body.classList.remove('game-mode-active');
    }, [gameModeActive]);

    // show-open-seats: when the toggle is OFF, we ADD the class (legacy inversion)
    useEffect(() => {
        document.body.classList.toggle('show-open-seats', !showOpenSeats);
    }, [showOpenSeats]);

    // Hamburger auto-show/hide on mouse movement
    // CSS hides #menuButton by default (opacity:0, pointer-events:none).
    // We show it on mouse move and hide after 2s idle, matching legacy behavior.
    useEffect(() => {
        const HIDE_DELAY = 2000;
        const btn = document.getElementById('menuButton');
        if (!btn) return;

        const showButton = () => {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        };

        const hideButton = () => {
            if (!document.body.classList.contains('menu-open')) {
                btn.style.opacity = '0';
                btn.style.pointerEvents = 'none';
            }
        };

        const onMouseMove = () => {
            showButton();
            clearTimeout(hideTimerRef.current);
            hideTimerRef.current = setTimeout(hideButton, HIDE_DELAY);
        };

        window.addEventListener('mousemove', onMouseMove);

        // Keep visible while menu is open
        if (menuOpen) showButton();

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            clearTimeout(hideTimerRef.current);
        };
    }, [menuOpen]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.classList.remove('menu-open', 'game-mode-active', 'show-open-seats', 'device-too-small');
        };
    }, []);
};

export default useBodyClass;
