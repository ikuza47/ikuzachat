// Кэш цветов ников
const userColorCache = {};

// Добавление системного сообщения
function addSystemMessage(text) {
    if (window.debugMode) {
        console.log(`📢 Системное сообщение: ${text}`);
    }
    const messageDiv = document.createElement('div');
    messageDiv.className = 'msg';
    messageDiv.style.wordBreak = 'break-all';
    messageDiv.style.fontSize = `${window.size}px`;
    messageDiv.style.fontFamily = window.font;
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text;
    textSpan.style.color = '#FF69B4';
    textSpan.style.fontStyle = 'italic';
    
    messageDiv.appendChild(textSpan);
    chatContainer.appendChild(messageDiv);

    // Прокрутка вниз только если debugMode = false
    if (!window.debugMode) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// Функция для создания стилей для специального ника
function CreateSpecialUsernameStyles(username) {
    if (username.toLowerCase() === 'ikuza47') {
        if (window.debugMode) console.log('✨ Создание градиентного ника для ikuza47');
        const userSpan = document.createElement('span');
        userSpan.className = 'IkuzaUsername';
        userSpan.textContent = username + (window.colonEnabled ? ':' : '');
        userSpan.style.wordBreak = 'break-all';
        userSpan.style.fontSize = `${window.size}px`;
        userSpan.style.fontFamily = window.font;
        return userSpan;
    }
    return null;
}

// Добавление сообщения
function addMessage(username, text, tags, originalText, channelId, color = null) {
    try {
        if (window.debugMode) {
            console.log(`👤 ${username}: ${text}`);
            console.log(`🎨 Цвет ника из тегов: ${color || 'не указан'}`);
            console.log(`🔖 Теги сообщения: ${tags}`);
            console.log(`🆔 Room ID: ${channelId || 'не найден'}`);
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'msg';
        messageDiv.style.wordBreak = 'break-all';
        messageDiv.style.fontSize = `${window.size}px`;
        messageDiv.style.fontFamily = window.font;

        // Создаем контейнер для ника и бейджиков
        const userSpan = document.createElement('span');
        userSpan.className = 'user';
        userSpan.style.wordBreak = 'break-all';
        userSpan.style.display = 'inline-block';
        userSpan.style.fontSize = `${window.size}px`;
        userSpan.style.fontFamily = window.font;

        // Добавляем бейджики, если включено
        if (showBadges && typeof badges !== 'undefined' && typeof badges.parse === 'function') {
            if (window.debugMode) console.log('🔄 Парсинг бейджиков...');
            const badgesArray = badges.parse(tags);
            
            if (badgesArray.length > 0) {
                if (window.debugMode) console.log(`✅ Найдено ${badgesArray.length} бейджиков`);
                
                if (typeof badges.createHtml === 'function') {
                    const badgesHtml = badges.createHtml(badgesArray, window.size, 'left');
                    if (window.debugMode) console.log('✅ HTML для бейджиков создан');
                    
                    // Вставляем бейджики в userSpan
                    userSpan.innerHTML = badgesHtml;
                    // Применяем стили к каждому бейджику
                    const badgeElements = userSpan.querySelectorAll('img');
                    badgeElements.forEach(img => {
                        img.className = 'badge';
                        img.style.wordBreak = 'break-all';
                        img.style.verticalAlign = 'middle';
                        img.style.borderRadius = '10%';
                        img.style.marginRight = '5px';
                        img.style.marginBottom = '8px';
                        img.style.height = `${parseInt(window.size) * 0.6}px`; // уменьшено в 2 раза
                    });
                } else {
                    console.error('❌ Функция createHtml не найдена в модуле badges');
                }
            } else {
                if (window.debugMode) console.log('ℹ️ Бейджики не найдены в тегах');
            }
        } else {
            if (window.debugMode) console.log('ℹ️ Отображение бейджиков отключено или модуль badges не загружен');
        }

        // Создаем и стилизуем никнейм
        let nickSpan;
        const specialUsername = CreateSpecialUsernameStyles(username);
        if (specialUsername) {
            nickSpan = specialUsername;
        } else {
            nickSpan = document.createElement('span');
            nickSpan.className = 'nick';
            nickSpan.textContent = username + (window.colonEnabled ? ':' : '');
            nickSpan.style.wordBreak = 'break-all';
            nickSpan.style.fontSize = `${window.size}px`;
            nickSpan.style.fontFamily = window.font;

            // Используем цвет из тегов, если есть
            if (color) {
                nickSpan.style.color = color;
                if (window.debugMode) console.log(`✅ Применён цвет ника из тегов: ${color}`);
            } else {
                // Если цвета нет, используем кэшированный или генерируем случайный
                if (!userColorCache[username]) {
                    const colors = [
                        '#FF4500', '#00FF7F', '#1E90FF', '#FFD700',
                        '#FF69B4', '#ADFF2F', '#FF6347', '#7B68EE'
                    ];
                    userColorCache[username] = colors[Math.floor(Math.random() * colors.length)];
                    if (window.debugMode) console.log(`🎨 Генерация случайного цвета для ${username}: ${userColorCache[username]}`);
                } else {
                    if (window.debugMode) console.log(`🎨 Использование кэшированного цвета для ${username}: ${userColorCache[username]}`);
                }
                nickSpan.style.color = userColorCache[username];
            }
        }

        // Добавляем ник в userSpan
        userSpan.appendChild(nickSpan);

        // Обрабатываем эмодзи
        let processedText = text;
        if (channelId && typeof emotes !== 'undefined' && typeof emotes.replace === 'function') {
            if (window.debugMode) console.log('🔄 Замена эмодзи в тексте...');
            // Передаем имя канала вместе с ID
            processedText = emotes.replace(text, channelId, channel);
        } else {
            if (window.debugMode) console.log('ℹ️ Обработка эмодзи пропущена');
        }

        // Создаем контейнер для текста сообщения
        const messageSpan = document.createElement('span');
        messageSpan.className = 'message';
        messageSpan.innerHTML = processedText;
        messageSpan.style.textShadow = `0 0 ${window.shadowBlur}px ${window.shadowColor}`;
        messageSpan.style.wordBreak = 'break-all';
        messageSpan.style.fontSize = `${window.size}px`;
        messageSpan.style.fontFamily = window.font;

        // Добавляем пробел между ником и сообщением
        const spaceSpan = document.createElement('span');
        spaceSpan.textContent = ' ';

        // Добавляем элементы в сообщение
        messageDiv.appendChild(userSpan);
        messageDiv.appendChild(spaceSpan); // пробел между ником и сообщением
        messageDiv.appendChild(messageSpan);
        
        chatContainer.appendChild(messageDiv);
        
        // Прокрутка вниз только если debugMode = false
        if (!window.debugMode) {
            // Дожидаемся завершения анимации появления перед прокруткой
            setTimeout(() => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 300);
        }

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

        // Ограничение количества сообщений — только если debugMode = false
        if (!window.debugMode && !autoRemove && chatContainer.children.length > 50) {
            chatContainer.removeChild(chatContainer.firstChild);
        }
    } catch (error) {
        if (window.debugMode) {
            console.error('❌ Ошибка добавления сообщения:', error);
        }
    }
}