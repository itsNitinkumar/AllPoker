import { useEffect, useRef } from 'react';

/**
 * React port of inline script 6 — Video container drag.
 *
 * Allows pointer-drag on #videoContainer to nudge all character videos
 * within a MAX_RADIUS of 10px.
 */
const useVideoDrag = () => {
    useEffect(() => {
        const vc = document.getElementById('videoContainer');
        if (!vc) return;

        const MAX_RADIUS = 10;
        let dragging = false;
        let startX = 0, startY = 0;
        let offsetX = 0, offsetY = 0;

        function clamp(val) {
            return Math.max(-MAX_RADIUS, Math.min(MAX_RADIUS, val));
        }

        function applyOffset() {
            vc.querySelectorAll('video:not([data-ghost])').forEach(v => {
                v.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            });
        }

        function onPointerDown(e) {
            if (e.target.closest('.overlay-box')) return; // don't drag from overlays
            dragging = true;
            startX = e.clientX - offsetX;
            startY = e.clientY - offsetY;
            vc.setPointerCapture(e.pointerId);
        }

        function onPointerMove(e) {
            if (!dragging) return;
            offsetX = clamp(e.clientX - startX);
            offsetY = clamp(e.clientY - startY);
            applyOffset();
        }

        function onPointerUp(e) {
            dragging = false;
            vc.releasePointerCapture(e.pointerId);
        }

        vc.addEventListener('pointerdown', onPointerDown);
        vc.addEventListener('pointermove', onPointerMove);
        vc.addEventListener('pointerup', onPointerUp);

        return () => {
            vc.removeEventListener('pointerdown', onPointerDown);
            vc.removeEventListener('pointermove', onPointerMove);
            vc.removeEventListener('pointerup', onPointerUp);
        };
    }, []);
};

export default useVideoDrag;
