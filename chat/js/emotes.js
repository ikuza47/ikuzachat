// Кэш эмодзи
const emotesCache = {
    twitch: {},
    bttv: {},
    ffz: {},
    '7tv': {}
};

// Загрузка Twitch эмодзи
async function loadTwitchEmotes(channelId) {
    if (emotesCache.twitch[channelId]) {
        console.log(`ℹ️ Twitch эмодзи для канала ${channelId} уже загружены`);
        return emotesCache.twitch[channelId];
    }

    try {
        console.log(`🔍 Загрузка Twitch эмодзи для канала: ${channelId}`);
        const response = await fetch(`https://api.ivr.fi/v2/twitch/emotes/channel/${channelId}`);
        
        if (!response.ok) {
            // Если ошибка 404, возможно у канала нет кастомных эмодзи
            if (response.status === 404) {
                console.log(`ℹ️ У канала ${channelId} нет кастомных Twitch эмодзи`);
                return {};
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📥 Получены Twitch эмодзи для канала ${channelId}:`, data);
        
        const emotes = {};
        
        // Добавляем глобальные эмодзи
        if (data.global) {
            console.log(`ℹ️ Найдено ${data.global.length} глобальных Twitch эмодзи`);
            for (const emote of data.global) {
                emotes[emote.code] = {
                    url: emote.emoteSet === 'global' ? 
                        `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0` :
                        `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/2.0`,
                    type: 'twitch'
                };
            }
        }
        
        // Добавляем эмодзи канала
        if (data.channel) {
            console.log(`ℹ️ Найдено ${data.channel.length} эмодзи канала`);
            for (const emote of data.channel) {
                emotes[emote.code] = {
                    url: `https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/2.0`,
                    type: 'twitch'
                };
            }
        }
        
        emotesCache.twitch[channelId] = emotes;
        console.log(`✅ Загружено ${Object.keys(emotes).length} Twitch эмодзи`);
        return emotes;
    } catch (error) {
        console.error(`❌ Ошибка загрузки Twitch эмодзи для канала ${channelId}:`, error);
        return {};
    }
}

// Загрузка BTTV эмодзи
async function loadBTTVEmotes(channelName) {
    // Для BTTV нужен не ID, а имя канала
    if (emotesCache.bttv[channelName]) {
        console.log(`ℹ️ BTTV эмодзи для канала ${channelName} уже загружены`);
        return emotesCache.bttv[channelName];
    }

    try {
        console.log(`🔍 Загрузка BTTV эмодзи для канала: ${channelName}`);
        const response = await fetch(`https://api.betterttv.net/3/cached/users/twitch/${channelName}`);
        
        if (!response.ok) {
            // Если ошибка 404, возможно у канала нет BTTV эмодзи
            if (response.status === 404) {
                console.log(`ℹ️ У канала ${channelName} нет BTTV эмодзи`);
                return {};
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📥 Получены BTTV эмодзи для канала ${channelName}:`, data);
        
        const emotes = {};
        
        // Добавляем глобальные BTTV эмодзи
        if (data?.sharedEmotes) {
            console.log(`ℹ️ Найдено ${data.sharedEmotes.length} глобальных BTTV эмодзи`);
            for (const emote of data.sharedEmotes) {
                emotes[emote.code] = {
                    url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
                    type: 'bttv'
                };
            }
        }
        
        // Добавляем эмодзи канала
        if (data?.channelEmotes) {
            console.log(`ℹ️ Найдено ${data.channelEmotes.length} эмодзи канала BTTV`);
            for (const emote of data.channelEmotes) {
                emotes[emote.code] = {
                    url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
                    type: 'bttv'
                };
            }
        }
        
        emotesCache.bttv[channelName] = emotes;
        console.log(`✅ Загружено ${Object.keys(emotes).length} BTTV эмодзи`);
        return emotes;
    } catch (error) {
        console.error(`❌ Ошибка загрузки BTTV эмодзи для канала ${channelName}:`, error);
        
        // Попробуем альтернативный метод
        try {
            console.log('🔄 Попытка загрузки через альтернативный метод...');
            const response = await fetch(`https://api.betterttv.net/3/emotes/shared/twitch/${channelName}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`ℹ️ У канала ${channelName} нет BTTV эмодзи через альтернативный метод`);
                    return {};
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`📥 Получены BTTV эмодзи для канала ${channelName} через альтернативный метод:`, data);
            
            const emotes = {};
            
            // Добавляем эмодзи канала
            if (data?.emotes) {
                console.log(`ℹ️ Найдено ${data.emotes.length} эмодзи канала BTTV через альтернативный метод`);
                for (const emote of data.emotes) {
                    emotes[emote.code] = {
                        url: `https://cdn.betterttv.net/emote/${emote.id}/3x`,
                        type: 'bttv'
                    };
                }
            }
            
            emotesCache.bttv[channelName] = emotes;
            console.log(`✅ Загружено ${Object.keys(emotes).length} BTTV эмодзи через альтернативный метод`);
            return emotes;
        } catch (altError) {
            console.error(`❌ Ошибка загрузки BTTV эмодзи для канала ${channelName} через альтернативный метод:`, altError);
            return {};
        }
    }
}

// Загрузка FFZ эмодзи
async function loadFFZEmotes(channelName) {
    // Для FFZ нужен не ID, а имя канала
    if (emotesCache.ffz[channelName]) {
        console.log(`ℹ️ FFZ эмодзи для канала ${channelName} уже загружены`);
        return emotesCache.ffz[channelName];
    }

    try {
        console.log(`🔍 Загрузка FFZ эмодзи для канала: ${channelName}`);
        const response = await fetch(`https://api.frankerfacez.com/v1/room/${channelName}`);
        
        if (!response.ok) {
            // Если ошибка 404, возможно у канала нет FFZ эмодзи
            if (response.status === 404) {
                console.log(`ℹ️ У канала ${channelName} нет FFZ эмодзи`);
                return {};
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📥 Получены FFZ эмодзи для канала ${channelName}:`, data);
        
        const emotes = {};
        
        // Добавляем глобальные FFZ эмодзи
        if (data?.sets?.[3]?.emoticons) {
            console.log(`ℹ️ Найдено ${data.sets[3].emoticons.length} глобальных FFZ эмодзи`);
            for (const emote of data.sets[3].emoticons) {
                emotes[emote.name] = {
                    url: emote.urls['4'] || emote.urls['2'] || emote.urls['1'],
                    type: 'ffz'
                };
            }
        }
        
        // Добавляем эмодзи канала
        if (data?.room?.set && data?.sets?.[data.room.set]?.emoticons) {
            console.log(`ℹ️ Найдено ${data.sets[data.room.set].emoticons.length} эмодзи канала FFZ`);
            for (const emote of data.sets[data.room.set].emoticons) {
                emotes[emote.name] = {
                    url: emote.urls['4'] || emote.urls['2'] || emote.urls['1'],
                    type: 'ffz'
                };
            }
        }
        
        emotesCache.ffz[channelName] = emotes;
        console.log(`✅ Загружено ${Object.keys(emotes).length} FFZ эмодзи`);
        return emotes;
    } catch (error) {
        console.error(`❌ Ошибка загрузки FFZ эмодзи для канала ${channelName}:`, error);
        return {};
    }
}

// Загрузка 7TV эмодзи
async function load7TVEmotes(channelId) {
    // Для 7TV нужен ID канала, а не имя
    if (emotesCache['7tv'][channelId]) {
        console.log(`ℹ️ 7TV эмодзи для канала ${channelId} уже загружены`);
        return emotesCache['7tv'][channelId];
    }

    try {
        console.log(`🔍 Загрузка 7TV эмодзи для канала: ${channelId}`);
        const response = await fetch(`https://7tv.io/v3/users/twitch/${channelId}`);
        
        if (!response.ok) {
            // Если ошибка 404, возможно у канала нет 7TV эмодзи
            if (response.status === 404) {
                console.log(`ℹ️ У канала ${channelId} нет 7TV эмодзи`);
                return {};
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📥 Получены 7TV эмодзи для канала ${channelId}:`, data);
        
        const emotes = {};
        
        // Добавляем эмодзи канала
        if (data?.emote_set?.emotes) {
            console.log(`ℹ️ Найдено ${data.emote_set.emotes.length} 7TV эмодзи`);
            for (const emote of data.emote_set.emotes) {
                emotes[emote.name] = {
                    url: `https://cdn.7tv.app/emote/${emote.id}/2x`,
                    type: '7tv'
                };
            }
        }
        
        emotesCache['7tv'][channelId] = emotes;
        console.log(`✅ Загружено ${Object.keys(emotes).length} 7TV эмодзи`);
        return emotes;
    } catch (error) {
        console.error(`❌ Ошибка загрузки 7TV эмодзи для канала ${channelId}:`, error);
        return {};
    }
}

// Получение Twitch user ID через API
async function getTwitchUserId(username) {
    try {
        console.log(`🔍 Получение Twitch user ID для: ${username}`);
        const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📥 Получены данные пользователя:`, data);
        
        if (data && data[0] && data[0].id) {
            console.log(`✅ Получен Twitch user ID: ${data[0].id} для ${username}`);
            return data[0].id;
        }
        
        console.error(`❌ Не удалось получить Twitch user ID для: ${username}`);
        return null;
    } catch (error) {
        console.error(`❌ Ошибка при получении Twitch user ID для ${username}:`, error);
        return null;
    }
}

// Замена эмодзи в тексте
function replaceEmotes(text, channelId, channelName) {
    if (!text) {
        console.log('⚠️ Не указан текст для замены эмодзи');
        return text;
    }
    
    console.log(`🔍 Замена эмодзи в тексте: "${text}"`);
    
    // Получаем все эмодзи
    const twitchEmotes = emotesCache.twitch[channelId] || {};
    const bttvEmotes = emotesCache.bttv[channelName] || {};
    const ffzEmotes = emotesCache.ffz[channelName] || {};
    const sevenTVEmotes = emotesCache['7tv'][channelId] || {};
    
    console.log(`ℹ️ Доступно эмодзи: Twitch=${Object.keys(twitchEmotes).length}, BTTV=${Object.keys(bttvEmotes).length}, FFZ=${Object.keys(ffzEmotes).length}, 7TV=${Object.keys(sevenTVEmotes).length}`);
    
    // Объединяем все эмодзи в один объект
    const allEmotes = { ...twitchEmotes, ...bttvEmotes, ...ffzEmotes, ...sevenTVEmotes };
    
    if (Object.keys(allEmotes).length === 0) {
        console.log('⚠️ Нет доступных эмодзи для замены');
        return text;
    }
    
    // Сортируем эмодзи по длине (от самых длинных к самым коротким)
    const sortedEmotes = Object.keys(allEmotes).sort((a, b) => b.length - a.length);
    
    let replacedText = text;
    
    // Заменяем каждый эмодзи
    for (const emote of sortedEmotes) {
        // Создаем регулярное выражение для поиска эмодзи как отдельного слова
        const regex = new RegExp(`\\b${escapeRegExp(emote)}\\b`, 'g');
        
        replacedText = replacedText.replace(regex, (match) => {
            const emoteData = allEmotes[emote];
            console.log(`✅ Замена эмодзи: "${emote}" -> ${emoteData.url}`);
            return `<img src="${emoteData.url}" alt="${emote}" class="emote" loading="lazy" />`;
        });
    }
    
    console.log(`✅ Результат замены: "${replacedText}"`);
    return replacedText;
}

// Экранирование регулярных выражений
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Инициализация эмодзи
async function initEmotes(channel) {
    try {
        console.log('🔄 Инициализация эмодзи...');
        
        // Получаем ID канала
        const channelId = await getTwitchUserId(channel);
        if (!channelId) {
            console.error('❌ Не удалось получить ID канала');
            return false;
        }
        
        console.log(`✅ Получен ID канала: ${channelId}`);
        
        // Загружаем все типы эмодзи
        const [twitchEmotes, bttvEmotes, ffzEmotes, sevenTVEmotes] = await Promise.all([
            loadTwitchEmotes(channelId),
            loadBTTVEmotes(channel),
            loadFFZEmotes(channel),
            load7TVEmotes(channelId)
        ]);
        
        console.log(`✅ Эмодзи успешно инициализированы. Всего: ${Object.keys(twitchEmotes).length + Object.keys(bttvEmotes).length + Object.keys(ffzEmotes).length + Object.keys(sevenTVEmotes).length}`);
        return true;
    } catch (error) {
        console.error('❌ Ошибка инициализации эмодзи:', error);
        return false;
    }
}

// Добавление стилей для эмодзи
function addEmotesStyles() {
    // Проверяем, не добавлены ли уже стили
    if (document.querySelector('style#emotes-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'emotes-styles';
    style.textContent = `
        .emote {
            vertical-align: middle;
            height: ${parseInt(size) * 1.2}px;
            margin: 0 2px;
            border-radius: 2px;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ Стили для эмодзи добавлены');
}

// Обработка ошибок загрузки эмодзи
function setupEmoteErrorHandling() {
    document.addEventListener('error', function(event) {
        if (event.target && event.target.classList && event.target.classList.contains('emote')) {
            console.log(`❌ Ошибка загрузки эмодзи: ${event.target.src}`);
            event.target.style.display = 'none';
        }
    }, true);
}

// Экспортируем функции
window.emotes = {
    init: initEmotes,
    replace: replaceEmotes,
    addStyles: addEmotesStyles,
    setupErrorHandling: setupEmoteErrorHandling,
    loadTwitch: loadTwitchEmotes,
    loadBTTV: loadBTTVEmotes,
    loadFFZ: loadFFZEmotes,
    load7TV: load7TVEmotes,
    getTwitchUserId: getTwitchUserId
};

console.log('✅ Модуль эмодзи загружен и готов к использованию');