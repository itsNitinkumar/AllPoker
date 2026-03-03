import { useEffect, useRef } from 'react';

/**
 * React port of inline script 10 — Time-of-day background video switching.
 *
 * Cycles the #backgroundVideo source between morning/day/evening/night
 * based on real clock time. Uses localStorage for optional offset.
 * Fader transitions between sources.
 */

const TIME_VIDEOS = {
    morning: 'video/morning.mp4',
    day: 'video/day.mp4',
    evening: 'video/evening.mp4',
    night: 'video/night.mp4',
};

function getTimePeriod(hour) {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'day';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
}

const useTimeOfDay = () => {
    const currentPeriodRef = useRef(null);

    useEffect(() => {
        const bgVideo = document.getElementById('backgroundVideo');
        const fader = document.getElementById('bgFader');
        if (!bgVideo) return;

        const offset = parseInt(localStorage.getItem('timeOffset') || '0', 10);

        function getAdjustedHour() {
            const now = new Date();
            return (now.getHours() + offset + 24) % 24;
        }

        function setVideoSrc(period) {
            const src = TIME_VIDEOS[period];
            if (!src) return;
            if (bgVideo.getAttribute('src') === src) return;

            // Fade out
            if (fader) {
                fader.style.opacity = '1';
                fader.style.transition = 'opacity 0.8s ease';
            }

            setTimeout(() => {
                bgVideo.src = src;
                bgVideo.load();
                bgVideo.play().catch(() => { });

                // Fade in
                if (fader) {
                    setTimeout(() => {
                        fader.style.opacity = '0';
                    }, 200);
                }
            }, 800);
        }

        function update() {
            const hour = getAdjustedHour();
            const period = getTimePeriod(hour);
            if (period !== currentPeriodRef.current) {
                currentPeriodRef.current = period;
                setVideoSrc(period);
            }
        }

        // Initial check
        update();

        // Check every 60 seconds
        const intervalId = setInterval(update, 60000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return currentPeriodRef;
};

export default useTimeOfDay;
