// Подключение к чату
let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;
let channelUserId = null;
let badgesInitialized = false;
let emotesInitialized = false;
let connectionEstablished = false;

// Инициализация бейджиков
async function initializeBadges() {
    console.log('🔄 Инициализация бейджиков...');
    
    // Обновляем статус загрузки
    if (typeof window.updateLoadingStatus === 'function') {
        window.updateLoadingStatus('Инициализация бейджиков...');
    }
    
    // Искусственная задержка для более продолжительной анимации
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Проверяем, доступен ли модуль badges
        if (typeof badges === 'undefined') {
            console.error('❌ Модуль badges не загружен. Проверьте порядок загрузки скриптов');
            return false;
        }
        
        // Добавляем стили для бейджиков
        if (typeof badges.addStyles === 'function') {
            badges.addStyles();
            console.log('✅ Стили для бейджиков добавлены');
        } else {
            console.error('❌ Функция addStyles не найдена в модуле badges');
            return false;
        }
        
        // Устанавливаем обработчики ошибок
        if (typeof badges.setupErrorHandling === 'function') {
            badges.setupErrorHandling();
            console.log('✅ Обработчики ошибок для бейджиков установлены');
        }
        
        // Инициализируем бейджики
        if (typeof badges.init === 'function') {
            const success = await badges.init(channel);
            if (success) {
                badgesInitialized = true;
                console.log('✅ Бейджики успешно инициализированы');
                return true;
            } else {
                console.error('❌ Не удалось инициализировать бейджики');
                return false;
            }
        } else {
            console.error('❌ Функция init не найдена в модуле badges');
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка инициализации бейджиков:', error);
        return false;
    }
}

// Инициализация эмодзи
async function initializeEmotes() {
    console.log('🔄 Инициализация эмодзи...');
    
    // Обновляем статус загрузки
    if (typeof window.updateLoadingStatus === 'function') {
        window.updateLoadingStatus('Инициализация эмодзи...');
    }
    
    // Искусственная задержка для более продолжительной анимации
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
        // Проверяем, доступен ли модуль emotes
        if (typeof emotes === 'undefined') {
            console.error('❌ Модуль emotes не загружен. Проверьте порядок загрузки скриптов');
            return false;
        }
        
        // Добавляем стили для эмодзи
        if (typeof emotes.addStyles === 'function') {
            emotes.addStyles();
            console.log('✅ Стили для эмодзи добавлены');
        } else {
            console.error('❌ Функция addStyles не найдена в модуле emotes');
            return false;
        }
        
        // Устанавливаем обработчики ошибок
        if (typeof emotes.setupErrorHandling === 'function') {
            emotes.setupErrorHandling();
            console.log('✅ Обработчики ошибок для эмодзи установлены');
        }
        
        // Инициализируем эмодзи
        if (typeof emotes.init === 'function') {
            const success = await emotes.init(channel);
            if (success) {
                emotesInitialized = true;
                console.log('✅ Эмодзи успешно инициализированы');
                return true;
            } else {
                console.error('❌ Не удалось инициализировать эмодзи');
                return false;
            }
        } else {
            console.error('❌ Функция init не найдена в модуле emotes');
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка инициализации эмодзи:', error);
        return false;
    }
}

function connectToChat() {
    console.log(`📡 Подключение к Twitch IRC для канала #${channel}...`);
    
    // Обновляем статус загрузки
    if (typeof window.updateLoadingStatus === 'function') {
        window.updateLoadingStatus('Подключение к Twitch чату...');
    }
    
    // Искусственная задержка для более продолжительной анимации
    setTimeout(() => {
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
                console.log(`✅ Отправлен запрос на подключение к #${channel}`);
                
                // Устанавливаем флаг успешного подключения
                connectionEstablished = true;
                
                // Проверяем, все ли ресурсы загружены
                if (badgesInitialized && emotesInitialized) {
                    console.log('✅ Все ресурсы загружены, скрываем индикатор загрузки');
                    setTimeout(() => {
                        if (typeof window.hideLoadingIndicator === 'function') {
                            window.hideLoadingIndicator();
                        }
                    }, 500);
                }
            };

            socket.onmessage = async (event) => {
                const message = event.data;
                console.log(`📩 Получено сообщение: ${message}`);
                
                // Обработка PING
                if (message.startsWith('PING')) {
                    console.log('📨 Ответ на PING');
                    socket.send('PONG :tmi.twitch.tv');
                    return;
                }
                
                // Обработка CLEARCHAT (очистка чата)
                if (message.includes(' CLEARCHAT #')) {
                    console.log('🧹 Обнаружена команда очистки чата');
                    
                    // Проверяем, включена ли настройка автоочистки
                    if (clearChatOnCommand) {
                        console.log('🧹 Автоочистка чата включена, очищаем чат');
                        clearChat();
                    } else {
                        console.log('🧹 Автоочистка чата отключена, пропускаем');
                    }
                    return;
                }
                
                // Обработка PRIVMSG (сообщения)
                if (message.includes(' PRIVMSG #')) {
                    console.log('💬 Обнаружено сообщение чата');
                    try {
                        // Извлекаем теги
                        const tags = extractTags(message);
                        console.log(`🔖 Теги сообщения: ${tags}`);

                        // Извлекаем цвет ника
                        const color = extractColor(tags);
                        console.log(`🎨 Цвет ника: ${color || 'не указан'}`);

                        // Извлекаем room-id
                        const roomIdMatch = message.match(/@.*?room-id=(\d+);/);
                        let roomId = roomIdMatch ? roomIdMatch[1] : null;
                        console.log(`🆔 Room ID из сообщения: ${roomId || 'не найден'}`);

                        // Извлекаем никнейм
                        const username = extractUsername(message);
                        console.log(`👤 Имя пользователя: ${username}`);

                        // Проверка на бота (если модуль загружен)
                        if (window.botModule && typeof window.botModule.isUserBot === 'function') {
                            if (window.botModule.isUserBot(username)) {
                                console.log('🚫 Сообщение от бота проигнорировано');
                                return; // не добавляем сообщение
                            }
                        }

                        // Извлекаем текст сообщения
                        const text = extractMessageText(message);
                        console.log(`📝 Текст сообщения: ${text}`);

                        if (!text) {
                            console.log('⚠️ Текст сообщения пуст');
                            return;
                        }

                        // Добавляем сообщение с учетом цвета
                        console.log('📨 Добавление сообщения в чат');
                        await addMessage(username, text, tags, text, roomId, color);
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
                
                if (!connectionEstablished && reconnectAttempts >= maxReconnectAttempts) {
                    console.error('❌ Превышено максимальное количество попыток переподключения');
                    if (typeof window.showErrorIndicator === 'function') {
                        window.showErrorIndicator('Не удалось подключиться к чату Twitch', 
                            'Проверьте имя канала и интернет-соединение');
                    }
                    return;
                }
                
                if (reconnectAttempts < maxReconnectAttempts) {
                    reconnectAttempts++;
                    const delay = Math.min(5000 * reconnectAttempts, 30000);
                    console.log(`🔄 Попытка переподключения через ${delay}ms (попытка ${reconnectAttempts}/${maxReconnectAttempts})`);
                    setTimeout(connectToChat, delay);
                }
            };
        } catch (error) {
            console.error('❌ Ошибка при создании WebSocket:', error);
            setTimeout(connectToChat, 5000);
        }
    }, 500); // Искусственная задержка для более продолжительной анимации
}

// Функция для проверки готовности системы
function checkSystemReady() {
    // Если соединение уже установлено, скрываем индикатор
    if (connectionEstablished) {
        if (typeof window.hideLoadingIndicator === 'function') {
            window.hideLoadingIndicator();
        }
        return;
    }
    
    // Если прошло достаточно времени и соединение не установлено
    if (reconnectAttempts >= maxReconnectAttempts) {
        if (typeof window.showErrorIndicator === 'function') {
            window.showErrorIndicator('Не удалось подключиться к чату Twitch', 
                'Проверьте имя канала и интернет-соединение');
        }
        return;
    }
    
    // Проверяем каждую секунду, готова ли система
    setTimeout(checkSystemReady, 1000);
}

// Функция для запуска проверки готовности через 5 секунд
function startReadyCheck() {
    setTimeout(checkSystemReady, 5000);
}

// Автозапуск
console.log('🚀 Запуск Twitch Chat Overlay');

// Функция для получения ID канала
async function getChannelUserId() {
    try {
        console.log(`🔍 Получение Twitch user ID для канала: ${channel}`);
        
        // Проверяем, доступна ли функция getTwitchUserId
        if (typeof badges !== 'undefined' && typeof badges.getTwitchUserId === 'function') {
            channelUserId = await badges.getTwitchUserId(channel);
        } else if (typeof emotes !== 'undefined' && typeof emotes.getTwitchUserId === 'function') {
            channelUserId = await emotes.getTwitchUserId(channel);
        } else {
            console.error('❌ Функция getTwitchUserId не найдена');
            return;
        }
        
        if (channelUserId) {
            console.log(`✅ Получен Twitch user ID канала: ${channel} -> ${channelUserId}`);
        } else {
            console.log(`⚠️ Не удалось получить Twitch user ID для канала: ${channel}`);
        }
    } catch (error) {
        console.error(`❌ Ошибка при получении Twitch user ID для канала ${channel}:`, error);
    }
}

// Запускаем инициализацию
async function startInitialization() {
    // Инициализируем бейджики и эмодзи
    const [badgesSuccess, emotesSuccess] = await Promise.all([
        initializeBadges(),
        initializeEmotes()
    ]);
    
    // Получаем ID канала
    await getChannelUserId();
    
    // Запускаем подключение к чату
    console.log('🔄 Подключение к чату...');
    setTimeout(connectToChat, 1000);
    
    // Запускаем проверку готовности системы
    startReadyCheck();
}

// Запускаем процесс инициализации
startInitialization().catch(error => {
    console.error('❌ Ошибка при инициализации:', error);
    console.log('🔄 Продолжаем без полной инициализации...');
    setTimeout(connectToChat, 1000);
    startReadyCheck();
});