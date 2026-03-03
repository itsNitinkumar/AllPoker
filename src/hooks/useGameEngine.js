import { useEffect, useRef } from 'react';

/**
 * Loads and initializes the game engine (ui-inline-bundle.js) AFTER
 * React has rendered the DOM elements it depends on.
 *
 * The bundle is pure vanilla JS (no jQuery). It manages:
 * - Character video loading / seat toggling
 * - Gesture playback (setting video currentTime + play segments)
 * - Overlay boxes (chip stacks, bet placards, empty-seat PNGs)
 * - Pot animations (chip flight, pot award)
 * - Card dealing animations
 * - Zoom area
 * - Lobby hover cards
 * - Room switching
 *
 * It expects these DOM IDs to exist (all provided by React components):
 *   videoContainer, backgroundVideo, characterSelector, gestureSelector,
 *   blindsSelector, betAmount, resetPotBtn, collectBetsBtn, pot, potImg,
 *   potLayers, potTarget, zoomArea, controls, checkboxContainer, menuButton,
 *   lobbyMenu, bgFader
 *
 * Conflicts handled:
 *   - Inline scripts 13 & 14 (hamburger show/hide + menu toggle) duplicate
 *     our useBodyClass hook. We set flags so they skip if React already handles it.
 */
const useGameEngine = () => {
    const loaded = useRef(false);

    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;

        // Mark that React is managing the hamburger, so inline scripts 13/14
        // won't conflict (they check for the button and bail if it's handled).
        window.__reactManagesMenu = true;

        // Dynamically import the bundle. Vite will load it as a module.
        // The IIFEs inside run immediately on import. Since this effect
        // fires after React's first paint, all DOM IDs are available.
        import('../assets/js/app/ui-inline-bundle.js').catch((err) => {
            console.warn('[useGameEngine] Failed to load game engine bundle:', err);
        });
    }, []);
};

export default useGameEngine;
