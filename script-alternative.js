import CONFIG from './config.js';
import TikTokAlternativeAPI from './tiktok-alternative-api.js';

class TikTokDashboard {
    constructor() {
        this.api = new TikTokAlternativeAPI(CONFIG);
        this.userInfo = null;
        this.lastStats = {};
        this.updateInterval = null;
        this.isLive = false;
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.showLoading('Iniciando dashboard...');
        
        try {
            await this.loadUserInfo();
            this.startLiveSimulation();
            this.hideLoading();
            this.showAlert('🎉 ¡Dashboard iniciado correctamente!');
        } catch (error) {
            this.hideLoading();
            this.showAlert('❌ Error al iniciar: ' + error.message);
        }
    }

    setupEventListeners() {
        const authButton = document.getElementById('auth-button');
        authButton.addEventListener('click', () => this.toggleLiveMode());
        
        // Botón para reset de sesión
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.resetSession();
            }
        });
    }

    async loadUserInfo() {
        this.showLoading('Obteniendo información del usuario...');
        
        try {
            this.userInfo = await this.api.getUserData(CONFIG.TARGET_USER.username);
            this.updateUserInfoUI();
            this.updateAuthStatus(true);
        } catch (error) {
            console.error('Error loading user info:', error);
            throw error;
        }
    }

    updateUserInfoUI() {
        const userInfoElement = document.getElementById('user-info');
        if (!this.userInfo) return;
        
        userInfoElement.innerHTML = `
            <div class="user-profile">
                <div class="user-avatar">
                    <img src="${this.userInfo.avatar_url}" alt="Avatar" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--secondary-color);" />
                    ${this.userInfo.verified ? '<div class="verified-badge" style="position: absolute; bottom: 0; right: 0; background: #00f2ea; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px;">✓</div>' : ''}
                </div>
                <div class="user-details">
                    <div class="user-name" style="font-weight: bold; font-size: 1.2rem;">
                        ${this.userInfo.display_name}
                        ${this.userInfo.verified ? '<span class="verified" style="color: #00f2ea; margin-left: 5px;">✓</span>' : ''}
                    </div>
                    <div class="user-handle" style="opacity: 0.8;">${this.userInfo.username}</div>
                    <div class="user-bio" style="margin-top: 10px; font-size: 0.9rem; opacity: 0.9;">${this.userInfo.bio}</div>
                </div>
            </div>
            <div class="user-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-number" style="font-weight: bold; color: #00f2ea;">${this.formatNumber(this.userInfo.follower_count)}</div>
                    <div class="stat-label" style="font-size: 0.8rem; opacity: 0.8;">Seguidores</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-number" style="font-weight: bold; color: #00f2ea;">${this.formatNumber(this.userInfo.following_count)}</div>
                    <div class="stat-label" style="font-size: 0.8rem; opacity: 0.8;">Siguiendo</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-number" style="font-weight: bold; color: #00f2ea;">${this.formatNumber(this.userInfo.likes_count)}</div>
                    <div class="stat-label" style="font-size: 0.8rem; opacity: 0.8;">Likes</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-number" style="font-weight: bold; color: #00f2ea;">${this.formatNumber(this.userInfo.video_count)}</div>
                    <div class="stat-label" style="font-size: 0.8rem; opacity: 0.8;">Videos</div>
                </div>
            </div>
        `;
    }

    updateAuthStatus(isActive) {
        const statusText = document.getElementById('status-text');
        const authButton = document.getElementById('auth-button');

        if (isActive) {
            statusText.innerHTML = this.isLive ? 
                '<span class="live-indicator" style="color: #ff0050;">🔴 EN VIVO</span>' : 
                '<span class="ready-indicator" style="color: #4caf50;">🟢 Listo</span>';
            authButton.textContent = this.isLive ? '⏹️ Terminar Live' : '🔴 Iniciar Live';
        } else {
            statusText.innerHTML = '<span class="offline-indicator" style="color: #666;">⚫ Desconectado</span>';
            authButton.textContent = '🔄 Reconectar';
        }
    }

    toggleLiveMode() {
        if (this.isLive) {
            this.stopLive();
        } else {
            this.startLive();
        }
    }

    startLive() {
        this.isLive = true;
        this.updateAuthStatus(true);
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        this.updateInterval = setInterval(() => {
            this.updateLiveStats();
        }, CONFIG.DASHBOARD.UPDATE_INTERVAL);
        
        this.showAlert('🔴 ¡Live iniciado!');
        this.addSystemComment('🎉 ¡El live ha comenzado! ¡Bienvenidos!');
    }

    stopLive() {
        this.isLive = false;
        this.updateAuthStatus(true);
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.showAlert('⏹️ Live terminado');
        this.addSystemComment('👋 ¡Gracias por acompañarnos! Hasta la próxima.');
    }

    startLiveSimulation() {
        // Simular que ya estamos en vivo
        this.startLive();
    }

    updateLiveStats() {
        if (!this.isLive) return;
        
        const currentStats = this.api.updateLiveStats();
        this.checkForAlerts(currentStats);
        this.updateStatsUI(currentStats);
        this.updateCommentsUI(currentStats.comments);
        
        this.lastStats = { ...currentStats };
    }

    updateStatsUI(stats) {
        this.updateCounter('viewers-count', stats.viewers);
        this.updateCounter('likes-count', stats.likes);
        this.updateCounter('follows-count', stats.follows);
        this.updateCounter('shares-count', stats.shares);
    }

    updateCounter(elementId, value) {
        const element = document.getElementById(elementId);
        if (element && element.textContent !== this.formatNumber(value)) {
            // Animación de cambio
            element.style.transform = 'scale(1.1)';
            element.style.color = '#00f2ea';
            element.textContent = this.formatNumber(value);
            
            setTimeout(() => {
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 200);
        }
    }

    updateCommentsUI(comments) {
        const commentsList = document.getElementById('comments-list');
        
        if (!comments || comments.length === 0) {
            commentsList.innerHTML = '<div class="no-data">Esperando comentarios...</div>';
            return;
        }
        
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment" data-comment-id="${comment.id}" style="${comment.isSystem ? 'background: rgba(0, 242, 234, 0.1); border-left-color: #00f2ea;' : ''}">
                <div class="comment-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <span class="comment-user" style="font-weight: bold; color: ${comment.isSystem ? '#00f2ea' : 'var(--secondary-color)'};">@${comment.user}</span>
                    <span class="comment-time" style="font-size: 0.8rem; opacity: 0.6;">${this.formatTime(comment.timestamp)}</span>
                </div>
                <div class="comment-text" style="margin-bottom: 5px;">${comment.text}</div>
                <div class="comment-likes" style="font-size: 0.8rem; opacity: 0.7;">❤️ ${comment.likes || 0}</div>
            </div>
        `).join('');
    }

    addSystemComment(text) {
        const systemComment = {
            id: 'system_' + Date.now(),
            user: 'Sistema',
            text: text,
            timestamp: Date.now(),
            likes: 0,
            isSystem: true
        };
        
        this.api.stats.comments.unshift(systemComment);
    }

    checkForAlerts(currentStats) {
        // Alerta por nuevos seguidores
        if (this.lastStats.follows && currentStats.follows > this.lastStats.follows) {
            const newFollows = currentStats.follows - this.lastStats.follows;
            this.showAlert(`🎉 ¡${newFollows} nuevo${newFollows > 1 ? 's' : ''} seguidor${newFollows > 1 ? 'es' : ''}!`);
        }
        
        // Alerta por hitos de likes
        const likesMilestone = Math.floor(currentStats.likes / 100) * 100;
        const lastLikesMilestone = Math.floor((this.lastStats.likes || 0) / 100) * 100;
        
        if (likesMilestone > lastLikesMilestone && likesMilestone > 0) {
            this.showAlert(`❤️ ¡${this.formatNumber(likesMilestone)} likes alcanzados!`);
        }
        
        // Alerta por pico de viewers
        if (currentStats.viewers > (this.lastStats.viewers || 0) + 20) {
            this.showAlert(`👥 ¡Pico de ${currentStats.viewers} espectadores!`);
        }
    }

    resetSession() {
        this.api.resetLiveSession();
        this.showAlert('🔄 Sesión reiniciada');
    }

    showAlert(message) {
        const alertOverlay = document.getElementById('alert-overlay');
        const alertText = document.getElementById('alert-text');
        
        alertText.textContent = message;
        alertOverlay.classList.add('show');
        
        setTimeout(() => {
            alertOverlay.classList.remove('show');
        }, CONFIG.DASHBOARD.ALERT_DURATION);
    }

    showLoading(message = 'Cargando...') {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingText = document.querySelector('.loading-text');
        
        loadingText.textContent = message;
        loadingOverlay.classList.add('show');
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.remove('show');
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    formatTime(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const seconds = Math.floor(diff / 1000);
        
        if (seconds < 60) return 'ahora';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
        return `${Math.floor(seconds / 3600)}h`;
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new TikTokDashboard();
});

export default TikTokDashboard;
