// Функция для получения osu! API ключа из URL
function getOsuApiKey() {
    const urlParams = new URLSearchParams(window.location.search);
    const key = urlParams.get('osuapi') || null;
    console.log('🔑 OSU_API_KEY из URL:', key);
    return key;
}

// Инициализируем API ключ из URL
const OSU_API_KEY = getOsuApiKey();

if (!OSU_API_KEY) {
    console.warn('⚠️ Не найден osu! API ключ в URL. Используйте &osuapi=ваш_ключ');
}

// Функция для извлечения beatmapset_id и beatmap_id из ссылки
function extractBeatmapIds(url) {
    console.log('🔍 Проверяем ссылку:', url);
    // Регулярное выражение: ищем beatmapset_id и опционально beatmap_id
    const match = url.match(/https?:\/\/osu\.ppy\.sh\/beatmapsets\/(\d+)(?:#(?:osu|taiko|fruits|mania)\/(\d+))?/);
    if (match) {
        const beatmapset_id = match[1];
        const beatmap_id = match[2] || null;

        if (beatmap_id) {
            console.log('📋 Извлечены ID: beatmapset_id =', beatmapset_id, ', beatmap_id =', beatmap_id);
            return { beatmapset_id, beatmap_id };
        } else {
            console.log('📋 Извлечён только beatmapset_id =', beatmapset_id, ', сложность не указана');
            return { beatmapset_id, beatmap_id: null };
        }
    } else {
        console.log('❌ Не найдены ID в ссылке:', url);
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
    let isSpecificBeatmap = false;

    if (beatmap_id) {
        console.log('🔍 Запрашиваем информацию о конкретной сложности (b):', beatmap_id);
        url = `https://osu.ppy.sh/api/get_beatmaps?k=${OSU_API_KEY}&b=${beatmap_id}`;
        isSpecificBeatmap = true;
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
            // Если запрашивали по beatmap_id — возвращаем конкретную сложность
            if (isSpecificBeatmap) {
                console.log('✅ Найдена информация о конкретной сложности:', data[0]);
                return data[0];
            } else {
                // Если запрашивали по beatmapset_id — возвращаем первую сложность (или любую)
                console.log('✅ Найдена информация о beatmapset, используем первую сложность:', data[0]);
                return data[0];
            }
        } else {
            console.warn('⚠️ Карта не найдена в API.');
            return null;
        }
    } catch (error) {
        console.error('❌ Ошибка получения данных osu! API:', error);
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

// Функция для замены ссылки на информацию о карте
async function replaceOsuLinksInText(text) {
    console.log('📝 Входной текст:', text);

    if (!OSU_API_KEY) {
        console.warn('⚠️ Нет osu! API ключа — пропускаем обработку.');
        return text; // Если нет ключа — не обрабатываем
    }

    // Регулярное выражение для поиска ссылки osu.ppy.sh
    const osuLinkRegex = /(https?:\/\/osu\.ppy\.sh\/beatmapsets\/\d+(?:#[a-z]+\/\d+)?)\b/g;

    const matches = [...text.matchAll(osuLinkRegex)];

    if (matches.length === 0) {
        console.log('🔗 Нет ссылок osu! в тексте.');
        return text; // Нет ссылок — возвращаем как есть
    }

    console.log('🔗 Найдены ссылки:', matches.map(m => m[0]));

    let resultText = text;

    for (const match of matches) {
        const fullUrl = match[0];
        const ids = extractBeatmapIds(fullUrl);
        if (!ids) continue;

        const { beatmapset_id, beatmap_id } = ids;

        const beatmapInfo = await getBeatmapInfo(beatmapset_id, beatmap_id);

        if (beatmapInfo) {
            const artist = beatmapInfo.artist;
            const title = beatmapInfo.title;
            const creator = beatmapInfo.creator;

            let replacement;

            if (beatmap_id) {
                // Полная ссылка — показываем всё
                const version = beatmapInfo.version;
                const params = formatBeatmapParams(beatmapInfo);
                replacement = `${artist} - ${title} (${creator}) - ${version} (${params})`;
            } else {
                // Ссылка только на beatmapset — без сложности и параметров
                replacement = `${artist} - ${title} (${creator})`;
            }

            console.log('🔄 Заменяем:', fullUrl, '→', replacement);
            resultText = resultText.replace(fullUrl, replacement);
        } else {
            console.warn(`⚠️ Не удалось получить информацию для: ${fullUrl}`);
        }
    }

    console.log('📤 Выходной текст:', resultText);
    return resultText;
}

// Экспортируем функцию для использования в других модулях
window.osuModule = {
    replaceOsuLinksInText
};