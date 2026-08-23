(function () {
    const root = window.IkuzaChatV2;
    const config = root.config;
    const utils = root.utils;
    const container = document.getElementById('message_container');
    const colorCache = new Map();

    const fallbackColors = [
        '#ff7a59', '#4dd4ac', '#63a8ff', '#ffd166', '#ff73c8',
        '#b3f56f', '#ff8f70', '#9f8cff', '#66e3ff', '#f7a8ff'
    ];

    function getFallbackColor(username) {
        const key = String(username || '').toLowerCase();
        if (!colorCache.has(key)) {
            colorCache.set(key, fallbackColors[colorCache.size % fallbackColors.length]);
        }
        return colorCache.get(key);
    }

    function getSpecialUsernameClass(username) {
        const value = String(username || '').toLowerCase();
        if (value === 'ikuza47') return 'IkuzaUsername';
        if (value === 'hellcake47') return 'HellCakeUsername';
        if (value === 'yatagarasu_gg') return 'YatagarasuUsername';
        return '';
    }

    function createAnimationClass(prefix, name) {
        return name && name !== 'none' ? `${prefix}-${name}` : '';
    }

    function createNickHtml(username, color) {
        const safeName = utils.escapeHtml(username);
        const specialClass = getSpecialUsernameClass(username);
        if (specialClass) {
            return `<span class="nick ${specialClass}">${safeName}</span>`;
        }
        return `<span class="nick" style="color: ${utils.escapeAttribute(color || getFallbackColor(username))}">${safeName}</span>`;
    }

    function processMentions(html) {
        return html.split(/(<[^>]+>)/g).map((part) => {
            if (!part || part.startsWith('<')) return part;

            return part.replace(/(^|\s)@(\w+)/g, (match, prefix, username) => {
                return `${prefix}<span class="mention" style="color: ${utils.escapeAttribute(getFallbackColor(username))}">@${utils.escapeHtml(username)}</span>`;
            });
        }).join('');
    }

    function getReply(payload) {
        const tags = payload.tags || '';
        const parentUser = utils.extractTagValue(tags, 'reply-parent-display-name') || utils.extractTagValue(tags, 'reply-parent-user-login');
        const parentMessage = utils.extractTagValue(tags, 'reply-parent-msg-body');
        if (!parentUser && !parentMessage) return '';

        const userName = utils.unescapeTagValue ? utils.unescapeTagValue(parentUser) : parentUser;
        const text = utils.unescapeTagValue ? utils.unescapeTagValue(parentMessage) : parentMessage;
        const user = userName ? `${utils.escapeHtml(userName)}:` : '';
        const preview = text ? utils.escapeHtml(text) : '';
        return `<div class="messagereplyto">${user}${user && preview ? ' ' : ''}<em>${preview}</em></div>`;
    }

    function getReplyTarget(payload) {
        const tags = payload.tags || '';
        const parentUser = utils.extractTagValue(tags, 'reply-parent-display-name') || utils.extractTagValue(tags, 'reply-parent-user-login');
        return parentUser && utils.unescapeTagValue ? utils.unescapeTagValue(parentUser) : parentUser;
    }

    function removeReplyMention(text, replyTarget) {
        if (!replyTarget) return text;
        const escaped = utils.escapeRegExp(String(replyTarget).replace(/^@+/, ''));
        return String(text || '').replace(new RegExp(`^@${escaped}[:,]?\\s*`, 'i'), '');
    }

    function formatSeconds(ms) {
        return `${Math.max(0, Math.ceil(ms / 1000))}s`;
    }

    function startTimeLeft(message, node) {
        if (!config.autoRemove || !node) return;

        const endAt = Date.now() + config.removeTimeout;
        let timer = null;
        const tick = () => {
            if (!message.parentNode) {
                window.clearInterval(timer);
                return;
            }
            node.textContent = formatSeconds(endAt - Date.now());
        };

        tick();
        timer = window.setInterval(tick, 250);
    }

    function removeMessage(message) {
        if (!message || !message.parentNode) return;
        const animation = createAnimationClass('animation-out', config.animationOut);
        message.classList.add('removing');
        if (animation) message.classList.add(animation);

        if (!animation) {
            message.remove();
            return;
        }

        message.addEventListener('animationend', () => message.remove(), { once: true });
        window.setTimeout(() => {
            if (message.parentNode) message.remove();
        }, 700);
    }

    function trimMessages() {
        if (config.debug || config.autoRemove) return;
        while (container.children.length > 70) {
            container.removeChild(container.firstElementChild);
        }
    }

    function scheduleMessageRemoval(message) {
        if (config.autoRemove) {
            window.setTimeout(() => removeMessage(message), config.removeTimeout);
        }

        trimMessages();
    }

    async function addMessage(payload) {
        if (!payload || !payload.text) return;

        const message = document.createElement('div');
        message.className = 'messagebox';
        if (payload.id) message.dataset.messageId = payload.id;
        if (config.hcfWidthMode === 'compact') {
            message.classList.add('compact-width');
            if (config.hcfMessageSide === 'right') message.classList.add('align-right');
        }
        if (payload.isAction && config.meStyleEnabled) {
            message.classList.add('action-message');
            if (config.meItalic) message.classList.add('italic-action');
        }

        const animationIn = createAnimationClass('animation-in', config.animationIn);
        if (animationIn) message.classList.add(animationIn);

        const replyTarget = getReplyTarget(payload);
        const text = removeReplyMention(payload.text, replyTarget);
        const osu = await root.osu.extractCards(text);
        let textHtml = root.emotes.replace(osu.text, payload.tags || '', payload.roomId, config.channel);
        textHtml = processMentions(textHtml);

        const badges = root.badges.createHtml(root.badges.parse(payload.tags || ''), config);
        const topParts = [createNickHtml(payload.username, payload.color), badges].filter(Boolean).join(' ');
        const timeLeft = config.autoRemove ? '<div class="messagetimeleft"></div>' : '';
        const messageText = textHtml ? `<div class="messagetext">${textHtml}</div>` : '';
        message.innerHTML = `<div class="messagetop"><div class="messagetopmeta">${topParts}</div>${timeLeft}</div>${getReply(payload)}${osu.html}${messageText}`;
        container.appendChild(message);
        startTimeLeft(message, message.querySelector('.messagetimeleft'));
        container.scrollTop = container.scrollHeight;
        scheduleMessageRemoval(message);
    }

    function createSimpleMessage(text, className) {
        if (!text) return null;

        const message = document.createElement('div');
        message.className = `messagebox ${className}`;
        if (config.hcfWidthMode === 'compact') {
            message.classList.add('compact-width');
            if (config.hcfMessageSide === 'right') message.classList.add('align-right');
        }

        const animationIn = createAnimationClass('animation-in', config.animationIn);
        if (animationIn) message.classList.add(animationIn);

        const timeLeft = config.autoRemove ? '<div class="messagetimeleft"></div>' : '';
        message.innerHTML = `<div class="messagetop"><div class="messagetopmeta">IkuzaChat</div>${timeLeft}</div><div class="messagetext">${processMentions(utils.escapeHtml(text))}</div>`;
        return message;
    }

    function addSimpleMessage(text, className) {
        const message = createSimpleMessage(text, className);
        if (!message) return Promise.resolve();

        container.appendChild(message);
        startTimeLeft(message, message.querySelector('.messagetimeleft'));
        container.scrollTop = container.scrollHeight;
        scheduleMessageRemoval(message);
        return Promise.resolve();
    }

    function addSystemMessage(text) {
        if (!config.showSystemMessages) return Promise.resolve();
        return addSimpleMessage(text, 'system-message');
    }

    function formatUserNotice(payload) {
        const prefix = payload.systemMessage || payload.noticeType || 'Twitch event';
        return payload.text ? `${prefix}: ${payload.text}` : prefix;
    }

    function addUserNotice(payload) {
        if (!config.showUserNotices) return Promise.resolve();
        return addSimpleMessage(formatUserNotice(payload), 'user-notice');
    }

    function clear() {
        container.innerHTML = '';
    }

    function findMessageById(id) {
        return Array.from(container.children).find((item) => item.dataset.messageId === id) || null;
    }

    function deleteMessage(id) {
        const message = findMessageById(id);
        if (!message || message.classList.contains('deleted-message')) return;

        message.classList.add('deleted-message');
        message.querySelectorAll('.messageosu, .messageosumap, .messageosuprofile, .messageosuscore').forEach((node) => node.remove());
        let text = message.querySelector('.messagetext');
        if (!text) {
            text = document.createElement('div');
            text.className = 'messagetext';
            message.appendChild(text);
        }
        text.textContent = 'Сообщение было удалено';
        window.setTimeout(() => removeMessage(message), 4000);
    }

    root.renderer = {
        addMessage,
        addSystemMessage,
        addUserNotice,
        deleteMessage,
        clear
    };
}());
