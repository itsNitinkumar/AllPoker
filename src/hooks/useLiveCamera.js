import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

/**
 * React port of inline script 11 — Live camera PIP.
 *
 * When videoPanelOpen is true in Redux, captures getUserMedia stream
 * and pushes it into #localVideo. On close, stops all tracks.
 */
const useLiveCamera = () => {
    const videoPanelOpen = useSelector((state) => state.ui.videoPanelOpen);
    const streamRef = useRef(null);

    useEffect(() => {
        const video = document.getElementById('localVideo');
        if (!video) return;

        if (videoPanelOpen) {
            // Start camera
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(stream => {
                    streamRef.current = stream;
                    video.srcObject = stream;
                    video.play().catch(() => { });
                })
                .catch(err => {
                    console.warn('Camera not available:', err.message);
                });
        } else {
            // Stop camera
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
            video.srcObject = null;
        }

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
                streamRef.current = null;
            }
        };
    }, [videoPanelOpen]);
};

export default useLiveCamera;
