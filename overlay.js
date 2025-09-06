// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const channel = urlParams.get('channel') || 'xqc';
const font = decodeURIComponent(urlParams.get('font') || "'Segoe UI', sans-serif");
const size = urlParams.get('size') || '16';
const shadowColorHex = urlParams.get('shadowColor') || '000000';
const shadowBlur = urlParams.get('shadowBlur') || '3';
const messageHeight = urlParams.get('messageHeight') || '32';
const messageBgColorHex = urlParams.get('messageBgColor') || '2a2a2a';
const backgroundEnabled = urlParams.get('backgroundEnabled') !== 'false'; // По умолчанию включено
const backgroundUrl = urlParams.get('backgroundUrl') || '';
const backgroundOpacity = parseFloat(urlParams.get('backgroundOpacity') || '1');
const autoRemove = urlParams.get('autoRemove') === 'true';
const timeout = parseInt(urlParams.get('timeout') || '5', 10) * 1000;

// Настройки выделения модераторов
const highlightMods = urlParams.get('highlightMods') === 'true';
const modsFontSize = urlParams.get('modsFontSize') || size;
const modsTextColorHex = urlParams.get('modsTextColor') || 'FFFFFF';
const modsBgColorHex = urlParams.get('modsBgColor') || '2a2a2a';
const modsUsernameColorHex = urlParams.get('modsUsernameColor') || '9146ff';

// Настройки выделения упоминаний
const highlightMentions = urlParams.get('highlightMentions') === 'true';
const mentionsFontSize = urlParams.get('mentionsFontSize') || size;
const mentionsTextColorHex = urlParams.get('mentionsTextColor') || 'FFFFFF';
const mentionsBgColorHex = urlParams.get('mentionsBgColor') || '2a2a2a';
const mentionsUsernameColorHex = urlParams.get('mentionsUsernameColor') || 'FFD700';

// Настройки выделения VIP
const highlightVip = urlParams.get('highlightVip') === 'true';
const vipFontSize = urlParams.get('vipFontSize') || size;
const vipTextColorHex = urlParams.get('vipTextColor') || 'FFFFFF';
const vipBgColorHex = urlParams.get('vipBgColor') || '2a2a2a';
const vipUsernameColorHex = urlParams.get('vipUsernameColor') || 'FF69B4';

// Форматируем цвета
const shadowColor = `#${shadowColorHex}`;
const messageBgColor = `#${messageBgColorHex}`;

// Функция для преобразования HEX цвета в RGBA
function hexToRgba(hex, opacity) {
    // Удаляем # если он есть
    hex = hex.replace('#', '');
    
    // Расширяем короткий HEX (например, #333)
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    
    // Извлекаем компоненты
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Применяем настройки
const chatContainer = document.getElementById('chat-container');
if (!chatContainer) {
    console.error('❌ Элемент #chat-container не найден!');
    document.body.innerHTML = '<h1 style="color: white; text-align: center; margin-top: 50px;">Ошибка: элемент #chat-container не найден!</h1>';
    throw new Error('Элемент #chat-container не найден!');
}

// Кэш цветов ников
const userColorCache = {};

// Добавляем глобальные стили
const style = document.createElement('style');
style.textContent = `
    .message {
        ${backgroundEnabled ? 
            (backgroundUrl ? 
                `background-image: url('${backgroundUrl}'); background-size: cover;` : 
                `background-color: ${hexToRgba(messageBgColorHex, backgroundOpacity)};`
            ) : 
            'background: transparent !important;'
        }
        border-radius: 8px !important;
        margin: 4px 0 !important;
        padding: ${(messageHeight - parseInt(size)) / 2}px 8px !important;
        min-height: ${messageHeight}px !important;
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        animation: fadeIn 0.3s ease-in !important;
        ${backgroundEnabled && backgroundUrl ? 'color: white !important;' : ''}
    }

    .message,
    .message span {
        font-family: ${font} !important;
        font-size: ${size}px !important;
        text-shadow: 0 0 ${shadowBlur}px ${shadowColor} !important;
    }

    .message span {
        color: white;
    }

    .username {
        font-weight: bold !important;
        margin-right: 8px !important;
        display: inline !important;
        vertical-align: middle !important;
    }

    /* Стили для модераторов */
    .message.mod {
        font-size: ${modsFontSize}px !important;
        background-color: ${hexToRgba(modsBgColorHex, backgroundOpacity)} !important;
    }
    
    .message.mod span {
        color: #${modsTextColorHex} !important;
    }
    
    .message.mod .username {
        color: #${modsUsernameColorHex} !important;
    }

    /* Стили для упоминаний */
    .message.mention {
        font-size: ${mentionsFontSize}px !important;
        background-color: ${hexToRgba(mentionsBgColorHex, backgroundOpacity)} !important;
    }
    
    .message.mention span {
        color: #${mentionsTextColorHex} !important;
    }
    
    .message.mention .username {
        color: #${mentionsUsernameColorHex} !important;
    }

    /* Стили для VIP */
    .message.vip {
        font-size: ${vipFontSize}px !important;
        background-color: ${hexToRgba(vipBgColorHex, backgroundOpacity)} !important;
    }
    
    .message.vip span {
        color: #${vipTextColorHex} !important;
    }
    
    .message.vip .username {
        color: #${vipUsernameColorHex} !important;
    }

    /* Стили для комбинаций выделения */
    .message.mod.mention {
        background-color: ${hexToRgba(mentionsBgColorHex, backgroundOpacity)} !important;
    }
    
    .message.mod.vip {
        background-color: ${hexToRgba(vipBgColorHex, backgroundOpacity)} !important;
    }
    
    .message.mention.vip {
        background-color: ${hexToRgba(vipBgColorHex, backgroundOpacity)} !important;
    }
    
    .message.mod.mention.vip {
        background-color: ${hexToRgba(vipBgColorHex, backgroundOpacity)} !important;
    }

    .emote {
        vertical-align: middle !important;
        height: 1.5em !important;
        margin: 0 2px !important;
        border-radius: 4px !important;
    }

    #chat-container::-webkit-scrollbar { display: none; }
    #chat-container { scrollbar-width: none; }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Кэш 7TV эмодзи по room-id
const sevenTVEmotesCache = {};

// Функция для безопасного экранирования HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функция для безопасного форматирования URL
function sanitizeUrl(url) {
    if (!url) return '';
    
    // Удаляем неправильные символы и экранируем кавычки
    return url
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/&/g, '&amp;');
}

// Функция для экранирования регулярных выражений
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Функция для извлечения текста сообщения из IRC
function extractMessageText(message) {
    // Проверяем, что это PRIVMSG
    if (!message.includes(' PRIVMSG #')) {
        return null;
    }
    
    // Находим начало текста (после ":")
    const colonIndex = message.indexOf(':', message.indexOf(' PRIVMSG #'));
    if (colonIndex === -1) {
        return null;
    }
    
    // Возвращаем текст после ":"
    return message.substring(colonIndex + 1);
}

// Функция для извлечения никнейма
function extractUsername(message) {
    // Пытаемся найти display-name в тегах
    const displayNameMatch = message.match(/@.*?display-name=([^;]*);/);
    if (displayNameMatch && displayNameMatch[1] && displayNameMatch[1] !== '') {
        return displayNameMatch[1];
    }
    
    // Если display-name не найден, ищем ник в начале сообщения
    const userMatch = message.match(/:(.*?)!/);
    if (userMatch && userMatch[1]) {
        return userMatch[1];
    }
    
    return 'Аноним';
}

// Функция для извлечения тегов
function extractTags(message) {
    const tagsMatch = message.match(/^@([^ ]+) /);
    return tagsMatch ? tagsMatch[1] : '';
}

// Функция для проверки, является ли пользователь модератором
function isModerator(tags) {
    return tags.includes('mod=1') || tags.includes('user-type=mod');
}

// Функция для проверки, является ли пользователь VIP
function isVip(tags) {
    return tags.includes('vip=1') || tags.includes('badges=vip') || tags.includes('vip/');
}

// Функция для проверки, содержит ли сообщение упоминание пользователя
function containsMention(text, channelName) {
    // Проверяем, содержит ли текст упоминание канала (с @)
    const mentionRegex = new RegExp(`@\\s*${channelName}\\b`, 'i');
    return mentionRegex.test(text);
}

// Загрузка 7TV эмодзи
async function loadSevenTVEmotesByRoomId(roomId) {
    if (sevenTVEmotesCache[roomId] !== undefined) {
        return sevenTVEmotesCache[roomId];
    }

    try {
        const res = await fetch(`https://7tv.io/v3/users/twitch/${roomId}`);
        const data = await res.json();

        if (data?.emote_set?.emotes) {
            const emotes = {};
            for (const emote of data.emote_set.emotes) {
                // Проверяем, что у эмодзи есть URL
                if (emote.urls && emote.urls.length > 0) {
                    // Берем последний URL (самый высокого качества)
                    const url = emote.urls[emote.urls.length - 1][1];
                    emotes[emote.name] = url;
                }
            }
            sevenTVEmotesCache[roomId] = emotes;
            console.log(`✅ 7TV эмодзи загружены для room-id: ${roomId} (${Object.keys(emotes).length} эмодзи)`);
            return emotes;
        } else {
            sevenTVEmotesCache[roomId] = {};
            console.log(`ℹ️ 7TV эмодзи не найдены для room-id: ${roomId}`);
            return {};
        }
    } catch (err) {
        console.error(`❌ Ошибка загрузки 7TV для room-id ${roomId}:`, err);
        sevenTVEmotesCache[roomId] = {};
        return {};
    }
}

// Замена эмодзи с улучшенной логикой (только целые слова)
function replaceEmotesWithImages(text, emotes) {
    if (!emotes || Object.keys(emotes).length === 0 || !text) {
        return text;
    }

    let replaced = text;
    const sortedEmotes = Object.keys(emotes).sort((a, b) => b.length - a.length);

    for (const name of sortedEmotes) {
        if (!name) continue;
        
        // Экранируем имя эмодзи для использования в регулярном выражении
        const escapedName = escapeRegExp(name);
        
        // Создаем регулярное выражение, которое проверяет:
        // - перед эмодзи НЕ должно быть буквы или цифры
        // - после эмодзи НЕ должно быть буквы или цифры
        // Это гарантирует, что "ку" заменится, а "курю" - нет
        const regex = new RegExp(`(?<![\\p{L}\\p{N}])${escapedName}(?![\\p{L}\\p{N}])`, 'gu');

        replaced = replaced.replace(regex, (match) => {
            const url = emotes[name];
            
            // Проверяем, что URL валидный
            if (!url || !url.startsWith('http')) {
                return match; // Возвращаем оригинальный текст, если URL невалидный
            }
            
            const safeUrl = sanitizeUrl(url);
            const safeName = escapeHtml(name);
            
            return `<img src="${safeUrl}" alt="${safeName}" class="emote" />`;
        });
    }

    return replaced;
}

// Подключение к чату
let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

function connectToChat() {
    console.log(`📡 Подключение к Twitch IRC для канала #${channel}...`);
    
    try {
        socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
        
        socket.onopen = () => {
            console.log('✅ WebSocket соединение установлено');
            reconnectAttempts = 0;
            socket.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
            socket.send('PASS SCHMOOPIIE');
            socket.send('NICK justinfan12345');
            socket.send('USER justinfan12345 8 * :justinfan12345');
            socket.send(`JOIN #${channel}`);
            console.log(`✅ Подключено к #${channel}`);
            addSystemMessage(`Подключено к чату #${channel}`);
        };

        socket.onmessage = async (event) => {
            const message = event.data;
            
            // Обработка PING
            if (message.startsWith('PING')) {
                socket.send('PONG :tmi.twitch.tv');
                return;
            }
            
            // Обработка PRIVMSG (сообщения)
            if (message.includes(' PRIVMSG #')) {
                try {
                    // Извлекаем теги
                    const tags = extractTags(message);
                    
                    // Извлекаем room-id
                    const roomIdMatch = message.match(/@.*?room-id=(\d+);/);
                    const roomId = roomIdMatch ? roomIdMatch[1] : null;
                    
                    // Извлекаем никнейм
                    const username = extractUsername(message);
                    
                    // Извлекаем текст сообщения
                    const text = extractMessageText(message);
                    if (!text) {
                        return;
                    }
                    
                    // Загружаем эмодзи, если есть room-id
                    let emotes = {};
                    if (roomId) {
                        emotes = sevenTVEmotesCache[roomId];
                        if (emotes === undefined) {
                            emotes = await loadSevenTVEmotesByRoomId(roomId);
                        }
                    }
                    
                    // Обрабатываем эмодзи с улучшенной логикой
                    const processedText = replaceEmotesWithImages(text, emotes);
                    
                    // Добавляем сообщение с учетом выделения
                    addMessage(username, processedText, tags, text);
                } catch (error) {
                    console.error('❌ Ошибка обработки сообщения:', error);
                    console.log('Сообщение:', message);
                }
            }
        };

        socket.onerror = (error) => {
            console.error('❌ Ошибка WebSocket:', error);
        };

        socket.onclose = (event) => {
            console.log(`🔌 Соединение закрыто (код: ${event.code}, причина: ${event.reason})`);
            
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                const delay = Math.min(5000 * reconnectAttempts, 30000);
                console.log(`🔄 Попытка переподключения через ${delay}ms (попытка ${reconnectAttempts}/${maxReconnectAttempts})`);
                setTimeout(connectToChat, delay);
            } else {
                console.error('❌ Превышено максимальное количество попыток переподключения');
                addSystemMessage('❌ Не удалось подключиться к чату Twitch');
            }
        };
    } catch (error) {
        console.error('❌ Ошибка при создании WebSocket:', error);
        setTimeout(connectToChat, 5000);
    }
}

// Добавление системного сообщения
function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    textSpan.style.color = '#FF69B4';
    textSpan.style.fontStyle = 'italic';
    
    messageDiv.appendChild(textSpan);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Добавление сообщения с учетом выделения
function addMessage(username, text, tags, originalText) {
    try {
        console.log(`👤 ${username}: ${text}`);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        // Проверяем и добавляем классы для выделения
        if (highlightMods && isModerator(tags)) {
            messageDiv.classList.add('mod');
        }
        
        if (highlightMentions && containsMention(originalText, channel)) {
            messageDiv.classList.add('mention');
        }
        
        if (highlightVip && isVip(tags)) {
            messageDiv.classList.add('vip');
        }

        // Создаем и стилизуем никнейм
        const userSpan = document.createElement('span');
        userSpan.className = 'username';
        userSpan.textContent = username + ':';
        
        // Генерируем или получаем цвет для этого пользователя
        if (!userColorCache[username]) {
            const colors = [
                '#FF4500', '#00FF7F', '#1E90FF', '#FFD700',
                '#FF69B4', '#ADFF2F', '#FF6347', '#7B68EE'
            ];
            userColorCache[username] = colors[Math.floor(Math.random() * colors.length)];
        }
        userSpan.style.color = userColorCache[username];

        // Создаем и стилизуем текст сообщения
        const textSpan = document.createElement('span');
        textSpan.innerHTML = text;

        // Обработка ошибок для всех изображений
        const images = textSpan.querySelectorAll('img.emote');
        images.forEach(img => {
            img.onerror = function() {
                console.log('❌ Ошибка загрузки эмодзи:', img.src);
                this.replaceWith(document.createTextNode(' '));
            };
            img.loading = 'lazy';
        });

        // Добавляем элементы в сообщение
        messageDiv.appendChild(userSpan);
        messageDiv.appendChild(textSpan);
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Автоудаление
        if (autoRemove) {
            setTimeout(() => {
                if (messageDiv && messageDiv.parentNode) {
                    messageDiv.style.opacity = '0';
                    messageDiv.style.transform = 'translateY(-10px)';
                    messageDiv.style.transition = 'all 0.3s ease-out';
                    setTimeout(() => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    }, 300);
                }
            }, timeout);
        }

        // Ограничение количества сообщений
        if (!autoRemove && chatContainer.children.length > 50) {
            chatContainer.removeChild(chatContainer.firstChild);
        }
    } catch (error) {
        console.error('❌ Ошибка добавления сообщения:', error);
    }
}

// Автозапуск
console.log('🚀 Запуск Twitch Chat Overlay');
addSystemMessage('Подключение к чату...');
connectToChat();