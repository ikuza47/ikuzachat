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

    function extractScoreId(url) {
        const match = url.match(/https?:\/\/osu\.ppy\.sh\/scores\/(?:[a-z]+\/)?(\d+)/i);
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

    async function getScoreInfo(scoreId) {
        const response = await fetch(`https://osu.ppy.sh/scores/${encodeURIComponent(scoreId)}`);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const text = (selector, fallback) => doc.querySelector(selector)?.textContent.trim() || fallback;

        return {
            playerName: text('.score-player strong:nth-child(2)', 'Unknown'),
            mapName: text('.score-beatmap h1 a', 'Unknown'),
            difficulty: text('.beatmap-list-item__col--main a', 'Unknown'),
            accuracy: text('.score-stats__group--stats > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)', '0%'),
            missCount: text('.score-stats__group--stats > div:nth-child(2) > div:nth-child(4) > div:nth-child(2)', '0'),
            ppValue: text('.score-stats__group--stats > div:nth-child(1) > div:nth-child(3) span', '0').replace(/pp/gi, '').trim(),
            coverUrl: doc.querySelector('.score-beatmap__cover, .beatmapset-cover, .beatmapset-cover__cover')?.getAttribute('src') || ''
        };
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

    function formatScore(score) {
        return `[Replay by ${score.playerName}] ${score.mapName} (${score.difficulty}) ${score.accuracy}; ${score.missCount} miss; ${score.ppValue}pp;`;
    }

    function wrap(text, type, highlight) {
        const safe = utils.escapeHtml(text);
        if (!highlight) return safe;
        return `<span class="osu-info osu-${type}">${safe}</span>`;
    }

    function mapCover(setId) {
        return `https://assets.ppy.sh/beatmaps/${encodeURIComponent(setId)}/covers/cover.jpg`;
    }

    function mapCard(map, index) {
        const cover = mapCover(map.setId);
        const compact = root.config.osu.compactInfo;
        const chips = compact ? [
            ['len', time(map.totalLength), 'gray'],
            ['status', map.status, 'mint'],
            ['stars', number(map.stars, 2), 'gold'],
            ['bpm', number(map.bpm, 1), 'pink']
        ] : [
            ['diff', map.version || 'Unknown', 'violet'],
            ['stars', `${number(map.stars, 2)}*`, 'gold'],
            ['bpm', number(map.bpm, 1), 'pink'],
            ['ar', number(map.ar, 1), 'cyan'],
            ['cs', number(map.cs, 1), 'blue'],
            ['hp', number(map.hp, 1), 'red'],
            ['od', number(map.od, 1), 'green'],
            ['len', time(map.totalLength), 'gray'],
            ['combo', integer(map.maxCombo), 'orange'],
            ['status', map.status, 'mint']
        ];

        return `<div class="messageosu messageosumap" style="--osu-bg: url('${utils.sanitizeUrl(cover)}'); animation-delay: ${index * 90}ms">` +
            `<img class="messageosuimage" src="${utils.sanitizeUrl(cover)}" alt="${utils.escapeAttribute(map.title)}" loading="lazy">` +
            '<div class="messageosubody">' +
            '<div class="messageosutop"><span>beatmap</span></div>' +
            `<div class="messageosuheader"><div class="messageosutitle">${utils.escapeHtml(map.title)}</div><div class="messageosusubtitle">${utils.escapeHtml(map.artist)}</div><div class="messageosucreator">made by <span>${utils.escapeHtml(map.creator)}</span></div></div>` +
            `<div class="messageosustats">${chips.map(([label, value, color]) => `<span class="osu-chip-${color}"><b>${utils.escapeHtml(label)}</b>${utils.escapeHtml(value)}</span>`).join('')}</div>` +
            '</div></div>';
    }

    function profileCard(user, index) {
        const cover = user.coverUrl || user.avatarUrl;
        const compact = root.config.osu.compactInfo;
        const accuracy = Number.isFinite(user.accuracy) && user.accuracy <= 1 ? user.accuracy * 100 : user.accuracy;
        const stats = compact ? [
            ['pp', integer(user.pp), 'pink'],
            ['rank', `#${integer(user.rank)} (#${integer(user.countryRank)})`, 'gold']
        ] : [
            ['rank', `#${integer(user.rank)}`, 'gold'],
            ['country', user.countryRank ? `#${integer(user.countryRank)}` : '?', 'blue'],
            ['acc', `${number(accuracy, 2)}%`, 'green'],
            ['pp', integer(user.pp), 'pink'],
            ['plays', integer(user.playCount), 'violet']
        ];
        const topScoresList = compact ? user.topScores.slice(0, 3) : user.topScores;
        const topScores = topScoresList.length > 0
            ? `<div class="messageosutopscores">${topScoresList.map((score, scoreIndex) => `<div><b>${scoreIndex + 1}</b><span>${utils.escapeHtml(score.title)}</span><strong>${number(score.pp, 0)}pp</strong></div>`).join('')}</div>`
            : '';
        const flag = user.flagUrl ? `<img class="messageosuflag" src="${utils.sanitizeUrl(user.flagUrl)}" alt="${utils.escapeAttribute(user.countryCode)}" loading="lazy">` : '';

        return `<div class="messageosu messageosuprofile" style="--osu-bg: url('${utils.sanitizeUrl(cover)}'); animation-delay: ${index * 90}ms">` +
            `<img class="messageosuimage" src="${utils.sanitizeUrl(user.avatarUrl)}" alt="${utils.escapeAttribute(user.username)}" loading="lazy">` +
            '<div class="messageosubody">' +
            '<div class="messageosutop"><span>profile</span></div>' +
            `<div class="messageosuheader"><div class="messageosutitle messageosutitlewithflag">${utils.escapeHtml(user.username)}${flag}</div><div class="messageosucreator">osu! player profile</div></div>` +
            `<div class="messageosustats">${stats.map(([label, value, color]) => `<span class="osu-chip-${color}"><b>${utils.escapeHtml(label)}</b>${utils.escapeHtml(value)}</span>`).join('')}</div>${topScores}` +
            '</div></div>';
    }

    function scoreCard(score, index) {
        const cover = score.coverUrl || '';
        const chips = [
            ['acc', score.accuracy, 'green'],
            ['miss', score.missCount, 'red'],
            ['pp', `${score.ppValue}pp`, 'pink']
        ];

        return `<div class="messageosu messageosuscore" style="--osu-bg: url('${utils.sanitizeUrl(cover)}'); animation-delay: ${index * 90}ms">` +
            `<div class="messageosuimage messageosuscoreimage">${utils.escapeHtml(score.playerName.slice(0, 1).toUpperCase())}</div>` +
            '<div class="messageosubody">' +
            '<div class="messageosutop"><span>score</span></div>' +
            `<div class="messageosuheader"><div class="messageosutitle">${utils.escapeHtml(score.mapName)}</div><div class="messageosusubtitle">${utils.escapeHtml(score.difficulty)}</div><div class="messageosucreator">played by <span>${utils.escapeHtml(score.playerName)}</span></div></div>` +
            `<div class="messageosustats">${chips.map(([label, value, color]) => `<span class="osu-chip-${color}"><b>${utils.escapeHtml(label)}</b>${utils.escapeHtml(value)}</span>`).join('')}</div>` +
            '</div></div>';
    }

    function findUrls(text) {
        const regex = /(https?:\/\/osu\.ppy\.sh\/(?:beatmapsets|beatmaps|users|scores)\/[^\s<]+)/gi;
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
                } else if (url.includes('/scores/') && config.parseScore) {
                    const scoreId = extractScoreId(url);
                    if (!scoreId) continue;
                    const score = await getScoreInfo(scoreId);
                    if (score) {
                        result = result.replace(escapedUrl, wrap(formatScore(score), 'score', config.highlight));
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
                } else if (url.includes('/scores/') && config.parseScore) {
                    const scoreId = extractScoreId(url);
                    const score = scoreId ? await getScoreInfo(scoreId) : null;
                    if (score) {
                        cards.push(scoreCard(score, cards.length));
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
