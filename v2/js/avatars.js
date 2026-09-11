(function () {
    const root = window.IkuzaChatV2 = window.IkuzaChatV2 || {};
    const utils = root.utils || { log: console.log, escapeAttribute: (s) => s };
    const cache = new Map();

    // Default SVG fallback avatar
    const defaultAvatarSvg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23888888'%3E%3Cpath d='M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z'/%3E%3C/svg%3E";

    // Demo avatars for test mode
    const testAvatars = {
        'ikuza47': 'https://static-cdn.jtvnw.net/jtv_user_pictures/345833a2-99e5-4d2c-8536-ad104b698fbb-profile_image-300x300.png',
        'hellcake47': 'https://static-cdn.jtvnw.net/jtv_user_pictures/7492c300-30fc-4c8d-8c10-09fa496e57d3-profile_image-300x300.png',
        'yatagarasu_gg': 'https://static-cdn.jtvnw.net/jtv_user_pictures/0b457ec7-f350-4ba2-9213-39dcaaa93699-profile_image-300x300.png'
    };

    async function fetchAvatarUrl(username) {
        const key = String(username || '').toLowerCase().trim();
        if (!key) return null;

        if (cache.has(key)) {
            return cache.get(key);
        }

        if (testAvatars[key]) {
            cache.set(key, testAvatars[key]);
            return testAvatars[key];
        }

        const promise = (async () => {
            try {
                const response = await fetch('https://decapi.me/twitch/avatar/' + encodeURIComponent(key));
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                const text = (await response.text()).trim();
                if (text && /^https?:\/\//i.test(text)) {
                    return text;
                }
                return null;
            } catch (err) {
                utils.log('Failed to fetch avatar for', key, err);
                return null;
            }
        })();

        cache.set(key, promise);
        try {
            const result = await promise;
            cache.set(key, result);
            return result;
        } catch (e) {
            cache.set(key, null);
            return null;
        }
    }

    function createAvatarHtml(username, avatarUrl, config) {
        const safeName = utils.escapeAttribute ? utils.escapeAttribute(username) : username;
        const src = avatarUrl || defaultAvatarSvg;
        const shape = (config && config.avatarShape) || 'circle';
        return `<img class="user-avatar user-avatar-${shape}" src="${src}" alt="${safeName}" onerror="this.src='${defaultAvatarSvg}'" loading="lazy">`;
    }

    root.avatars = {
        fetchAvatarUrl,
        createAvatarHtml,
        defaultAvatarSvg,
        cache
    };
}());
