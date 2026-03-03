import { useEffect } from 'react';

/**
 * React port of inline script 23 — Room 3 background video playback speed.
 *
 * Forces a specific playback rate on backgroundVideo_3.
 */
const useRoom3Speed = () => {
    useEffect(() => {
        const RATE = 1;
        const v = document.getElementById('backgroundVideo_3');
        if (!v) return;

        function applyRate() {
            if (!v) return;
            v.defaultPlaybackRate = RATE;
            if (v.playbackRate !== RATE) v.playbackRate = RATE;
        }

        const events = ['loadedmetadata', 'loadeddata', 'canplay', 'play', 'playing', 'ratechange', 'seeking', 'seeked'];
        events.forEach(ev => v.addEventListener(ev, applyRate, { passive: true }));

        // Watch for src changes
        const observer = new MutationObserver(muts => {
            for (const m of muts) {
                if (m.type === 'attributes' && (m.attributeName === 'src' || m.attributeName === 'srcObject')) {
                    applyRate();
                }
            }
        });
        observer.observe(v, { attributes: true, attributeFilter: ['src', 'srcObject'] });

        // Watch room3 section activation
        const room3 = document.getElementById('room3Section');
        let sectionObserver;
        if (room3) {
            sectionObserver = new MutationObserver(() => {
                if (room3.classList.contains('active')) applyRate();
            });
            sectionObserver.observe(room3, { attributes: true, attributeFilter: ['class'] });
        }

        applyRate();

        return () => {
            events.forEach(ev => v.removeEventListener(ev, applyRate));
            observer.disconnect();
            if (sectionObserver) sectionObserver.disconnect();
        };
    }, []);
};

export default useRoom3Speed;
