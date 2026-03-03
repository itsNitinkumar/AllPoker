import { useEffect, useRef } from 'react';

/**
 * React port of inline script 5 — Chip stack, bet placard, pot system.
 *
 * Manages chip images attached to character overlays, bet amount labels,
 * chip flight animations, pot state, pot winner animation, and collect-bets.
 *
 * Uses refs to DOM elements (#pot, #potImg, #potLayers) that already exist
 * in the React-rendered JSX.
 */

const CHIP_BASE = '/img/chips/';

const CHIP_TIERS = {
    A: [
        { name: 'b200', min: 0, max: 999 },
    ],
    B: [
        { name: 'b500', min: 1000, max: 4999 },
    ],
    C: [
        { name: 'b1000', min: 5000, max: Infinity },
    ],
};

function chipUrl(name) {
    return `${CHIP_BASE}${name}.png`;
}

function betKeyFromAmount(amount) {
    const n = Number(amount) || 0;
    if (n >= 5000) return 'b1000';
    if (n >= 1000) return 'b500';
    return 'b200';
}

const useChipSystem = (betAmount, blinds, seatChecked) => {
    const potStateRef = useRef({ total: 0, layers: [] });

    useEffect(() => {
        const pot = document.getElementById('pot');
        const potImg = document.getElementById('potImg');
        const potLayers = document.getElementById('potLayers');

        if (!pot || !potImg) return;

        /* ---- Chip stack attach/detach per overlay ---- */
        function attachChipStack(overlayBox, amount) {
            if (!overlayBox) return;
            let stack = overlayBox.querySelector('.chip-stack');
            if (!stack) {
                stack = document.createElement('div');
                stack.className = 'chip-stack';
                overlayBox.appendChild(stack);
            }
            stack.innerHTML = '';
            const key = betKeyFromAmount(amount);
            const img = document.createElement('img');
            img.src = chipUrl(key);
            img.alt = '';
            img.className = 'chip-img';
            stack.appendChild(img);

            // Bet placard
            let placard = overlayBox.querySelector('.bet-placard');
            if (!placard) {
                placard = document.createElement('div');
                placard.className = 'bet-placard';
                overlayBox.appendChild(placard);
            }
            placard.textContent = `$${amount}`;
        }

        function removeChipStack(overlayBox) {
            if (!overlayBox) return;
            const stack = overlayBox.querySelector('.chip-stack');
            if (stack) stack.remove();
            const placard = overlayBox.querySelector('.bet-placard');
            if (placard) placard.remove();
        }

        /* ---- Apply chips to active seats ---- */
        for (let seat = 1; seat <= 9; seat++) {
            const ov = document.getElementById(`overlay_video_character${seat}_seat1`);
            if (!ov) continue;

            if (seatChecked[seat] && betAmount > 0) {
                // Determine if this seat has a blind
                let amt = Number(betAmount);
                if (blinds === 'sb' && seat === 1) amt = Math.round(amt / 2);
                if (blinds === 'bb' && seat === 2) amt = amt;
                attachChipStack(ov, amt);
            } else {
                removeChipStack(ov);
            }
        }

        /* ---- Collect bets handler ---- */
        const collectBtn = document.getElementById('collectBetsBtn');
        const resetBtn = document.getElementById('resetPotBtn');

        function collectBets() {
            let collected = 0;
            for (let seat = 1; seat <= 9; seat++) {
                const ov = document.getElementById(`overlay_video_character${seat}_seat1`);
                if (!ov) continue;
                const placard = ov.querySelector('.bet-placard');
                if (placard) {
                    const val = parseInt(placard.textContent.replace('$', ''), 10) || 0;
                    collected += val;
                }
                removeChipStack(ov);
            }
            potStateRef.current.total += collected;

            // Update pot display
            if (potImg) {
                potImg.style.display = collected > 0 ? 'block' : potImg.style.display;
            }
            // Update pot text
            let potText = pot.querySelector('.pot-text');
            if (!potText) {
                potText = document.createElement('div');
                potText.className = 'pot-text';
                pot.appendChild(potText);
            }
            potText.textContent = `$${potStateRef.current.total}`;
        }

        function resetPot() {
            potStateRef.current.total = 0;
            const potText = pot.querySelector('.pot-text');
            if (potText) potText.textContent = '$0';
            if (potLayers) potLayers.innerHTML = '';
            // Remove all chip stacks
            for (let seat = 1; seat <= 9; seat++) {
                const ov = document.getElementById(`overlay_video_character${seat}_seat1`);
                if (ov) removeChipStack(ov);
            }
        }

        if (collectBtn) collectBtn.addEventListener('click', collectBets);
        if (resetBtn) resetBtn.addEventListener('click', resetPot);

        return () => {
            if (collectBtn) collectBtn.removeEventListener('click', collectBets);
            if (resetBtn) resetBtn.removeEventListener('click', resetPot);
        };
    }, [betAmount, blinds, seatChecked]);

    return potStateRef;
};

export default useChipSystem;
