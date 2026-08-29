(function () {
    const root = window.IkuzaChatV2;
    const utils = root.utils;
    const mirrorBase = 'https://mirror.hinamizawa.ai';
    const cache = {
        set: new Map(),
        beatmapSetId: new Map(),
        user: new Map()
    };

    function extractBeatmapIds(url) {
        const beatmap = url.match(/https?:\/\/osu\.ppy\.sh\/beatmaps\/(\d+)/i);
        if (beatmap) {
            return { beatmapsetId: null, beatmapId: beatmap[1] };
        }

        const set = url.match(/https?:\/\/osu\.ppy\.sh\/beatmapsets\/(\d+)(?:#(?:osu|taiko|fruits|mania)\/(\d+))?/i);
        if (!set) return null;
        return { beatmapsetId: set[1], beatmapId: set[2] || null };
    }

    function extractUserId(url) {
        const match = url.match(/https?:\/\/osu\.ppy\.sh\/users\/([^\s/?#]+)/i);
        return match ? match[1] : null;
    }

    function decodeEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    async function fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
    }

    async function fetchText(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.text();
    }

    function normalizeSet(envelope, setId, beatmapId) {
        const data = envelope && envelope.data ? envelope.data : envelope;
        if (!data) return null;

        const beatmaps = Array.isArray(data.beatmaps) ? data.beatmaps : [];
        const selected = beatmaps.find((item) => String(item.id) === String(beatmapId)) || beatmaps[0] || null;
        return {
            type: 'map',
            setId: String(envelope.beatmapset_id || setId || ''),
            beatmapId: selected ? String(selected.id) : String(beatmapId || ''),
            artist: data.artist || 'Unknown artist',
            title: data.title || 'Unknown title',
            creator: data.creator || 'Unknown mapper',
            status: data.status || 'unknown',
            bpm: Number(data.bpm),
            playCount: Number(data.play_count),
            favouriteCount: Number(data.favourite_count),
            version: selected?.version || '',
            ar: Number(selected?.ar),
            cs: Number(selected?.cs),
            hp: Number(selected?.hp),
            od: Number(selected?.od),
            stars: Number(selected?.difficulty_rating),
            maxCombo: Number(selected?.max_combo),
            totalLength: Number(selected?.total_length)
        };
    }

    async function resolveSetIdByBeatmapId(beatmapId) {
        const key = String(beatmapId);
        if (cache.beatmapSetId.has(key)) return cache.beatmapSetId.get(key);

        const text = await fetchText(`${mirrorBase}/api/v1/hinai/aeris/search-set?b=${encodeURIComponent(key)}`);
        const setId = text.split('|')[7] || '';
        cache.beatmapSetId.set(key, setId);
        return setId;
    }

    async function getBeatmapInfo(ids) {
        let setId = ids.beatmapsetId;
        if (!setId && ids.beatmapId) {
            setId = await resolveSetIdByBeatmapId(ids.beatmapId);
        }
        if (!setId) return null;

        const cacheKey = `${setId}:${ids.beatmapId || ''}`;
        if (cache.set.has(cacheKey)) return cache.set.get(cacheKey);

        const envelope = await fetchJson(`${mirrorBase}/api/v1/hinai/s/${encodeURIComponent(setId)}?pp=true`);
        const map = normalizeSet(envelope, setId, ids.beatmapId);
        cache.set.set(cacheKey, map);
        return map;
    }

    async function getUserInfo(userId) {
        const key = String(userId || '');
        if (!key) return null;
        if (cache.user.has(key)) return cache.user.get(key);

        const user = await fetchJson(`${mirrorBase}/api/v1/hinai/player/${encodeURIComponent(key)}?mode=osu`);
        const normalized = {
            type: 'profile',
            id: String(user.id || key),
            username: user.username || key,
            avatarUrl: user.avatar_url || '',
            flagUrl: user.country_code ? `https://flagcdn.com/w40/${String(user.country_code).toLowerCase()}.png` : '',
            coverUrl: user.cover_url || user.cover?.url || user.avatar_url || '',
            countryCode: user.country_code || user.country?.code || '',
            countryName: user.country?.name || '',
            rank: Number(user.statistics?.global_rank),
            countryRank: Number(user.statistics?.country_rank || user.statistics?.rank?.country),
            accuracy: Number(user.statistics?.hit_accuracy ?? user.statistics?.accuracy),
            pp: Number(user.statistics?.pp),
            playCount: Number(user.statistics?.play_count),
            topScores: []
        };

        try {
            normalized.topScores = await getUserTopScores(normalized.id);
        } catch (error) {
            utils.log('Unable to load osu! top scores', normalized.id, error);
        }

        cache.user.set(key, normalized);
        return normalized;
    }

    async function getUserTopScores(userId) {
        const data = await fetchJson(`${mirrorBase}/api/v1/hinai/player/${encodeURIComponent(userId)}/scores?type=best&limit=5&mode=osu`);
        const scores = Array.isArray(data?.scores) ? data.scores : [];
        return scores.map((score) => ({
            title: score.beatmapset?.title || score.beatmap?.version || 'Unknown score',
            pp: Number(score.pp)
        }));
    }

    function number(value, decimals) {
        return Number.isFinite(value) ? value.toFixed(decimals) : '?';
    }

    function integer(value) {
        return Number.isFinite(value) ? Math.round(value).toLocaleString('en-US') : '?';
    }

    function time(value) {
        if (!Number.isFinite(value)) return '?';
        const minutes = Math.floor(value / 60);
        const seconds = Math.round(value % 60);
        return `${minutes}:${String(seconds).padStart(2, '0')}`;
    }

    function formatBeatmap(map, hasBeatmapId) {
        const base = `${map.artist} - ${map.title} (${map.creator})`;
        if (!hasBeatmapId && !map.version) return base;

        return `${base} - ${map.version || 'Unknown'} (AR${number(map.ar, 1)} CS${number(map.cs, 1)} HP${number(map.hp, 1)} OD${number(map.od, 1)} BPM${number(map.bpm, 1)} *${number(map.stars, 2)})`;
    }

    function formatUser(user) {
        const accuracy = Number.isFinite(user.accuracy) && user.accuracy <= 1 ? user.accuracy * 100 : user.accuracy;
        return `${user.username} - Rank: #${integer(user.rank)} (Country: #${integer(user.countryRank)}), Accuracy: ${number(accuracy, 2)}%, PP: ${integer(user.pp)}`;
    }

    function wrap(text, type, highlight) {
        const safe = utils.escapeHtml(text);
        if (!highlight) return safe;
        return `<span class="osu-info osu-${type}">${safe}</span>`;
    }

    const lazerColorStops = [
        { sr: 0.0, rgb: [136, 204, 0] },
        { sr: 2.0, rgb: [102, 204, 255] },
        { sr: 2.7, rgb: [255, 204, 34] },
        { sr: 4.0, rgb: [255, 102, 170] },
        { sr: 5.0, rgb: [119, 68, 255] },
        { sr: 6.0, rgb: [102, 0, 255] },
        { sr: 7.0, rgb: [255, 51, 102] },
        { sr: 8.0, rgb: [255, 51, 102] }
    ];

    function rgbToHex(rgb) {
        return `#${rgb.map((value) => value.toString(16).padStart(2, '0')).join('')}`;
    }

    function getOsuLazerColor(stars) {
        const sr = Number(stars);
        if (!Number.isFinite(sr)) return '#b7bac7';
        if (sr <= lazerColorStops[0].sr) return rgbToHex(lazerColorStops[0].rgb);
        const last = lazerColorStops[lazerColorStops.length - 1];
        if (sr >= last.sr) return rgbToHex(last.rgb);

        for (let i = 0; i < lazerColorStops.length - 1; i += 1) {
            const start = lazerColorStops[i];
            const end = lazerColorStops[i + 1];
            if (sr >= start.sr && sr <= end.sr) {
                const t = (sr - start.sr) / (end.sr - start.sr);
                return rgbToHex(start.rgb.map((value, channel) => Math.round(value + t * (end.rgb[channel] - value))));
            }
        }

        return rgbToHex(last.rgb);
    }

    function getStatusLabel(status) {
        const value = String(status || 'unknown').toLowerCase();
        const labels = {
            graveyard: 'Graveyard',
            wip: 'WIP',
            pending: 'Pending',
            ranked: 'Ranked',
            approved: 'Approved',
            qualified: 'Qualified',
            loved: 'Loved'
        };
        return labels[value] || value.replace(/^./, (letter) => letter.toUpperCase()) || 'Unknown';
    }

    function getStatusColor(status) {
        const value = String(status || '').toLowerCase();
        if (value === 'ranked' || value === 'approved') return '#8df0ac';
        if (value === 'loved') return '#ff73c8';
        if (value === 'qualified') return '#63a8ff';
        if (value === 'pending' || value === 'wip') return '#ffd166';
        if (value === 'graveyard') return '#8f949f';
        return '#b7bac7';
    }

    function marquee(text) {
        return `<span class="messageosumarquee"><span>${utils.escapeHtml(text)}</span></span>`;
    }

    function chip(label, value, color, extraClass) {
        const className = extraClass ? ` ${extraClass}` : '';
        return `<span class="messageosuchip${className}" style="--chip-color: ${utils.escapeAttribute(color)}"><b>${utils.escapeHtml(label)}</b>${utils.escapeHtml(value)}</span>`;
    }

    function getVisibleChips(items) {
        return items
            .filter((item) => item.show)
            .map((item) => chip(item.label, item.value, item.color, item.className || ''))
            .join('');
    }

    function mapCover(setId) {
        return `https://assets.ppy.sh/beatmaps/${encodeURIComponent(setId)}/covers/cover.jpg`;
    }

    function mapCard(map, index) {
        const cover = mapCover(map.setId);
        const options = root.config.osu;
        const starsColor = getOsuLazerColor(map.stars);
        const statusLabel = getStatusLabel(map.status);
        const statusColor = getStatusColor(map.status);
        const chips = getVisibleChips([
            { show: options.mapShowVersion, label: 'diff', value: map.version || 'Unknown', color: '#a78bfa' },
            { show: options.mapShowStars, label: 'stars', value: number(map.stars, 2), color: starsColor, className: 'messageosuchip-stars' },
            { show: options.mapShowBpm, label: 'bpm', value: number(map.bpm, 1), color: '#ff73c8' },
            { show: options.mapShowAr, label: 'ar', value: number(map.ar, 1), color: '#66e3ff' },
            { show: options.mapShowCs, label: 'cs', value: number(map.cs, 1), color: '#63a8ff' },
            { show: options.mapShowHp, label: 'hp', value: number(map.hp, 1), color: '#ff7a7a' },
            { show: options.mapShowOd, label: 'od', value: number(map.od, 1), color: '#8df0ac' },
            { show: options.mapShowLength, label: 'len', value: time(map.totalLength), color: '#b7bac7' },
            { show: options.mapShowCombo, label: 'combo', value: integer(map.maxCombo), color: '#ffae5d' },
            { show: options.mapShowStatus, label: 'status', value: statusLabel, color: statusColor },
            { show: options.mapShowPlayCount, label: 'plays', value: integer(map.playCount), color: '#7dd3fc' },
            { show: options.mapShowFavourites, label: 'fav', value: integer(map.favouriteCount), color: '#f9a8d4' }
        ]);
        const image = options.mapShowCover
            ? `<img class="messageosuimage" src="${utils.sanitizeUrl(cover)}" alt="${utils.escapeAttribute(map.title)}" loading="lazy">`
            : '';
        const title = options.mapShowTitle ? `<div class="messageosutitle">${marquee(map.title)}</div>` : '';
        const artist = options.mapShowArtist ? `<div class="messageosusubtitle">${marquee(map.artist)}</div>` : '';
        const creator = options.mapShowCreator ? `<div class="messageosucreator">made by <span>${utils.escapeHtml(map.creator)}</span></div>` : '';
        const stats = chips ? `<div class="messageosustats">${chips}</div>` : '';

        return `<div class="messageosu messageosumap${image ? '' : ' messageosu-no-image'}" style="--osu-bg: url('${utils.sanitizeUrl(cover)}'); animation-delay: ${index * 90}ms">` +
            image +
            '<div class="messageosubody">' +
            `<div class="messageosuheader">${title}${artist}${creator}</div>${stats}` +
            '</div></div>';
    }

    function profileCard(user, index) {
        const cover = user.coverUrl || user.avatarUrl;
        const options = root.config.osu;
        const accuracy = Number.isFinite(user.accuracy) && user.accuracy <= 1 ? user.accuracy * 100 : user.accuracy;
        const stats = getVisibleChips([
            { show: options.profileShowRank, label: 'rank', value: `#${integer(user.rank)}`, color: '#ffd166' },
            { show: options.profileShowCountryRank, label: 'country', value: user.countryRank ? `#${integer(user.countryRank)}` : '?', color: '#63a8ff' },
            { show: options.profileShowAccuracy, label: 'acc', value: `${number(accuracy, 2)}%`, color: '#8df0ac' },
            { show: options.profileShowPp, label: 'pp', value: integer(user.pp), color: '#ff73c8' },
            { show: options.profileShowPlayCount, label: 'plays', value: integer(user.playCount), color: '#a78bfa' }
        ]);
        const topScoresList = user.topScores.slice(0, options.profileTopScoresCount);
        const topScores = options.profileTopScoresCount > 0 && topScoresList.length > 0
            ? `<div class="messageosutopscores">${topScoresList.map((score, scoreIndex) => `<div><b>${scoreIndex + 1}</b>${marquee(score.title)}<strong>${number(score.pp, 0)}pp</strong></div>`).join('')}</div>`
            : '';
        const flag = options.profileShowFlag && user.flagUrl ? `<img class="messageosuflag" src="${utils.sanitizeUrl(user.flagUrl)}" alt="${utils.escapeAttribute(user.countryCode)}" loading="lazy">` : '';
        const image = options.profileShowAvatar
            ? `<img class="messageosuimage" src="${utils.sanitizeUrl(user.avatarUrl)}" alt="${utils.escapeAttribute(user.username)}" loading="lazy">`
            : '';
        const title = options.profileShowUsername ? `<div class="messageosutitle messageosutitlewithflag">${marquee(user.username)}${flag}</div>` : '';
        const statsHtml = stats ? `<div class="messageosustats messageosustats-profile">${stats}</div>` : '';

        return `<div class="messageosu messageosuprofile${image ? '' : ' messageosu-no-image'}" style="--osu-bg: url('${utils.sanitizeUrl(cover)}'); animation-delay: ${index * 90}ms">` +
            image +
            '<div class="messageosubody">' +
            `<div class="messageosuheader">${title}<div class="messageosucreator">osu! player profile</div></div>${statsHtml}${topScores}` +
            '</div></div>';
    }

    function findUrls(text) {
        const regex = /(https?:\/\/osu\.ppy\.sh\/(?:beatmapsets|beatmaps|users)\/[^\s<]+)/gi;
        const decodedText = decodeEntities(text);
        return [...decodedText.matchAll(regex)].map((match) => match[0]);
    }

    async function replace(text) {
        const config = root.config.osu;
        if (!config.enabled) return text;

        let result = text;
        for (const url of findUrls(text)) {
            const escapedUrl = utils.escapeHtml(url);
            try {
                if ((url.includes('/beatmapsets/') || url.includes('/beatmaps/')) && config.parseMap) {
                    const ids = extractBeatmapIds(url);
                    if (!ids) continue;
                    const beatmap = await getBeatmapInfo(ids);
                    if (beatmap) {
                        result = result.replace(escapedUrl, wrap(formatBeatmap(beatmap, Boolean(ids.beatmapId)), 'map', config.highlight));
                    }
                } else if (url.includes('/users/') && config.parseUser) {
                    const userId = extractUserId(url);
                    if (!userId) continue;
                    const user = await getUserInfo(userId);
                    if (user) {
                        result = result.replace(escapedUrl, wrap(formatUser(user), 'user', config.highlight));
                    }
                }
            } catch (error) {
                utils.log('Unable to replace osu! link', url, error);
            }
        }

        return result;
    }

    async function extractCards(text) {
        const config = root.config.osu;
        if (!config.enabled) return { text, html: '' };

        const cards = [];
        let cleanText = text;
        for (const url of findUrls(text)) {
            try {
                if ((url.includes('/beatmapsets/') || url.includes('/beatmaps/')) && config.parseMap) {
                    const ids = extractBeatmapIds(url);
                    const beatmap = ids ? await getBeatmapInfo(ids) : null;
                    if (beatmap) {
                        cards.push(mapCard(beatmap, cards.length));
                        cleanText = cleanText.replace(url, '').replace(utils.escapeHtml(url), '');
                    }
                } else if (url.includes('/users/') && config.parseUser) {
                    const userId = extractUserId(url);
                    const user = userId ? await getUserInfo(userId) : null;
                    if (user) {
                        cards.push(profileCard(user, cards.length));
                        cleanText = cleanText.replace(url, '').replace(utils.escapeHtml(url), '');
                    }
                }
            } catch (error) {
                utils.log('Unable to create osu! card', url, error);
            }
        }

        return {
            text: cleanText.replace(/\s{2,}/g, ' ').trim(),
            html: cards.join('')
        };
    }

    root.osu = { replace, extractCards };
}());
