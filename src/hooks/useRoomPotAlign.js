import { useEffect } from 'react';

/**
 * React port of inline script 22 — Room pot alignment.
 *
 * Mirrors Room 1's pot position onto rooms 2–4 using relative offsets.
 * Also lifts chip stacks in non-primary rooms above the table.
 */
const useRoomPotAlign = (activeRoom) => {
    useEffect(() => {
        if (activeRoom === 1) {
            // Hide pots for rooms 2-4
            [2, 3, 4].forEach(n => {
                const p = document.getElementById('pot_' + n);
                if (p) {
                    p.style.display = 'none';
                    p.style.visibility = 'hidden';
                }
            });
            return;
        }

        function getRoom1Delta() {
            const pot = document.getElementById('pot');
            const zoom = document.getElementById('zoomArea');
            if (!pot || !zoom) return null;
            const pr = pot.getBoundingClientRect();
            const zr = zoom.getBoundingClientRect();
            return {
                dx: pr.left - zr.right,
                dy: pr.top - (zr.top + zr.height / 2),
                width: getComputedStyle(pot).width || '120px',
                z: getComputedStyle(pot).zIndex || '30',
                transform: getComputedStyle(pot).transform,
            };
        }

        function placePot(n, base) {
            if (!base) return;
            const pot = document.getElementById('pot_' + n);
            const zoom = document.getElementById('zoomArea_' + n);
            if (!pot || !zoom) return;

            const zr = zoom.getBoundingClientRect();
            pot.style.position = 'fixed';
            pot.style.left = (zr.right + base.dx) + 'px';
            pot.style.top = (zr.top + zr.height / 2 + base.dy) + 'px';
            pot.style.width = base.width;
            pot.style.zIndex = base.z;
            pot.style.pointerEvents = 'none';
            pot.style.transform = (base.transform && base.transform !== 'none') ? base.transform : 'translateY(-50%)';
            pot.style.visibility = 'visible';
            pot.style.display = 'block';
        }

        function settleChipStacks(vc) {
            if (!vc) return;
            vc.querySelectorAll('.chips, .chip-stack, .stack, .bet, .chips-layer, [data-role="chips"]').forEach(el => {
                if (!el.style.position) el.style.position = 'absolute';
                el.style.zIndex = '22';
                el.style.pointerEvents = 'none';
            });
            vc.offsetWidth;
            requestAnimationFrame(() => { vc.offsetHeight; });
        }

        // Show only active room pot
        [2, 3, 4].forEach(n => {
            const p = document.getElementById('pot_' + n);
            if (!p) return;
            p.style.display = (n === activeRoom) ? 'block' : 'none';
            p.style.visibility = (n === activeRoom) ? 'visible' : 'hidden';
        });

        requestAnimationFrame(() => {
            const base = getRoom1Delta();
            placePot(activeRoom, base);
            const vc = document.getElementById('videoContainer_' + activeRoom);
            settleChipStacks(vc);
        });

        // Re-align on resize
        const onResize = () => {
            requestAnimationFrame(() => {
                const base = getRoom1Delta();
                placePot(activeRoom, base);
            });
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [activeRoom]);
};

export default useRoomPotAlign;
