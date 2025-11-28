// Применяем стили к чату
function applyChatStyles() {
    // Создаем элемент стиля
    const style = document.createElement('style');
    style.textContent = `
.user {
    word-break: break-all;
    display: inline-block;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

.nick {
    word-break: break-all;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

.message {
    word-break: break-all;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
    text-shadow: 0 0 var(--shadowBlur, 3)px var(--shadowColor, #000000);
}

.badge {
    word-break: break-all;
    vertical-align: middle;
    border-radius: 10%;
    margin-right: 5px;
    margin-bottom: 8px;
    height: calc(var(--size, 24) * 0.6 * 1px); /* уменьшено в 2 раза */
}

/* Общие стили для сообщений */
.msg {
    word-break: break-word;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

/* Стиль для упоминаний пользователей (@username) */
.mention {
    word-break: break-all;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

.emote {
    vertical-align: middle;
    height: calc(var(--size, 24) * 1.2 * 1px);
    margin: 0 2px;
    border-radius: 2px;
}

/* Стиль для IkuzaUsername (градиент без анимации) */
.IkuzaUsername {
    background: linear-gradient(90deg, #FFD700, #FFA500, #DAA520, #F0E68C, #FFD700);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
    word-break: break-word;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

/* Стили для других ников */
.HellCakeUsername {
    background: linear-gradient(90deg, #2E8B57, #3CB371, #228B22, #006400, #2E8B57);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(46, 139, 87, 0.6);
    word-break: break-word;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

.YatagarasuUsername {
    background: linear-gradient(90deg, #FF69B4, #FF1493, #FF6B9D, #FFB6C1, #FF69B4);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255, 105, 180, 0.6);
    word-break: break-word;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}


/* Анимация удаления сообщений */
.msg.removing {
    animation: fadeOut 0.5s ease-out forwards;
}

@keyframes fadeOut {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(-20px);
    }
}
    `;
    document.head.appendChild(style);
    
    console.log('✅ Стили чата применены');
}

// Вызываем функцию применения стилей
applyChatStyles();