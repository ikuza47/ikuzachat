// Кэш 7TV эмодзи по room-id
const sevenTVEmotesCache = {};

// Получение Twitch user ID через API
async function getTwitchUserId(username) {
    try {
        console.log(`🔍 Получение Twitch user ID для: ${username}`);
        const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`);
        const data = await response.json();
        
        if (data && data[0] && data[0].id) {
            console.log(`✅ Получен Twitch user ID: ${data[0].id} для ${username}`);
            return data[0].id;
        } else {
            console.log(`⚠️ Не удалось получить Twitch user ID для: ${username}`);
            return null;
        }
    } catch (error) {
        console.error(`❌ Ошибка при получении Twitch user ID для ${username}:`, error);
        return null;
    }
}

// Загрузка 7TV эмодзи
async function loadSevenTVEmotesByRoomId(roomId) {
    if (sevenTVEmotesCache[roomId] !== undefined) {
        return sevenTVEmotesCache[roomId];
    }

    try {
        console.log(`🔍 Загрузка 7TV эмодзи для room-id: ${roomId}`);
        const res = await fetch(`https://7tv.io/v3/users/twitch/${roomId}`);
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log(`📥 Получены данные 7TV для room-id: ${roomId}`, data);

        if (data?.emote_set?.emotes) {
            const emotes = {};
            for (const emote of data.emote_set.emotes) {
                // Используем 1x для оригинального размера эмодзи
                emotes[emote.name] = `https://cdn.7tv.app/emote/${emote.id}/1x`;
                console.log(`✅ Добавлен эмодзи: ${emote.name} -> https://cdn.7tv.app/emote/${emote.id}/1x`);
            }
            
            sevenTVEmotesCache[roomId] = emotes;
            console.log(`✅ Загружено ${Object.keys(emotes).length} эмодзи для room-id: ${roomId}`);
            return emotes;
        } else {
            sevenTVEmotesCache[roomId] = {};
            console.log(`ℹ️ 7TV эмодзи не найдены для room-id: ${roomId}`);
            return {};
        }
    } catch (err) {
        console.error(`❌ Ошибка загрузки 7TV для room-id ${roomId}:`, err);
        sevenTVEmotesCache[roomId] = {};
        return {};
    }
}

// Замена эмодзи с улучшенной логикой (только целые слова)
function replaceEmotesWithImages(text, emotes) {
    if (!emotes || Object.keys(emotes).length === 0 || !text) {
        return text;
    }

    console.log(`🔍 Обработка текста для замены эмодзи: "${text}"`);
    console.log(`ℹ️ Доступно эмодзи: ${Object.keys(emotes).length}`);
    
    let replaced = text;
    const sortedEmotes = Object.keys(emotes).sort((a, b) => b.length - a.length);
    
    for (const name of sortedEmotes) {
        if (!name) continue;
        
        console.log(`🔍 Проверка эмодзи: "${name}"`);
        
        const url = emotes[name];
        if (!url || !url.startsWith('http')) {
            console.log(`⚠️ Пропуск эмодзи "${name}": невалидный URL`);
            continue;
        }
        
        // Создаем регулярное выражение, которое ищет эмодзи как отдельное слово
        const regex = new RegExp(`\\b${escapeRegExp(name)}\\b`, 'g');
        
        // Заменяем все вхождения
        replaced = replaced.replace(regex, (match) => {
            console.log(`✅ Замена эмодзи: "${name}" -> изображение`);
            return `<img src="${url}" alt="${name}" class="emote" />`;
        });
    }
    
    console.log(`✅ Результат замены: "${replaced}"`);
    return replaced;
}