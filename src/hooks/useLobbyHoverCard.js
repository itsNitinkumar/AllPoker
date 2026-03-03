import { useEffect, useRef } from 'react';

/**
 * React port of inline script 19 — Lobby hover cards.
 *
 * Shows a floating preview card (image or video) when hovering
 * over .lobby-btn elements inside #lobbyMenu.
 */
const useLobbyHoverCard = () => {
    const cardRef = useRef(null);
    const mediaRef = useRef(null);
    const activeBtnRef = useRef(null);
    const hideTimerRef = useRef(null);

    useEffect(() => {
        const menu = document.getElementById('lobbyMenu');
        if (!menu) return;

        // Create reusable hover card
        const card = document.createElement('div');
        card.className = 'lobby-hover-card';
        card.innerHTML = `<div class="lobby-hover-card__title"></div>`;
        document.body.appendChild(card);
        cardRef.current = card;

        function ensureMediaEl(tag) {
            if (mediaRef.current && mediaRef.current.tagName.toLowerCase() === tag) return mediaRef.current;
            if (mediaRef.current) mediaRef.current.remove();
            const el = document.createElement(tag);
            el.className = 'lobby-hover-card__media';
            if (tag === 'video') {
                el.autoplay = true;
                el.loop = true;
                el.muted = true;
                el.playsInline = true;
            }
            card.insertBefore(el, card.firstChild);
            mediaRef.current = el;
            return el;
        }

        function getTarget(btn) {
            const sel = btn.getAttribute('data-target');
            if (!sel) return null;
            return document.querySelector(sel);
        }

        function getMediaFromTarget(target) {
            if (!target) return null;
            const vid = target.querySelector('video');
            const img = target.querySelector('img');
            if (vid && (vid.currentSrc || vid.src)) {
                return { type: 'video', src: vid.currentSrc || vid.src, poster: vid.getAttribute('poster') || '' };
            }
            if (img && img.src) {
                return { type: 'image', src: img.src };
            }
            const dataSrc = target.getAttribute('data-media');
            const dataType = target.getAttribute('data-type');
            if (dataSrc) {
                return { type: (dataType || 'image').toLowerCase(), src: dataSrc };
            }
            return null;
        }

        function positionCard(btn) {
            const rect = btn.getBoundingClientRect();
            const width = Math.round(rect.width);
            card.style.width = width + 'px';
            const ratio = 16 / 9;
            const height = width / ratio;
            const gap = 10;
            let left = Math.round(rect.left);
            let top = Math.round(rect.top - height - gap);
            left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
            if (top < 8) top = Math.round(rect.bottom + gap);
            card.style.left = left + 'px';
            card.style.top = top + 'px';
        }

        function showCard(btn) {
            const target = getTarget(btn);
            const mediaInfo = getMediaFromTarget(target);
            if (!mediaInfo || !mediaInfo.src) return;

            activeBtnRef.current = btn;
            clearTimeout(hideTimerRef.current);

            const titleEl = card.querySelector('.lobby-hover-card__title');
            const titleText = target?.getAttribute('data-title') || btn.textContent.trim();
            if (titleEl) titleEl.textContent = titleText;

            if (mediaInfo.type === 'video') {
                const v = ensureMediaEl('video');
                if (v.src !== mediaInfo.src) {
                    v.src = mediaInfo.src;
                    if (mediaInfo.poster) v.poster = mediaInfo.poster;
                }
                v.currentTime = 0;
                v.play().catch(() => { });
            } else {
                const i = ensureMediaEl('img');
                if (i.src !== mediaInfo.src) i.src = mediaInfo.src;
            }

            positionCard(btn);
            requestAnimationFrame(() => card.classList.add('is-on'));
        }

        function hideCard(immediate = false) {
            clearTimeout(hideTimerRef.current);
            const doHide = () => {
                card.classList.remove('is-on');
                activeBtnRef.current = null;
            };
            if (immediate) doHide();
            else hideTimerRef.current = setTimeout(doHide, 60);
        }

        function onEnter(e) {
            const btn = e.target.closest('.lobby-btn');
            if (!btn) return;
            showCard(btn);
        }

        function onLeave(e) {
            const btn = e.target.closest('.lobby-btn');
            if (!btn) return;
            if (btn === activeBtnRef.current) hideCard();
        }

        menu.addEventListener('mouseenter', onEnter, true);
        menu.addEventListener('mouseleave', onLeave, true);
        menu.addEventListener('focusin', onEnter, true);
        menu.addEventListener('focusout', onLeave, true);

        const onScroll = () => hideCard(true);
        const onResize = () => hideCard(true);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize);

        return () => {
            menu.removeEventListener('mouseenter', onEnter, true);
            menu.removeEventListener('mouseleave', onLeave, true);
            menu.removeEventListener('focusin', onEnter, true);
            menu.removeEventListener('focusout', onLeave, true);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            clearTimeout(hideTimerRef.current);
            card.remove();
            if (mediaRef.current) mediaRef.current.remove();
        };
    }, []);
};

export default useLobbyHoverCard;
