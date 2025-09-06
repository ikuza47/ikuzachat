document.addEventListener('DOMContentLoaded', () => {
    // Элементы
    const channelInput = document.getElementById('channel');
    const fontFamilyInput = document.getElementById('fontFamily');
    const fontSizeInput = document.getElementById('fontSize');
    const generateBtn = document.getElementById('generate');
    const resultDiv = document.getElementById('result');
    const overlayUrlInput = document.getElementById('overlayUrl');
    const copyBtn = document.getElementById('copyBtn');
    const autoRemoveCheckbox = document.getElementById('autoRemove');
    const timeoutGroup = document.getElementById('timeoutGroup');
    const removeTimeoutInput = document.getElementById('removeTimeout');
    
    // Новые элементы
    const backgroundEnabledCheckbox = document.getElementById('backgroundEnabled');
    const backgroundTypeSelect = document.getElementById('backgroundType');
    const messageBgColorInput = document.getElementById('messageBgColor');
    const backgroundImageUrlInput = document.getElementById('backgroundImageUrl');
    const backgroundOpacityInput = document.getElementById('backgroundOpacity');
    const backgroundOpacityValue = document.getElementById('opacityValue');
    const textShadowColorInput = document.getElementById('textShadowColor');
    const textShadowBlurInput = document.getElementById('textShadowBlur');
    const messageHeightInput = document.getElementById('messageHeight');
    
    // Элементы выделения
    const highlightModsCheckbox = document.getElementById('highlightMods');
    const modsFontSizeInput = document.getElementById('modsFontSize');
    const modsTextColorInput = document.getElementById('modsTextColor');
    const modsBgColorInput = document.getElementById('modsBgColor');
    const modsUsernameColorInput = document.getElementById('modsUsernameColor');
    
    const highlightMentionsCheckbox = document.getElementById('highlightMentions');
    const mentionsFontSizeInput = document.getElementById('mentionsFontSize');
    const mentionsTextColorInput = document.getElementById('mentionsTextColor');
    const mentionsBgColorInput = document.getElementById('mentionsBgColor');
    const mentionsUsernameColorInput = document.getElementById('mentionsUsernameColor');
    
    const highlightVipCheckbox = document.getElementById('highlightVip');
    const vipFontSizeInput = document.getElementById('vipFontSize');
    const vipTextColorInput = document.getElementById('vipTextColor');
    const vipBgColorInput = document.getElementById('vipBgColor');
    const vipUsernameColorInput = document.getElementById('vipUsernameColor');
    
    // Элементы анимаций
    const animationInSelect = document.getElementById('animationIn');
    const animationOutSelect = document.getElementById('animationOut');
    
    // Элементы бейджиков
    const showBadgesCheckbox = document.getElementById('showBadges');
    const badgesSizeSelect = document.getElementById('badgesSize');
    const badgesPositionSelect = document.getElementById('badgesPosition');

    // Проверка обязательных элементов
    const requiredElements = [
        channelInput, fontFamilyInput, fontSizeInput, generateBtn,
        textShadowColorInput, textShadowBlurInput,
        messageHeightInput, messageBgColorInput,
        backgroundEnabledCheckbox, backgroundTypeSelect,
        backgroundOpacityInput, backgroundOpacityValue,
        animationInSelect, animationOutSelect,
        showBadgesCheckbox, badgesSizeSelect, badgesPositionSelect
    ];

    for (const el of requiredElements) {
        if (!el) {
            console.error('❌ Элемент не найден:', el);
            return;
        }
    }

    // Обновление значения прозрачности
    if (backgroundOpacityInput && backgroundOpacityValue) {
        backgroundOpacityInput.addEventListener('input', () => {
            backgroundOpacityValue.textContent = `${Math.round(backgroundOpacityInput.value * 100)}%`;
        });
        backgroundOpacityValue.textContent = `${Math.round(backgroundOpacityInput.value * 100)}%`;
    }

    // Показ/скрытие таймаута
    if (autoRemoveCheckbox && timeoutGroup) {
        autoRemoveCheckbox.addEventListener('change', function () {
            timeoutGroup.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Показ/скрытие настроек фона
    if (backgroundEnabledCheckbox) {
        backgroundEnabledCheckbox.addEventListener('change', function () {
            const backgroundTypeGroup = document.getElementById('backgroundTypeGroup');
            if (backgroundTypeGroup) {
                backgroundTypeGroup.style.display = this.checked ? 'block' : 'none';
            }
            updateBackgroundSettingsVisibility();
        });
    }
    
    // Показ/скрытие конкретных настроек фона
    if (backgroundTypeSelect) {
        backgroundTypeSelect.addEventListener('change', updateBackgroundSettingsVisibility);
    }
    
    function updateBackgroundSettingsVisibility() {
        const isBackgroundEnabled = backgroundEnabledCheckbox.checked;
        const backgroundTypeValue = backgroundTypeSelect.value;
        
        const backgroundColorGroup = document.getElementById('backgroundColorGroup');
        const backgroundImageGroup = document.getElementById('backgroundImageGroup');
        const backgroundOpacityGroup = document.getElementById('backgroundOpacityGroup');
        
        if (backgroundColorGroup) {
            backgroundColorGroup.style.display = isBackgroundEnabled && backgroundTypeValue === 'color' ? 'block' : 'none';
        }
        
        if (backgroundImageGroup) {
            backgroundImageGroup.style.display = isBackgroundEnabled && backgroundTypeValue === 'image' ? 'block' : 'none';
        }
        
        if (backgroundOpacityGroup) {
            backgroundOpacityGroup.style.display = isBackgroundEnabled ? 'block' : 'none';
        }
    }
    
    // Инициализация видимости
    updateBackgroundSettingsVisibility();

    // Показ/скрытие настроек выделения модераторов
    if (highlightModsCheckbox) {
        highlightModsCheckbox.addEventListener('change', function() {
            const modsSettings = document.getElementById('modsSettings');
            if (modsSettings) {
                modsSettings.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
    
    // Показ/скрытие настроек выделения упоминаний
    if (highlightMentionsCheckbox) {
        highlightMentionsCheckbox.addEventListener('change', function() {
            const mentionsSettings = document.getElementById('mentionsSettings');
            if (mentionsSettings) {
                mentionsSettings.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
    
    // Показ/скрытие настроек выделения VIP
    if (highlightVipCheckbox) {
        highlightVipCheckbox.addEventListener('change', function() {
            const vipSettings = document.getElementById('vipSettings');
            if (vipSettings) {
                vipSettings.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
    
    // Показ/скрытие настроек бейджиков
    if (showBadgesCheckbox) {
        showBadgesCheckbox.addEventListener('change', function() {
            const badgesSizeGroup = document.getElementById('badgesSizeGroup');
            const badgesPositionGroup = document.getElementById('badgesPositionGroup');
            
            if (badgesSizeGroup) {
                badgesSizeGroup.style.display = this.checked ? 'block' : 'none';
            }
            
            if (badgesPositionGroup) {
                badgesPositionGroup.style.display = this.checked ? 'block' : 'none';
            }
        });
    }

    // Генерация ссылки
    generateBtn.addEventListener('click', () => {
        let channel = channelInput.value.trim().toLowerCase();
        
        // Удаляем символ @, если он есть в начале
        if (channel.startsWith('@')) {
            channel = channel.substring(1);
        }
        
        // Проверяем на допустимые символы для Twitch канала
        const twitchChannelRegex = /^[a-z0-9_]{3,25}$/;
        if (!twitchChannelRegex.test(channel)) {
            alert('Недопустимое имя канала!\n\nИмя канала Twitch должно:\n- Содержать от 3 до 25 символов\n- Содержать только буквы, цифры и нижнее подчеркивание');
            return;
        }

        const params = new URLSearchParams();
        
        // Добавляем обязательные параметры
        params.append('channel', channel);
        params.append('font', encodeURIComponent(fontFamilyInput.value));
        params.append('size', fontSizeInput.value);
        params.append('shadowColor', textShadowColorInput.value.replace('#', ''));
        params.append('shadowBlur', textShadowBlurInput.value);
        params.append('messageHeight', messageHeightInput.value);
        params.append('backgroundEnabled', backgroundEnabledCheckbox.checked);
        params.append('backgroundOpacity', backgroundOpacityInput.value);
        
        // Добавляем цвет фона, если фон включен и выбран тип "color"
        if (backgroundEnabledCheckbox.checked && backgroundTypeSelect.value === 'color') {
            params.append('messageBgColor', messageBgColorInput.value.replace('#', ''));
        }
        
        // Добавляем URL фонового изображения, если выбран тип "image"
        if (backgroundEnabledCheckbox.checked && backgroundTypeSelect.value === 'image' && backgroundImageUrlInput.value) {
            params.append('backgroundUrl', backgroundImageUrlInput.value);
        }

        // Добавляем автоудаление, если включено
        if (autoRemoveCheckbox && autoRemoveCheckbox.checked) {
            params.append('autoRemove', 'true');
            const timeoutValue = removeTimeoutInput ? removeTimeoutInput.value : '5';
            params.append('timeout', timeoutValue || '5');
        }

        // Добавляем настройки выделения модераторов
        if (highlightModsCheckbox && highlightModsCheckbox.checked) {
            params.append('highlightMods', 'true');
            if (modsFontSizeInput) params.append('modsFontSize', modsFontSizeInput.value);
            if (modsTextColorInput) params.append('modsTextColor', modsTextColorInput.value.replace('#', ''));
            if (modsBgColorInput) params.append('modsBgColor', modsBgColorInput.value.replace('#', ''));
            if (modsUsernameColorInput) params.append('modsUsernameColor', modsUsernameColorInput.value.replace('#', ''));
        }

        // Добавляем настройки выделения упоминаний
        if (highlightMentionsCheckbox && highlightMentionsCheckbox.checked) {
            params.append('highlightMentions', 'true');
            if (mentionsFontSizeInput) params.append('mentionsFontSize', mentionsFontSizeInput.value);
            if (mentionsTextColorInput) params.append('mentionsTextColor', mentionsTextColorInput.value.replace('#', ''));
            if (mentionsBgColorInput) params.append('mentionsBgColor', mentionsBgColorInput.value.replace('#', ''));
            if (mentionsUsernameColorInput) params.append('mentionsUsernameColor', mentionsUsernameColorInput.value.replace('#', ''));
        }

        // Добавляем настройки выделения VIP
        if (highlightVipCheckbox && highlightVipCheckbox.checked) {
            params.append('highlightVip', 'true');
            if (vipFontSizeInput) params.append('vipFontSize', vipFontSizeInput.value);
            if (vipTextColorInput) params.append('vipTextColor', vipTextColorInput.value.replace('#', ''));
            if (vipBgColorInput) params.append('vipBgColor', vipBgColorInput.value.replace('#', ''));
            if (vipUsernameColorInput) params.append('vipUsernameColor', vipUsernameColorInput.value.replace('#', ''));
        }
        
        // Добавляем настройки анимаций
        if (animationInSelect) params.append('animationIn', animationInSelect.value);
        if (animationOutSelect) params.append('animationOut', animationOutSelect.value);
        
        // Добавляем настройки бейджиков
        if (showBadgesCheckbox && showBadgesCheckbox.checked) {
            params.append('showBadges', 'true');
            if (badgesSizeSelect) params.append('badgesSize', badgesSizeSelect.value);
            if (badgesPositionSelect) params.append('badgesPosition', badgesPositionSelect.value);
        }

        console.log('Сгенерированные параметры:', params.toString());
        
        const url = `chat/overlay.html?${params.toString()}`;

        let basePath = window.location.pathname;
        if (basePath.endsWith('index.html')) {
            basePath = basePath.substring(0, basePath.lastIndexOf('/') + 1);
        } else if (!basePath.endsWith('/')) {
            basePath += '/';
        }

        const fullUrl = `${window.location.origin}${basePath}${url}`;

        if (overlayUrlInput) overlayUrlInput.value = fullUrl;
        if (resultDiv) resultDiv.style.display = 'block';
        
        // Логируем результат
        console.log('✅ Ссылка сгенерирована:', fullUrl);
        console.log({
            channel,
            font: fontFamilyInput.value,
            size: fontSizeInput.value,
            shadowColor: textShadowColorInput.value,
            shadowBlur: textShadowBlurInput.value,
            messageHeight: messageHeightInput.value,
            backgroundEnabled: backgroundEnabledCheckbox.checked,
            messageBgColor: messageBgColorInput.value,
            backgroundUrl: backgroundImageUrlInput.value,
            backgroundOpacity: backgroundOpacityInput.value,
            autoRemove: autoRemoveCheckbox.checked,
            timeout: removeTimeoutInput ? removeTimeoutInput.value : '5',
            highlightMods: highlightModsCheckbox.checked,
            modsFontSize: modsFontSizeInput ? modsFontSizeInput.value : '16',
            modsTextColor: modsTextColorInput ? modsTextColorInput.value : '#FFFFFF',
            modsBgColor: modsBgColorInput ? modsBgColorInput.value : '#2a2a2a',
            modsUsernameColor: modsUsernameColorInput ? modsUsernameColorInput.value : '#9146ff',
            highlightMentions: highlightMentionsCheckbox.checked,
            mentionsFontSize: mentionsFontSizeInput ? mentionsFontSizeInput.value : '16',
            mentionsTextColor: mentionsTextColorInput ? mentionsTextColorInput.value : '#FFFFFF',
            mentionsBgColor: mentionsBgColorInput ? mentionsBgColorInput.value : '#2a2a2a',
            mentionsUsernameColor: mentionsUsernameColorInput ? mentionsUsernameColorInput.value : '#FFD700',
            highlightVip: highlightVipCheckbox.checked,
            vipFontSize: vipFontSizeInput ? vipFontSizeInput.value : '16',
            vipTextColor: vipTextColorInput ? vipTextColorInput.value : '#FFFFFF',
            vipBgColor: vipBgColorInput ? vipBgColorInput.value : '#2a2a2a',
            vipUsernameColor: vipUsernameColorInput ? vipUsernameColorInput.value : '#FF69B4',
            animationIn: animationInSelect ? animationInSelect.value : 'fadeIn',
            animationOut: animationOutSelect ? animationOutSelect.value : 'fadeOut',
            showBadges: showBadgesCheckbox ? showBadgesCheckbox.checked : false,
            badgesSize: badgesSizeSelect ? badgesSizeSelect.value : '2',
            badgesPosition: badgesPositionSelect ? badgesPositionSelect.value : 'left'
        });
    });

    // Копирование ссылки
    if (copyBtn && overlayUrlInput) {
        copyBtn.addEventListener('click', () => {
            overlayUrlInput.select();
            document.execCommand('copy');
            copyBtn.textContent = '✅ Скопировано!';
            setTimeout(() => {
                copyBtn.textContent = '📋 Копировать';
            }, 2000);
        });
    }
});