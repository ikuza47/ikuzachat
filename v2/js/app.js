(async function () {
    const root = window.IkuzaChatV2;
    const config = root.config;
    const utils = root.utils;

    try {
        let badgeChannelId = null;
        if (config.showUserBadges || config.showChannelBadges || config.showAchievementBadges) {
            root.setLoadingStatus('Loading badges...');
            badgeChannelId = await root.badges.init(config.channel);
        }

        root.setLoadingStatus('Loading emotes...');
        root.channelId = await root.emotes.init(config.channel, badgeChannelId);

        if (config.blockBots) {
            root.setLoadingStatus('Loading bot list...');
            await root.bots.load();
        }

        if (config.testMode) {
            root.testMode.start();
            return;
        }

        root.twitch.connect();
    } catch (error) {
        utils.log('Startup failed', error);
        root.showError('Unable to start chat', error && error.stack ? error.stack : String(error));
    }
}());
