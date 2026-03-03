import { useEffect, useRef } from 'react';

/**
 * React port of inline scripts 7, 8, 9 — Zoom system.
 *
 * Script 7: Hold-to-zoom on #zoomArea — scales the view up.
 * Script 8: Hides characters during zoom (adds `chars-hidden` class).
 * Script 9: Chip stack + pot fade/unfade using WAAPI during zoom.
 */
const useZoom = () => {
    useEffect(() => {
        const zoomArea = document.getElementById('zoomArea');
        if (!zoomArea) return;

        const root = document.documentElement;
        const Z_MAX = parseFloat(getComputedStyle(root).getPropertyValue('--z-max')) || 2.5;
        const SPEED_IN = parseFloat(getComputedStyle(root).getPropertyValue('--z-speed-in')) || 0.02;
        const SPEED_OUT = parseFloat(getComputedStyle(root).getPropertyValue('--z-speed-out')) || 0.04;

        let zoom = 1;
        let holding = false;
        let rafId;

        function tick() {
            if (holding && zoom < Z_MAX) {
                zoom = Math.min(Z_MAX, zoom + SPEED_IN);
            } else if (!holding && zoom > 1) {
                zoom = Math.max(1, zoom - SPEED_OUT);
            }

            root.style.setProperty('--zoom', zoom.toString());

            // Script 8: toggle chars-hidden
            const vc = document.getElementById('videoContainer');
            const chairsLayer = document.getElementById('chairsLayer');
            if (zoom > 1.1) {
                vc?.classList.add('chars-hidden');
                chairsLayer?.classList.add('chars-hidden');
            } else {
                vc?.classList.remove('chars-hidden');
                chairsLayer?.classList.remove('chars-hidden');
            }

            // Script 9: chip/pot fade via filter
            const pot = document.getElementById('pot');
            if (pot) {
                const opacity = zoom > 1.2 ? Math.max(0, 1 - (zoom - 1.2) / 0.8) : 1;
                pot.style.opacity = opacity.toString();
            }

            // Fade chip stacks
            document.querySelectorAll('.chip-stack, .bet-placard').forEach(el => {
                const opacity = zoom > 1.2 ? Math.max(0, 1 - (zoom - 1.2) / 0.8) : 1;
                el.style.opacity = opacity.toString();
            });

            if (zoom !== 1 || holding) {
                rafId = requestAnimationFrame(tick);
            }
        }

        function onPointerDown(e) {
            holding = true;
            zoomArea.setPointerCapture(e.pointerId);
            rafId = requestAnimationFrame(tick);
        }

        function onPointerUp(e) {
            holding = false;
            zoomArea.releasePointerCapture(e.pointerId);
        }

        zoomArea.addEventListener('pointerdown', onPointerDown);
        zoomArea.addEventListener('pointerup', onPointerUp);
        zoomArea.addEventListener('pointercancel', onPointerUp);

        return () => {
            cancelAnimationFrame(rafId);
            zoomArea.removeEventListener('pointerdown', onPointerDown);
            zoomArea.removeEventListener('pointerup', onPointerUp);
            zoomArea.removeEventListener('pointercancel', onPointerUp);
            root.style.removeProperty('--zoom');
        };
    }, []);
};

export default useZoom;
