import { useEffect, useRef, useCallback } from 'react';

/**
 * React port of inline script 5 — Character video creation / removal + toggle.
 *
 * Manages `<video>` elements inside #videoContainer.
 * Each seat checkbox drives whether its character video is mounted.
 *
 * Depends on useOverlays (window.__overlayHelpers__) being active.
 */
const useCharacterVideos = (seatChecked, characterView) => {
    const videoMapRef = useRef({}); // { seatNum: HTMLVideoElement }

    useEffect(() => {
        const vc = document.getElementById('videoContainer');
        if (!vc) return;

        const SEAT_VIEW = 1; // seat suffix in video filenames

        function vidId(charNum) {
            return `video_character${charNum}_seat${SEAT_VIEW}`;
        }

        function vidClass(charNum) {
            return `character${charNum}-seat${SEAT_VIEW}`;
        }

        function createVideo(charNum) {
            const id = vidId(charNum);
            if (document.getElementById(id)) return document.getElementById(id);

            const v = document.createElement('video');
            v.id = id;
            v.className = vidClass(charNum);
            v.autoplay = true;
            v.loop = true;
            v.muted = true;
            v.playsInline = true;
            v.setAttribute('playsinline', '');
            v.setAttribute('muted', '');
            v.setAttribute('autoplay', '');
            v.setAttribute('loop', '');
            v.preload = 'auto';
            v.src = `video/character${charNum}-seat${SEAT_VIEW}.webm`;

            vc.appendChild(v);

            // Create overlay via overlay helpers
            if (window.__overlayHelpers__) {
                window.__overlayHelpers__.makeOverlay(v);
                window.__overlayHelpers__.clearEmptySeatForId(id);
            }

            v.play().catch(() => { });

            videoMapRef.current[charNum] = v;
            return v;
        }

        function removeVideo(charNum) {
            const id = vidId(charNum);
            const v = document.getElementById(id);
            if (v) {
                v.pause();
                v.removeAttribute('src');
                v.load();
                if (window.__overlayHelpers__) {
                    window.__overlayHelpers__.removeOverlayFor(v);
                }
                v.remove();
            }
            delete videoMapRef.current[charNum];
        }

        // Sync current checkbox state to videos
        for (let seat = 1; seat <= 9; seat++) {
            const shouldExist = !!seatChecked[seat];
            const exists = !!document.getElementById(vidId(seat));
            if (shouldExist && !exists) {
                createVideo(seat);
            } else if (!shouldExist && exists) {
                removeVideo(seat);
                // Show empty seat overlay
                if (window.__overlayHelpers__) {
                    // Create ghost for positioning then show empty
                    const ghost = document.createElement('video');
                    ghost.id = vidId(seat);
                    ghost.className = vidClass(seat);
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
            }
        }

        return () => {
            // Cleanup: remove all videos this hook created
            for (let seat = 1; seat <= 9; seat++) {
                removeVideo(seat);
            }
        };
    }, [seatChecked]);

    return videoMapRef;
};

export default useCharacterVideos;
