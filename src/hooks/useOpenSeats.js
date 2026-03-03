import { useEffect } from 'react';

/**
 * React port of inline script 18 — Empty seats at start (ghost-seeded).
 *
 * Seeds seats 1,2,3,7,8,9 with empty-seat overlays at boot.
 * Also handles clicking "OPEN" on an empty seat to check the corresponding
 * seat checkbox.
 *
 * Script 2 (OPEN click blocking) and Script 17 (toggleOpenSeats)
 * are also integrated here.
 */

const BOOT_SEATS = [1, 2, 3, 7, 8, 9];

const useOpenSeats = (seatChecked, onSeatToggle) => {
    useEffect(() => {
        const vc = document.getElementById('videoContainer');
        if (!vc) return;

        // Wait for overlay helpers to be available
        function readyHelpers(cb) {
            if (
                window.__overlayHelpers__ &&
                typeof window.__overlayHelpers__.makeOverlay === 'function' &&
                typeof window.__overlayHelpers__.showEmptySeatForId === 'function'
            ) {
                cb();
            } else {
                requestAnimationFrame(() => readyHelpers(cb));
            }
        }

        const SEAT_VIEW = 1;
        const vidId = (s) => `video_character${s}_seat${SEAT_VIEW}`;
        const vidCls = (s) => `character${s}-seat${SEAT_VIEW}`;
        const hasReal = (s) => {
            const el = document.getElementById(vidId(s));
            return el && !el.hasAttribute('data-ghost');
        };

        function seedEmptySeat(seat) {
            if (hasReal(seat)) return;
            const id = vidId(seat);
            const ov = document.getElementById(`overlay_${id}`);
            if (ov && ov.dataset.empty === '1') return;

            const ghost = document.createElement('video');
            ghost.id = id;
            ghost.className = vidCls(seat);
            ghost.setAttribute('data-ghost', '1');
            ghost.setAttribute('width', '1080');
            ghost.setAttribute('height', '1920');
            ghost.style.aspectRatio = '9 / 16';
            ghost.style.position = 'absolute';
            ghost.style.opacity = '0';
            ghost.style.pointerEvents = 'none';
            vc.appendChild(ghost);

            window.__overlayHelpers__.makeOverlay(ghost);
            window.__overlayHelpers__.showEmptySeatForId(ghost.id);
            ghost.remove();
        }

        function syncAll() {
            BOOT_SEATS.forEach(seat => {
                if (hasReal(seat)) {
                    window.__overlayHelpers__.clearEmptySeatForId(vidId(seat));
                } else {
                    seedEmptySeat(seat);
                }
            });
        }

        // Handle click on OPEN overlay to toggle seat checkbox
        function onOpenClick(e) {
            const box = e.target.closest('.overlay-box[data-empty="1"]');
            if (!box) return;
            const m = /^overlay_video_character(\d+)_seat1$/.exec(box.id);
            if (!m) return;
            const seat = parseInt(m[1], 10);
            if (!BOOT_SEATS.includes(seat)) return;

            if (typeof onSeatToggle === 'function') {
                onSeatToggle(seat);
            }
        }

        // Script 2: Block OPEN seat clicks when show-open-seats body class is present
        function onOpenBlock(e) {
            if (!document.body.classList.contains('show-open-seats')) return;
            const box = e.target.closest('.overlay-box[data-empty="1"]');
            if (box) {
                const openLabel = box.querySelector('.open-label');
                if (openLabel && !openLabel.contains(e.target)) {
                    e.stopPropagation();
                }
            }
        }

        readyHelpers(() => {
            syncAll();

            // Watch for DOM changes to keep sync
            const mo = new MutationObserver(syncAll);
            mo.observe(vc, { childList: true, subtree: true });

            vc.addEventListener('click', onOpenClick, { passive: true });
            vc.addEventListener('click', onOpenBlock, true);

            window.addEventListener('resize', syncAll, { passive: true });

            // Store cleanup refs
            vc._openSeatsCleanup = () => {
                mo.disconnect();
                vc.removeEventListener('click', onOpenClick);
                vc.removeEventListener('click', onOpenBlock, true);
                window.removeEventListener('resize', syncAll);
            };
        });

        return () => {
            if (vc._openSeatsCleanup) {
                vc._openSeatsCleanup();
                delete vc._openSeatsCleanup;
            }
        };
    }, [seatChecked, onSeatToggle]);
};

export default useOpenSeats;
