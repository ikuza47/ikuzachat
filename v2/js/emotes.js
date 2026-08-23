(function () {
    const utils = window.IkuzaChatV2.utils;
    const cache = {
        twitch: {},
        bttv: {},
        ffz: {},
        sevenTv: {}
    };

    async function fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
    }

    async function getTwitchUserId(username) {
        if (window.IkuzaChatV2.badges) {
            return window.IkuzaChatV2.badges.getTwitchUserId(username);
        }

        try {
            const data = await fetchJson(`https://api.ivr.fi/v2/twitch/user?login=${encodeURIComponent(username)}`);
            return data && data[0] && data[0].id ? data[0].id : null;
        } catch (error) {
            utils.log('Unable to resolve Twitch user id for emotes', username, error);
            return null;
        }
    }

    async function loadTwitch(channelId) {
        if (!channelId) return {};
        if (cache.twitch[channelId]) return cache.twitch[channelId];

        const emotes = {};

        try {
            const globalData = await fetchJson('https://api.ivr.fi/v2/twitch/emotes/global');
            if (Array.isArray(globalData)) {
                for (const emote of globalData) {
                    if (!emote.code || !emote.id) continue;
                    emotes[emote.code] = {
                        url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`,
                        type: 'twitch'
                    };
                }
            }
        } catch (error) {
            utils.log('Unable to load global Twitch emotes', error);
        }

        try {
            const channelData = await fetchJson(`https://api.ivr.fi/v2/twitch/emotes/channel/${channelId}`);
            const channelEmotes = Array.isArray(channelData?.channel) ? channelData.channel : [];
            for (const emote of channelEmotes) {
                if (!emote.code || !emote.id) continue;
                emotes[emote.code] = {
                    url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0`,
                    type: 'twitch'
                };
            }
        } catch (error) {
            utils.log('Unable to load channel Twitch emotes', error);
        }

        cache.twitch[channelId] = emotes;
        return emotes;
    }

    async function loadBTTV(channel, channelId) {
        const cacheKey = channelId || channel;
        if (cache.bttv[cacheKey]) return cache.bttv[cacheKey];
        const emotes = {};

        try {
            const globalData = await fetchJson('https://api.betterttv.net/3/cached/emotes/global');
            if (Array.isArray(globalData)) {
                for (const emote of globalData) {
                    emotes[emote.code] = { url: `https://cdn.betterttv.net/emote/${emote.id}/3x`, type: 'bttv' };
                }
            }
        } catch (error) {
            utils.log('Unable to load global BTTV emotes', error);
        }

        try {
            const data = await fetchJson(`https://api.betterttv.net/3/cached/users/twitch/${cacheKey}`);
            for (const emote of [...(data.channelEmotes || []), ...(data.sharedEmotes || [])]) {
                emotes[emote.code] = { url: `https://cdn.betterttv.net/emote/${emote.id}/3x`, type: 'bttv' };
            }
        } catch (error) {
            utils.log('Unable to load channel BTTV emotes', error);
        }

        cache.bttv[cacheKey] = emotes;
        return emotes;
    }

    async function loadFFZ(channel) {
        if (cache.ffz[channel]) return cache.ffz[channel];
        const emotes = {};

        try {
            const globalData = await fetchJson('https://api.frankerfacez.com/v1/set/global');
            for (const set of Object.values(globalData.sets || {})) {
                for (const emote of set.emoticons || []) {
                    emotes[emote.name] = { url: emote.urls['4'] || emote.urls['2'] || emote.urls['1'], type: 'ffz' };
                }
            }
        } catch (error) {
            utils.log('Unable to load global FFZ emotes', error);
        }

        try {
            const data = await fetchJson(`https://api.frankerfacez.com/v1/room/${channel}`);
            for (const set of Object.values(data.sets || {})) {
                for (const emote of set.emoticons || []) {
                    emotes[emote.name] = { url: emote.urls['4'] || emote.urls['2'] || emote.urls['1'], type: 'ffz' };
                }
            }
        } catch (error) {
            utils.log('Unable to load channel FFZ emotes', error);
        }

        cache.ffz[channel] = emotes;
        return emotes;
    }

    async function loadSevenTv(channelId, force) {
        if (!channelId) return {};
        if (!force && cache.sevenTv[channelId]) return cache.sevenTv[channelId];
        const emotes = {};

        try {
            const globalData = await fetchJson('https://7tv.io/v3/emote-sets/global');
            for (const emote of globalData.emotes || []) {
                emotes[emote.name] = { url: `https://cdn.7tv.app/emote/${emote.id}/2x`, type: '7tv' };
            }
        } catch (error) {
            utils.log('Unable to load global 7TV emotes', error);
        }

        try {
            const data = await fetchJson(`https://7tv.io/v3/users/twitch/${channelId}`);
            for (const emote of data.emote_set?.emotes || []) {
                emotes[emote.name] = { url: `https://cdn.7tv.app/emote/${emote.id}/2x`, type: '7tv' };
            }
        } catch (error) {
            utils.log('Unable to load channel 7TV emotes', error);
        }

        cache.sevenTv[channelId] = emotes;
        return emotes;
    }

    async function init(channel, existingChannelId) {
        const channelId = existingChannelId || await getTwitchUserId(channel);
        await Promise.all([
            loadTwitch(channelId),
            loadBTTV(channel, channelId),
            loadFFZ(channel),
            loadSevenTv(channelId)
        ]);
        return channelId;
    }

    function startSevenTvRefresh(channelId) {
        if (!channelId || startSevenTvRefresh.timer) return;
        startSevenTvRefresh.timer = window.setInterval(() => {
            loadSevenTv(channelId, true).catch((error) => utils.log('Unable to refresh 7TV emotes', error));
        }, 60000);
    }

    function replaceTwitchTagEmotes(text, tags) {
        const emotesTag = utils.extractTagValue(tags, 'emotes');
        if (!text) return '';
        if (!emotesTag) return utils.escapeHtml(text);

        const replacements = [];
        for (const part of emotesTag.split('/')) {
            const [id, ranges] = part.split(':');
            if (!id || !ranges) continue;
            for (const range of ranges.split(',')) {
                const [start, end] = range.split('-').map(Number);
                if (!Number.isInteger(start) || !Number.isInteger(end)) continue;
                replacements.push({ start, end, id, code: text.slice(start, end + 1) });
            }
        }

        if (replacements.length === 0) return utils.escapeHtml(text);

        replacements.sort((a, b) => a.start - b.start);
        let result = '';
        let cursor = 0;
        for (const item of replacements) {
            result += utils.escapeHtml(text.slice(cursor, item.start));
            result += `<img class="emote" src="https://static-cdn.jtvnw.net/emoticons/v2/${utils.escapeAttribute(item.id)}/default/dark/3.0" alt="${utils.escapeAttribute(item.code)}" loading="lazy">`;
            cursor = item.end + 1;
        }
        result += utils.escapeHtml(text.slice(cursor));
        return result;
    }

    function replaceThirdPartyEmotes(html, channelId, channel) {
        const all = {
            ...(cache.twitch[channelId] || {}),
            ...(cache.bttv[channelId] || cache.bttv[channel] || {}),
            ...(cache.ffz[channel] || {}),
            ...(cache.sevenTv[channelId] || {})
        };

        const names = Object.keys(all).sort((a, b) => b.length - a.length);
        if (names.length === 0) return html;

        const byEscapedName = new Map(names.map((name) => [utils.escapeHtml(name), all[name]]));

        return html.split(/(<[^>]+>)/g).map((part) => {
            if (!part || part.startsWith('<')) return part;

            return part.split(/(\s+)/).map((token) => {
                if (!token || /^\s+$/.test(token)) return token;
                const emote = byEscapedName.get(token);
                if (!emote) return token;
                const url = utils.sanitizeUrl(emote.url);
                if (!url) return token;
                return `<img class="emote" src="${url}" alt="${utils.escapeAttribute(token)}" loading="lazy">`;
            }).join('');
        }).join('');
    }

    function replace(text, tags, channelId, channel) {
        const withTwitch = replaceTwitchTagEmotes(text, tags);
        return replaceThirdPartyEmotes(withTwitch, channelId, channel);
    }

    window.IkuzaChatV2.emotes = {
        cache,
        init,
        startSevenTvRefresh,
        replace,
        getTwitchUserId
    };
}());
