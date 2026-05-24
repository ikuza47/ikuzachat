(function () {
    const root = window.IkuzaChatV2;
    const config = root.config;
    const utils = root.utils;
    const container = document.getElementById('chat-container');
    const firstMessageUsers = new Set();
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
        const suffix = config.colonEnabled ? ':' : '';
        const specialClass = getSpecialUsernameClass(username);
        if (specialClass) {
            return `<span class="nick ${specialClass}">${safeName}${suffix}</span>`;
        }
        return `<span class="nick" style="color: ${utils.escapeAttribute(color || getFallbackColor(username))}">${safeName}${suffix}</span>`;
    }

    function createActionMessageHtml(textHtml, username, color) {
        const specialClass = getSpecialUsernameClass(username);
        if (specialClass) {
            return `<span class="message ${specialClass}">${textHtml}</span>`;
        }

        return `<span class="message" style="color: ${utils.escapeAttribute(color || getFallbackColor(username))}">${textHtml}</span>`;
    }

    function wrapMeta(items, className) {
        const html = items.filter(Boolean).join('');
        return html ? `<span class="${className}">${html}</span>` : '';
    }

    function processMentions(html) {
        return html.split(/(<[^>]+>)/g).map((part) => {
            if (!part || part.startsWith('<')) return part;

            return part.replace(/(^|\s)@(\w+)/g, (match, prefix, username) => {
                const specialClass = getSpecialUsernameClass(username);
                if (specialClass) {
                    return `${prefix}<span class="mention ${specialClass}">@${utils.escapeHtml(username)}</span>`;
                }
                return `${prefix}<span class="mention" style="color: ${utils.escapeAttribute(getFallbackColor(username))}">@${utils.escapeHtml(username)}</span>`;
            });
        }).join('');
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

    async function addMessage(payload) {
        if (!payload || !payload.text) return;

        const message = document.createElement('div');
        message.className = 'msg';
        if (config.showBackground) message.classList.add('with-bg');
        if (payload.isAction && config.meStyleEnabled) {
            message.classList.add('action-message');
            if (config.meItalic) message.classList.add('italic-action');
        }

        const animationIn = createAnimationClass('animation-in', config.animationIn);
        if (animationIn) message.classList.add(animationIn);

        const userKey = String(payload.username || '').toLowerCase();
        const isFirstMessage = !firstMessageUsers.has(userKey);
        firstMessageUsers.add(userKey);

        if (isFirstMessage && config.firstMessageEnabled) {
            message.classList.remove('with-bg');
            message.classList.add('first-message-bg');
        }

        let textHtml = root.emotes.replace(payload.text, payload.tags || '', payload.roomId, config.channel);
        textHtml = await root.osu.replace(textHtml);
        textHtml = processMentions(textHtml);

        const badges = root.badges.createHtml(root.badges.parse(payload.tags || ''), config);
        const time = config.showTime ? `<span class="time">${utils.getTimeString(config.timeZone)}</span>` : '';
        const nick = createNickHtml(payload.username, payload.color);
        const beforeName = [];
        const afterName = [];
        const corner = [];

        if (time) {
            if (config.timePosition === 'after-name') afterName.push(time);
            else if (config.timePosition === 'top-right') corner.push(time);
            else beforeName.push(time);
        }

        if (badges) {
            if (config.badgePosition === 'after-name') afterName.push(badges);
            else if (config.badgePosition === 'top-right') corner.unshift(badges);
            else beforeName.push(badges);
        }

        if (corner.length > 0) {
            message.classList.add('has-corner-meta');
        }

        const bodyHtml = payload.isAction && config.meStyleEnabled
            ? createActionMessageHtml(textHtml, payload.username, payload.color)
            : `<span class="message">${textHtml}</span>`;
        message.innerHTML = `${wrapMeta(corner, 'corner-meta')}${wrapMeta(beforeName, 'inline-meta-before')}<span class="user">${nick}</span>${wrapMeta(afterName, 'inline-meta-after')} ${bodyHtml}`;
        container.appendChild(message);
        container.scrollTop = container.scrollHeight;

        if (config.autoRemove) {
            window.setTimeout(() => removeMessage(message), config.removeTimeout);
        }

        trimMessages();
    }

    function scheduleMessageRemoval(message) {
        if (config.autoRemove) {
            window.setTimeout(() => removeMessage(message), config.removeTimeout);
        }

        trimMessages();
    }

    function createSimpleMessage(text, className) {
        if (!text) return Promise.resolve();

        const message = document.createElement('div');
        message.className = `msg ${className}`;

        const animationIn = createAnimationClass('animation-in', config.animationIn);
        if (animationIn) message.classList.add(animationIn);

        message.innerHTML = `<span class="message">${processMentions(utils.escapeHtml(text))}</span>`;
        return message;
    }

    function addSimpleMessage(text, className) {
        const message = createSimpleMessage(text, className);
        if (!message) return Promise.resolve();

        container.appendChild(message);
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

    root.renderer = {
        addMessage,
        addSystemMessage,
        addUserNotice,
        clear
    };
}());
