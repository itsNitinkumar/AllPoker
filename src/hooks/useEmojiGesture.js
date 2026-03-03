import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { closeEmojiPanel } from '../store/uiSlice';

/**
 * React port of inline script 27 — Emoji → Gesture + GIF.
 *
 * When an emoji image is clicked in the emoji panel:
 *   1) Closes the emoji panel
 *   2) Sets the gesture selector to the matching animation
 *   3) Plays the matching GIF overlay on the target character
 */

const EMOJI_TO_GESTURE = {
    'brain-emoji.svg': '9.50',
    'sad-emoji.svg': '9.50',
    'sad-emoji3.svg': '9.50',
    'dolar-emoji.svg': '21.50',
    'smily-emoji2.svg': '21.50',
    'thumbup-emoji.svg': '21.50',
    'sad-emoji2.svg': '30.50',
    'silence-emoji.svg': '30.50',
    'ill-emoji.svg': '30.50',
    'blind-emoji.svg': '30.50',
};

function baseName(path) {
    const s = (path || '').split('?')[0].split('#')[0];
    return s.substring(s.lastIndexOf('/') + 1);
}

function gifForEmojiFile(file) {
    if (file.endsWith('.svg')) return 'images/' + file.replace(/\.svg$/i, '.gif');
    return null;
}

const useEmojiGesture = (setGesture) => {
    const dispatch = useDispatch();

    useEffect(() => {
        function getTargetVideo() {
            try {
                if (typeof window.__getGestureTargets === 'function') {
                    const vids = window.__getGestureTargets() || [];
                    if (vids.length) return vids[0];
                }
            } catch (e) { }
            return document.getElementById('video_character1_seat1');
        }

        function getTargetOverlay() {
            const v = getTargetVideo();
            if (!v) return null;
            const box = document.getElementById('overlay_' + v.id);
            if (!box) return null;
            if (box.dataset?.empty === '1') return null;
            return box;
        }

        function ensureLayer(box) {
            let layer = box.querySelector('.reaction-layer');
            if (!layer) {
                layer = document.createElement('div');
                layer.className = 'reaction-layer';
                box.appendChild(layer);
            }
            return layer;
        }

        function ensureGif(layer) {
            let img = layer.querySelector('img.react-gif[data-reaction-demo="1"]');
            if (!img) {
                img = document.createElement('img');
                img.className = 'react-gif';
                img.setAttribute('data-seat1-demo', '1');
                img.alt = '';
                img.decoding = 'async';
                img.style.display = 'none';
                layer.appendChild(img);
            }
            return img;
        }

        function getOnePlayMs() {
            const raw = getComputedStyle(document.documentElement).getPropertyValue('--react-gif-ms').trim();
            let ms = 1400;
            if (raw) {
                const n = parseFloat(raw);
                if (!Number.isNaN(n)) ms = raw.endsWith('s') ? n * 1000 : n;
            }
            return Math.max(ms, 1400);
        }

        function startOnce(gifSrc) {
            const box = getTargetOverlay();
            if (!box) return null;

            const layer = ensureLayer(box);
            const img = ensureGif(layer);

            img.style.display = 'none';
            img.onload = () => { img.style.display = 'block'; };
            img.onerror = () => { img.style.display = 'none'; };

            const bust = (gifSrc.indexOf('?') >= 0 ? '&' : '?') + 'r=' + Date.now() + '_' + Math.random().toString(16).slice(2);
            img.src = gifSrc + bust;
            return img;
        }

        function playTwice(gifSrc) {
            if (!gifSrc) return;
            const one = getOnePlayMs();
            const img1 = startOnce(gifSrc);
            if (!img1) return;

            clearTimeout(img1.__t1);
            clearTimeout(img1.__t2);

            img1.__t1 = setTimeout(() => { startOnce(gifSrc); }, one);
            img1.__t2 = setTimeout(() => {
                const box = getTargetOverlay();
                if (!box) return;
                const img = box.querySelector('img.react-gif[data-reaction-demo="1"]');
                if (img) img.style.display = 'none';
            }, one * 2);
        }

        function onClick(e) {
            // Ignore close button
            const closeBtn = e.target?.closest?.('a.buy-cross, button.buy-cross');
            if (closeBtn) return;

            // Only handle emoji images in the emojis tab
            const emojiImg = e.target?.closest?.('.emoji-main #profile-tab-pane img, .emoji-main [id="profile-tab-pane"] img');
            if (!emojiImg) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const file = baseName(emojiImg.getAttribute('src') || emojiImg.src || '');
            const gestureVal = EMOJI_TO_GESTURE[file] || null;
            const gifSrc = gifForEmojiFile(file);

            // 1) Close emoji panel via Redux
            dispatch(closeEmojiPanel());

            // 2) Set gesture and trigger animation
            if (gestureVal && typeof setGesture === 'function') {
                setGesture(gestureVal);
            }
            if (gestureVal && typeof window.triggerGesture === 'function') {
                window.triggerGesture();
            }

            // 3) Play GIF overlay
            if (gifSrc) playTwice(gifSrc);
        }

        window.addEventListener('click', onClick, true);
        return () => window.removeEventListener('click', onClick, true);
    }, [dispatch, setGesture]);
};

export default useEmojiGesture;
