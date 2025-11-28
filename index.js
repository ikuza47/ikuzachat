// Определение языка системы
const userLang = navigator.language || navigator.userLanguage;
let currentLang = userLang.startsWith('ru') ? 'ru' : 'en';
console.log('🌐 Язык системы:', userLang, 'Выбран язык:', currentLang);

// Языковые строки
const translations = {
    ru: {
        title: 'IkuzaChat - Настройки',
        mainTitle: 'IkuzaChat',
        subtitle: 'Настройте ваш оверлей для Twitch чата',
        tabBasic: 'Основное',
        tabAdvanced: 'Дополнительно',
        tabModules: 'Модули',
        basicSettingsTitle: 'Основные настройки',
        channelLabel: 'Имя канала',
        channelDesc: 'Введите имя Twitch-канала, с которого будет читаться чат',
        fontLabel: 'Шрифт',
        fontDesc: 'Выберите шрифт для отображения сообщений в чате',
        sizeLabel: 'Размер шрифта',
        sizeDesc: 'Размер текста в чате в пикселях',
        advancedSettingsTitle: 'Дополнительные настройки',
        timeLabel: 'Показывать время',
        timeDesc: 'Показывать текущее время в формате HH:MM перед ником',
        timeZoneLabel: 'Часовой пояс',
        timeZoneDesc: 'Выберите часовой пояс для отображения времени',
        backgroundLabel: 'Отображать задний фон сообщений',
        backgroundDesc: 'Показывать полупрозрачный черный фон за сообщениями',
        bgTransparencyLabel: 'Прозрачность фона',
        bgTransparencyDesc: '0 = полностью прозрачный, 1 = непрозрачный',
        userBadgesLabel: 'Отображать бейджики пользователей',
        userBadgesDesc: 'Показывать бейджики премиум, турбо и другие',
        channelBadgesLabel: 'Отображать бейджики канала',
        channelBadgesDesc: 'Показывать бейджики модератора, подписчика и т.д.',
        achievementBadgesLabel: 'Отображать бейджики достижений',
        achievementBadgesDesc: 'Показывать бейджики Hype Train, First Time Chatter и т.д.',
        animationInLabel: 'Анимация появления',
        animationInDesc: 'Выберите анимацию появления сообщений',
        animationOutLabel: 'Анимация исчезновения',
        animationOutDesc: 'Выберите анимацию исчезновения сообщений',
        autoRemoveLabel: 'Автоудаление сообщений',
        autoRemoveDesc: 'Автоматически удалять старые сообщения через указанное время',
        timeoutLabel: 'Время до удаления (сек)',
        timeoutDesc: 'Через сколько секунд удалять сообщение',
        clearChatLabel: 'Автоочистка чата',
        clearChatDesc: 'Чат будет очищаться при команде /clear в Twitch',
        colonLabel: 'Добавлять двоеточие после ника',
        colonDesc: 'Добавлять : после имени пользователя в сообщениях',
        modulesTitle: 'Модули',
        osuModuleLabel: 'osu! модуль',
        osuModuleDesc: 'Включает поддержку отображения информации о картах osu! по ссылке',
        osuApiKeyLabel: 'osu! API ключ',
        osuApiInstructionText: 'Ключ от osu! API v1 для получения информации о картах. ',
        osuApiLinkText: 'Instruction',
        osuMapLabel: 'Парсинг карты',
        osuMapDesc: 'Парсит ссылку на мапу и выводит информацию',
        osuScoreLabel: 'Парсинг скоры',
        osuScoreDesc: 'Парсит ссылку на скор и выводит информацию о скоре (не работает)',
        osuUserLabel: 'Парсинг юзера',
        osuUserDesc: 'Парсит ссылку на юзера и выводит информацию о нём',
        osuHighlightLabel: 'Выделять информацию',
        osuHighlightDesc: 'Меняет часть текста на другой цвет: \n Карта - розовый \n Скор - жёлтый \n Юзер - синий',
        botModuleLabel: 'Блокировка ботов',
        botModuleDesc: 'Скрывать сообщения от ботов (список загружается с GitHub)',
        copyBtnText: 'Скопировать ссылку',
        resetBtnText: 'Сбросить',
    },
    en: {
        title: 'IkuzaChat - Settings',
        mainTitle: 'IkuzaChat',
        subtitle: 'Configure your Twitch chat overlay',
        tabBasic: 'Basic',
        tabAdvanced: 'Advanced',
        tabModules: 'Modules',
        basicSettingsTitle: 'Basic Settings',
        channelLabel: 'Channel Name',
        channelDesc: 'Enter the name of the Twitch channel from which the chat will be read',
        fontLabel: 'Font',
        fontDesc: 'Choose a font for displaying messages in chat',
        sizeLabel: 'Font Size',
        sizeDesc: 'The size of the text in the chat in pixels',
        advancedSettingsTitle: 'Advanced Settings',
        timeLabel: 'Show time',
        timeDesc: 'Show current time in HH:MM format before the username',
        timeZoneLabel: 'Time zone',
        timeZoneDesc: 'Select the time zone for displaying time',
        backgroundLabel: 'Show message background',
        backgroundDesc: 'Display a semi-transparent black background behind messages',
        bgTransparencyLabel: 'Background transparency',
        bgTransparencyDesc: '0 = fully transparent, 1 = opaque',
        userBadgesLabel: 'Display User Badges',
        userBadgesDesc: 'Show premium, turbo and other user badges',
        channelBadgesLabel: 'Display Channel Badges',
        channelBadgesDesc: 'Show moderator, subscriber, etc. badges',
        achievementBadgesLabel: 'Display Achievement Badges',
        achievementBadgesDesc: 'Show Hype Train, First Time Chatter and other achievement badges',
        animationInLabel: 'Animation on appearance',
        animationInDesc: 'Select the animation when messages appear',
        animationOutLabel: 'Animation on disappearance',
        animationOutDesc: 'Select the animation when messages disappear',
        autoRemoveLabel: 'Auto Remove Messages',
        autoRemoveDesc: 'Automatically delete old messages after a specified time',
        timeoutLabel: 'Time until deletion (sec)',
        timeoutDesc: 'How many seconds to delete the message after',
        clearChatLabel: 'Auto Clear Chat',
        clearChatDesc: 'Chat will be cleared when using /clear command in Twitch',
        colonLabel: 'Add colon after nickname',
        colonDesc: 'Add : after the username in messages',
        modulesTitle: 'Modules',
        osuModuleLabel: 'osu! module',
        osuModuleDesc: 'Enables support for displaying osu! map info from a link',
        osuApiKeyLabel: 'osu! API key',
        osuApiInstructionText: 'osu! API v1 key for getting beatmap info. ',
        osuApiLinkText: 'Instruction',
        osuMapLabel: 'Parse map',
        osuMapDesc: 'Parses map link and displays information',
        osuScoreLabel: 'Parse score',
        osuScoreDesc: 'Parses score link and displays score info (not working)',
        osuUserLabel: 'Parse user',
        osuUserDesc: 'Parses user link and displays user info',
        osuHighlightLabel: 'Highlight info',
        osuHighlightDesc: 'Changes part of the text to another color: \n Map - pink \n Score - yellow \n User - blue',
        botModuleLabel: 'Block Bots',
        botModuleDesc: 'Hide messages from bots (list loaded from GitHub)',
        copyBtnText: 'Copy Link',
        resetBtnText: 'Reset',
    }
};

// Функция для обновления текста на странице
function updateTexts() {
    const t = translations[currentLang];

    document.title = t.title;
    document.getElementById('mainTitle').textContent = t.mainTitle;
    document.getElementById('subtitle').textContent = t.subtitle;

    document.getElementById('tabBasic').textContent = t.tabBasic;
    document.getElementById('tabAdvanced').textContent = t.tabAdvanced;
    document.getElementById('tabModules').textContent = t.tabModules;

    document.getElementById('basicSettingsTitle').textContent = t.basicSettingsTitle;
    document.getElementById('channelLabel').textContent = t.channelLabel;
    document.getElementById('channelDesc').textContent = t.channelDesc;
    document.getElementById('fontLabel').textContent = t.fontLabel;
    document.getElementById('fontDesc').textContent = t.fontDesc;
    document.getElementById('sizeLabel').textContent = t.sizeLabel;
    document.getElementById('sizeDesc').textContent = t.sizeDesc;

    document.getElementById('advancedSettingsTitle').textContent = t.advancedSettingsTitle;
    document.getElementById('timeLabel').textContent = t.timeLabel;
    document.getElementById('timeDesc').textContent = t.timeDesc;
    document.getElementById('timeZoneLabel').textContent = t.timeZoneLabel;
    document.getElementById('timeZoneDesc').textContent = t.timeZoneDesc;
    document.getElementById('backgroundLabel').textContent = t.backgroundLabel;
    document.getElementById('backgroundDesc').textContent = t.backgroundDesc;
    document.getElementById('bgTransparencyLabel').textContent = t.bgTransparencyLabel;
    document.getElementById('bgTransparencyDesc').textContent = t.bgTransparencyDesc;
    document.getElementById('userBadgesLabel').textContent = t.userBadgesLabel;
    document.getElementById('userBadgesDesc').textContent = t.userBadgesDesc;
    document.getElementById('channelBadgesLabel').textContent = t.channelBadgesLabel;
    document.getElementById('channelBadgesDesc').textContent = t.channelBadgesDesc;
    document.getElementById('achievementBadgesLabel').textContent = t.achievementBadgesLabel;
    document.getElementById('achievementBadgesDesc').textContent = t.achievementBadgesDesc;
    document.getElementById('animationInLabel').textContent = t.animationInLabel;
    document.getElementById('animationInDesc').textContent = t.animationInDesc;
    document.getElementById('animationOutLabel').textContent = t.animationOutLabel;
    document.getElementById('animationOutDesc').textContent = t.animationOutDesc;
    document.getElementById('autoRemoveLabel').textContent = t.autoRemoveLabel;
    document.getElementById('autoRemoveDesc').textContent = t.autoRemoveDesc;
    document.getElementById('timeoutLabel').textContent = t.timeoutLabel;
    document.getElementById('timeoutDesc').textContent = t.timeoutDesc;
    document.getElementById('clearChatLabel').textContent = t.clearChatLabel;
    document.getElementById('clearChatDesc').textContent = t.clearChatDesc;
    document.getElementById('colonLabel').textContent = t.colonLabel;
    document.getElementById('colonDesc').textContent = t.colonDesc;

    document.getElementById('modulesTitle').textContent = t.modulesTitle;
    document.getElementById('osuModuleLabel').textContent = t.osuModuleLabel;
    document.getElementById('osuModuleDesc').textContent = t.osuModuleDesc;
    document.getElementById('osuApiKeyLabel').textContent = t.osuApiKeyLabel;
    document.getElementById('osuApiInstructionText').textContent = t.osuApiInstructionText;
    document.getElementById('osuApiLinkText').textContent = t.osuApiLinkText;
    document.getElementById('osuMapLabel').textContent = t.osuMapLabel;
    document.getElementById('osuMapDesc').textContent = t.osuMapDesc;
    document.getElementById('osuScoreLabel').textContent = t.osuScoreLabel;
    document.getElementById('osuScoreDesc').textContent = t.osuScoreDesc;
    document.getElementById('osuUserLabel').textContent = t.osuUserLabel;
    document.getElementById('osuUserDesc').textContent = t.osuUserDesc;
    document.getElementById('osuHighlightLabel').textContent = t.osuHighlightLabel;
    document.getElementById('osuHighlightDesc').textContent = t.osuHighlightDesc;
    document.getElementById('botModuleLabel').textContent = t.botModuleLabel;
    document.getElementById('botModuleDesc').textContent = t.botModuleDesc;

    document.getElementById('copyBtnText').innerHTML = `<i class="fas fa-copy mr-2"></i>${t.copyBtnText}`;
    document.getElementById('resetBtnText').innerHTML = `<i class="fas fa-redo mr-2"></i>${t.resetBtnText}`;
}

// Функция для обновления ссылки на инструкцию
function updateInstructionLink() {
    const osuApiLink = document.getElementById('osuApiLink');
    if (currentLang === 'ru') {
        osuApiLink.href = 'https://github.com/ikuza47/ikuzachat/blob/main/publics/howgetosuapi.md';
    } else {
        osuApiLink.href = 'https://github.com/ikuza47/ikuzachat/blob/main/publics/howgetosuapi.md';
    }
}

// Функция смены языка
function changeLanguage() {
    const langSelect = document.getElementById('langSelector');
    currentLang = langSelect.value;
    console.log('🌐 Язык изменён на:', currentLang);
    updateTexts();
    updateInstructionLink();
    updateUrl();
}

// Инициализация при загрузке
function initLanguage() {
    const langSelect = document.getElementById('langSelector');
    langSelect.value = currentLang;
    updateTexts();
    updateInstructionLink();
}

// Переключение вкладок
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active', 'bg-card-bg', 'text-accent-orange', 'border-l-2', 'border-accent-orange'));
        document.querySelectorAll('.tab').forEach(t => t.classList.add('bg-primary-bg', 'text-text-secondary', 'hover:bg-card-bg', 'hover:text-text-primary'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.remove('bg-primary-bg', 'text-text-secondary', 'hover:bg-card-bg', 'hover:text-text-primary');
        tab.classList.add('active', 'bg-card-bg', 'text-accent-orange', 'border-l-2', 'border-accent-orange');
        const tabId = tab.getAttribute('data-tab') + '-tab';
        document.getElementById(tabId).classList.remove('hidden');
        document.getElementById(tabId).classList.add('active');
    });
});

// Переключение настроек времени
function toggleTimeSettings() {
    const timeSettings = document.getElementById('timeSettings');
    if (document.getElementById('showTime').checked) {
        timeSettings.classList.remove('hidden');
    } else {
        timeSettings.classList.add('hidden');
    }
    updateUrl();
}

// Переключение настроек фона
function toggleBackgroundSettings() {
    const backgroundSettings = document.getElementById('backgroundSettings');
    if (document.getElementById('showBackground').checked) {
        backgroundSettings.classList.remove('hidden');
    } else {
        backgroundSettings.classList.add('hidden');
    }
    updateUrl();
}

// Переключение настроек osu!
function toggleOsuSettings() {
    const osuSettings = document.getElementById('osuModuleSettings');
    if (document.getElementById('osuModuleToggle').checked) {
        osuSettings.classList.remove('hidden');
    } else {
        osuSettings.classList.add('hidden');
    }
    updateUrl();
}

// Обновление значения прозрачности
function updateBgTransparencyValue() {
    const slider = document.getElementById('bgTransparency');
    const value = parseFloat(slider.value).toFixed(2);
    document.getElementById('bgTransparencyValue').textContent = value;
}

// Переключение таймаута
function toggleTimeout() {
    const timeoutGroup = document.getElementById('timeoutGroup');
    if (document.getElementById('autoRemove').checked) {
        timeoutGroup.classList.remove('hidden');
    } else {
        timeoutGroup.classList.add('hidden');
    }
}

// Обработка выбора шрифта
document.getElementById('fontFamily').addEventListener('change', function() {
    const customInput = document.getElementById('customFontInput');
    const preview = document.querySelector('.font-preview');
    if (this.value === 'custom') {
        customInput.classList.remove('hidden');
        preview.textContent = 'Введите название шрифта';
    } else {
        customInput.classList.add('hidden');
        preview.textContent = 'Пример текста';
        preview.style.fontFamily = this.value;
    }
    updateUrl();
});

// Обновление превью шрифта
document.getElementById('customFontInput').addEventListener('input', function() {
    const preview = document.querySelector('.font-preview');
    preview.textContent = 'Проверка шрифта: ' + this.value;
    preview.style.fontFamily = this.value + ', sans-serif';
    updateUrl();
});

// Генерация ссылки
function updateUrl() {
    const channel = document.getElementById('channel').value.trim().toLowerCase();
    if (!channel) return;

    const params = new URLSearchParams();
    params.append('channel', channel);

    let fontValue = document.getElementById('fontFamily').value;
    if (fontValue === 'custom') {
        const customFont = document.getElementById('customFontInput').value.trim();
        fontValue = customFont ? `'${customFont}', sans-serif` : 'sans-serif';
    }
    params.append('f', encodeURIComponent(fontValue));  // короткое имя для шрифта
    params.append('sz', document.getElementById('fontSize').value);  // короткое имя для размера

    // Параметры бейджиков - теперь с отдельными переключателями
    params.append('ubdg', document.getElementById('showUserBadges').checked); // короткое имя для showUserBadges
    params.append('cbdg', document.getElementById('showChannelBadges').checked); // короткое имя для showChannelBadges
    params.append('abdg', document.getElementById('showAchievementBadges').checked); // короткое имя для showAchievementBadges

    params.append('clrc', document.getElementById('clearChatOnCommand').checked);  // короткое имя
    params.append('col', document.getElementById('colonEnabled').checked);  // короткое имя

    if (document.getElementById('autoRemove').checked) {
        params.append('rm', 'true');  // короткое имя
        params.append('tm', document.getElementById('removeTimeout').value || '5');  // короткое имя
    }

    // Время
    if (document.getElementById('showTime').checked) {
        const timeZone = document.getElementById('timeZone').value;
        params.append('mt', timeZone);  // короткое имя
    }

    // osu!
    if (document.getElementById('osuModuleToggle').checked) {
        const osuKey = document.getElementById('osuApiKey').value.trim();
        if (osuKey) {
            params.append('osu', osuKey);  // короткое имя
        }

        // Новые параметры osu!
        params.append('osum', document.getElementById('osuMap').checked);  // короткое имя
        params.append('osus', document.getElementById('osuScore').checked);  // короткое имя
        params.append('osuu', document.getElementById('osuUser').checked);  // короткое имя
        params.append('osuh', document.getElementById('osuHighlight').checked);  // короткое имя
    }

    // bot!
    params.append('bb', document.getElementById('botModuleToggle').checked);  // короткое имя (block bots)


    // Добавляем параметры анимаций (если они включены)
    const animationIn = document.getElementById('animationIn').value;
    const animationOut = document.getElementById('animationOut').value;

    if (animationIn !== 'none') {
        params.append('animationIn', animationIn);
    }
    if (animationOut !== 'none') {
        params.append('animationOut', animationOut);
    }

    const url = `v1/index.html?${params.toString()}`;
    const fullUrl = `${window.location.origin}${window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1)}${url}`;
    document.getElementById('overlayUrl').value = fullUrl;
}

// Копирование ссылки
function copyUrl() {
    const input = document.getElementById('overlayUrl');
    input.select();
    document.execCommand('copy');
    alert('Ссылка скопирована!');
}

// Сброс настроек
function resetSettings() {
    if (confirm('Сбросить все настройки?')) {
        document.getElementById('channel').value = 'ikuza47';
        document.getElementById('fontFamily').value = "'Segoe UI', sans-serif";
        document.getElementById('fontSize').value = '24';
        document.getElementById('showUserBadges').checked = true;
        document.getElementById('showChannelBadges').checked = true;
        document.getElementById('showAchievementBadges').checked = true;
        document.getElementById('animationIn').value = 'none';
        document.getElementById('animationOut').value = 'none';
        document.getElementById('autoRemove').checked = false;
        document.getElementById('clearChatOnCommand').checked = true;
        document.getElementById('colonEnabled').checked = false; // По умолчанию выключено
        document.getElementById('showTime').checked = false; // Новый параметр
        document.getElementById('timeZone').value = '0'; // По умолчанию UTC+0
        document.getElementById('osuModuleToggle').checked = false;
        document.getElementById('osuApiKey').value = '';
        document.getElementById('osuMap').checked = true; // По умолчанию включено
        document.getElementById('osuScore').checked = false; // По умолчанию выключено
        document.getElementById('osuUser').checked = true; // По умолчанию включено
        document.getElementById('osuHighlight').checked = false; // По умолчанию выключено
        document.getElementById('botModuleToggle').checked = false;
        document.getElementById('customFontInput').classList.add('hidden');
        document.querySelector('.font-preview').textContent = 'Пример текста';
        document.querySelector('.font-preview').style.fontFamily = "'Segoe UI', sans-serif";
        document.getElementById('timeoutGroup').classList.add('hidden');
        document.getElementById('osuModuleSettings').classList.add('hidden');
        document.getElementById('timeSettings').classList.add('hidden'); // Скрыть настройки времени
        document.querySelector('.tab[data-tab="basic"]').click();
        updateUrl();
        alert('Настройки сброшены');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    updateBgTransparencyValue(); // Инициализация значения слайдера
    updateUrl(); // Генерация ссылки при загрузке страницы
});