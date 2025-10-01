// Функция для получения osu! API ключа из URL
function getOsuApiKey() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('osuapi') || null;
}

// Инициализируем API ключ из URL
const OSU_API_KEY = getOsuApiKey();

if (!OSU_API_KEY) {
    console.warn('⚠️ Не найден osu! API ключ в URL. Используйте &osuapi=ваш_ключ');
}

// Функция для извлечения beatmapset_id и beatmap_id из ссылки
function extractBeatmapIds(url) {
    console.log('🔍 Проверяем ссылку:', url);

    // Сначала проверяем, не является ли это ссылкой на конкретную сложность (b)
    const beatmapMatch = url.match(/https?:\/\/osu\.ppy\.sh\/beatmaps\/(\d+)/);
    if (beatmapMatch) {
        const beatmap_id = beatmapMatch[1];
        console.log('📋 Извлечён ID сложности (b):', beatmap_id);
        return {
            beatmapset_id: null, // неизвестен
            beatmap_id: beatmap_id
        };
    }

    // Иначе проверяем на стандартный формат beatmapset с опциональной диффой
    const match = url.match(/https?:\/\/osu\.ppy\.sh\/beatmapsets\/(\d+)(?:#(?:osu|taiko|fruits|mania)\/(\d+))?/);
    if (match) {
        const ids = {
            beatmapset_id: match[1],
            beatmap_id: match[2] || null
        };
        console.log('📋 Извлечённые ID:', ids);
        return ids;
    }

    console.log('❌ Не найдены ID в ссылке:', url);
    return null;
}

// Функция для извлечения user_id из ссылки
function extractUserId(url) {
    console.log('🔍 Проверяем ссылку на юзера:', url);
    const match = url.match(/https?:\/\/osu\.ppy\.sh\/users\/(\d+)(?:\/(?!osu|taiko|fruits|mania))?/);
    if (match) {
        const id = match[1];
        console.log('📋 Извлечён ID юзера:', id);
        return id;
    } else {
        console.log('❌ Не найден ID юзера в ссылке:', url);
        return null;
    }
}

// Функция для извлечения score_id из ссылки
function extractScoreId(url) {
    console.log('🔍 Проверяем ссылку на скор:', url);
    const match = url.match(/https?:\/\/osu\.ppy\.sh\/scores\/(\d+)/);
    if (match) {
        const id = match[1];
        console.log('📋 Извлечён ID скоры:', id);
        return id;
    } else {
        console.log('❌ Не найден ID скоры в ссылке:', url);
        return null;
    }
}

// Функция для получения информации о карте через osu! API v1
async function getBeatmapInfo(beatmapset_id, beatmap_id = null) {
    if (!OSU_API_KEY) {
        console.error('❌ Не указан osu! API ключ. Невозможно получить информацию о карте.');
        return null;
    }

    let url;
    if (beatmap_id) {
        console.log('🔍 Запрашиваем информацию о конкретной сложности (b):', beatmap_id);
        url = `https://osu.ppy.sh/api/get_beatmaps?k=${OSU_API_KEY}&b=${beatmap_id}`;
    } else {
        console.log('🔍 Запрашиваем информацию о beatmapset (s):', beatmapset_id);
        url = `https://osu.ppy.sh/api/get_beatmaps?k=${OSU_API_KEY}&s=${beatmapset_id}`;
    }

    try {
        const response = await fetch(url);
        console.log('🌐 Ответ от API:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('📥 Полученные данные:', data);
        if (data && data.length > 0) {
            console.log('✅ Найдена информация о карте:', data[0]);
            return data[0];
        } else {
            console.warn('⚠️ Карта не найдена в API.');
            return null;
        }
    } catch (error) {
        console.error('❌ Ошибка получения данных osu! API:', error);
        return null;
    }
}

// Функция для получения информации о пользователе через osu! API v1
async function getUserInfo(user_id) {
    if (!OSU_API_KEY) {
        console.error('❌ Не указан osu! API ключ. Невозможно получить информацию о пользователе.');
        return null;
    }

    const url = `https://osu.ppy.sh/api/get_user?k=${OSU_API_KEY}&u=${user_id}&type=id`;

    try {
        const response = await fetch(url);
        console.log('🌐 Ответ от API (пользователь):', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('📥 Полученные данные (пользователь):', data);
        if (data && data.length > 0) {
            console.log('✅ Найдена информация о пользователе:', data[0]);
            return data[0];
        } else {
            console.warn('⚠️ Пользователь не найден в API.');
            return null;
        }
    } catch (error) {
        console.error('❌ Ошибка получения данных osu! API (пользователь):', error);
        return null;
    }
}

// Функция для форматирования параметров сложности
function formatBeatmapParams(beatmap) {
    const ar = parseFloat(beatmap.diff_approach).toFixed(1);
    const cs = parseFloat(beatmap.diff_size).toFixed(1);
    const hp = parseFloat(beatmap.diff_drain).toFixed(1);
    const od = parseFloat(beatmap.diff_overall).toFixed(1);
    const bpm = parseFloat(beatmap.bpm).toFixed(1);
    const sr = parseFloat(beatmap.difficultyrating).toFixed(2);
    const params = `AR${ar} CS${cs} HP${hp} OD${od} BPM${bpm} ★${sr}`;
    console.log('⚙️ Сформированы параметры:', params);
    return params;
}

// Функция для форматирования информации о пользователе (без Plays)
function formatUserInfo(user) {
    const username = user.username;
    const pp_rank = user.pp_rank;
    const pp_country_rank = user.pp_country_rank;
    const accuracy = parseFloat(user.accuracy).toFixed(2);
    const pp_raw = Math.round(parseFloat(user.pp_raw));

    const info = `${username} - Rank: #${pp_rank} (Country: #${pp_country_rank}), Accuracy: ${accuracy}%, PP: ${pp_raw}`;
    console.log('⚙️ Сформирована информация о пользователе:', info);
    return info;
}

// Функция для получения информации о скоре через парсинг веб-страницы
async function getScoreInfoFromWeb(score_id) {
    const url = `https://osu.ppy.sh/scores/${score_id}`;

    try {
        console.log('🌐 Загружаем страницу скоры:', url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();

        // Создаём DOM из HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Используем твои селекторы для извлечения данных
        const playerNameEl = doc.querySelector("body > div.osu-layout__section.osu-layout__section--full > div.js-react--scores-show.u-contents > div.osu-page.osu-page--generic-compact > div.score-info > div.score-info__item.score-info__item--player > div > div.score-player__row.score-player__row--player > strong:nth-child(2)");
        const playerName = playerNameEl ? playerNameEl.textContent.trim() : 'Unknown';

        const mapNameEl = doc.querySelector("body > div.osu-layout__section.osu-layout__section--full > div.js-react--scores-show.u-contents > div.osu-page.osu-page--generic-compact > div.score-beatmap > h1 > a");
        const mapName = mapNameEl ? mapNameEl.textContent.trim() : 'Unknown';

        const difficultyEl = doc.querySelector("body > div.osu-layout__section.osu-layout__section--full > div.js-react--scores-show.u-contents > div.osu-page.osu-page--generic-compact > div.score-beatmap > div > span > div > div.beatmap-list-item__col.beatmap-list-item__col--main > div > a");
        const difficulty = difficultyEl ? difficultyEl.textContent.trim() : 'Unknown';

        const accuracyEl = doc.querySelector("body > div.osu-layout__section.osu-layout__section--full > div.js-react--scores-show.u-contents > div.osu-page.osu-page--generic-compact > div.score-stats > div.score-stats__group.score-stats__group--stats > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)");
        const accuracy = accuracyEl ? accuracyEl.textContent.trim() : '0%';

        const missCountEl = doc.querySelector("body > div.osu-layout__section.osu-layout__section--full > div.js-react--scores-show.u-contents > div.osu-page.osu-page--generic-compact > div.score-stats > div.score-stats__group.score-stats__group--stats > div:nth-child(2) > div:nth-child(4) > div:nth-child(2)");
        const missCount = missCountEl ? missCountEl.textContent.trim() : '0';

        const ppEl = doc.querySelector("body > div.osu-layout__section.osu-layout__section--full > div.js-react--scores-show.u-contents > div.osu-page.osu-page--generic-compact > div.score-stats > div.score-stats__group.score-stats__group--stats > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > span");
        const ppValue = ppEl ? ppEl.textContent.trim().replace(/pp/gi, '').trim() : '0';

        const scoreInfo = {
            playerName,
            mapName,
            difficulty,
            accuracy,
            missCount,
            ppValue
        };

        console.log('📥 Полученные данные (парсинг):', scoreInfo);
        return scoreInfo;
    } catch (error) {
        console.error('❌ Ошибка парсинга страницы скоры:', error);
        return null;
    }
}

// Функция для форматирования информации о скоре
function formatScoreInfo(score) {
    const { playerName, mapName, difficulty, accuracy, missCount, ppValue } = score;
    const info = `[Replay by ${playerName}] ${mapName} (${difficulty}) ${accuracy}; ${missCount} miss; ${ppValue}pp;`;
    console.log('⚙️ Сформирована информация о скоре:', info);
    return info;
}

// Функция для замены ссылки на информацию о карте, пользователе или скоре
async function replaceOsuLinksInText(text) {
    console.log('📝 Входной текст:', text);

    if (!OSU_API_KEY) {
        console.warn('⚠️ Нет osu! API ключа — пропускаем обработку.');
        return text; // Если нет ключа — не обрабатываем
    }

    // Проверяем, включены ли соответствующие опции
    const osuMap = new URLSearchParams(window.location.search).get('osuMap') !== 'false';
    const osuUser = new URLSearchParams(window.location.search).get('osuUser') !== 'false';
    const osuScore = new URLSearchParams(window.location.search).get('osuScore') !== 'false';
    const osuHighlight = new URLSearchParams(window.location.search).get('osuHighlight') === 'true';

    // Регулярное выражение для поиска ссылки osu.ppy.sh
    const osuLinkRegex = /(https?:\/\/osu\.ppy\.sh\/(?:beatmapsets|beatmaps|users|scores)\/\d+(?:#[a-z]+\/\d+)?)\b/g;

    const matches = [...text.matchAll(osuLinkRegex)];

    if (matches.length === 0) {
        console.log('🔗 Нет ссылок osu! в тексте.');
        return text; // Нет ссылок — возвращаем как есть
    }

    console.log('🔗 Найдены ссылки:', matches.map(m => m[0]));

    let resultText = text;

    for (const match of matches) {
        const fullUrl = match[0];
        if (fullUrl.includes('/beatmapsets/') || fullUrl.includes('/beatmaps/')) {
            // Это ссылка на мапу (beatmapset или конкретная сложность)
            if (!osuMap) {
                console.log('⏭️ Парсинг мапы отключён, пропускаем:', fullUrl);
                continue;
            }

            const ids = extractBeatmapIds(fullUrl);
            if (!ids) continue;

            const { beatmapset_id, beatmap_id } = ids;

            const beatmapInfo = await getBeatmapInfo(beatmapset_id, beatmap_id);

            if (beatmapInfo) {
                let replacement;
                if (beatmap_id) {
                    // Полная ссылка — показываем всё
                    const artist = beatmapInfo.artist;
                    const title = beatmapInfo.title;
                    const creator = beatmapInfo.creator;
                    const version = beatmapInfo.version;
                    const params = formatBeatmapParams(beatmapInfo);
                    replacement = `${artist} - ${title} (${creator}) - ${version} (${params})`;
                } else {
                    // Ссылка только на beatmapset — без сложности и параметров
                    const artist = beatmapInfo.artist;
                    const title = beatmapInfo.title;
                    const creator = beatmapInfo.creator;
                    replacement = `${artist} - ${title} (${creator})`;
                }

                if (osuHighlight) {
                    replacement = `<span style="color: #ff69b4;">${replacement}</span>`; // розовый для мапы
                }

                console.log('🔄 Заменяем:', fullUrl, '→', replacement);
                resultText = resultText.replace(fullUrl, replacement);
            } else {
                console.warn(`⚠️ Не удалось получить информацию для: ${fullUrl}`);
            }
        } else if (fullUrl.includes('/users/')) {
            // Это ссылка на пользователя
            if (!osuUser) {
                console.log('⏭️ Парсинг юзера отключён, пропускаем:', fullUrl);
                continue;
            }

            const user_id = extractUserId(fullUrl);
            if (!user_id) continue;

            const userInfo = await getUserInfo(user_id);

            if (userInfo) {
                let replacement = formatUserInfo(userInfo);

                if (osuHighlight) {
                    replacement = `<span style="color: #00aaff;">${replacement}</span>`; // синий для юзера
                }

                console.log('🔄 Заменяем:', fullUrl, '→', replacement);
                resultText = resultText.replace(fullUrl, replacement);
            } else {
                console.warn(`⚠️ Не удалось получить информацию для юзера: ${fullUrl}`);
            }
        } else if (fullUrl.includes('/scores/')) {
            // Это ссылка на скору
            if (!osuScore) {
                console.log('⏭️ Парсинг скоры отключён, пропускаем:', fullUrl);
                continue;
            }

            const score_id = extractScoreId(fullUrl);
            if (!score_id) continue;

            const scoreInfo = await getScoreInfoFromWeb(score_id);
            if (scoreInfo) {
                let replacement = formatScoreInfo(scoreInfo);

                if (osuHighlight) {
                    replacement = `<span style="color: #ffcc00;">${replacement}</span>`; // жёлтый для скоры
                }

                console.log('🔄 Заменяем:', fullUrl, '→', replacement);
                resultText = resultText.replace(fullUrl, replacement);
            } else {
                console.warn(`⚠️ Не удалось получить информацию для скоры: ${fullUrl}`);
            }
        }
    }

    console.log('📤 Выходной текст:', resultText);
    return resultText;
}

// Экспортируем функцию для использования в других модулях
window.osuModule = {
    replaceOsuLinksInText
};