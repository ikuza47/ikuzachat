(function () {
    const root = window.IkuzaChatV2;
    const utils = root.utils;

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
        const match = url.match(/https?:\/\/osu\.ppy\.sh\/users\/(\d+)/i);
        return match ? match[1] : null;
    }

    function extractScoreId(url) {
        const match = url.match(/https?:\/\/osu\.ppy\.sh\/scores\/(\d+)/i);
        return match ? match[1] : null;
    }

    async function fetchJson(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
    }

    async function getBeatmapInfo(ids, apiKey) {
        const query = ids.beatmapId ? `b=${ids.beatmapId}` : `s=${ids.beatmapsetId}`;
        const data = await fetchJson(`https://osu.ppy.sh/api/get_beatmaps?k=${encodeURIComponent(apiKey)}&${query}`);
        return Array.isArray(data) && data[0] ? data[0] : null;
    }

    async function getUserInfo(userId, apiKey) {
        const data = await fetchJson(`https://osu.ppy.sh/api/get_user?k=${encodeURIComponent(apiKey)}&u=${encodeURIComponent(userId)}&type=id`);
        return Array.isArray(data) && data[0] ? data[0] : null;
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
            ppValue: text('.score-stats__group--stats > div:nth-child(1) > div:nth-child(3) span', '0').replace(/pp/gi, '').trim()
        };
    }

    function formatBeatmap(beatmap, hasBeatmapId) {
        const base = `${beatmap.artist} - ${beatmap.title} (${beatmap.creator})`;
        if (!hasBeatmapId) return base;

        const ar = Number(beatmap.diff_approach).toFixed(1);
        const cs = Number(beatmap.diff_size).toFixed(1);
        const hp = Number(beatmap.diff_drain).toFixed(1);
        const od = Number(beatmap.diff_overall).toFixed(1);
        const bpm = Number(beatmap.bpm).toFixed(1);
        const sr = Number(beatmap.difficultyrating).toFixed(2);
        return `${base} - ${beatmap.version} (AR${ar} CS${cs} HP${hp} OD${od} BPM${bpm} *${sr})`;
    }

    function formatUser(user) {
        return `${user.username} - Rank: #${user.pp_rank} (Country: #${user.pp_country_rank}), Accuracy: ${Number(user.accuracy).toFixed(2)}%, PP: ${Math.round(Number(user.pp_raw))}`;
    }

    function formatScore(score) {
        return `[Replay by ${score.playerName}] ${score.mapName} (${score.difficulty}) ${score.accuracy}; ${score.missCount} miss; ${score.ppValue}pp;`;
    }

    function decodeEntities(text) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    function wrap(text, type, highlight) {
        const safe = utils.escapeHtml(text);
        if (!highlight) return safe;
        return `<span class="osu-info osu-${type}">${safe}</span>`;
    }

    async function replace(text) {
        const config = root.config.osu;
        if (!config.enabled || !config.apiKey) return text;

        const regex = /(https?:\/\/osu\.ppy\.sh\/(?:beatmapsets|beatmaps|users|scores)\/\d+(?:#[a-z]+\/\d+)?)/gi;
        const decodedText = decodeEntities(text);
        const matches = [...decodedText.matchAll(regex)];
        if (matches.length === 0) return text;

        let result = text;
        for (const match of matches) {
            const url = match[0];
            const escapedUrl = utils.escapeHtml(url);
            try {
                if ((url.includes('/beatmapsets/') || url.includes('/beatmaps/')) && config.parseMap) {
                    const ids = extractBeatmapIds(url);
                    if (!ids) continue;
                    const beatmap = await getBeatmapInfo(ids, config.apiKey);
                    if (beatmap) {
                        result = result.replace(escapedUrl, wrap(formatBeatmap(beatmap, Boolean(ids.beatmapId)), 'map', config.highlight));
                    }
                } else if (url.includes('/users/') && config.parseUser) {
                    const userId = extractUserId(url);
                    if (!userId) continue;
                    const user = await getUserInfo(userId, config.apiKey);
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

    root.osu = { replace };
}());
