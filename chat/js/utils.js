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

// Функция для проверки, содержит ли сообщение упоминание пользователя
function containsMention(text, channelName) {
    // Проверяем, содержит ли текст упоминание канала (с @)
    const mentionRegex = new RegExp(`@\\s*${channelName}\\b`, 'i');
    return mentionRegex.test(text);
}

// Функция для очистки чата
function clearChat() {
    console.log('🧹 Очистка чата по команде /clear');
    chatContainer.innerHTML = '';
}

console.log('✅ Глобальные утилиты инициализированы');