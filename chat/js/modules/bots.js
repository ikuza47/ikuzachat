// Кэш списка ботов
let botListCache = [];
let botListLoaded = false;

// Функция для загрузки списка ботов
async function loadBotList() {
    if (botListLoaded) {
        console.log('📋 Список ботов уже загружен из кэша');
        return botListCache;
    }

    try {
        console.log('🔄 Загрузка списка ботов...');
        const response = await fetch('https://raw.githubusercontent.com/ikuza47/ikuzachat/refs/heads/main/public/bots');
        if (!response.ok) {
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

// Экспортируем функции
window.botModule = {
    loadBotList,
    isUserBot
};