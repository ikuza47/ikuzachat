// Кэш списка ботов
let botListCache = [];
let botListLoaded = false;

// Функция для загрузки списка ботов
async function loadBotList() {
    if (botListLoaded) {
        console.log('ℹ️ Список ботов уже загружен из кэша');
        return botListCache;
    }

    try {
        console.log('🔄 Загрузка списка ботов...');
        const response = await fetch('https://raw.githubusercontent.com/ikuza47/ikuzachat/refs/heads/main/public/bots');
        
        if (!response.ok) {
            // Если ошибка 404, возможно у канала нет ботов
            if (response.status === 404) {
                console.log('ℹ️ У канала нет ботов');
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        console.log('📥 Получен список ботов:', text);

        // Разбиваем по запятым и убираем лишние пробелы
        botListCache = text.split(',').map(nick => nick.trim().toLowerCase()).filter(nick => nick);
        console.log('✅ Загружено ботов:', botListCache.length);
        botListLoaded = true;

        return botListCache;
    } catch (error) {
        console.error('❌ Ошибка загрузки списка ботов:', error);
        return [];
    }
}

// Функция для проверки, является ли пользователь ботом
function isUserBot(username) {
    if (!botListLoaded) {
        console.warn('⚠️ Список ботов ещё не загружен');
        return false;
    }

    const lowerUsername = username.toLowerCase();
    const isBot = botListCache.includes(lowerUsername);
    if (isBot) {
        console.log(`🤖 Пользователь ${username} заблокирован как бот`);
    }
    return isBot;
}

// Функция для тестирования модуля ботов
function testBotModule() {
    console.log('🧪 Тестирование модуля ботов...');
    
    // Проверяем, загружен ли список
    if (!botListLoaded) {
        console.warn('⚠️ Список ботов не загружен. Загружаем...');
        loadBotList().then(() => {
            console.log('✅ Список ботов загружен. Повторный тест...');
            testBotModule();
        }).catch(error => {
            console.error('❌ Ошибка загрузки списка ботов:', error);
        });
        return;
    }

    // Тестируем несколько известных ботов
    const testBots = ['moobot', 'nightbot', 'ronniabot', 'streamlabs', 'streamelements'];
    const testUsers = ['ikuza47', 'hellcake47', 'randomuser123'];

    console.log('📊 Результаты тестирования:');
    console.log('========================');

    // Тест ботов
    testBots.forEach(bot => {
        const result = isUserBot(bot);
        console.log(`🤖 ${bot}: ${result ? '✅ БОТ' : '❌ Не бот'}`);
    });

    console.log('--------------------');

    // Тест обычных пользователей
    testUsers.forEach(user => {
        const result = isUserBot(user);
        console.log(`👤 ${user}: ${result ? '✅ БОТ' : '❌ Не бот'}`);
    });

    console.log('========================');
    console.log('✅ Тестирование завершено');
}

// Добавляем тестовую команду в консоль как глобальную функцию
window.testBotModule = testBotModule;

// Инициализация модуля ботов
console.log('✅ Модуль ботов инициализирован');
console.log('🔧 Для тестирования используйте: testBotModule() в консоли');

// Экспортируем функции
window.botModule = {
    loadBotList,
    isUserBot,
    testBotModule
};