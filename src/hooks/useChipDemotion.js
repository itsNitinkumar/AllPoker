import { useEffect } from 'react';

/**
 * React port of inline script 12 — Chip stack demotion (z-ordering).
 *
 * Adjusts z-index of chip stacks for seats 1, 2, 9 to prevent
 * them from overlapping videos at higher z-indices.
 */

const PINNED_SEATS = [1, 2, 9];
const DEMOTED_Z = '5'; // below video z-index (typically 10+)

const useChipDemotion = (seatChecked) => {
    useEffect(() => {
        PINNED_SEATS.forEach(seat => {
            const ov = document.getElementById(`overlay_video_character${seat}_seat1`);
            if (!ov) return;

            const stack = ov.querySelector('.chip-stack');
            if (stack) {
                stack.style.zIndex = DEMOTED_Z;
            }
        });
    }, [seatChecked]);
};

export default useChipDemotion;
