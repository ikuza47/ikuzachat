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

    function getChoice(name, fallback, choices) {
        const value = params.get(name);
        return choices.includes(value) ? value : fallback;
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
        hcfBoxColor: getColor('hcfBoxColor', '#121218'),
        hcfBoxOpacity: getNumber('hcfBoxOpacity', 0.72, 0, 1),
        hcfBoxRadius: getNumber('hcfBoxRadius', 18, 0, 48),
        hcfBoxPadding: getNumber('hcfBoxPadding', 12, 0, 40),
        hcfBadgeRadius: getNumber('hcfBadgeRadius', 5, 0, 16),
        hcfTopColor: getColor('hcfTopColor', '#ffffff'),
        hcfReplyColor: getColor('hcfReplyColor', '#b7bac7'),
        hcfTextColor: getColor('hcfTextColor', '#ffffff'),
        hcfWidthMode: getString('hcfWidthMode', 'full'),
        hcfMessageSide: getString('hcfMessageSide', 'left'),
        hcfMessageWidth: getNumber('hcfMessageWidth', 680, 160, 1200),
        hcfTimeMode: getChoice('hcfTimeMode', 'none', ['none', 'sent', 'remaining']),
        hcfSpecialBackgrounds: getBool('hcfSpecialBackgrounds', false),
        testMode: getBool('testMode', false),
        debug: getBool('debug', false),
        blockBots: getBool('blockBots', false),
        media: {
            enabled: getBool('media', true),
            radius: getNumber('mediaRadius', 20, 0, 64),
            opacity: getNumber('mediaOpacity', 1, 0, 1)
        },
        osu: {
            enabled: getBool('osu', false),
            apiKey: getString('osuKey', ''),
            parseMap: getBool('osuMap', true),
            parseUser: getBool('osuUser', true),
            highlight: getBool('osuHighlight', false),
            mapShowCover: getBool('osuMapShowCover', true),
            mapShowTitle: getBool('osuMapShowTitle', true),
            mapShowArtist: getBool('osuMapShowArtist', true),
            mapShowCreator: getBool('osuMapShowCreator', true),
            mapShowStatus: getBool('osuMapShowStatus', true),
            mapShowVersion: getBool('osuMapShowVersion', true),
            mapShowStars: getBool('osuMapShowStars', true),
            mapShowBpm: getBool('osuMapShowBpm', true),
            mapShowAr: getBool('osuMapShowAr', true),
            mapShowCs: getBool('osuMapShowCs', true),
            mapShowHp: getBool('osuMapShowHp', true),
            mapShowOd: getBool('osuMapShowOd', true),
            mapShowLength: getBool('osuMapShowLength', true),
            mapShowCombo: getBool('osuMapShowCombo', true),
            mapShowPlayCount: getBool('osuMapShowPlayCount', false),
            mapShowFavourites: getBool('osuMapShowFavourites', false),
            profileShowAvatar: getBool('osuProfileShowAvatar', true),
            profileShowUsername: getBool('osuProfileShowUsername', true),
            profileShowFlag: getBool('osuProfileShowFlag', true),
            profileShowRank: getBool('osuProfileShowRank', true),
            profileShowCountryRank: getBool('osuProfileShowCountryRank', true),
            profileShowAccuracy: getBool('osuProfileShowAccuracy', true),
            profileShowPp: getBool('osuProfileShowPp', true),
            profileShowPlayCount: getBool('osuProfileShowPlayCount', true),
            profileTopScoresCount: getNumber('osuProfileTopScoresCount', 3, 0, 5)
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
    document.documentElement.style.setProperty('--hcf-box-rgb', hexToRgb(config.hcfBoxColor));
    document.documentElement.style.setProperty('--hcf-box-opacity', String(config.hcfBoxOpacity));
    document.documentElement.style.setProperty('--hcf-box-radius', `${config.hcfBoxRadius}px`);
    document.documentElement.style.setProperty('--hcf-box-padding', `${config.hcfBoxPadding}px`);
    document.documentElement.style.setProperty('--hcf-badge-radius', `${config.hcfBadgeRadius}px`);
    document.documentElement.style.setProperty('--hcf-top-color', config.hcfTopColor);
    document.documentElement.style.setProperty('--hcf-reply-color', config.hcfReplyColor);
    document.documentElement.style.setProperty('--hcf-text-color', config.hcfTextColor);
    document.documentElement.style.setProperty('--hcf-message-width', `${config.hcfMessageWidth}px`);
    document.documentElement.style.setProperty('--media-radius', `${config.media.radius}px`);
    document.documentElement.style.setProperty('--media-opacity', String(config.media.opacity));

    window.IkuzaChatV2 = window.IkuzaChatV2 || {};
    window.IkuzaChatV2.config = config;
}());
