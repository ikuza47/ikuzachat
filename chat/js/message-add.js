// Кэш цветов ников
const userColorCache = {};

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

// Добавление сообщения
function addMessage(username, text, tags, originalText, channelId) {
    try {
        console.log(`👤 ${username}: ${text}`);
        console.log(`🔖 Теги сообщения: ${tags}`);
        console.log(`🆔 Room ID: ${channelId || 'не найден'}`);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        
        // Создаем контейнер для всего сообщения
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.style.display = 'flex';
        messageContent.style.flexDirection = 'column';
        messageContent.style.gap = '5px';
        messageContent.style.padding = '0';

        // Создаем контейнер для ника и бейджиков
        const usernameContainer = document.createElement('div');
        usernameContainer.style.display = 'flex';
        usernameContainer.style.alignItems = 'center';
        usernameContainer.style.gap = '5px';
        usernameContainer.style.flexWrap = 'nowrap';
        usernameContainer.style.flexShrink = '0';

        // Добавляем бейджики, если включено
        let badgesHtml = '';
        if (showBadges && typeof badges !== 'undefined' && typeof badges.parse === 'function') {
            console.log('🔄 Парсинг бейджиков...');
            const badgesArray = badges.parse(tags);
            
            if (badgesArray.length > 0) {
                console.log(`✅ Найдено ${badgesArray.length} бейджиков`);
                
                if (typeof badges.createHtml === 'function') {
                    badgesHtml = badges.createHtml(badgesArray, badgesSize, badgesPosition);
                    console.log('✅ HTML для бейджиков создан');
                } else {
                    console.error('❌ Функция createHtml не найдена в модуле badges');
                }
            } else {
                console.log('ℹ️ Бейджики не найдены в тегах');
            }
        } else {
            console.log('ℹ️ Отображение бейджиков отключено или модуль badges не загружен');
        }

        // Создаем и стилизуем никнейм
        let userSpan;
        if (username.toLowerCase() === 'ikuza47') {
            console.log('✨ Создание градиентного ника для ikuza47');
            userSpan = createGradientUsername(username);
        } else {
            userSpan = document.createElement('span');
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
        }

        // Обрабатываем эмодзи
        let processedText = text;
        if (channelId && typeof emotes !== 'undefined' && typeof emotes.replace === 'function') {
            console.log('🔄 Замена эмодзи в тексте...');
            // Передаем имя канала вместе с ID
            processedText = emotes.replace(text, channelId, channel);
        } else {
            console.log('ℹ️ Обработка эмодзи пропущена');
        }

        // Создаем контейнер для текста сообщения
        const messageTextContainer = document.createElement('div');
        messageTextContainer.style.width = '100%';
        messageTextContainer.style.lineHeight = '1.4';
        messageTextContainer.style.wordBreak = 'break-word';
        messageTextContainer.style.overflowWrap = 'break-word';

        // Создаем и стилизуем текст сообщения
        const textSpan = document.createElement('span');
        textSpan.innerHTML = processedText;
        textSpan.style.textShadow = `0 0 ${shadowBlur}px ${shadowColor}`;

        // Добавляем элементы в контейнер ника
        if (badgesPosition === 'left' && badgesHtml) {
            const badgesContainer = document.createElement('div');
            badgesContainer.innerHTML = badgesHtml;
            badgesContainer.style.display = 'flex';
            badgesContainer.style.alignItems = 'center';
            badgesContainer.style.gap = '3px';
            usernameContainer.appendChild(badgesContainer);
        }
        
        usernameContainer.appendChild(userSpan);
        
        if (badgesPosition === 'right' && badgesHtml) {
            const badgesContainer = document.createElement('div');
            badgesContainer.innerHTML = badgesHtml;
            badgesContainer.style.display = 'flex';
            badgesContainer.style.alignItems = 'center';
            badgesContainer.style.gap = '3px';
            usernameContainer.appendChild(badgesContainer);
        }

        // Добавляем контейнер ника и текст сообщения в основной контейнер
        messageContent.appendChild(usernameContainer);
        messageTextContainer.appendChild(textSpan);
        messageContent.appendChild(messageTextContainer);
        messageDiv.appendChild(messageContent);
        
        chatContainer.appendChild(messageDiv);
        
        // Дожидаемся завершения анимации появления перед прокруткой
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 300);

        // Автоудаление
        if (autoRemove) {
            setTimeout(() => {
                if (messageDiv && messageDiv.parentNode) {
                    // Добавляем класс для анимации исчезновения
                    messageDiv.classList.add('removing');
                    
                    // Удаляем элемент после завершения анимации
                    messageDiv.addEventListener('animationend', () => {
                        if (messageDiv.parentNode) {
                            messageDiv.remove();
                        }
                    });
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

// Создание градиентного ника для ikuza47 (простой переливающийся градиент)
function createGradientUsername(username) {
    const userSpan = document.createElement('span');
    userSpan.className = 'gradient-username';
    userSpan.textContent = username + ':';
    return userSpan;
}