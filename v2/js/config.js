(function () {
    const params = new URLSearchParams(window.location.search);

    function getString(name, fallback) {
        const value = params.get(name);
        return value === null || value === '' ? fallback : value;
    }

    function getNumber(name, fallback, min, max) {
        const value = Number(params.get(name));
        if (!Number.isFinite(value)) return fallback;
        return Math.min(max, Math.max(min, value));
    }

    function getBool(name, fallback) {
        const value = params.get(name);
        if (value === null) return fallback;
        return value === '1' || value === 'true' || value === 'yes';
    }

    function getColor(name, fallback) {
        const value = params.get(name);
        return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback;
    }

    function getPosition(name, fallback) {
        const value = params.get(name);
        return ['before-name', 'after-name', 'top-right'].includes(value) ? value : fallback;
    }

    function hexToRgb(hex) {
        const clean = hex.replace('#', '');
        return [
            parseInt(clean.slice(0, 2), 16),
            parseInt(clean.slice(2, 4), 16),
            parseInt(clean.slice(4, 6), 16)
        ].join(', ');
    }

    function cleanChannel(channel) {
        return String(channel || 'ikuza47')
            .trim()
            .replace(/^@+/, '')
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, '') || 'ikuza47';
    }

    const config = {
        channel: cleanChannel(getString('channel', 'ikuza47')),
        font: getString('font', "'Segoe UI', sans-serif"),
        size: getNumber('size', 24, 12, 64),
        showUserBadges: getBool('userBadges', true),
        showChannelBadges: getBool('channelBadges', true),
        showAchievementBadges: getBool('achievementBadges', true),
        badgePosition: getPosition('badgePosition', 'before-name'),
        badgeScale: getNumber('badgeScale', 1.5, 0.5, 3),
        showTime: getBool('showTime', false),
        timePosition: getPosition('timePosition', 'before-name'),
        timeZone: getNumber('timeZone', 0, -12, 14),
        timeColor: getColor('timeColor', '#c3c7d4'),
        showBackground: getBool('background', false),
        backgroundColor: getColor('backgroundColor', '#000000'),
        backgroundOpacity: getNumber('backgroundOpacity', 0.35, 0, 1),
        backgroundRadius: getNumber('backgroundRadius', 12, 0, 32),
        chatPadding: getNumber('chatPadding', 12, 0, 64),
        messageGap: getNumber('messageGap', 5, 0, 32),
        messagePadding: getNumber('messagePadding', 5, 0, 32),
        firstMessageEnabled: getBool('firstMessage', false),
        firstMessageColor: getColor('firstMessageColor', '#ff6bcb'),
        firstMessageOpacity: getNumber('firstMessageOpacity', 0.35, 0, 1),
        firstMessageRadius: getNumber('firstMessageRadius', 12, 0, 32),
        animationIn: getString('animationIn', 'none'),
        animationOut: getString('animationOut', 'fade'),
        clearOnCommand: getBool('clearOnCommand', true),
        colonEnabled: getBool('colon', false),
        autoRemove: getBool('autoRemove', false),
        removeTimeout: getNumber('removeTimeout', 12, 3, 120) * 1000,
        showUserNotices: getBool('userNotices', true),
        userNoticeColor: getColor('userNoticeColor', '#9f8cff'),
        userNoticeOpacity: getNumber('userNoticeOpacity', 0.16, 0, 1),
        meStyleEnabled: getBool('meStyle', true),
        meItalic: getBool('meItalic', true),
        showSystemMessages: getBool('systemMessages', true),
        systemMessageColor: getColor('systemMessageColor', '#c3c7d4'),
        testMode: getBool('testMode', false),
        debug: getBool('debug', false),
        blockBots: getBool('blockBots', false),
        osu: {
            enabled: getBool('osu', false),
            apiKey: getString('osuKey', ''),
            parseMap: getBool('osuMap', true),
            parseUser: getBool('osuUser', true),
            parseScore: getBool('osuScore', false),
            highlight: getBool('osuHighlight', false)
        }
    };

    document.documentElement.style.setProperty('--chat-font', config.font);
    document.documentElement.style.setProperty('--chat-size', `${config.size}px`);
    document.documentElement.style.setProperty('--badge-scale', String(config.badgeScale));
    document.documentElement.style.setProperty('--time-color', config.timeColor);
    document.documentElement.style.setProperty('--message-bg-rgb', hexToRgb(config.backgroundColor));
    document.documentElement.style.setProperty('--message-bg-opacity', String(config.backgroundOpacity));
    document.documentElement.style.setProperty('--message-bg-radius', `${config.backgroundRadius}px`);
    document.documentElement.style.setProperty('--chat-padding', `${config.chatPadding}px`);
    document.documentElement.style.setProperty('--message-gap', `${config.messageGap}px`);
    document.documentElement.style.setProperty('--message-padding', `${config.messagePadding}px`);
    document.documentElement.style.setProperty('--first-message-bg-rgb', hexToRgb(config.firstMessageColor));
    document.documentElement.style.setProperty('--first-message-bg-opacity', String(config.firstMessageOpacity));
    document.documentElement.style.setProperty('--first-message-bg-radius', `${config.firstMessageRadius}px`);
    document.documentElement.style.setProperty('--user-notice-color', config.userNoticeColor);
    document.documentElement.style.setProperty('--user-notice-rgb', hexToRgb(config.userNoticeColor));
    document.documentElement.style.setProperty('--user-notice-opacity', String(config.userNoticeOpacity));
    document.documentElement.style.setProperty('--system-message-color', config.systemMessageColor);

    window.IkuzaChatV2 = window.IkuzaChatV2 || {};
    window.IkuzaChatV2.config = config;
}());
