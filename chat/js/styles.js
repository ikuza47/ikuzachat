// Применяем стили к чату
function applyChatStyles() {
    // Создаем элемент стиля
    const style = document.createElement('style');
    style.textContent = `
        #chat-container {
            font-family: ${font};
            font-size: ${size}px;
            line-height: 1.4;
            height: 100%;
        }
        
        .message {
            margin-bottom: 8px;
            animation: ${animationIn} 0.3s ease;
            padding: 0;
        }
        
        .message.removing {
            animation: ${animationOut} 0.3s ease;
        }
        
        .message-content {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .username {
            font-weight: bold;
            white-space: nowrap;
        }
        
        .gradient-username {
            font-weight: bold;
            white-space: nowrap;
        }
        
        .message-content > div:last-child {
            word-wrap: break-word;
            word-break: break-word;
            width: 100%;
            min-width: 0;
        }
        
        .badges-container {
            display: flex;
            align-items: center;
            gap: 3px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-20px); }
        }
        
        @keyframes zoomIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes zoomOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.9); }
        }
        .message-content {
            display: flex;
            flex-direction: row;
            gap: 5px;
            align-items: flex-start;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Стили чата применены');
}

// Вызываем функцию применения стилей
applyChatStyles();