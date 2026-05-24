(function () {
    const root = window.IkuzaChatV2;
    const utils = root.utils;
    let timer = null;

    const users = ['DemoViewer', 'Ikuza47', 'HellCake47', 'Yatagarasu_gg', 'ChatGuest', 'OsuPlayer', 'NightOwl'];
    const messages = [
        'hello IkuzaChat v2',
        'this overlay looks clean',
        '@ikuza47 nice stream',
        'ACTION waves at chat',
        'Kappa Keepo PogChamp',
        'BTTV and 7TV emotes should work if they are loaded',
        'testing <script>alert(1)</script> safety',
        'osu link test https://osu.ppy.sh/beatmapsets/79498#osu/221777'
    ];
    const badgeSamples = ['moderator/1', 'subscriber/1', 'premium/1', 'bits/1', 'vip/1'];
    const colors = ['#ff7a59', '#4dd4ac', '#63a8ff', '#ffd166', '#ff73c8', '#b3f56f'];

    function item(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function createTags(color, badge) {
        return `color=${color};badges=${badge};room-id=${root.channelId || ''}`;
    }

    function generate() {
        const username = item(users);
        root.renderer.addMessage({
            username,
            text: item(messages),
            tags: createTags(item(colors), item(badgeSamples)),
            roomId: root.channelId || null,
            color: item(colors)
        }).catch((error) => utils.log('Unable to render test message', error));
    }

    function start() {
        if (timer) return;
        root.hideLoading();
        root.renderer.addSystemMessage('Test mode enabled.');
        root.renderer.addUserNotice({ systemMessage: 'DemoViewer subscribed for 3 months', text: 'nice overlay' });
        generate();
        timer = window.setInterval(generate, 2200);
    }

    function stop() {
        if (!timer) return;
        window.clearInterval(timer);
        timer = null;
    }

    root.testMode = {
        start,
        stop
    };
}());
