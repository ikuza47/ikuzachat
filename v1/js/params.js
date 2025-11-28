// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);

// Основные параметры (поддержка новых коротких имен с резервом к старым)
const channel = urlParams.get('cnl') || urlParams.get('channel') || 'ikuza47';
const font = decodeURIComponent(urlParams.get('f') || urlParams.get('font') || "'Segoe UI', sans-serif");
const size = urlParams.get('sz') || urlParams.get('size') || '24';
const shadowColorHex = urlParams.get('shadowColor') || '000000';
const shadowBlur = urlParams.get('shadowBlur') || '3';
const autoRemove = urlParams.get('rm') === 'true' || urlParams.get('autoRemove') === 'true';
const timeout = parseInt(urlParams.get('tm') || urlParams.get('timeout') || '5', 10) * 1000;
const clearChatOnCommand = (urlParams.get('clrc') !== 'false' && urlParams.get('clrc') !== null) || urlParams.get('clearChatOnCommand') !== 'false';

// Новые параметры фона
const showBackground = urlParams.get('bg') === 'true' || urlParams.get('background') === 'true';
const bgTransparent = parseFloat(urlParams.get('bgt') || urlParams.get('bgtransparent')) || 0.3;

// Параметры анимаций
const animationIn = urlParams.get('animationIn') || 'fadeIn';
const animationOut = urlParams.get('animationOut') || 'fadeOut';

// Параметры бейджиков (новые) с поддержкой обратной совместимости
const showBadges = urlParams.get('showBadges'); // проверяем старый параметр
let showUserBadges, showChannelBadges, showAchievementBadges;

if (showBadges !== null) {
    // Если есть старый параметр showBadges, используем его для всех типов
    const oldShowBadges = showBadges === 'true';
    showUserBadges = oldShowBadges;
    showChannelBadges = oldShowBadges;
    showAchievementBadges = oldShowBadges;
} else {
    // Иначе используем новые параметры (с поддержкой коротких имен)
    showUserBadges = urlParams.get('ubdg') === 'true' || urlParams.get('showUserBadges') === 'true';
    showChannelBadges = urlParams.get('cbdg') === 'true' || urlParams.get('showChannelBadges') === 'true';
    showAchievementBadges = urlParams.get('abdg') === 'true' || urlParams.get('showAchievementBadges') === 'true';
}

// Параметры двоеточия
const colonEnabled = urlParams.get('col') === 'true' || urlParams.get('colon') === 'true';

// Новый параметр: время (с поддержкой короткого имени)
const showTime = (urlParams.get('mt') !== null) || (urlParams.get('msgtime') !== null);
const timeZone = parseInt(urlParams.get('mt') || urlParams.get('msgtime') || '0', 10); // по умолчанию UTC+0

// Параметры osu! (с поддержкой коротких имен)
const osuApiKey = urlParams.get('osu'); // osuapi -> osu
const osuMap = urlParams.get('osum') === 'true' || urlParams.get('osuMap') === 'true'; // osuMap -> osum
const osuScore = urlParams.get('osus') === 'true' || urlParams.get('osuScore') === 'true'; // osuScore -> osus
const osuUser = urlParams.get('osuu') === 'true' || urlParams.get('osuUser') === 'true'; // osuUser -> osuu
const osuHighlight = urlParams.get('osuh') === 'true' || urlParams.get('osuHighlight') === 'true'; // osuHighlight -> osuh

// Параметры ботов (с поддержкой короткого имени)
const ignoreBots = urlParams.get('bb') === 'true' || urlParams.get('ignorebots') === 'true'; // ignorebots -> bb (block bots)

// Форматируем цвета
const shadowColor = `#${shadowColorHex}`;

// Применяем настройки
const chatContainer = document.getElementById('chat-container');
if (!chatContainer) {
    console.error('❌ Элемент #chat-container не найден!');
    document.body.innerHTML = '<h1 style="color: white; text-align: center; margin-top: 50px;">Ошибка: элемент #chat-container не найден!</h1>';
    throw new Error('Элемент #chat-container не найден!');
}

// Выводим все параметры для отладки
if (window.debugMode) {
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
    console.log(`- Значки пользователя: ${showUserBadges ? 'включены' : 'отключены'}`);
    console.log(`- Значки канала: ${showChannelBadges ? 'включены' : 'отключены'}`);
    console.log(`- Значки достижений: ${showAchievementBadges ? 'включены' : 'отключены'}`);
    console.log(`- Двоеточие после ника: ${colonEnabled ? 'включено' : 'отключено'}`);
    console.log(`- Задний фон: ${showBackground ? `включён (прозрачность: ${bgTransparent})` : 'отключён'}`);
    console.log(`- Показывать время: ${showTime ? 'включено (часовой пояс: UTC' + (timeZone >= 0 ? '+' : '') + timeZone + ')' : 'отключено'}`);
    console.log(`- osu! API ключ: ${osuApiKey ? 'установлен' : 'не установлен'}`);
    console.log(`- osu! парсинг карты: ${osuMap ? 'включён' : 'отключён'}`);
    console.log(`- osu! парсинг скоры: ${osuScore ? 'включён' : 'отключён'}`);
    console.log(`- osu! парсинг юзера: ${osuUser ? 'включён' : 'отключён'}`);
    console.log(`- osu! выделение: ${osuHighlight ? 'включено' : 'отключено'}`);
    console.log(`- Блокировка ботов: ${ignoreBots ? 'включена' : 'отключена'}`);
}

// Экспортируем параметры как глобальные переменные
window.debugMode = window.debugMode;
window.colonEnabled = colonEnabled;
window.size = size;
window.font = font;
window.shadowBlur = shadowBlur;
window.shadowColor = shadowColor;
window.showUserBadges = showUserBadges;
window.showChannelBadges = showChannelBadges;
window.showAchievementBadges = showAchievementBadges;
window.autoRemove = autoRemove;
window.timeout = timeout;
window.clearChatOnCommand = clearChatOnCommand;
window.animationIn = animationIn;
window.animationOut = animationOut;
window.showBackground = showBackground; // Новый параметр
window.bgTransparent = bgTransparent;   // Новый параметр
window.showTime = showTime;             // Новый параметр
window.timeZone = timeZone;             // Новый параметр
window.osuApiKey = osuApiKey;           // Новый параметр
window.osuMap = osuMap;                 // Новый параметр
window.osuScore = osuScore;             // Новый параметр
window.osuUser = osuUser;               // Новый параметр
window.osuHighlight = osuHighlight;     // Новый параметр
window.ignoreBots = ignoreBots;         // Новый параметр