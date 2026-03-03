import { useEffect, useRef, useCallback } from 'react';

/**
 * React port of inline script 5 — Gesture system.
 *
 * Maps gesture selector values to character video time segments.
 * When a gesture is selected, seeks each active video to the start time,
 * plays the segment, then pauses at the end.
 *
 * Gesture time map (from legacy):
 *   0.00 → 3.00   Angry
 *   3.00 → 8.50   Bet
 *   7.00 → 11.00  Extra
 *   9.50 → 17.00  Disbelief
 *  14.50 → 22.00  Look At Cards
 *  18.00 → 26.00  Check 1
 *  21.50 → 30.00  Happy
 *  26.00 → 34.00  All-In
 *  30.50 → 34.00  Idle
 */

const GESTURE_MAP = {
    '0.00': { start: 0, end: 3 },
    '3.00': { start: 3.5, end: 8.5 },
    '7.00': { start: 8.5, end: 11 },
    '9.50': { start: 11.5, end: 17 },
    '14.50': { start: 17, end: 22 },
    '18.00': { start: 22, end: 26 },
    '21.50': { start: 26, end: 30 },
    '26.00': { start: 30, end: 34 },
    '30.50': { start: 30, end: 34 },
};

const useGestures = (gestureValue, seatChecked) => {
    const timersRef = useRef([]);

    // Get all active character videos
    const getActiveVideos = useCallback(() => {
        const videos = [];
        for (let seat = 1; seat <= 9; seat++) {
            if (!seatChecked[seat]) continue;
            const v = document.getElementById(`video_character${seat}_seat1`);
            if (v && !v.hasAttribute('data-ghost')) videos.push(v);
        }
        return videos;
    }, [seatChecked]);

    // Expose for emoji system
    useEffect(() => {
        window.__getGestureTargets = getActiveVideos;
        return () => { delete window.__getGestureTargets; };
    }, [getActiveVideos]);

    // Trigger gesture play
    const triggerGesture = useCallback(() => {
        const segment = GESTURE_MAP[gestureValue];
        if (!segment) return;

        // Clear any existing timers
        timersRef.current.forEach(t => clearTimeout(t));
        timersRef.current = [];

        const videos = getActiveVideos();
        videos.forEach(v => {
            v.currentTime = segment.start;
            v.play().catch(() => { });

            // Pause at segment end
            const duration = (segment.end - segment.start) * 1000;
            const t = setTimeout(() => {
                if (v.currentTime >= segment.end - 0.1) {
                    v.pause();
                }
            }, duration);
            timersRef.current.push(t);
        });
    }, [gestureValue, getActiveVideos]);

    // Expose globally for emoji click handler
    useEffect(() => {
        window.triggerGesture = triggerGesture;
        return () => { delete window.triggerGesture; };
    }, [triggerGesture]);

    // When gesture value changes, trigger it
    useEffect(() => {
        if (gestureValue !== '0.00') {
            triggerGesture();
        }
    }, [gestureValue, triggerGesture]);

    return { triggerGesture, getActiveVideos };
};

export default useGestures;
