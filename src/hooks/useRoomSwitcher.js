import { useEffect, useRef, useCallback } from 'react';

/**
 * React port of inline scripts 20, 21 — Room switcher.
 *
 * Manages switching between rooms 1–4 when lobby buttons are clicked.
 * Room 1 uses existing DOM elements; rooms 2–4 use .room-section elements.
 * Character layers (#videoContainer, #chairsLayer) are kept visible across rooms.
 */
const useRoomSwitcher = (activeRoom) => {
    const prevRoomRef = useRef(1);

    useEffect(() => {
        const r1 = {
            bgVideo: document.getElementById('backgroundVideo'),
            roomImg: document.querySelector('img.room'),
            tableImg: document.querySelector('img.tabletop'),
            chairs: document.getElementById('chairsLayer'),
            videos: document.getElementById('videoContainer'),
            zoom: document.getElementById('zoomArea'),
            pot: document.getElementById('pot'),
        };

        const sections = {
            2: document.getElementById('room2Section'),
            3: document.getElementById('room3Section'),
            4: document.getElementById('room4Section'),
        };

        const bgVideos = {
            1: r1.bgVideo,
            2: document.getElementById('backgroundVideo_2'),
            3: document.getElementById('backgroundVideo_3'),
            4: document.getElementById('backgroundVideo_4'),
        };

        function hideRoom1(hide) {
            const v = hide ? 'none' : '';
            if (r1.bgVideo) r1.bgVideo.style.display = v;
            if (r1.roomImg) r1.roomImg.style.display = v;
            if (r1.tableImg) r1.tableImg.style.display = v;
            if (r1.chairs) r1.chairs.style.display = v;
            if (r1.videos) r1.videos.style.display = v;
            if (r1.zoom) r1.zoom.style.display = v;
            if (r1.pot) r1.pot.style.display = v;
        }

        function pauseAllExcept(n) {
            for (let i = 1; i <= 4; i++) {
                const v = bgVideos[i];
                if (!v) continue;
                const hasSrc = v.getAttribute('src') || v.currentSrc;
                try {
                    (i === n && hasSrc) ? v.play() : v.pause();
                } catch (e) { }
            }
        }

        function safeSet(el, src, fallback) {
            if (!el) return;
            if (!src) { el.removeAttribute('src'); return; }
            const tag = el.tagName.toLowerCase();
            const onErr = () => { if (fallback) el.src = fallback; };
            el.addEventListener('error', onErr, { once: true });
            el.src = src;
            if (tag === 'video' && el.load) el.load();
        }

        // Deactivate all appended sections
        for (const k of [2, 3, 4]) {
            const s = sections[k];
            if (s) {
                s.classList.remove('active');
                s.setAttribute('aria-hidden', 'true');
            }
        }

        const n = activeRoom;

        if (n === 1) {
            hideRoom1(false);
            pauseAllExcept(1);
        } else {
            const s = sections[n];
            if (!s) {
                hideRoom1(false);
                pauseAllExcept(1);
            } else {
                // Lazy-apply sources from data-* when first activated
                const bgSrc = s.getAttribute('data-bg');
                const roomSrc = s.getAttribute('data-room');
                const tableSrc = s.getAttribute('data-table');

                const v = bgVideos[n];
                const imgRoom = s.querySelector('img.room');
                const imgTable = s.querySelector('img.tabletop');

                const fbVideo = r1.bgVideo ? (r1.bgVideo.getAttribute('src') || r1.bgVideo.currentSrc) : '';
                const fbRoom = r1.roomImg ? r1.roomImg.getAttribute('src') : '';
                const fbTable = r1.tableImg ? r1.tableImg.getAttribute('src') : '';

                if (v && !v.getAttribute('src')) safeSet(v, bgSrc, fbVideo);
                if (imgRoom && !imgRoom.getAttribute('src')) safeSet(imgRoom, roomSrc, fbRoom);
                if (imgTable && !imgTable.getAttribute('src')) safeSet(imgTable, tableSrc, fbTable);

                hideRoom1(true);
                s.classList.add('active');
                s.setAttribute('aria-hidden', 'false');
                pauseAllExcept(n);
            }
        }

        // Script 21: Keep character layers visible across rooms
        if (r1.videos) r1.videos.style.display = '';
        if (r1.chairs) r1.chairs.style.display = '';

        prevRoomRef.current = n;
    }, [activeRoom]);
};

export default useRoomSwitcher;
