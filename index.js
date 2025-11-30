// Set English as the default language
let currentLang = 'en';

// Update text elements directly to English
function updateTexts() {
    document.title = 'IkuzaChat - Settings';
    document.getElementById('mainTitle').textContent = 'IkuzaChat';
    document.getElementById('subtitle').textContent = 'Configure your Twitch chat overlay';

    document.getElementById('tabBasic').textContent = 'Basic';
    document.getElementById('tabAdvanced').textContent = 'Advanced';
    document.getElementById('tabModules').textContent = 'Modules';
    document.getElementById('tabDebug').textContent = 'Debug';

    document.getElementById('basicSettingsTitle').textContent = 'Basic Settings';
    document.getElementById('channelLabel').textContent = 'Channel Name';
    document.getElementById('channelDesc').textContent = 'Enter the name of the Twitch channel from which the chat will be read';
    document.getElementById('fontLabel').textContent = 'Font';
    document.getElementById('fontDesc').textContent = 'Choose a font for displaying messages in chat';
    document.getElementById('sizeLabel').textContent = 'Font Size';
    document.getElementById('sizeDesc').textContent = 'The size of the text in the chat in pixels';

    document.getElementById('advancedSettingsTitle').textContent = 'Advanced Settings';
    document.getElementById('timeLabel').textContent = 'Show time';
    document.getElementById('timeDesc').textContent = 'Show current time in HH:MM format before the username';
    document.getElementById('timeZoneLabel').textContent = 'Time zone';
    document.getElementById('timeZoneDesc').textContent = 'Select the time zone for displaying time';
    document.getElementById('backgroundLabel').textContent = 'Show message background';
    document.getElementById('backgroundDesc').textContent = 'Display a semi-transparent black background behind messages';
    document.getElementById('bgTransparencyLabel').textContent = 'Background transparency';
    document.getElementById('bgTransparencyDesc').textContent = '0 = fully transparent, 1 = opaque';
    document.getElementById('userBadgesLabel').textContent = 'Display User Badges';
    document.getElementById('userBadgesDesc').textContent = 'Show premium, turbo and other user badges';
    document.getElementById('channelBadgesLabel').textContent = 'Display Channel Badges';
    document.getElementById('channelBadgesDesc').textContent = 'Show moderator, subscriber, etc. badges';
    document.getElementById('achievementBadgesLabel').textContent = 'Display Achievement Badges';
    document.getElementById('achievementBadgesDesc').textContent = 'Show Hype Train, First Time Chatter and other achievement badges';
    document.getElementById('animationInLabel').textContent = 'Animation on appearance';
    document.getElementById('animationInDesc').textContent = 'Select the animation when messages appear';
    document.getElementById('animationOutLabel').textContent = 'Animation on disappearance';
    document.getElementById('animationOutDesc').textContent = 'Select the animation when messages disappear';
    document.getElementById('autoRemoveLabel').textContent = 'Auto Remove Messages';
    document.getElementById('autoRemoveDesc').textContent = 'Automatically delete old messages after a specified time';
    document.getElementById('timeoutLabel').textContent = 'Time until deletion (sec)';
    document.getElementById('timeoutDesc').textContent = 'How many seconds to delete the message after';
    document.getElementById('clearChatLabel').textContent = 'Auto Clear Chat';
    document.getElementById('clearChatDesc').textContent = 'Chat will be cleared when using /clear command in Twitch';
    document.getElementById('colonLabel').textContent = 'Add colon after nickname';
    document.getElementById('colonDesc').textContent = 'Add : after the username in messages';

    document.getElementById('modulesTitle').textContent = 'Modules';
    document.getElementById('osuModuleLabel').textContent = 'osu! module';
    document.getElementById('osuModuleDesc').textContent = 'Enables support for displaying osu! map info from a link';
    document.getElementById('osuApiKeyLabel').textContent = 'osu! API key';
    document.getElementById('osuApiInstructionText').textContent = 'osu! API v1 key for getting beatmap info. ';
    document.getElementById('osuApiLinkText').textContent = 'Instruction';
    document.getElementById('osuMapLabel').textContent = 'Parse map';
    document.getElementById('osuMapDesc').textContent = 'Parses map link and displays information';
    document.getElementById('osuScoreLabel').textContent = 'Parse score';
    document.getElementById('osuScoreDesc').textContent = 'Parses score link and displays score info (not working)';
    document.getElementById('osuUserLabel').textContent = 'Parse user';
    document.getElementById('osuUserDesc').textContent = 'Parses user link and displays user info';
    document.getElementById('osuHighlightLabel').textContent = 'Highlight info';
    document.getElementById('osuHighlightDesc').textContent = 'Changes part of the text to another color: \n Map - pink \n Score - yellow \n User - blue';
    document.getElementById('botModuleLabel').textContent = 'Block Bots';
    document.getElementById('botModuleDesc').textContent = 'Hide messages from bots (list loaded from GitHub)';

    // Debug tab labels
    document.getElementById('testModeLabel').textContent = 'Test mode';
    document.getElementById('testModeDesc').textContent = 'Generates random messages with emotes for testing';
    document.getElementById('debugSettingsTitle').textContent = 'Debug settings';
    document.getElementById('fontPreviewText').textContent = 'Example text';

    document.getElementById('copyBtnText').innerHTML = '<i class="fas fa-copy mr-2"></i>Copy Link';
    document.getElementById('resetBtnText').innerHTML = '<i class="fas fa-redo mr-2"></i>Reset';

    // Update font family options
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontOptions = {
        "'Segoe UI', sans-serif": 'Segoe UI',
        "Arial, sans-serif": 'Arial',
        "'Helvetica Neue', sans-serif": 'Helvetica',
        "'Open Sans', sans-serif": 'Open Sans',
        "'Roboto', sans-serif": 'Roboto',
        "'Inter', sans-serif": 'Inter',
        "system-ui": 'System fonts',
        "custom": 'Other font...'
    };

    Array.from(fontFamilySelect.options).forEach(option => {
        const optionValue = option.value;
        if (fontOptions[optionValue]) {
            option.textContent = fontOptions[optionValue];
        }
    });

    // Update timezone options
    const timeZoneSelect = document.getElementById('timeZone');
    const timezoneOptions = {
        "-12": 'UTC-12',
        "-11": 'UTC-11',
        "-10": 'UTC-10',
        "-9": 'UTC-9',
        "-8": 'UTC-8',
        "-7": 'UTC-7',
        "-6": 'UTC-6',
        "-5": 'UTC-5',
        "-4": 'UTC-4',
        "-3": 'UTC-3',
        "-2": 'UTC-2',
        "-1": 'UTC-1',
        "0": 'UTC+0',
        "+1": 'UTC+1',
        "+2": 'UTC+2',
        "+3": 'UTC+3',
        "+4": 'UTC+4',
        "+5": 'UTC+5',
        "+6": 'UTC+6',
        "+7": 'UTC+7',
        "+8": 'UTC+8',
        "+9": 'UTC+9',
        "+10": 'UTC+10',
        "+11": 'UTC+11',
        "+12": 'UTC+12',
        "+13": 'UTC+13',
        "+14": 'UTC+14'
    };

    Array.from(timeZoneSelect.options).forEach(option => {
        const optionValue = option.value;
        if (timezoneOptions[optionValue]) {
            option.textContent = timezoneOptions[optionValue];
        }
    });

    // Update animationIn options
    const animationInSelect = document.getElementById('animationIn');
    const animationInOptions = {
        "none": 'none',
        "fadeIn": 'fadeIn',
        "slideInUp": 'slideInUp',
        "bounceIn": 'bounceIn',
        "zoomIn": 'zoomIn'
    };

    Array.from(animationInSelect.options).forEach(option => {
        const optionValue = option.value;
        if (animationInOptions[optionValue]) {
            option.textContent = animationInOptions[optionValue];
        }
    });

    // Update animationOut options
    const animationOutSelect = document.getElementById('animationOut');
    const animationOutOptions = {
        "none": 'none',
        "fadeOut": 'fadeOut',
        "slideOutDown": 'slideOutDown',
        "bounceOut": 'bounceOut',
        "zoomOut": 'zoomOut'
    };

    Array.from(animationOutSelect.options).forEach(option => {
        const optionValue = option.value;
        if (animationOutOptions[optionValue]) {
            option.textContent = animationOutOptions[optionValue];
        }
    });

    // Update font preview to reflect current language
    updateFontPreview();
}

// Update instruction link (English version only)
function updateInstructionLink() {
    // Always use the English version since we're in English-only mode
    const osuApiLink = document.getElementById('osuApiLink');
    osuApiLink.href = 'https://github.com/ikuza47/ikuzachat/blob/main/publics/howgetosuapi.md';
}

// No language change function needed in English-only mode

// Инициализация при загрузке
function initLanguage() {
    // Only set the English language since we're in English-only mode
    updateTexts();
    updateInstructionLink();
}

// Переключение вкладок
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active', 'bg-card-bg', 'text-accent-orange', 'border-l-2', 'border-accent-orange'));
        document.querySelectorAll('.tab').forEach(t => t.classList.add('bg-primary-bg', 'text-text-secondary', 'hover:bg-card-bg', 'hover:text-secondary'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.remove('bg-primary-bg', 'text-text-secondary', 'hover:bg-card-bg', 'hover:text-secondary', 'border-l-2', 'border-accent-orange');
        tab.classList.add('active', 'bg-card-bg', 'text-accent-orange');
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
        preview.textContent = 'Enter font name';
    } else {
        customInput.classList.add('hidden');
        preview.textContent = 'Example text';
        preview.style.fontFamily = this.value;
    }
    updateUrl();
});

// Function to update font preview based on current state
function updateFontPreview() {
    const fontFamily = document.getElementById('fontFamily').value;
    const customFontValue = document.getElementById('customFontInput').value;
    const preview = document.querySelector('.font-preview');

    if (fontFamily === 'custom') {
        if (customFontValue) {
            preview.textContent = 'Test font: ' + customFontValue;
            preview.style.fontFamily = customFontValue + ', sans-serif';
        } else {
            preview.textContent = 'Enter font name';
            preview.style.fontFamily = 'sans-serif';
        }
    } else {
        preview.textContent = 'Example text';
        preview.style.fontFamily = fontFamily;
    }
}

// Обновление превью шрифта
document.getElementById('customFontInput').addEventListener('input', function() {
    updateFontPreview();
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

    // testmode
    params.append('tm', document.getElementById('testModeToggle').checked);  // короткое имя


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
    alert('Link copied!');
}

// Сброс настроек
function resetSettings() {
    if (confirm('Reset all settings?')) {
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
        document.getElementById('colonEnabled').checked = false; // Default off
        document.getElementById('showTime').checked = false; // New setting
        document.getElementById('timeZone').value = '0'; // Default UTC+0
        document.getElementById('osuModuleToggle').checked = false;
        document.getElementById('osuApiKey').value = '';
        document.getElementById('osuMap').checked = true; // Default on
        document.getElementById('osuScore').checked = false; // Default off
        document.getElementById('osuUser').checked = true; // Default on
        document.getElementById('osuHighlight').checked = false; // Default off
        document.getElementById('botModuleToggle').checked = false;
        document.getElementById('testModeToggle').checked = false;
        document.getElementById('customFontInput').classList.add('hidden');
        updateFontPreview();
        document.getElementById('timeoutGroup').classList.add('hidden');
        document.getElementById('osuModuleSettings').classList.add('hidden');
        document.getElementById('timeSettings').classList.add('hidden'); // Hide time settings
        document.querySelector('.tab[data-tab="basic"]').click();
        updateUrl();
        alert('Settings reset');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    updateBgTransparencyValue(); // Инициализация значения слайдера
    updateUrl(); // Генерация ссылки при загрузке страницы
});