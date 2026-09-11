(function () {
    const root = window.IkuzaChatV2;
    const config = root.config;
    const utils = root.utils;
    const container = document.getElementById('chat-container');
    const firstMessageUsers = new Set();
    const colorCache = new Map();

    const colorPalettes = {
        vibrant: [
            '#ff7a59', '#4dd4ac', '#63a8ff', '#ffd166', '#ff73c8',
            '#b3f56f', '#ff8f70', '#9f8cff', '#66e3ff', '#f7a8ff'
        ],
        pastel: [
            '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', '#bae1ff',
            '#e8c5ff', '#ffcbf2', '#f3c4fb', '#c5e3f6', '#d6f8b8'
        ],
        neon: [
            '#00ffcc', '#ff007f', '#00e5ff', '#ffea00', '#76ff03',
            '#f50057', '#d500f9', '#00b0ff', '#1de9b6', '#ff3d00'
        ],
        monochrome: [
            '#ffffff', '#e0e0e0', '#cfd8dc', '#b0bec5', '#90a4ae',
            '#eceff1', '#f5f5f5', '#d1d5db', '#9ca3af', '#cbd5e1'
        ],
        sunset: [
            '#ff5e62', '#ff9966', '#ff7e5f', '#feb47b', '#f857a6',
            '#ff5858', '#f09819', '#ed4264', '#ffedbc', '#ff6e7f'
        ]
    };

    function hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    function getUserColor(username, payloadColor) {
        const mode = config.nameColorMode || 'twitch';
        if (mode === 'defined') {
            return config.definedNameColor || '#a996ff';
        }

        const key = String(username || '').toLowerCase();
        const paletteName = mode === 'palette' ? (config.nameColorPalette || 'vibrant') : 'vibrant';
        const palette = colorPalettes[paletteName] || colorPalettes.vibrant;

        if (mode === 'twitch') {
            if (payloadColor && /^#[0-9a-f]{6}$/i.test(payloadColor)) {
                return payloadColor;
            }
            if (!colorCache.has(key)) {
                const color = palette[hashString(key) % palette.length];
                colorCache.set(key, color);
            }
            return colorCache.get(key);
        }

        // 'random' or 'palette' mode
        const hash = hashString(key);
        return palette[hash % palette.length];
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
        const finalColor = getUserColor(username, color);
        return `<span class="nick" style="color: ${utils.escapeAttribute(finalColor)}">${safeName}${suffix}</span>`;
    }

    function createActionMessageHtml(textHtml, username, color) {
        const specialClass = getSpecialUsernameClass(username);
        if (specialClass) {
            return `<span class="message ${specialClass}">${textHtml}</span>`;
        }
        const finalColor = getUserColor(username, color);
        return `<span class="message" style="color: ${utils.escapeAttribute(finalColor)}">${textHtml}</span>`;
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
        if (payload.id) message.dataset.messageId = payload.id;
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

        const media = await root.media.extractCards(payload.text, payload);
        let textHtml = root.emotes.replace(media.text, payload.tags || '', payload.roomId, config.channel);
        textHtml = await root.osu.replace(textHtml);
        textHtml = processMentions(textHtml);

        const badges = root.badges.createHtml(root.badges.parse(payload.tags || ''), config);
        let avatarHtml = '';
        if (config.showAvatar && root.avatars) {
            const avatarUrl = await root.avatars.fetchAvatarUrl(payload.username);
            avatarHtml = root.avatars.createAvatarHtml(payload.username, avatarUrl, config);
        }

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

        if (avatarHtml && config.avatarPosition === 'before-badges') {
            beforeName.push(avatarHtml);
        }

        if (badges) {
            if (config.badgePosition === 'after-name') afterName.push(badges);
            else if (config.badgePosition === 'top-right') corner.unshift(badges);
            else beforeName.push(badges);
        }

        if (avatarHtml && config.avatarPosition === 'after-badges') {
            if (config.badgePosition === 'after-name') afterName.push(avatarHtml);
            else beforeName.push(avatarHtml);
        }

        if (corner.length > 0) {
            message.classList.add('has-corner-meta');
        }

        const bodyHtml = payload.isAction && config.meStyleEnabled
            ? createActionMessageHtml(textHtml, payload.username, payload.color)
            : `<span class="message">${textHtml}</span>`;
        message.innerHTML = `${wrapMeta(corner, 'corner-meta')}${wrapMeta(beforeName, 'inline-meta-before')}<span class="user">${nick}</span>${wrapMeta(afterName, 'inline-meta-after')} ${media.html}${bodyHtml}`;
        container.appendChild(message);
        container.scrollTop = container.scrollHeight;

        scheduleMessageRemoval(message);
    }

    function scheduleMessageRemoval(message) {
        if (config.autoRemove) {
            const timeoutMs = (Number(config.removeTimeout) || 12000) < 1000 ? (Number(config.removeTimeout) || 12) * 1000 : Number(config.removeTimeout);
            window.setTimeout(() => removeMessage(message), timeoutMs);
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

    function scheduleDeletedRemoval(message) {
        window.setTimeout(() => removeMessage(message), 4000);
    }

    function findMessageById(id) {
        return Array.from(container.children).find((item) => item.dataset.messageId === id) || null;
    }

    function deleteMessage(id) {
        const message = findMessageById(id);
        if (!message || message.classList.contains('deleted-message')) return;

        message.classList.add('deleted-message');
        message.querySelectorAll('.messageosu, .messageosumap, .messageosuprofile, .messageosuscore, .messagemedia').forEach((node) => node.remove());
        const body = message.querySelector('.message');
        if (body) {
            body.textContent = 'Сообщение было удалено';
        } else {
            message.textContent = 'Сообщение было удалено';
        }
        scheduleDeletedRemoval(message);
    }

    root.renderer = {
        addMessage,
        addSystemMessage,
        addUserNotice,
        deleteMessage,
        clear
    };
}());
