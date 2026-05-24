(function () {
    const utils = window.IkuzaChatV2.utils;
    const cache = {
        global: {},
        channel: {}
    };

    const channelBadgeTypes = new Set([
        'moderator', 'broadcaster', 'vip', 'artist', 'subscriber', 'founder',
        'sub-gifter', 'subscriber-gift-leader'
    ]);

    const achievementBadgeTypes = new Set([
        'premium', 'turbo', 'hype-train', 'first-time-chatter', 'sub-unlocked',
        'bits', 'bits-leader', 'clap', 'cheer', 'hype-chat'
    ]);

    async function fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    function normalizeBadges(items) {
        const result = {};
        if (!Array.isArray(items)) return result;

        for (const badge of items) {
            if (!badge || !badge.set_id || !Array.isArray(badge.versions)) continue;
            result[badge.set_id] = result[badge.set_id] || {};
            for (const version of badge.versions) {
                result[badge.set_id][version.id] = {
                    image_url_1x: version.image_url_1x,
                    image_url_2x: version.image_url_2x,
                    image_url_4x: version.image_url_4x,
                    description: version.description || badge.set_id
                };
            }
        }

        return result;
    }

    async function getTwitchUserId(username) {
        try {
            const data = await fetchJson(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`);
            return data && data[0] && data[0].id ? data[0].id : null;
        } catch (error) {
            utils.log('Unable to resolve Twitch user id', username, error);
            return null;
        }
    }

    async function loadGlobalBadges() {
        if (Object.keys(cache.global).length > 0) return cache.global;

        try {
            cache.global = normalizeBadges(await fetchJson('https://api.ivr.fi/v2/twitch/badges/global'));
        } catch (error) {
            utils.log('Unable to load global badges', error);
            cache.global = {};
        }

        return cache.global;
    }

    async function loadChannelBadges(channelId) {
        if (!channelId) return {};
        if (cache.channel[channelId]) return cache.channel[channelId];

        try {
            cache.channel[channelId] = normalizeBadges(await fetchJson(`https://api.ivr.fi/v2/twitch/badges/channel/${channelId}`));
        } catch (error) {
            utils.log('Unable to load channel badges', channelId, error);
            cache.channel[channelId] = {};
        }

        return cache.channel[channelId];
    }

    async function init(channel) {
        await loadGlobalBadges();
        const channelId = await getTwitchUserId(channel);
        if (channelId) {
            await loadChannelBadges(channelId);
        }
        return channelId;
    }

    function parse(tags) {
        const value = utils.extractTagValue(tags, 'badges');
        if (!value) return [];

        return value.split(',')
            .map((item) => item.split('/'))
            .filter((item) => item[0] && item[1])
            .map(([type, version]) => ({ type, version }));
    }

    function isAllowed(type, config) {
        if (channelBadgeTypes.has(type)) return config.showChannelBadges;
        if (achievementBadgeTypes.has(type)) return config.showAchievementBadges;
        return config.showUserBadges;
    }

    function getBadge(type, version) {
        if (cache.global[type] && cache.global[type][version]) {
            return cache.global[type][version];
        }

        for (const channelId of Object.keys(cache.channel)) {
            const channelBadges = cache.channel[channelId];
            if (channelBadges[type] && channelBadges[type][version]) {
                return channelBadges[type][version];
            }
        }

        return null;
    }

    function createHtml(items, config) {
        const badges = items.filter((badge) => isAllowed(badge.type, config));
        if (badges.length === 0) return '';

        const html = badges.map((badge) => {
            const meta = getBadge(badge.type, badge.version);
            if (!meta) return '';
            const url = meta.image_url_2x || meta.image_url_1x || meta.image_url_4x;
            if (!url) return '';
            return `<img class="badge" src="${utils.sanitizeUrl(url)}" alt="${utils.escapeAttribute(badge.type)}" title="${utils.escapeAttribute(meta.description)}" loading="lazy">`;
        }).join('');

        return html ? `<span class="badges">${html}</span>` : '';
    }

    window.IkuzaChatV2.badges = {
        cache,
        init,
        parse,
        createHtml,
        getTwitchUserId
    };
}());
