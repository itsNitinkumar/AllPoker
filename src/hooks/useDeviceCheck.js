import { useEffect, useRef } from 'react';

/**
 * React port of inline script 25 — Device size check.
 *
 * Shows a "rotate device" or "device not supported" message
 * in the #turn element when the viewport is too small.
 *
 * Manages `device-too-small` class on document.body.
 */

const DEFAULT_ROTATE_MESSAGE = 'Please rotate your device!';
const TOO_SMALL_MESSAGE = 'Your device is not supported.<br>Please use a larger phone, tablet, or desktop.';

const useDeviceCheck = () => {
    useEffect(() => {
        function update() {
            const w = window.innerWidth || document.documentElement.clientWidth;
            const h = window.innerHeight || document.documentElement.clientHeight;
            const turn = document.getElementById('turn');
            if (!turn) return;

            const tooSmall = (w <= 750 && h >= 450 && h <= 550);
            document.body.classList.toggle('device-too-small', tooSmall);

            if (tooSmall) {
                turn.innerHTML = TOO_SMALL_MESSAGE;
            } else {
                turn.innerHTML = DEFAULT_ROTATE_MESSAGE;
            }
        }

        update();
        window.addEventListener('resize', update);

        return () => {
            window.removeEventListener('resize', update);
            document.body.classList.remove('device-too-small');
        };
    }, []);
};

export default useDeviceCheck;
