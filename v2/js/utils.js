(function () {
    function log(...args) {
        if (window.IkuzaChatV2.config.debug) {
            console.log('[IkuzaChat v2]', ...args);
        }
    }

    function escapeHtml(value) {
        const div = document.createElement('div');
        div.textContent = value == null ? '' : String(value);
        return div.innerHTML;
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replace(/`/g, '&#96;');
    }

    function escapeRegExp(value) {
        return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function sanitizeUrl(value) {
        const url = String(value || '').trim();
        if (/^(https?:)?\/\//i.test(url) || /^data:image\//i.test(url)) {
            return escapeAttribute(url);
        }
        return '';
    }

    function extractTags(message) {
        const match = message.match(/^@([^ ]+) /);
        return match ? match[1] : '';
    }

    function extractTagValue(tags, name) {
        const parts = String(tags || '').split(';');
        for (const part of parts) {
            const separator = part.indexOf('=');
            if (separator === -1) continue;
            if (part.slice(0, separator) === name) {
                return part.slice(separator + 1);
            }
        }
        return '';
    }

    function extractUsername(message) {
        const tags = extractTags(message);
        const displayName = extractTagValue(tags, 'display-name');
        if (displayName) return displayName;

        const match = message.match(/:([^!\s]+)!/);
        return match ? match[1] : 'Anonymous';
    }

    function extractMessageText(message) {
        if (!message.includes(' PRIVMSG #')) return null;
        const start = message.indexOf(':', message.indexOf(' PRIVMSG #'));
        return start === -1 ? null : message.slice(start + 1);
    }

    function parseActionText(text) {
        const value = String(text || '').replace(/[\r\n]+$/g, '');
        const normalized = value
            .replace(/^\x01ACTION\s+/i, '')
            .replace(/^\\u0001ACTION\s+/i, '')
            .replace(/\x01$/g, '')
            .replace(/\\u0001$/g, '');

        if (normalized !== value) {
            return {
                isAction: true,
                text: normalized
            };
        }

        return {
            isAction: false,
            text: value
        };
    }

    function extractCommandText(message, command) {
        if (!message.includes(` ${command} #`)) return '';
        const start = message.indexOf(':', message.indexOf(` ${command} #`));
        return start === -1 ? '' : message.slice(start + 1);
    }

    function extractRoomId(tags) {
        return extractTagValue(tags, 'room-id') || null;
    }

    function extractColor(tags) {
        const color = extractTagValue(tags, 'color');
        return /^#[0-9a-f]{6}$/i.test(color) ? color : null;
    }

    function extractMessageId(tags) {
        return extractTagValue(tags, 'id') || extractTagValue(tags, 'target-msg-id') || null;
    }

    function getTimeString(timeZone) {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const target = new Date(utc + Number(timeZone) * 3600000);
        return `${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')}`;
    }

    function parseIrcMessage(message) {
        const tags = extractTags(message);
        const text = extractMessageText(message);
        const action = parseActionText(text);
        return {
            raw: message,
            tags,
            username: extractUsername(message),
            text: action.text,
            id: extractMessageId(tags),
            isAction: action.isAction,
            roomId: extractRoomId(tags),
            color: extractColor(tags)
        };
    }

    function parseClearMessage(message) {
        const tags = extractTags(message);
        return {
            raw: message,
            tags,
            id: extractMessageId(tags),
            text: extractCommandText(message, 'CLEARMSG')
        };
    }

    function unescapeTagValue(value) {
        return String(value || '')
            .replace(/\\s/g, ' ')
            .replace(/\\:/g, ';')
            .replace(/\\r/g, '\r')
            .replace(/\\n/g, '\n')
            .replace(/\\\\/g, '\\');
    }

    function parseUserNotice(message) {
        const tags = extractTags(message);
        const systemMessage = unescapeTagValue(extractTagValue(tags, 'system-msg'));
        const text = extractCommandText(message, 'USERNOTICE');
        return {
            raw: message,
            tags,
            username: extractUsername(message),
            text,
            systemMessage,
            noticeType: extractTagValue(tags, 'msg-id'),
            roomId: extractRoomId(tags),
            color: extractColor(tags)
        };
    }

    function parseNotice(message) {
        const tags = extractTags(message);
        return {
            raw: message,
            tags,
            text: extractCommandText(message, 'NOTICE'),
            noticeType: extractTagValue(tags, 'msg-id'),
            roomId: extractRoomId(tags)
        };
    }

    window.IkuzaChatV2 = window.IkuzaChatV2 || {};
    window.IkuzaChatV2.utils = {
        log,
        escapeHtml,
        escapeAttribute,
        escapeRegExp,
        sanitizeUrl,
        extractTags,
        extractTagValue,
        extractUsername,
        extractMessageText,
        extractCommandText,
        extractRoomId,
        extractColor,
        extractMessageId,
        unescapeTagValue,
        getTimeString,
        parseIrcMessage,
        parseClearMessage,
        parseUserNotice,
        parseNotice
    };
}());
