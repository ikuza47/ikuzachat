// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);

// Получаем параметры чата
const channel = urlParams.get('channel') || 'ikuza47';
const font = decodeURIComponent(urlParams.get('font') || "'Segoe UI', sans-serif");
const size = urlParams.get('size') || '24';
const shadowColorHex = urlParams.get('shadowColor') || '000000';
const shadowBlur = urlParams.get('shadowBlur') || '3';
const autoRemove = urlParams.get('autoRemove') === 'true';
const timeout = parseInt(urlParams.get('timeout') || '5', 10) * 1000;
const clearChatOnCommand = urlParams.get('clearChatOnCommand') !== 'false';
const ignoreBots = urlParams.get('ignorebots') === 'true';

// Получаем параметры анимаций
const animationIn = urlParams.get('animationIn') || 'fadeIn';
const animationOut = urlParams.get('animationOut') || 'fadeOut';

// Получаем параметры бейджиков
const showBadges = urlParams.get('showBadges') === 'true';

// Проверяем, есть ли параметр debug
const debugMode = urlParams.get('debug') === 'true';

// Проверяем, нужно ли добавлять двоеточие после ника
const colonEnabled = urlParams.get('colon') === 'true';

// Форматируем цвета
const shadowColor = `#${shadowColorHex}`;

const useSevenTvNick = urlParams.get('7tvnick') === 'true';


// Применяем настройки
const chatContainer = document.getElementById('chat-container');
if (!chatContainer) {
    console.error('❌ Элемент #chat-container не найден!');
    document.body.innerHTML = '<h1 style="color: white; text-align: center; margin-top: 50px;">Ошибка: элемент #chat-container не найден!</h1>';
    throw new Error('Элемент #chat-container не найден!');
}
if (ignoreBots) {
    const script = document.createElement('script');
    script.src = 'js/modules/bots.js';
    document.head.appendChild(script);
}
if (useSevenTvNick) {
    console.log('🔄 Загрузка модуля 7TV эмодзи после ника...');
    const script = document.createElement('script');
    script.src = 'js/modules/7tvnick.js';
    document.head.appendChild(script);
} else {
    console.log('ℹ️ Модуль 7TV эмодзи после ника отключён');
}
// Выводим все параметры для отладки (только в debugMode)
if (debugMode) {
    console.log('⚙️ Настройки чата:');
    console.log(`- Канал: ${channel}`);
    console.log(`- Шрифт: ${font}`);
    console.log(`- Размер шрифта: ${size}px`);
    console.log(`- Цвет тени: ${shadowColor}`);
    console.log(`- Размытие тени: ${shadowBlur}px`);
    console.log(`- Автоудаление: ${autoRemove ? `включено (${timeout/1000} сек)` : 'отключено'}`);
    console.log(`- Автоочистка чата: ${clearChatOnCommand ? 'включена' : 'отключена'}`);
    console.log(`- Анимация появления: ${animationIn}`);
    console.log(`- Анимация исчезновения: ${animationOut}`);
    console.log(`- Бейджики: ${showBadges ? 'включены' : 'отключены'}`);
    console.log(`- Debug Mode: ${debugMode ? 'включён' : 'отключён'}`);
    console.log(`- Двоеточие после ника: ${colonEnabled ? 'включено' : 'отключено'}`);
}

// Экспортируем все параметры как глобальные переменные
window.debugMode = debugMode;
window.colonEnabled = colonEnabled;
window.size = size;
window.font = font;
window.shadowBlur = shadowBlur;
window.shadowColor = shadowColor;