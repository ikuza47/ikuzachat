(function () {
    const root = window.IkuzaChatV2;
    const utils = root.utils;
    let loaded = false;
    let bots = new Set();

    async function load() {
        if (loaded) return bots;

        try {
            const response = await fetch('bots');
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            const text = await response.text();
            bots = new Set(text.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean));
            loaded = true;
        } catch (error) {
            utils.log('Unable to load bot list', error);
            bots = new Set();
            loaded = true;
        }

        return bots;
    }

    function isBot(username) {
        if (!root.config.blockBots) return false;
        return bots.has(String(username || '').toLowerCase());
    }

    root.bots = {
        load,
        isBot
    };
}());
