// Глобальная переменная для обновления статуса загрузки
window.updateLoadingStatus = function(message) {
    const loadingSubtext = document.querySelector('.loading-subtext');
    if (loadingSubtext) {
        loadingSubtext.textContent = message;
    }
};

// Добавляем стили для анимации загрузки
(function() {
    // Проверяем, существует ли индикатор загрузки
    let loadingIndicator = document.getElementById('loading-indicator');
    
    // Если индикатора еще нет, создаем его
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.style.position = 'fixed';
        loadingIndicator.style.top = '0';
        loadingIndicator.style.left = '0';
        loadingIndicator.style.width = '100%';
        loadingIndicator.style.height = '100%';
        loadingIndicator.style.display = 'flex';
        loadingIndicator.style.flexDirection = 'column';
        loadingIndicator.style.justifyContent = 'center';
        loadingIndicator.style.alignItems = 'center';
        loadingIndicator.style.background = 'transparent';
        loadingIndicator.style.zIndex = '1000';
        loadingIndicator.style.transition = 'opacity 0.5s ease';
        
        // Добавляем текст
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.style.fontSize = '3.5rem';
        loadingText.style.fontWeight = 'bold';
        loadingText.style.background = 'linear-gradient(90deg, #00c2ff, #33ff8c, #ffc640, #e54cff, #00c2ff)';
        loadingText.style.backgroundSize = '400% 100%';
        loadingText.style.webkitBackgroundClip = 'text';
        loadingText.style.backgroundClip = 'text';
        loadingText.style.color = 'transparent';
        loadingText.style.textAlign = 'center';
        loadingText.style.lineHeight = '1.2';
        loadingText.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        loadingText.style.zIndex = '1001';
        loadingText.textContent = 'IkuzaChat';
        
        const loadingSubtext = document.createElement('div');
        loadingSubtext.className = 'loading-subtext';
        loadingSubtext.style.marginTop = '20px';
        loadingSubtext.style.fontSize = '1.2rem';
        loadingSubtext.style.color = '#a0a0a0';
        loadingSubtext.style.textAlign = 'center';
        loadingSubtext.style.maxWidth = '80%';
        loadingSubtext.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.3)';
        loadingSubtext.style.zIndex = '1001';
        loadingSubtext.textContent = 'Загрузка ресурсов чата...';
        
        loadingIndicator.appendChild(loadingText);
        loadingIndicator.appendChild(loadingSubtext);
        
        // Добавляем индикатор в body
        document.body.appendChild(loadingIndicator);
    }
    
    // Добавляем CSS анимацию
    const style = document.createElement('style');
    style.textContent = `
        @keyframes load {
            0% {
                opacity: 0.08;
                filter: blur(5px);
                letter-spacing: 3px;
                transform: scale(0.95);
            }
            50% {
                opacity: 0.7;
                filter: blur(1px);
                letter-spacing: 1px;
                transform: scale(1);
            }
            100% {
                opacity: 1;
                filter: blur(0);
                letter-spacing: 0;
                transform: scale(1.02);
            }
        }
        
        @keyframes gradientFlow {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
        
        .loading-text {
            animation: load 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1), 
                       gradientFlow 15s ease infinite;
            animation-direction: alternate;
            will-change: opacity, filter, letter-spacing, transform;
        }
        
        .loading-subtext {
            animation: load 2.2s infinite cubic-bezier(0.4, 0, 0.2, 1);
            animation-direction: alternate;
            will-change: opacity, filter, letter-spacing;
        }
        
        /* Эффект мерцания для градиента */
        .loading-text::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                90deg, 
                rgba(255,255,255,0) 0%, 
                rgba(255,255,255,0.1) 20%, 
                rgba(255,255,255,0) 40%
            );
            opacity: 0;
            animation: shimmer 3s infinite;
            pointer-events: none;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 0.3; }
            100% { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Устанавливаем функцию обновления статуса
    window.updateLoadingStatus = function(message) {
        const loadingSubtext = document.querySelector('.loading-subtext');
        if (loadingSubtext) {
            loadingSubtext.textContent = message;
        }
    };
})();