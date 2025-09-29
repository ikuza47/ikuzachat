// Кэш 7TV эмодзи
let sevenTvEmotesCache = {};
let sevenTvEmotesLoaded = false;
let sevenTvEmotesLoading = false; // флаг загрузки

// Загрузка 7TV эмодзи
async function loadSevenTvEmotes() {
    if (sevenTvEmotesLoaded) {
        console.log('📋 7TV эмодзи уже загружены из кэша');
        return sevenTvEmotesCache;
    }

    if (sevenTvEmotesLoading) {
        console.log('⏳ 7TV эмодзи уже загружаются, ждём...');
        // Ждём завершения загрузки
        while (sevenTvEmotesLoading && !sevenTvEmotesLoaded) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return sevenTvEmotesCache;
    }

    sevenTvEmotesLoading = true;
    console.log('🔄 Начало загрузки 7TV эмодзи...');

    try {
        const response = await fetch('https://7tv.io/v3/emotes/global');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('📥 Получены 7TV эмодзи (первые 5):', data.items?.slice(0, 5));

        // Сохраняем эмодзи в кэш
        for (const emote of data.items || data) {
            sevenTvEmotesCache[emote.name.toLowerCase()] = {
                url: `https://cdn.7tv.app/emote/${emote.id}/2x`,
                name: emote.name
            };
        }

        console.log('✅ Загружено 7TV эмодзи:', Object.keys(sevenTvEmotesCache).length);
        sevenTvEmotesLoaded = true;
        sevenTvEmotesLoading = false;

        return sevenTvEmotesCache;
    } catch (error) {
        console.error('❌ Ошибка загрузки 7TV эмодзи:', error);
        sevenTvEmotesLoading = false;
        sevenTvEmotesLoaded = true; // чтобы не пытаться снова
        return {};
    }
}

// Функция для добавления эмодзи перед ником
async function addSevenTvEmojiToUsername(username) {
    // Если не загружено — пробуем загрузить
    if (!sevenTvEmotesLoaded) {
        console.log('🔄 7TV эмодзи ещё не загружены, запускаем загрузку...');
        await loadSevenTvEmotes();
    }

    if (!sevenTvEmotesLoaded) {
        console.warn('⚠️ 7TV эмодзи не удалось загрузить');
        return null;
    }

    const lowerUsername = username.toLowerCase();
    const emote = sevenTvEmotesCache[lowerUsername];
    if (emote) {
        console.log(`✅ Найден 7TV эмодзи для ника ${username}: ${emote.name}`);
        const img = document.createElement('img');
        img.src = emote.url;
        img.alt = emote.name;
        img.className = 'emote';
        img.style.height = `${parseInt(window.size) * 1.2}px`;
        img.style.marginRight = '4px';
        img.style.verticalAlign = 'middle';
        img.loading = 'lazy';
        return img;
    } else {
        console.log(`ℹ️ 7TV эмодзи для ника ${username} не найден`);
    }

    return null;
}

// Автозагрузка при подключении модуля
console.log('🔄 Модуль 7TV эмодзи после ника загружен, запускаем автозагрузку...');
loadSevenTvEmotes();

// Экспортируем функции
window.sevenTvNickModule = {
    loadSevenTvEmotes,
    addSevenTvEmojiToUsername
};

console.log('✅ Модуль 7TV эмодзи после ника готов к работе');