import { useEffect, useCallback, useRef } from 'react';

/**
 * React port of inline script 1 — Overlay helpers.
 *
 * Creates / removes / repositions `.overlay-box` divs inside #videoContainer
 * so that each character video has a floating overlay aligned to its bounding box.
 *
 * Exposes the same API surface as the legacy `window.__overlayHelpers__` so that
 * other hooks (useCharacterVideos, useOpenSeats, etc.) can call them.
 */
const useOverlays = () => {
    const helpersRef = useRef(null);

    useEffect(() => {
        const vc = document.getElementById('videoContainer');
        if (!vc) return;

        /* ---- overlay creation / positioning ---- */
        function makeOverlay(videoEl) {
            if (!videoEl || !videoEl.id) return null;
            const overlayId = 'overlay_' + videoEl.id;
            let box = document.getElementById(overlayId);
            if (!box) {
                box = document.createElement('div');
                box.id = overlayId;
                box.className = 'overlay-box';
                vc.appendChild(box);
            }
            repositionOverlay(videoEl, box);
            return box;
        }

        function repositionOverlay(videoEl, box) {
            if (!videoEl || !box) return;
            const r = videoEl.getBoundingClientRect();
            const pr = vc.getBoundingClientRect();
            box.style.position = 'absolute';
            box.style.left = (r.left - pr.left) + 'px';
            box.style.top = (r.top - pr.top) + 'px';
            box.style.width = r.width + 'px';
            box.style.height = r.height + 'px';
        }

        function repositionAllOverlays() {
            vc.querySelectorAll('.overlay-box').forEach(box => {
                const vidId = box.id.replace('overlay_', '');
                const vid = document.getElementById(vidId);
                if (vid) repositionOverlay(vid, box);
            });
        }

        function removeOverlayFor(videoEl) {
            if (!videoEl) return;
            const ov = document.getElementById('overlay_' + videoEl.id);
            if (ov) ov.remove();
        }

        /* ---- empty-seat PNG display ---- */
        function showEmptySeatForId(vidId) {
            const ov = document.getElementById('overlay_' + vidId);
            if (!ov) return;
            ov.dataset.empty = '1';

            // Add OPEN label if not present
            if (!ov.querySelector('.open-label')) {
                const lbl = document.createElement('div');
                lbl.className = 'open-label';
                lbl.textContent = 'OPEN';
                ov.appendChild(lbl);
            }

            // Show the empty-seat PNG
            const seatMatch = vidId.match(/character(\d+)_seat(\d+)/);
            if (seatMatch) {
                let img = ov.querySelector('img.empty-seat-img');
                if (!img) {
                    img = document.createElement('img');
                    img.className = 'empty-seat-img';
                    img.alt = '';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    ov.insertBefore(img, ov.firstChild);
                }
                img.src = `video/character${seatMatch[1]}-seat${seatMatch[2]}.png`;
            }
        }

        function clearEmptySeatForId(vidId) {
            const ov = document.getElementById('overlay_' + vidId);
            if (!ov) return;
            delete ov.dataset.empty;
            const lbl = ov.querySelector('.open-label');
            if (lbl) lbl.remove();
            const img = ov.querySelector('img.empty-seat-img');
            if (img) img.remove();
        }

        const helpers = {
            makeOverlay,
            removeOverlayFor,
            repositionAllOverlays,
            showEmptySeatForId,
            clearEmptySeatForId,
        };

        helpersRef.current = helpers;

        // Expose on window so other hooks can access (matches legacy API)
        window.__overlayHelpers__ = helpers;

        /* ---- continuous repositioning tick (script 4) ---- */
        let rafId;
        const bgVideo = document.getElementById('backgroundVideo');

        function tick() {
            repositionAllOverlays();
            // Use requestVideoFrameCallback if available for tighter sync
            if (bgVideo && typeof bgVideo.requestVideoFrameCallback === 'function') {
                bgVideo.requestVideoFrameCallback(tick);
            } else {
                rafId = requestAnimationFrame(tick);
            }
        }

        if (bgVideo && typeof bgVideo.requestVideoFrameCallback === 'function') {
            bgVideo.requestVideoFrameCallback(tick);
        } else {
            rafId = requestAnimationFrame(tick);
        }

        return () => {
            cancelAnimationFrame(rafId);
            delete window.__overlayHelpers__;
            helpersRef.current = null;
        };
    }, []);

    return helpersRef;
};

export default useOverlays;
