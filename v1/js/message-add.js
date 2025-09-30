// Кэш цветов ников
const userColorCache = {};

// Глобальный таймер для синхронизации анимаций
let glowTimer = null;
let startTime = null;

// Функция для запуска синхронизированной анимации
function startGlowSync() {
    // Если таймер уже запущен — выходим
    if (glowTimer) return;

    console.log('⏱️ Запуск синхронизированного таймера анимаций');
    startTime = Date.now();

    // Обновляем позицию градиента каждые 50 мс
    glowTimer = setInterval(() => {
        // Прошедшее время в секундах
        const elapsed = (Date.now() - startTime) / 1000;
        // Прогресс анимации (4 секунды — длительность одного цикла)
        const progress = (elapsed % 4) / 4;

        // Вычисляем позицию градиента (от 0% до 100% и обратно)
        const pos = Math.sin(progress * Math.PI * 2) * 50 + 50;

        // Применяем ко всем градиентным никам
        document.querySelectorAll('.IkuzaUsername, .HellCakeUsername, .YatagarasuUsername').forEach(el => {
            el.style.backgroundPosition = `${pos}% 50%`;
        });
    }, 50); // 20 FPS
}

// Функция для безопасного экранирования HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функция для получения специального класса для ника
function getSpecialUsernameClass(username) {
    if (username.toLowerCase() === 'ikuza47') {
        return 'IkuzaUsername';
    }
    if (username.toLowerCase() === 'hellcake47') {
        return 'HellCakeUsername';
    }
    if (username.toLowerCase() === 'yatagarasu_gg') {
        return 'YatagarasuUsername';
    }
    return null;
}

// Функция для обработки упоминаний в тексте
function processMentions(text) {
    // Регулярное выражение для поиска @username
    const mentionRegex = /@(\w+)/g;
    return text.replace(mentionRegex, (match, username) => {
        const specialClass = getSpecialUsernameClass(username);
        if (specialClass) {
            // Если специальный ник — применяем его класс, и шрифт
            if (specialClass === 'IkuzaUsername' || specialClass === 'HellCakeUsername' || specialClass === 'YatagarasuUsername') {
                // Для градиентных ников — запускаем синхронизацию
                startGlowSync();
                return `<span class="${specialClass}" style="font-family: ${window.font};">@${username}</span>`;
            } else {
                // Для других специальных ников
                return `<span class="${specialClass}" style="font-family: ${window.font};">@${username}</span>`;
            }
        } else {
            // Если обычный пользователь — применяем его цвет и шрифт
            if (!userColorCache[username]) {
                const colors = [
                    '#FF4500', '#00FF7F', '#1E90FF', '#FFD700',
                    '#FF69B4', '#ADFF2F', '#FF6347', '#7B68EE'
                ];
                userColorCache[username] = colors[Math.floor(Math.random() * colors.length)];
            }
            const color = userColorCache[username];
            return `<span class="mention" style="color: ${color}; font-family: ${window.font};">@${username}</span>`;
        }
    });
}

// Добавление системного сообщения
function addSystemMessage(text) {
    if (window.debugMode) {
        console.log(`📢 Системное сообщение: ${text}`);
    }
    const messageDiv = document.createElement('div');
    messageDiv.className = 'msg';
    messageDiv.style.wordBreak = 'break-word';
    messageDiv.style.fontSize = `${window.size}px`;
    messageDiv.style.fontFamily = window.font;
    
    const textSpan = document.createElement('span');
    textSpan.textContent = text; // безопасное отображение
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
        userSpan.style.wordBreak = 'break-word';
        userSpan.style.fontSize = `${window.size}px`;
        userSpan.style.fontFamily = window.font;

        // Синхронизация анимации
        startGlowSync();

        return userSpan;
    }

    if (username.toLowerCase() === 'hellcake47') {
        if (window.debugMode) console.log('🌿 Создание тёмно-зелёного градиентного ника для HellCake47');
        const userSpan = document.createElement('span');
        userSpan.className = 'HellCakeUsername';
        userSpan.textContent = username + (window.colonEnabled ? ':' : '');
        userSpan.style.wordBreak = 'break-word';
        userSpan.style.fontSize = `${window.size}px`;
        userSpan.style.fontFamily = window.font;

        // Синхронизация анимации
        startGlowSync();

        return userSpan;
    }

    if (username.toLowerCase() === 'yatagarasu_gg') {
        if (window.debugMode) console.log('🌸 Создание ярко-розового градиентного ника для yatagarasu_gg');
        const userSpan = document.createElement('span');
        userSpan.className = 'YatagarasuUsername';
        userSpan.textContent = username + (window.colonEnabled ? ':' : '');
        userSpan.style.wordBreak = 'break-word';
        userSpan.style.fontSize = `${window.size}px`;
        userSpan.style.fontFamily = window.font;

        // Синхронизация анимации
        startGlowSync();

        return userSpan;
    }

    return null;
}

// Добавление сообщения
async function addMessage(username, text, tags, originalText, channelId, color = null) {
    try {
        if (window.debugMode) {
            console.log(`👤 ${username}: ${text}`);
            console.log(`🎨 Цвет ника из тегов: ${color || 'не указан'}`);
            console.log(`🔖 Теги сообщения: ${tags}`);
            console.log(`🆔 Room ID: ${channelId || 'не найден'}`);
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'msg';
        messageDiv.style.wordBreak = 'break-word';
        messageDiv.style.fontSize = `${window.size}px`;
        messageDiv.style.fontFamily = window.font;

        // Создаем контейнер для ника и бейджиков
        const userSpan = document.createElement('span');
        userSpan.className = 'user';
        userSpan.style.wordBreak = 'break-word';
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
                        img.style.wordBreak = 'break-word';
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
            nickSpan.style.wordBreak = 'break-word';
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
            // Если эмодзи не обрабатываются, экранируем HTML в тексте
            processedText = escapeHtml(text);
        }

        // Обрабатываем osu! ссылки (если модуль загружен)
        if (window.osuModule && typeof window.osuModule.replaceOsuLinksInText === 'function') {
            if (window.debugMode) console.log('🔄 Обработка osu! ссылок...');
            processedText = await window.osuModule.replaceOsuLinksInText(processedText);
        } else {
            if (window.debugMode) console.log('ℹ️ Модуль osuModule не найден или не загружен.');
        }

        // Обрабатываем упоминания
        processedText = processMentions(processedText);

        // Создаем контейнер для текста сообщения
        const messageSpan = document.createElement('span');
        messageSpan.className = 'message';
        // Если эмодзи были обработаны, вставляем как HTML, иначе как текст
        if (channelId && typeof emotes !== 'undefined' && typeof emotes.replace === 'function') {
            messageSpan.innerHTML = processedText; // безопасный HTML от эмодзи
        } else {
            messageSpan.textContent = processedText; // текст без HTML
        }
        messageSpan.style.textShadow = `0 0 ${window.shadowBlur}px ${window.shadowColor}`;
        messageSpan.style.wordBreak = 'break-word';
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