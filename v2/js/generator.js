(function () {
    const ids = [
        'channel', 'chatType', 'fontFamily', 'customFont', 'fontSize', 'showUserBadges',
        'showChannelBadges', 'showAchievementBadges', 'badgePosition', 'badgeScale',
        'showTime', 'timePosition', 'timeZone', 'timeColor',
        'showBackground', 'backgroundColor', 'backgroundOpacity', 'backgroundRadius',
        'chatPadding', 'messageGap', 'messagePadding',
        'animationIn', 'animationOut', 'firstMessageEnabled', 'firstMessageColor',
        'firstMessageOpacity', 'firstMessageRadius',
        'clearOnCommand', 'colonEnabled', 'autoRemove', 'removeTimeout',
        'showUserNotices', 'userNoticeColor', 'userNoticeOpacity',
        'meStyleEnabled', 'meItalic',
        'showSystemMessages', 'systemMessageColor', 'hcfBoxColor', 'hcfBoxOpacity',
        'hcfBoxRadius', 'hcfBoxPadding', 'hcfBadgeRadius', 'hcfTopColor', 'hcfReplyColor',
        'hcfTextColor', 'hcfWidthMode', 'hcfMessageSide', 'hcfMessageWidth',
        'testMode', 'debugMode', 'osuEnabled', 'osuApiKey', 'osuMap', 'osuUser',
        'osuScore', 'osuHighlight', 'osuCompactInfo', 'blockBots'
    ];

    const el = {};
    const settingsStorageKey = 'ikuzachat-v2-generator-settings';
    const activeTabStorageKey = 'ikuzachat-v2-active-tab';
    const colorDefaults = {
        timeColor: '#c3c7d4',
        backgroundColor: '#000000',
        firstMessageColor: '#ff6bcb',
        userNoticeColor: '#9f8cff',
        systemMessageColor: '#c3c7d4',
        hcfBoxColor: '#121218',
        hcfTopColor: '#ffffff',
        hcfReplyColor: '#b7bac7',
        hcfTextColor: '#ffffff'
    };
    const rangeFormats = {
        badgeScale: { suffix: 'x', decimals: 2 },
        backgroundOpacity: { suffix: '', decimals: 2 },
        backgroundRadius: { suffix: 'px', decimals: 0 },
        firstMessageOpacity: { suffix: '', decimals: 2 },
        firstMessageRadius: { suffix: 'px', decimals: 0 },
        chatPadding: { suffix: 'px', decimals: 0 },
        messageGap: { suffix: 'px', decimals: 0 },
        messagePadding: { suffix: 'px', decimals: 0 },
        userNoticeOpacity: { suffix: '', decimals: 2 },
        hcfBoxOpacity: { suffix: '', decimals: 2 },
        hcfBoxRadius: { suffix: 'px', decimals: 0 },
        hcfBoxPadding: { suffix: 'px', decimals: 0 },
        hcfBadgeRadius: { suffix: 'px', decimals: 0 },
        hcfMessageWidth: { suffix: 'px', decimals: 0 }
    };
    const defaultValues = {
        channel: 'ikuza47',
        chatType: 'classic',
        fontFamily: "'Segoe UI', sans-serif",
        customFont: '',
        fontSize: '24',
        showUserBadges: true,
        showChannelBadges: true,
        showAchievementBadges: true,
        badgePosition: 'before-name',
        badgeScale: '1.5',
        showTime: false,
        timePosition: 'before-name',
        timeZone: '0',
        timeColor: '#c3c7d4',
        showBackground: false,
        backgroundColor: '#000000',
        backgroundOpacity: '0.35',
        backgroundRadius: '12',
        chatPadding: '12',
        messageGap: '5',
        messagePadding: '5',
        animationIn: 'none',
        animationOut: 'fade',
        firstMessageEnabled: false,
        firstMessageColor: '#ff6bcb',
        firstMessageOpacity: '0.35',
        firstMessageRadius: '12',
        clearOnCommand: true,
        colonEnabled: false,
        autoRemove: false,
        removeTimeout: '12',
        showUserNotices: true,
        userNoticeColor: '#9f8cff',
        userNoticeOpacity: '0.16',
        meStyleEnabled: true,
        meItalic: true,
        showSystemMessages: true,
        systemMessageColor: '#c3c7d4',
        hcfBoxColor: '#121218',
        hcfBoxOpacity: '0.72',
        hcfBoxRadius: '18',
        hcfBoxPadding: '12',
        hcfBadgeRadius: '5',
        hcfTopColor: '#ffffff',
        hcfReplyColor: '#b7bac7',
        hcfTextColor: '#ffffff',
        hcfWidthMode: 'full',
        hcfMessageSide: 'left',
        hcfMessageWidth: '680',
        testMode: false,
        debugMode: false,
        osuEnabled: false,
        osuApiKey: '',
        osuMap: true,
        osuUser: true,
        osuScore: false,
        osuHighlight: false,
        osuCompactInfo: false,
        blockBots: false
    };
    let currentLang = localStorage.getItem('ikuzachat-v2-lang') || 'en';
    let isRestoring = false;

    const dictionaries = {
        en: {
            'hero.subtitle': 'Generate a browser-source link for a clean Twitch chat overlay.',
            'actions.v1': 'v1 generator',
            'nav.title': 'Settings',
            'tabs.basic': 'Basic',
            'tabs.appearance': 'Appearance',
            'tabs.behavior': 'Behavior',
            'tabs.modules': 'Modules',
            'basic.title': 'Basic settings',
            'basic.desc': 'Only the channel is required. The generated URL can be used directly in OBS.',
            'fields.channel': 'Twitch channel',
            'hints.channel': 'Use the channel login without @.',
            'fields.chatType': 'Chat type',
            'options.classic': 'Classic',
            'options.hellcakefication': 'HellCakeFication',
            'fields.font': 'Font',
            'fields.fontSize': 'Font size',
            'fields.customFont': 'Custom font family',
            'hints.customFont': 'The font must be available in the browser source environment.',
            'placeholders.customFont': 'Example: Manrope',
            'options.systemFonts': 'System fonts',
            'options.customFont': 'Custom font',
            'options.none': 'None',
            'options.fade': 'Fade',
            'options.slideUp': 'Slide up',
            'options.slideDown': 'Slide down',
            'options.pop': 'Pop',
            'appearance.title': 'Appearance',
            'appearance.desc': 'Control badges, timestamps, message background and simple animations.',
            'switch.userBadges': 'User badges',
            'switch.userBadgesHint': 'Premium, turbo and similar global badges.',
            'switch.channelBadges': 'Channel badges',
            'switch.channelBadgesHint': 'Broadcaster, moderator, subscriber, VIP and similar badges.',
            'switch.achievementBadges': 'Achievement badges',
            'switch.achievementBadgesHint': 'Bits, hype train, first-time chatter and similar badges.',
            'fields.badgePosition': 'Badge position',
            'fields.badgeScale': 'Badge size multiplier',
            'switch.showTime': 'Show time',
            'switch.showTimeHint': 'Display HH:MM before the nickname.',
            'fields.timePosition': 'Time position',
            'fields.timeZone': 'Time zone',
            'fields.timeColor': 'Time text color',
            'position.beforeName': 'Before name',
            'position.afterName': 'After name',
            'position.topRight': 'Top right corner',
            'switch.background': 'Message background',
            'switch.backgroundHint': 'Adds a soft dark background behind each message.',
            'fields.backgroundColor': 'Message background color',
            'fields.backgroundOpacity': 'Background opacity',
            'fields.backgroundRadius': 'Message background radius',
            'fields.chatPadding': 'Chat edge padding',
            'fields.messageGap': 'Message gap',
            'fields.messagePadding': 'Message inner padding',
            'switch.firstMessage': 'First message background',
            'switch.firstMessageHint': 'Highlight the first message from each user with a background, without adding text.',
            'fields.firstMessageColor': 'First message background color',
            'fields.firstMessageOpacity': 'First message background opacity',
            'fields.firstMessageRadius': 'First message background radius',
            'fields.animationIn': 'Animation in',
            'fields.animationOut': 'Animation out',
            'hellcake.title': 'HellCakeFication message box',
            'hellcake.desc': 'Customize the separated message structure: nickname row, reply preview and message text.',
            'fields.hcfBoxColor': 'Message box color',
            'fields.hcfBoxOpacity': 'Message box opacity',
            'fields.hcfBoxRadius': 'Message box radius',
            'fields.hcfBoxPadding': 'Message box padding',
            'fields.hcfBadgeRadius': 'Badge radius',
            'fields.hcfTopColor': 'Nickname row color',
            'fields.hcfReplyColor': 'Reply preview color',
            'fields.hcfTextColor': 'Message text color',
            'fields.hcfWidthMode': 'Message width mode',
            'fields.hcfMessageSide': 'Compact message side',
            'options.hcfSideLeft': 'Left',
            'options.hcfSideRight': 'Right',
            'options.hcfFullWidth': 'Full width',
            'options.hcfCompactWidth': 'Compact',
            'fields.hcfMessageWidth': 'Max message width',
            'behavior.title': 'Behavior',
            'behavior.desc': 'Set cleanup behavior and rendering helpers for busy chats.',
            'switch.clear': 'Clear on /clear',
            'switch.clearHint': 'Clear overlay when Twitch sends CLEARCHAT.',
            'switch.colon': 'Colon after nickname',
            'switch.colonHint': 'Render usernames as name: message.',
            'switch.autoRemove': 'Auto remove messages',
            'switch.autoRemoveHint': 'Remove old messages after a delay.',
            'fields.removeTimeout': 'Remove after seconds',
            'switch.userNotices': 'Twitch event notices',
            'switch.userNoticesHint': 'Show subs, resubs, gifts, raids and similar USERNOTICE events.',
            'fields.userNoticeColor': 'Notice color',
            'fields.userNoticeOpacity': 'Notice background opacity',
            'switch.meStyle': '/me message style',
            'switch.meStyleHint': 'Apply a separate style to Twitch action messages.',
            'switch.meItalic': 'Italic /me text',
            'switch.meItalicHint': 'Render action messages with italic text.',
            'switch.systemMessages': 'System messages',
            'switch.systemMessagesHint': 'Show local connection/test/system messages.',
            'fields.systemMessageColor': 'System message color',
            'switch.testMode': 'Test mode',
            'switch.testModeHint': 'Generate local messages instead of connecting to Twitch.',
            'switch.debug': 'Debug mode',
            'switch.debugHint': 'Keep extra messages and log more information to console.',
            'modules.title': 'Modules',
            'modules.desc': 'Optional integrations. osu! metadata is loaded from mirror.hinamizawa.ai.',
            'switch.osu': 'osu! links',
            'switch.osuHint': 'Replace osu! map/user links with readable info.',
            'fields.osuKey': 'osu! API key',
            'links.osuHelp': 'How to get a legacy osu! API key',
            'switch.osuMap': 'Parse maps',
            'switch.osuMapHint': 'beatmapsets and beatmaps.',
            'switch.osuUser': 'Parse users',
            'switch.osuUserHint': 'osu! user profile links.',
            'switch.osuScore': 'Parse scores',
            'switch.osuScoreHint': 'Experimental score page parsing.',
            'switch.osuHighlight': 'Highlight osu! info',
            'switch.osuHighlightHint': 'Color replaced osu! text by type.',
            'switch.osuCompactInfo': 'Compact info',
            'switch.osuCompactInfoHint': 'Show fewer fields in HellCakeFication osu! cards.',
            'switch.blockBots': 'Block known bots',
            'switch.blockBotsHint': 'Hide messages from a small bundled bot list.',
            'output.title': 'Overlay link',
            'output.desc': 'Paste this URL into an OBS Browser Source.',
            'actions.copy': 'Copy link',
            'actions.reset': 'Reset',
            'actions.preview': 'Open preview',
            'placeholders.colorHex': '#RRGGBB',
            'status.copied': 'Link copied.',
            'status.reset': 'Settings reset.'
        },
        ru: {
            'hero.subtitle': 'Сгенерируйте ссылку для Browser Source в OBS.',
            'actions.v1': 'Генератор v1',
            'nav.title': 'Настройки',
            'tabs.basic': 'Основное',
            'tabs.appearance': 'Внешний вид',
            'tabs.behavior': 'Поведение',
            'tabs.modules': 'Модули',
            'basic.title': 'Основные настройки',
            'basic.desc': 'Обязателен только канал. Готовую ссылку можно сразу вставить в OBS.',
            'fields.channel': 'Twitch-канал',
            'hints.channel': 'Укажите логин канала без @.',
            'fields.chatType': 'Тип чата',
            'options.classic': 'Классический',
            'options.hellcakefication': 'HellCakeFication',
            'fields.font': 'Шрифт',
            'fields.fontSize': 'Размер шрифта',
            'fields.customFont': 'Свой шрифт',
            'hints.customFont': 'Шрифт должен быть доступен в окружении Browser Source.',
            'placeholders.customFont': 'Например: Manrope',
            'options.systemFonts': 'Системные шрифты',
            'options.customFont': 'Свой шрифт',
            'options.none': 'Нет',
            'options.fade': 'Затухание',
            'options.slideUp': 'Снизу вверх',
            'options.slideDown': 'Сверху вниз',
            'options.pop': 'Поп',
            'appearance.title': 'Внешний вид',
            'appearance.desc': 'Настройте бейджи, время, фон сообщений и простые анимации.',
            'switch.userBadges': 'Пользовательские бейджи',
            'switch.userBadgesHint': 'Premium, turbo и похожие глобальные бейджи.',
            'switch.channelBadges': 'Канальные бейджи',
            'switch.channelBadgesHint': 'Бродкастер, модератор, подписчик, VIP и похожие бейджи.',
            'switch.achievementBadges': 'Бейджи достижений',
            'switch.achievementBadgesHint': 'Bits, Hype Train, первое сообщение и похожие бейджи.',
            'fields.badgePosition': 'Позиция бейджей',
            'fields.badgeScale': 'Множитель размера бейджей',
            'switch.showTime': 'Показывать время',
            'switch.showTimeHint': 'Показывает HH:MM перед ником.',
            'fields.timePosition': 'Позиция времени',
            'fields.timeZone': 'Часовой пояс',
            'fields.timeColor': 'Цвет текста времени',
            'position.beforeName': 'Перед ником',
            'position.afterName': 'После ника',
            'position.topRight': 'Правый верхний угол',
            'switch.background': 'Фон сообщения',
            'switch.backgroundHint': 'Добавляет мягкий тёмный фон за каждым сообщением.',
            'fields.backgroundColor': 'Цвет фона сообщения',
            'fields.backgroundOpacity': 'Прозрачность фона',
            'fields.backgroundRadius': 'Радиус фона сообщения',
            'fields.chatPadding': 'Отступ от края чата',
            'fields.messageGap': 'Расстояние между сообщениями',
            'fields.messagePadding': 'Внутренний отступ сообщения',
            'switch.firstMessage': 'Фон первого сообщения',
            'switch.firstMessageHint': 'Подсвечивает первое сообщение каждого пользователя фоном без добавления текста.',
            'fields.firstMessageColor': 'Цвет фона первого сообщения',
            'fields.firstMessageOpacity': 'Прозрачность фона первого сообщения',
            'fields.firstMessageRadius': 'Радиус фона первого сообщения',
            'fields.animationIn': 'Анимация появления',
            'fields.animationOut': 'Анимация исчезновения',
            'hellcake.title': 'Блок сообщения HellCakeFication',
            'hellcake.desc': 'Настройте отдельную структуру сообщения: строку ника, предпросмотр reply и текст сообщения.',
            'fields.hcfBoxColor': 'Цвет блока сообщения',
            'fields.hcfBoxOpacity': 'Прозрачность блока сообщения',
            'fields.hcfBoxRadius': 'Радиус блока сообщения',
            'fields.hcfBoxPadding': 'Внутренний отступ блока',
            'fields.hcfBadgeRadius': 'Радиус бейджей',
            'fields.hcfTopColor': 'Цвет строки ника',
            'fields.hcfReplyColor': 'Цвет предпросмотра reply',
            'fields.hcfTextColor': 'Цвет текста сообщения',
            'fields.hcfWidthMode': 'Режим ширины сообщения',
            'fields.hcfMessageSide': 'Сторона компактных сообщений',
            'options.hcfSideLeft': 'Слева',
            'options.hcfSideRight': 'Справа',
            'options.hcfFullWidth': 'Во всю ширину',
            'options.hcfCompactWidth': 'Компактно',
            'fields.hcfMessageWidth': 'Максимальная ширина сообщения',
            'behavior.title': 'Поведение',
            'behavior.desc': 'Настройки очистки и вспомогательного рендера для активных чатов.',
            'switch.clear': 'Очищать по /clear',
            'switch.clearHint': 'Очищает overlay, когда Twitch отправляет CLEARCHAT.',
            'switch.colon': 'Двоеточие после ника',
            'switch.colonHint': 'Показывает сообщения в формате name: message.',
            'switch.autoRemove': 'Автоудаление сообщений',
            'switch.autoRemoveHint': 'Удаляет старые сообщения через заданное время.',
            'fields.removeTimeout': 'Удалять через секунд',
            'switch.userNotices': 'События Twitch',
            'switch.userNoticesHint': 'Показывает sub, resub, gift, raid и похожие USERNOTICE события.',
            'fields.userNoticeColor': 'Цвет события',
            'fields.userNoticeOpacity': 'Прозрачность фона события',
            'switch.meStyle': 'Стиль /me сообщений',
            'switch.meStyleHint': 'Применяет отдельный стиль к action-сообщениям Twitch.',
            'switch.meItalic': 'Курсив для /me',
            'switch.meItalicHint': 'Показывает action-сообщения курсивом.',
            'switch.systemMessages': 'Системные сообщения',
            'switch.systemMessagesHint': 'Показывает локальные сообщения подключения, тестового режима и системы.',
            'fields.systemMessageColor': 'Цвет системных сообщений',
            'switch.testMode': 'Тестовый режим',
            'switch.testModeHint': 'Генерирует локальные сообщения вместо подключения к Twitch.',
            'switch.debug': 'Debug-режим',
            'switch.debugHint': 'Оставляет больше сообщений и пишет больше информации в консоль.',
            'modules.title': 'Модули',
            'modules.desc': 'Дополнительные интеграции. osu! данные загружаются через mirror.hinamizawa.ai.',
            'switch.osu': 'osu! ссылки',
            'switch.osuHint': 'Заменяет ссылки на карты/пользователей osu! читаемой информацией.',
            'fields.osuKey': 'osu! API ключ',
            'links.osuHelp': 'Как получить legacy osu! API key',
            'switch.osuMap': 'Парсить карты',
            'switch.osuMapHint': 'beatmapsets и beatmaps.',
            'switch.osuUser': 'Парсить пользователей',
            'switch.osuUserHint': 'Ссылки на профили osu!.',
            'switch.osuScore': 'Парсить скоры',
            'switch.osuScoreHint': 'Экспериментальный парсинг страниц score.',
            'switch.osuHighlight': 'Подсветка osu! информации',
            'switch.osuHighlightHint': 'Окрашивает заменённый osu! текст по типу.',
            'switch.osuCompactInfo': 'Краткая инфо',
            'switch.osuCompactInfoHint': 'Показывает меньше полей в osu! карточках HellCakeFication.',
            'switch.blockBots': 'Блокировать известных ботов',
            'switch.blockBotsHint': 'Скрывает сообщения из небольшого встроенного списка ботов.',
            'output.title': 'Ссылка overlay',
            'output.desc': 'Вставьте эту ссылку в OBS Browser Source.',
            'actions.copy': 'Скопировать',
            'actions.reset': 'Сбросить',
            'actions.preview': 'Открыть превью',
            'placeholders.colorHex': '#RRGGBB',
            'status.copied': 'Ссылка скопирована.',
            'status.reset': 'Настройки сброшены.'
        }
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function getBool(id) {
        return el[id].checked ? '1' : '0';
    }

    function getFont() {
        const selected = el.fontFamily.value;
        if (selected !== 'custom') {
            return selected;
        }

        const custom = el.customFont.value.trim();
        return custom ? `'${custom}', sans-serif` : 'sans-serif';
    }

    function getNumberValue(id, fallback) {
        const value = Number(el[id].value);
        return Number.isFinite(value) ? value : fallback;
    }

    function normalizeHexColor(value, fallback) {
        const color = String(value || '').trim();
        if (/^#[0-9a-f]{6}$/i.test(color)) return color.toLowerCase();
        if (/^[0-9a-f]{6}$/i.test(color)) return `#${color.toLowerCase()}`;
        return fallback;
    }

    function getColorValue(id) {
        return normalizeHexColor(el[id].value, colorDefaults[id] || '#000000');
    }

    function clampToRange(id, value) {
        const input = el[id];
        const fallback = Number(input.value) || Number(input.min) || 0;
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) return fallback;

        const min = Number(input.min);
        const max = Number(input.max);
        return Math.min(max, Math.max(min, numeric));
    }

    function formatRangeValue(id) {
        const format = rangeFormats[id] || { suffix: '', decimals: 0 };
        const value = clampToRange(id, el[id].value);
        return `${value.toFixed(format.decimals)}${format.suffix}`;
    }

    function setRangeValue(id, value) {
        const input = el[id];
        const clamped = clampToRange(id, value);
        input.value = String(clamped);
        updateUrl();
    }

    function getControlValue(node) {
        if (node.type === 'checkbox') {
            return node.checked;
        }
        return node.value;
    }

    function setControlValue(node, value) {
        if (value === undefined || value === null) return;

        if (node.type === 'checkbox') {
            node.checked = Boolean(value);
            return;
        }

        node.value = String(value);
    }

    function resetControl(id, shouldUpdate) {
        if (!el[id] || !Object.prototype.hasOwnProperty.call(defaultValues, id)) return;

        setControlValue(el[id], defaultValues[id]);
        if (shouldUpdate) {
            updateUrl();
        }
    }

    function createColorControl(id) {
        const mount = document.querySelector(`[data-color-control="${id}"]`);
        if (!mount) return;

        const fallback = colorDefaults[id] || '#000000';
        const input = document.createElement('input');
        input.id = id;
        input.type = 'text';
        input.className = 'color-input';
        input.value = fallback;
        input.placeholder = translate('placeholders.colorHex');
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.addEventListener('blur', () => {
            input.value = getColorValue(id);
            updateColorControl(id);
            updateUrl();
        });

        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.setProperty('--swatch-color', fallback);

        const picker = document.createElement('input');
        picker.type = 'color';
        picker.className = 'color-picker';
        picker.value = fallback;
        picker.setAttribute('aria-label', id);
        picker.addEventListener('input', () => {
            input.value = picker.value;
            updateColorControl(id);
            updateUrl();
        });

        const swatchButton = document.createElement('button');
        swatchButton.type = 'button';
        swatchButton.className = 'color-swatch-button';
        swatchButton.setAttribute('aria-label', id);
        swatchButton.append(swatch, picker);
        swatchButton.addEventListener('click', () => {
            if (typeof picker.showPicker === 'function') {
                picker.showPicker();
                return;
            }

            picker.click();
        });

        const row = document.createElement('div');
        row.className = 'color-row';
        row.append(swatchButton, input);

        mount.append(row);
        el[id] = input;
    }

    function updateColorControl(id) {
        const input = el[id];
        const fallback = colorDefaults[id] || '#000000';
        const normalized = normalizeHexColor(input.value, '');
        const displayColor = normalized || fallback;
        input.classList.toggle('invalid', input.value.trim() !== '' && !normalized);
        const swatch = input.closest('.color-control')?.querySelector('.color-swatch');
        if (swatch) {
            swatch.style.setProperty('--swatch-color', displayColor);
        }
        const picker = input.closest('.color-control')?.querySelector('.color-picker');
        if (picker) {
            picker.value = displayColor;
        }
    }

    function updateRangeProgress(id) {
        const input = el[id];
        if (!input || input.type !== 'range') return;

        const min = Number(input.min) || 0;
        const max = Number(input.max) || 100;
        const value = clampToRange(id, input.value);
        const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;
        input.style.setProperty('--range-progress', `${Math.min(100, Math.max(0, progress))}%`);
    }

    function updateRangeControls() {
        ids.forEach(updateRangeProgress);
    }

    function getSettingsSnapshot() {
        return ids.reduce((settings, id) => {
            settings[id] = getControlValue(el[id]);
            return settings;
        }, {});
    }

    function saveSettings() {
        if (isRestoring) return;

        try {
            localStorage.setItem(settingsStorageKey, JSON.stringify(getSettingsSnapshot()));
        } catch (error) {
            console.warn('Unable to save IkuzaChat v2 settings', error);
        }
    }

    function loadSettings() {
        try {
            const raw = localStorage.getItem(settingsStorageKey);
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            console.warn('Unable to load IkuzaChat v2 settings', error);
            return null;
        }
    }

    function restoreSettings() {
        const settings = loadSettings();
        if (!settings || typeof settings !== 'object') return;

        isRestoring = true;
        ids.forEach((id) => {
            if (Object.prototype.hasOwnProperty.call(settings, id)) {
                setControlValue(el[id], settings[id]);
            }
        });
        isRestoring = false;
    }

    function setStatus(text) {
        byId('status').textContent = text;
        if (!text) return;
        window.clearTimeout(setStatus.timer);
        setStatus.timer = window.setTimeout(() => setStatus(''), 2200);
    }

    function translate(key) {
        return dictionaries[currentLang][key] || dictionaries.en[key] || key;
    }

    function applyLanguage(lang) {
        currentLang = dictionaries[lang] ? lang : 'en';
        localStorage.setItem('ikuzachat-v2-lang', currentLang);
        document.documentElement.lang = currentLang;
        document.title = currentLang === 'ru' ? 'IkuzaChat v2 - Генератор' : 'IkuzaChat v2 - Generator';

        document.querySelectorAll('[data-i18n]').forEach((node) => {
            node.textContent = translate(node.dataset.i18n);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
            node.placeholder = translate(node.dataset.i18nPlaceholder);
        });
        document.querySelectorAll('.color-input').forEach((node) => {
            node.placeholder = translate('placeholders.colorHex');
        });
        document.querySelectorAll('.lang-btn').forEach((button) => {
            button.classList.toggle('active', button.dataset.lang === currentLang);
        });
        document.querySelectorAll('.param-reset').forEach((button) => {
            button.textContent = translate('actions.reset');
            button.title = translate('actions.reset');
            button.setAttribute('aria-label', translate('actions.reset'));
        });
    }

    function updateDependentControls() {
        const isClassic = el.chatType.value === 'classic';
        byId('customFontWrap').classList.toggle('hidden', el.fontFamily.value !== 'custom');
        byId('hcfMessageWidthWrap').classList.toggle('hidden', el.chatType.value !== 'hellcakefication' || el.hcfWidthMode.value !== 'compact');
        document.documentElement.dataset.chatType = el.chatType.value;
        byId('timeSettings').classList.toggle('hidden', !isClassic || !el.showTime.checked);
        byId('backgroundSettings').classList.toggle('hidden', !isClassic || !el.showBackground.checked);
        byId('firstMessageSettings').classList.toggle('hidden', !isClassic || !el.firstMessageEnabled.checked);
        byId('removeSettings').classList.toggle('hidden', !el.autoRemove.checked);
        byId('userNoticeSettings').classList.toggle('hidden', !el.showUserNotices.checked);
        byId('meStyleSettings').classList.toggle('hidden', !el.meStyleEnabled.checked);
        byId('systemMessageSettings').classList.toggle('hidden', !el.showSystemMessages.checked);
        byId('osuSettings').classList.toggle('hidden', !el.osuEnabled.checked);
        document.querySelectorAll('[data-chat-types]').forEach((node) => {
            const types = node.dataset.chatTypes.split(/\s+/);
            node.classList.toggle('hidden', !types.includes(el.chatType.value));
        });
        document.querySelectorAll('[data-range-value]').forEach((node) => {
            node.textContent = formatRangeValue(node.dataset.rangeValue);
        });
        updateRangeControls();
        updateColorControl('backgroundColor');
        updateColorControl('firstMessageColor');
        updateColorControl('timeColor');
        updateColorControl('userNoticeColor');
        updateColorControl('systemMessageColor');
        updateColorControl('hcfBoxColor');
        updateColorControl('hcfTopColor');
        updateColorControl('hcfReplyColor');
        updateColorControl('hcfTextColor');
        updateResetButtons();
    }

    function updateUrl() {
        updateDependentControls();

        const channel = el.channel.value.trim().replace(/^@+/, '').toLowerCase() || 'ikuza47';
        const overlayFile = el.chatType.value === 'hellcakefication' ? 'v2/hellcakefication.html' : 'v2/chat.html';
        const url = new URL(overlayFile, window.location.href);

        url.searchParams.set('channel', channel);
        url.searchParams.set('font', getFont());
        url.searchParams.set('size', String(Number(el.fontSize.value) || 24));
        url.searchParams.set('userBadges', getBool('showUserBadges'));
        url.searchParams.set('channelBadges', getBool('showChannelBadges'));
        url.searchParams.set('achievementBadges', getBool('showAchievementBadges'));
        url.searchParams.set('badgePosition', el.badgePosition.value);
        url.searchParams.set('badgeScale', getNumberValue('badgeScale', 1.5).toFixed(2));
        url.searchParams.set('showTime', getBool('showTime'));
        url.searchParams.set('timePosition', el.timePosition.value);
        url.searchParams.set('timeZone', el.timeZone.value);
        url.searchParams.set('timeColor', getColorValue('timeColor'));
        url.searchParams.set('background', getBool('showBackground'));
        url.searchParams.set('backgroundColor', getColorValue('backgroundColor'));
        url.searchParams.set('backgroundOpacity', el.backgroundOpacity.value);
        url.searchParams.set('backgroundRadius', String(Math.round(getNumberValue('backgroundRadius', 12))));
        url.searchParams.set('chatPadding', String(Math.round(getNumberValue('chatPadding', 12))));
        url.searchParams.set('messageGap', String(Math.round(getNumberValue('messageGap', 5))));
        url.searchParams.set('messagePadding', String(Math.round(getNumberValue('messagePadding', 5))));
        url.searchParams.set('firstMessage', getBool('firstMessageEnabled'));
        url.searchParams.set('firstMessageColor', getColorValue('firstMessageColor'));
        url.searchParams.set('firstMessageOpacity', el.firstMessageOpacity.value);
        url.searchParams.set('firstMessageRadius', String(Math.round(getNumberValue('firstMessageRadius', 12))));
        url.searchParams.set('animationIn', el.animationIn.value);
        url.searchParams.set('animationOut', el.animationOut.value);
        url.searchParams.set('clearOnCommand', getBool('clearOnCommand'));
        url.searchParams.set('colon', getBool('colonEnabled'));
        url.searchParams.set('autoRemove', getBool('autoRemove'));
        url.searchParams.set('removeTimeout', String(Number(el.removeTimeout.value) || 12));
        url.searchParams.set('userNotices', getBool('showUserNotices'));
        url.searchParams.set('userNoticeColor', getColorValue('userNoticeColor'));
        url.searchParams.set('userNoticeOpacity', el.userNoticeOpacity.value);
        url.searchParams.set('meStyle', getBool('meStyleEnabled'));
        url.searchParams.set('meItalic', getBool('meItalic'));
        url.searchParams.set('systemMessages', getBool('showSystemMessages'));
        url.searchParams.set('systemMessageColor', getColorValue('systemMessageColor'));
        url.searchParams.set('hcfBoxColor', getColorValue('hcfBoxColor'));
        url.searchParams.set('hcfBoxOpacity', el.hcfBoxOpacity.value);
        url.searchParams.set('hcfBoxRadius', String(Math.round(getNumberValue('hcfBoxRadius', 18))));
        url.searchParams.set('hcfBoxPadding', String(Math.round(getNumberValue('hcfBoxPadding', 12))));
        url.searchParams.set('hcfBadgeRadius', String(Math.round(getNumberValue('hcfBadgeRadius', 5))));
        url.searchParams.set('hcfTopColor', getColorValue('hcfTopColor'));
        url.searchParams.set('hcfReplyColor', getColorValue('hcfReplyColor'));
        url.searchParams.set('hcfTextColor', getColorValue('hcfTextColor'));
        url.searchParams.set('hcfWidthMode', el.hcfWidthMode.value);
        url.searchParams.set('hcfMessageSide', el.hcfMessageSide.value);
        url.searchParams.set('hcfMessageWidth', String(Math.round(getNumberValue('hcfMessageWidth', 680))));
        url.searchParams.set('testMode', getBool('testMode'));
        url.searchParams.set('debug', getBool('debugMode'));
        url.searchParams.set('blockBots', getBool('blockBots'));

        if (el.osuEnabled.checked) {
            url.searchParams.set('osu', '1');
            const key = el.osuApiKey.value.trim();
            if (key) {
                url.searchParams.set('osuKey', key);
            }
            url.searchParams.set('osuMap', getBool('osuMap'));
            url.searchParams.set('osuUser', getBool('osuUser'));
            url.searchParams.set('osuScore', getBool('osuScore'));
            url.searchParams.set('osuHighlight', getBool('osuHighlight'));
            url.searchParams.set('osuCompactInfo', getBool('osuCompactInfo'));
        }

        byId('overlayUrl').value = url.toString();
        byId('openPreview').href = url.toString();
        saveSettings();
    }

    function resetSettings() {
        ids.forEach((id) => resetControl(id, false));
        localStorage.removeItem(settingsStorageKey);
        localStorage.removeItem(activeTabStorageKey);
        activateTab('basic', false);
        updateUrl();
        setStatus(translate('status.reset'));
    }

    async function copyUrl() {
        const output = byId('overlayUrl');
        output.select();
        try {
            await navigator.clipboard.writeText(output.value);
            setStatus(translate('status.copied'));
        } catch (error) {
            document.execCommand('copy');
            setStatus(translate('status.copied'));
        }
    }

    function setupTabs() {
        document.querySelectorAll('.tab').forEach((tab) => {
            tab.addEventListener('click', () => {
                activateTab(tab.dataset.tab, true);
            });
        });
    }

    function activateTab(tabName, shouldSave) {
        const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
        const panel = byId(`${tabName}-tab`);
        if (!tab || !panel) return;

        document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach((item) => item.classList.remove('active'));
        tab.classList.add('active');
        panel.classList.add('active');

        if (shouldSave) {
            localStorage.setItem(activeTabStorageKey, tabName);
        }
    }

    function fillTimeZones() {
        for (let zone = -12; zone <= 14; zone += 1) {
            const option = document.createElement('option');
            option.value = String(zone);
            option.textContent = `UTC${zone >= 0 ? '+' : ''}${zone}`;
            if (zone === 0) option.selected = true;
            el.timeZone.appendChild(option);
        }
    }

    function setupRangeValueEditors() {
        document.querySelectorAll('[data-range-value]').forEach((valueNode) => {
            valueNode.addEventListener('click', () => {
                const id = valueNode.dataset.rangeValue;
                let finished = false;
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'range-value-input';
                input.min = el[id].min;
                input.max = el[id].max;
                input.step = el[id].step;
                input.value = String(getNumberValue(id, 0));

                function commit() {
                    if (finished) return;
                    finished = true;
                    setRangeValue(id, input.value);
                    input.replaceWith(valueNode);
                    updateDependentControls();
                }

                function cancel() {
                    if (finished) return;
                    finished = true;
                    input.replaceWith(valueNode);
                    updateDependentControls();
                }

                input.addEventListener('blur', commit);
                input.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') commit();
                    if (event.key === 'Escape') cancel();
                });

                valueNode.replaceWith(input);
                input.focus();
                input.select();
            });
        });
    }

    function getResetContainer(id) {
        const node = el[id];
        return node.closest('.switch') || node.closest('.field');
    }

    function getDirectChildByTag(node, tagName) {
        return Array.from(node.children).find((child) => child.tagName.toLowerCase() === tagName);
    }

    function attachResetButton(container, button) {
        if (container.classList.contains('switch')) {
            const content = getDirectChildByTag(container, 'span');
            const title = content?.querySelector('.label');
            if (content && title) {
                const row = document.createElement('span');
                row.className = 'control-title';
                title.before(row);
                row.append(title, button);
                return;
            }
        }

        const label = getDirectChildByTag(container, 'label');
        if (label) {
            const row = document.createElement('div');
            row.className = 'control-title';
            label.before(row);
            row.append(label, button);
            return;
        }

        container.appendChild(button);
    }

    function setupParameterResets() {
        ids.forEach((id) => {
            const container = getResetContainer(id);
            if (!container || container.querySelector(`.param-reset[data-reset-id="${id}"]`)) return;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'param-reset';
            button.dataset.resetId = id;
            button.textContent = translate('actions.reset');
            button.title = translate('actions.reset');
            button.setAttribute('aria-label', translate('actions.reset'));
            button.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                resetControl(id, true);
            });

            attachResetButton(container, button);
        });
    }

    function isDefaultValue(id) {
        if (!Object.prototype.hasOwnProperty.call(defaultValues, id)) return true;
        return getControlValue(el[id]) === defaultValues[id];
    }

    function updateResetButtons() {
        document.querySelectorAll('.param-reset').forEach((button) => {
            const id = button.dataset.resetId;
            button.classList.toggle('visible', !isDefaultValue(id));
        });
    }

    function init() {
        createColorControl('backgroundColor');
        createColorControl('firstMessageColor');
        createColorControl('timeColor');
        createColorControl('userNoticeColor');
        createColorControl('systemMessageColor');
        createColorControl('hcfBoxColor');
        createColorControl('hcfTopColor');
        createColorControl('hcfReplyColor');
        createColorControl('hcfTextColor');

        ids.forEach((id) => {
            el[id] = el[id] || byId(id);
        });

        fillTimeZones();
        restoreSettings();
        applyLanguage(currentLang);
        setupTabs();
        activateTab(localStorage.getItem(activeTabStorageKey) || 'basic', false);
        document.querySelectorAll('.lang-btn').forEach((button) => {
            button.addEventListener('click', () => applyLanguage(button.dataset.lang));
        });
        setupRangeValueEditors();
        setupParameterResets();
        ids.forEach((id) => {
            const node = el[id];
            node.addEventListener('input', updateUrl);
            node.addEventListener('change', updateUrl);
        });

        byId('copyUrl').addEventListener('click', copyUrl);
        byId('resetSettings').addEventListener('click', resetSettings);
        updateUrl();
        updateResetButtons();
    }

    document.addEventListener('DOMContentLoaded', init);
}());
