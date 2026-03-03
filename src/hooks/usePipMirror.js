import { useEffect, useRef } from 'react';

/**
 * React port of inline script 29 — PIP mirror.
 *
 * Mirrors .live-pip video elements outside overflow:hidden containers
 * by creating a fixed-position clone on document.body.
 */

const MIRROR_Z = 8;

const usePipMirror = () => {
    const mirrorsRef = useRef(new Map());

    useEffect(() => {
        function ensureMirror(pip) {
            if (!pip || pip.tagName !== 'VIDEO') return null;

            let mirrorId = pip.getAttribute('data-pip-mirror-id');
            let mirror = mirrorId ? document.getElementById(mirrorId) : null;

            if (!mirror) {
                mirrorId = 'pip-mirror-' + Math.random().toString(16).slice(2);
                pip.setAttribute('data-pip-mirror-id', mirrorId);

                mirror = document.createElement('video');
                mirror.id = mirrorId;
                mirror.className = 'live-pip-mirror';
                mirror.autoplay = true;
                mirror.muted = true;
                mirror.playsInline = true;
                mirror.style.pointerEvents = 'none';
                mirror.style.position = 'fixed';
                mirror.style.zIndex = String(MIRROR_Z);
                document.body.appendChild(mirror);
                mirrorsRef.current.set(mirrorId, mirror);
            }

            try {
                if (pip.srcObject && mirror.srcObject !== pip.srcObject) {
                    mirror.srcObject = pip.srcObject;
                } else if (!pip.srcObject && pip.currentSrc && mirror.src !== pip.currentSrc) {
                    mirror.src = pip.currentSrc;
                }
            } catch (e) { }

            return mirror;
        }

        function syncOne(pip) {
            const mirror = ensureMirror(pip);
            if (!mirror) return;

            const r = pip.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) {
                mirror.style.display = 'none';
                return;
            }

            mirror.style.display = 'block';
            mirror.style.left = r.left + 'px';
            mirror.style.top = r.top + 'px';
            mirror.style.width = r.width + 'px';
            mirror.style.height = r.height + 'px';
            mirror.style.borderRadius = getComputedStyle(pip).borderRadius;
            mirror.style.objectFit = getComputedStyle(pip).objectFit || 'cover';
            mirror.style.transform = 'none';
            mirror.style.transformOrigin = '0 0';
        }

        function syncAll() {
            document.querySelectorAll('video.live-pip').forEach(syncOne);
        }

        function rafSync() { requestAnimationFrame(syncAll); }

        rafSync();

        window.addEventListener('resize', rafSync, { passive: true });
        window.addEventListener('scroll', rafSync, { passive: true });

        const intervalId = setInterval(rafSync, 250);

        return () => {
            window.removeEventListener('resize', rafSync);
            window.removeEventListener('scroll', rafSync);
            clearInterval(intervalId);
            // Remove all mirrors
            mirrorsRef.current.forEach(m => m.remove());
            mirrorsRef.current.clear();
        };
    }, []);
};

export default usePipMirror;
