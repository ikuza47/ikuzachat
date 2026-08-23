(function () {
    const root = window.IkuzaChatV2;
    const utils = root.utils;
    const trustedUsers = new Set(['ikuza47', 'hellcake47', 'yatagarasu_gg']);
    const imageExtensions = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif']);
    const videoExtensions = new Set(['mp4', 'webm', 'mov', 'ogg']);

    function isAllowed(payload) {
        if (!root.config.media.enabled) return false;
        const username = String(payload.username || '').toLowerCase();
        if (trustedUsers.has(username)) return true;

        const badges = root.badges.parse(payload.tags || '');
        return badges.some((badge) => badge.type === 'broadcaster' || badge.type === 'moderator');
    }

    function getExtension(url) {
        try {
            const path = new URL(url).pathname;
            const match = path.match(/\.([a-z0-9]+)$/i);
            return match ? match[1].toLowerCase() : '';
        } catch (error) {
            return '';
        }
    }

    function getMediaType(url) {
        const extension = getExtension(url);
        if (imageExtensions.has(extension)) return 'image';
        if (videoExtensions.has(extension)) return 'video';
        return '';
    }

    function findUrls(text) {
        return String(text || '').match(/https?:\/\/[^\s<]+/gi) || [];
    }

    function createCard(url, type, index) {
        const safeUrl = utils.sanitizeUrl(url);
        if (!safeUrl) return '';
        const content = type === 'video'
            ? `<video class="messagemediaelement" src="${safeUrl}" muted autoplay loop playsinline preload="metadata"></video>`
            : `<img class="messagemediaelement" src="${safeUrl}" alt="media" loading="lazy">`;

        return `<div class="messagemedia messagemedia-${type}" style="animation-delay: ${index * 90}ms">${content}</div>`;
    }

    async function extractCards(text, payload) {
        if (!isAllowed(payload)) return { text, html: '' };

        const cards = [];
        let cleanText = text;
        for (const url of findUrls(text)) {
            const type = getMediaType(url);
            if (!type) continue;
            const card = createCard(url, type, cards.length);
            if (!card) continue;

            cards.push(card);
            cleanText = cleanText.replace(url, '').replace(utils.escapeHtml(url), '');
        }

        return {
            text: cleanText.replace(/\s{2,}/g, ' ').trim(),
            html: cards.join('')
        };
    }

    root.media = { extractCards };
}());
