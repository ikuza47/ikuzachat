// Применяем стили к чату
function applyChatStyles() {
    // Создаем элемент стиля
    const style = document.createElement('style');
    style.textContent = `
.msg {
    word-break: break-all;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

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

.IkuzaUsername {
    background: linear-gradient(90deg, #FFD700, #FFA500, #DAA520, #F0E68C, #FFD700);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: goldenGlow 4s ease-in-out infinite;
    display: inline-block;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
    word-break: break-all;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

.HellCakeUsername {
    background: linear-gradient(90deg, #2E8B57, #3CB371, #228B22, #006400, #2E8B57);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: darkGreenGlow 4s ease-in-out infinite;
    display: inline-block;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(46, 139, 87, 0.6);
    word-break: break-all;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

.YatagarasuUsername {
    background: linear-gradient(90deg, #FF69B4, #FF1493, #FF6B9D, #FFB6C1, #FF69B4);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: pinkGlow 4s ease-in-out infinite;
    display: inline-block;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255, 105, 180, 0.6);
    word-break: break-all;
    font-size: calc(var(--size, 24) * 1px);
    font-family: var(--font, 'Segoe UI', sans-serif);
}

@keyframes goldenGlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes darkGreenGlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes pinkGlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
    `;
    document.head.appendChild(style);
    
    console.log('✅ Стили чата применены');
}

// Вызываем функцию применения стилей
applyChatStyles();