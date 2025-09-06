// Кэш бейджиков
const badgesCache = {
    global: {},
    channel: {}
};

// Получение глобальных бейджиков
async function loadGlobalBadges() {
    if (Object.keys(badgesCache.global).length > 0) {
        console.log('ℹ️ Глобальные бейджики уже загружены');
        return badgesCache.global;
    }

    try {
        console.log('🔍 Загрузка глобальных бейджиков через ivr.fi...');
        const response = await fetch('https://api.ivr.fi/v2/twitch/badges/global');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📥 Получены глобальные бейджики:', data);
        
        // Преобразуем данные в удобный формат
        for (const badge of data) {
            badgesCache.global[badge.set_id] = {};
            
            for (const version of badge.versions) {
                badgesCache.global[badge.set_id][version.id] = {
                    image_url_1x: version.image_url_1x,
                    image_url_2x: version.image_url_2x,
                    image_url_4x: version.image_url_4x,
                    description: version.description || badge.set_id
                };
            }
        }
        
        console.log(`✅ Загружено ${Object.keys(badgesCache.global).length} типов глобальных бейджиков`);
        return badgesCache.global;
    } catch (error) {
        console.error('❌ Ошибка загрузки глобальных бейджиков:', error);
        return {};
    }
}

// Получение бейджиков канала
async function loadChannelBadges(channelId) {
    if (!channelId) {
        console.error('❌ Не указан ID канала для загрузки бейджиков');
        return {};
    }
    
    if (badgesCache.channel[channelId]) {
        console.log(`ℹ️ Бейджики канала ${channelId} уже загружены`);
        return badgesCache.channel[channelId];
    }

    try {
        console.log(`🔍 Загрузка бейджиков канала: ${channelId} через ivr.fi`);
        const response = await fetch(`https://api.ivr.fi/v2/twitch/badges/channel/${channelId}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                console.log(`ℹ️ Бейджики канала ${channelId} не найдены`);
                return {};
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📥 Получены бейджики канала ${channelId}:`, data);
        
        // Преобразуем данные в удобный формат
        const channelBadges = {};
        for (const badge of data) {
            channelBadges[badge.set_id] = {};
            
            for (const version of badge.versions) {
                channelBadges[badge.set_id][version.id] = {
                    image_url_1x: version.image_url_1x,
                    image_url_2x: version.image_url_2x,
                    image_url_4x: version.image_url_4x,
                    description: version.description || badge.set_id
                };
            }
        }
        
        badgesCache.channel[channelId] = channelBadges;
        console.log(`✅ Загружено ${Object.keys(channelBadges).length} типов бейджиков канала`);
        return channelBadges;
    } catch (error) {
        console.error(`❌ Ошибка загрузки бейджиков канала ${channelId}:`, error);
        return {};
    }
}

// Получение Twitch user ID через API
async function getTwitchUserId(username) {
    try {
        console.log(`🔍 Получение Twitch user ID для: ${username}`);
        const response = await fetch(`https://api.ivr.fi/v2/twitch/user?login=${username}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`📥 Получены данные пользователя:`, data);
        
        if (data && data[0] && data[0].id) {
            console.log(`✅ Получен Twitch user ID: ${data[0].id} для ${username}`);
            return data[0].id;
        }
        
        console.error(`❌ Не удалось получить Twitch user ID для: ${username}`);
        return null;
    } catch (error) {
        console.error(`❌ Ошибка при получении Twitch user ID для ${username}:`, error);
        return null;
    }
}

// Парсинг бейджиков из тегов сообщения
function parseBadges(tags) {
    const badges = [];
    
    console.log('🔍 Парсинг бейджиков из тегов:', tags);
    
    // Ищем тег badges в строке
    const badgesMatch = tags.match(/badges=([^;]+)/);
    if (badgesMatch && badgesMatch[1]) {
        const badgesString = badgesMatch[1];
        console.log(`✅ Найдены бейджики: ${badgesString}`);
        
        // Разбиваем на отдельные бейджики
        const badgePairs = badgesString.split(',');
        
        for (const pair of badgePairs) {
            if (!pair) continue;
            
            const [badgeType, version] = pair.split('/');
            if (badgeType && version) {
                console.log(`✅ Обнаружен бейджик: ${badgeType} версии ${version}`);
                badges.push({ type: badgeType, version });
            } else {
                console.log(`⚠️ Пропущен некорректный бейджик: ${pair}`);
            }
        }
    } else {
        console.log('ℹ️ Бейджики не найдены в тегах сообщения');
    }
    
    return badges;
}

// Создание HTML для бейджиков
function createBadgesHtml(badges, size = '2', position = 'left') {
    if (!badges || badges.length === 0) {
        console.log('ℹ️ Нет бейджиков для отображения');
        return '';
    }
    
    console.log(`🎨 Создание HTML для ${badges.length} бейджиков (размер: ${size}x, позиция: ${position})`);
    
    let badgesHtml = '<div class="badges-container badges-position-' + position + '">';
    
    for (const badge of badges) {
        const url = getBadgeUrl(badge.type, badge.version, size);
        if (!url) {
            console.log(`⚠️ Пропущен бейджик ${badge.type} версии ${badge.version} - URL не найден`);
            continue;
        }
        
        const description = getBadgeDescription(badge.type, badge.version);
        
        badgesHtml += `
            <img 
                src="${url}" 
                alt="${badge.type} ${badge.version}" 
                title="${description}" 
                class="badge"
                loading="lazy"
            />
        `;
    }
    
    badgesHtml += '</div>';
    console.log('✅ HTML для бейджиков успешно создан');
    return badgesHtml;
}

// Получение URL бейджика
function getBadgeUrl(badgeType, version, size = '2') {
    console.log(`🔍 Поиск URL для бейджика: ${badgeType} версии ${version}, размер: ${size}x`);
    
    // Сначала проверяем глобальные бейджики
    if (badgesCache.global[badgeType] && badgesCache.global[badgeType][version]) {
        const badge = badgesCache.global[badgeType][version];
        console.log(`✅ Найден глобальный бейджик: ${badgeType} версии ${version}`);
        return badge[`image_url_${size}x`] || badge.image_url_2x;
    }
    
    // Если глобальные не найдены, проверяем бейджики канала
    for (const channelId in badgesCache.channel) {
        const channelBadges = badgesCache.channel[channelId];
        if (channelBadges[badgeType] && channelBadges[badgeType][version]) {
            const badge = channelBadges[badgeType][version];
            console.log(`✅ Найден бейджик канала ${channelId}: ${badgeType} версии ${version}`);
            return badge[`image_url_${size}x`] || badge.image_url_2x;
        }
    }
    
    console.log(`❌ Бейджик не найден: ${badgeType} версии ${version}`);
    return null;
}

// Получение описания бейджика
function getBadgeDescription(badgeType, version) {
    // Сначала проверяем глобальные бейджики
    if (badgesCache.global[badgeType] && badgesCache.global[badgeType][version]) {
        return badgesCache.global[badgeType][version].description;
    }
    
    // Если глобальные не найдены, проверяем бейджики канала
    for (const channelId in badgesCache.channel) {
        const channelBadges = badgesCache.channel[channelId];
        if (channelBadges[badgeType] && channelBadges[badgeType][version]) {
            return channelBadges[badgeType][version].description;
        }
    }
    
    return badgeType;
}

// Инициализация бейджиков
async function initBadges(channel) {
    try {
        console.log('🔄 Инициализация бейджиков...');
        
        // Загружаем глобальные бейджики
        await loadGlobalBadges();
        
        // Получаем ID канала
        const channelId = await getTwitchUserId(channel);
        if (channelId) {
            // Загружаем бейджики канала
            await loadChannelBadges(channelId);
        } else {
            console.warn('⚠️ Не удалось получить ID канала для бейджиков');
        }
        
        console.log('✅ Бейджики успешно инициализированы');
        return true;
    } catch (error) {
        console.error('❌ Ошибка инициализации бейджиков:', error);
        return false;
    }
}

// Добавление стилей для бейджиков
function addBadgesStyles() {
    // Проверяем, не добавлены ли уже стили
    if (document.querySelector('style#badges-styles')) {
        return;
    }
    
    const style = document.createElement('style');
    style.id = 'badges-styles';
    style.textContent = `
        .badges-container {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            margin-right: 4px;
            flex-shrink: 0;
        }
        
        .badges-container.badges-position-right {
            margin-left: 4px;
            margin-right: 0;
        }
        
        .badge {
            height: ${parseInt(size) * 1.2}px;
            vertical-align: middle;
            border-radius: 2px;
            opacity: 0.9;
        }
    `;
    document.head.appendChild(style);
    console.log('✅ Стили для бейджиков добавлены');
}

// Обработка ошибок загрузки бейджиков
function setupBadgeErrorHandling() {
    document.addEventListener('error', function(event) {
        if (event.target && event.target.classList && event.target.classList.contains('badge')) {
            console.log(`❌ Ошибка загрузки бейджика: ${event.target.src}`);
            event.target.style.display = 'none';
        }
    }, true);
}

// Экспортируем функции
window.badges = {
    init: initBadges,
    parse: parseBadges,
    createHtml: createBadgesHtml,
    addStyles: addBadgesStyles,
    setupErrorHandling: setupBadgeErrorHandling,
    loadGlobal: loadGlobalBadges,
    loadChannel: loadChannelBadges,
    getTwitchUserId: getTwitchUserId
};

console.log('✅ Модуль бейджиков загружен и готов к использованию');