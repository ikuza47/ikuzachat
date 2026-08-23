(function () {
    const root = window.IkuzaChatV2;
    const config = root.config;
    const utils = root.utils;
    let socket = null;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 10;

    function close() {
        if (!socket) return;
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        socket.close();
        socket = null;
    }

    function scheduleReconnect() {
        if (config.testMode) return;
        if (reconnectAttempts >= maxReconnectAttempts) {
            root.showError('Unable to connect to Twitch chat', 'Check the channel name and network connection.');
            return;
        }

        reconnectAttempts += 1;
        const delay = Math.min(2500 * reconnectAttempts, 30000);
        root.setLoadingStatus(`Reconnecting to Twitch (${reconnectAttempts}/${maxReconnectAttempts})...`);
        window.setTimeout(connect, delay);
    }

    function connect() {
        close();
        root.setLoadingStatus(`Connecting to #${config.channel}...`);

        socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

        socket.onopen = () => {
            reconnectAttempts = 0;
            const nick = 'justinfan' + Math.floor(Math.random() * 100000);
            socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            socket.send('PASS SCHMOOPIIE');
            socket.send(`NICK ${nick}`);
            socket.send(`USER ${nick} 8 * :${nick}`);
            socket.send(`JOIN #${config.channel}`);
            root.hideLoading();
        };

        socket.onmessage = async (event) => {
            const message = String(event.data || '');
            utils.log('IRC', message);

            if (message.startsWith('PING')) {
                socket.send('PONG :tmi.twitch.tv');
                return;
            }

            if (message.includes(' CLEARCHAT #')) {
                if (config.clearOnCommand) root.renderer.clear();
                return;
            }

            if (message.includes(' CLEARMSG #')) {
                const parsed = utils.parseClearMessage(message);
                if (parsed.id && root.renderer.deleteMessage) root.renderer.deleteMessage(parsed.id);
                return;
            }

            if (message.includes(' USERNOTICE #')) {
                const parsed = utils.parseUserNotice(message);
                await root.renderer.addUserNotice(parsed);
                return;
            }

            if (message.includes(' NOTICE #')) {
                const parsed = utils.parseNotice(message);
                await root.renderer.addSystemMessage(parsed.text || parsed.noticeType || 'Twitch notice');
                return;
            }

            if (!message.includes(' PRIVMSG #')) return;

            const parsed = utils.parseIrcMessage(message);
            if (!parsed.text) return;
            if (root.bots.isBot(parsed.username)) return;
            await root.renderer.addMessage(parsed);
        };

        socket.onerror = (error) => {
            utils.log('WebSocket error', error);
        };

        socket.onclose = () => {
            socket = null;
            scheduleReconnect();
        };
    }

    root.twitch = {
        connect,
        close
    };
}());
