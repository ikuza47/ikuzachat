// Тестовый режим - генерирует рандомные сообщения для тестирования
let testModeInterval = null;
let testModeActive = false;

// Список тестовых слов
const testWords = [
    'hello', 'world', 'test', 'debug', 'chat', 'message', 'overlay', 'twitch',
    'emote', 'emoji', 'user', 'name', 'channel', 'stream', 'follow', 'sub',
    'cheer', 'donation', 'raid', 'gift', 'mod', 'broadcaster', 'viewer',
    'IkuzaChat', 'settings', 'parameters', 'animation', 'style', 'font',
    'size', 'color', 'background', 'time', 'badge', 'osu', 'map', 'score',
    'user', 'highlight', 'bot', 'filter', 'command', 'clear', 'remove',
    'animation', 'fadeIn', 'fadeOut', 'slideIn', 'bounce', 'zoom'
];

// Список потенциально "опасных" тестовых строк
const dangerousStrings = [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(\'XSS\')">',
    '<svg onload="alert(\'XSS\')">',
    '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;',
    '&#60;script&#62;alert(&#34;XSS&#34;)&#60;/script&#62;',
    '&lt;img src=x onerror=alert(1)&gt;',
    '&amp;nbsp;', // &nbsp; в виде сущности
    '&#160;', // неразрывный пробел
    '&#34; onclick=&#34;alert(1)', // попытка XSS через атрибуты
    'javascript:alert(1)',
    'vbscript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    '<iframe src="javascript:alert(1)">',
    '<a href="javascript:alert(1)">click me</a>',
    '&lt;div style=&quot;color:red&quot;&gt;red text&lt;/div&gt;',
    'normal text &#160; with entities &#38; symbols',
    'test &nbsp; space &amp; ampersand &#60; tag',
    // Некоторые HTML сущности
    '&lt;', '&gt;', '&amp;', '&quot;', '&apos;',
    '&#60;', '&#62;', '&#38;', '&#34;', '&#39;'
];

// Функция для запуска тестового режима
function startTestMode() {
    if (testModeActive) {
        console.log('⚠️ Тестовый режим уже запущен');
        return;
    }

    console.log('🧪 Запуск тестового режима');
    testModeActive = true;

    // Проверяем, доступны ли эмодзи
    const allEmotes = getAllAvailableEmotes();
    console.log(`📦 Доступно эмодзи для теста: ${Object.keys(allEmotes).length}`);

    // Генерируем сообщения с интервалом
    testModeInterval = setInterval(() => {
        generateAndDisplayTestMessage(allEmotes);
    }, 2000); // каждые 2 секунды
}

// Функция для остановки тестового режима
function stopTestMode() {
    if (testModeInterval) {
        clearInterval(testModeInterval);
        testModeInterval = null;
        testModeActive = false;
        console.log('🛑 Тестовый режим остановлен');
    }
}

// Функция для получения всех доступных эмодзи
function getAllAvailableEmotes() {
    // Собираем все доступные эмодзи из различных источников
    let allEmotes = {};

    if (window.emotes && window.emotesCache) {
        // Twitch эмодзи
        if (window.emotesCache.twitch) {
            for (const channelId in window.emotesCache.twitch) {
                Object.assign(allEmotes, window.emotesCache.twitch[channelId]);
            }
        }

        // BTTV эмодзи
        if (window.emotesCache.bttv) {
            for (const channelName in window.emotesCache.bttv) {
                Object.assign(allEmotes, window.emotesCache.bttv[channelName]);
            }
        }

        // FFZ эмодзи
        if (window.emotesCache.ffz) {
            for (const channelName in window.emotesCache.ffz) {
                Object.assign(allEmotes, window.emotesCache.ffz[channelName]);
            }
        }

        // 7TV эмодзи
        if (window.emotesCache['7tv']) {
            for (const channelId in window.emotesCache['7tv']) {
                Object.assign(allEmotes, window.emotesCache['7tv'][channelId]);
            }
        }
    }

    return allEmotes;
}

// Функция для генерации и отображения тестового сообщения
function generateAndDisplayTestMessage(emotes) {
    // Генерируем рандомное имя пользователя
    const randomUser = generateRandomUsername();

    // Создаем сообщение: случайные слова + эмодзи + потенциально "опасные" строки
    const messageParts = [];

    // Добавляем случайное количество обычных слов (2-5)
    const wordCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < wordCount; i++) {
        messageParts.push(testWords[Math.floor(Math.random() * testWords.length)]);
    }

    // Добавляем случайные эмодзи (0-3)
    const emoteCount = Math.floor(Math.random() * 4);
    const emoteKeys = Object.keys(emotes);
    for (let i = 0; i < emoteCount && emoteKeys.length > 0; i++) {
        const randomEmote = emoteKeys[Math.floor(Math.random() * emoteKeys.length)];
        messageParts.push(randomEmote);
    }

    // Добавляем потенциально "опасные" строки (0-2)
    const dangerCount = Math.floor(Math.random() * 3);
    for (let i = 0; i < dangerCount; i++) {
        messageParts.push(dangerousStrings[Math.floor(Math.random() * dangerousStrings.length)]);
    }

    // Собираем сообщение
    const messageText = messageParts.join(' ');

    // Создаем теги для тестового сообщения
    const tags = generateRandomTags();

    // Выбираем случайный channel ID
    let channelId = null;
    if (window.emotesCache && window.emotesCache.twitch) {
        const channelIds = Object.keys(window.emotesCache.twitch);
        if (channelIds.length > 0) {
            channelId = channelIds[Math.floor(Math.random() * channelIds.length)];
        }
    }

    // Добавляем сообщение в чат
    if (window.addMessage) {
        // Используем цвет ника из тегов или генерируем случайный, если нет
        const color = extractColor(tags) || getRandomColor();
        addMessage(randomUser, messageText, tags, messageText, channelId, color);
    }
}

// Функция для генерации рандомного имени пользователя
function generateRandomUsername() {
    const prefixes = ['Test', 'User', 'Guest', 'Anonymous', 'Fake', 'Demo', 'Debug', 'Dev'];
    const suffixes = ['_01', '_02', '_03', '_47', '_69', '_420', '_xyz', '_temp'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return prefix + suffix;
}

// Функция для генерации рандомных тегов
function generateRandomTags() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];

    const badges = [
        'moderator/1', 'broadcaster/1', 'subscriber/1', 'premium/1',
        'turbo/1', 'glitchcon2020/1', 'hype-train/1', 'bits/1'
    ];

    const color = colors[Math.floor(Math.random() * colors.length)];
    const badge = Math.random() > 0.5 ? badges[Math.floor(Math.random() * badges.length)] : '';

    let tags = `color=${color}`;
    if (badge) {
        tags += `;badges=${badge}`;
    }

    return tags;
}

// Функция для извлечения цвета из тегов (копия из utils.js)
function extractColor(tags) {
    const colorMatch = tags.match(/color=([^;]+)/);
    const color = colorMatch ? colorMatch[1] : null;

    // Проверяем, что цвет есть и не пустой
    if (color && color.trim() !== '' && color !== 'null' && color !== 'undefined') {
        return color;
    }

    return null;
}

// Функция для получения случайного цвета
function getRandomColor() {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
        '#FF4500', '#00FF7F', '#1E90FF', '#FFD700', '#FF69B4',
        '#ADFF2F', '#FF6347', '#7B68EE'
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}

// Экспортируем функции
window.testModeModule = {
    start: startTestMode,
    stop: stopTestMode,
    isActive: () => testModeActive,
    generateAndDisplay: generateAndDisplayTestMessage
};

console.log('✅ Модуль тестового режима загружен');