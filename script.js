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
                    <img src="${this.userInfo.avatar_url}" alt="Avatar" />
                    ${this.userInfo.verified ? '<div class="verified-badge">✓</div>' : ''}
                </div>
                <div class="user-details">
                    <div class="user-name">
                        ${this.userInfo.display_name}
                        ${this.userInfo.verified ? '<span class="verified">✓</span>' : ''}
                    </div>
                    <div class="user-handle">${this.userInfo.username}</div>
                    <div class="user-bio">${this.userInfo.bio}</div>
                </div>
            </div>
            <div class="user-stats">
                <div class="stat-item">
                    <div class="stat-number">${this.formatNumber(this.userInfo.follower_count)}</div>
                    <div class="stat-label">Seguidores</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${this.formatNumber(this.userInfo.following_count)}</div>
                    <div class="stat-label">Siguiendo</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${this.formatNumber(this.userInfo.likes_count)}</div>
                    <div class="stat-label">Likes</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${this.formatNumber(this.userInfo.video_count)}</div>
                    <div class="stat-label">Videos</div>
                </div>
            </div>
        `;
    }

    updateAuthStatus(isActive) {
        const statusText = document.getElementById('status-text');
        const authButton = document.getElementById('auth-button');

        if (isActive) {
            statusText.innerHTML = this.isLive ? 
                '<span class="live-indicator">🔴 EN VIVO</span>' : 
                '<span class="ready-indicator">🟢 Listo</span>';
            authButton.textContent = this.isLive ? '⏹️ Terminar Live' : '🔴 Iniciar Live';
        } else {
            statusText.innerHTML = '<span class="offline-indicator">⚫ Desconectado</span>';
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
            <div class="comment" data-comment-id="${comment.id}">
                <div class="comment-header">
                    <span class="comment-user">@${comment.user}</span>
                    <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-likes">❤️ ${comment.likes || 0}</div>
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

    init() {
        this.setupEventListeners();
        this.updateAuthStatus();
        this.handleCallback();
        
        if (this.accessToken) {
            this.startDashboard();
        }
    }

    setupEventListeners() {
        const authButton = document.getElementById('auth-button');
        authButton.addEventListener('click', () => this.authenticate());
    }

    updateAuthStatus() {
        const statusText = document.getElementById('status-text');
        const authButton = document.getElementById('auth-button');

        if (this.accessToken) {
            statusText.textContent = '✅ Autorizado';
            authButton.textContent = '🔄 Renovar autorización';
        } else {
            statusText.textContent = '❌ No autorizado';
            authButton.textContent = '🔐 Autorizar con TikTok';
        }
    }

    authenticate() {
        const authUrl = this.buildAuthUrl();
        window.location.href = authUrl;
    }

    buildAuthUrl() {
        const params = new URLSearchParams({
            client_key: CONFIG.TIKTOK.CLIENT_KEY,
            scope: CONFIG.TIKTOK.SCOPES,
            response_type: 'code',
            redirect_uri: CONFIG.TIKTOK.REDIRECT_URI,
            state: this.generateState()
        });

        return `${CONFIG.API.AUTH_URL}?${params.toString()}`;
    }

    generateState() {
        const state = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
        localStorage.setItem('oauth_state', state);
        return state;
    }

    async handleCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');

        if (error) {
            this.showAlert(`❌ Error de autorización: ${error}`);
            return;
        }

        if (code) {
            const savedState = localStorage.getItem('oauth_state');
            if (state !== savedState) {
                this.showAlert('❌ Error de seguridad en la autorización');
                return;
            }

            this.showLoading('Obteniendo token de acceso...');
            
            try {
                await this.exchangeCodeForToken(code);
                this.hideLoading();
                this.showAlert('🎉 ¡Autorización exitosa!');
                
                // Limpiar URL
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Iniciar dashboard
                this.startDashboard();
            } catch (error) {
                this.hideLoading();
                this.showAlert(`❌ Error al obtener token: ${error.message}`);
            }
        }
    }

    async exchangeCodeForToken(code) {
        // ⚠️ IMPORTANTE: En un entorno real, esto debe hacerse en el backend
        // GitHub Pages es solo frontend, así que simularemos la respuesta
        
        // Para desarrollo, almacenamos un token ficticio
        const mockToken = 'mock_access_token_' + Date.now();
        this.accessToken = mockToken;
        localStorage.setItem('tiktok_access_token', mockToken);
        
        // En producción, harías esto:
        /*
        const response = await fetch(CONFIG.API.TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_key: CONFIG.TIKTOK.CLIENT_KEY,
                client_secret: CONFIG.TIKTOK.CLIENT_SECRET, // Esto DEBE estar en el backend
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: CONFIG.TIKTOK.REDIRECT_URI
            })
        });

        const data = await response.json();
        
        if (data.access_token) {
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            localStorage.setItem('tiktok_access_token', this.accessToken);
            localStorage.setItem('tiktok_refresh_token', this.refreshToken);
        } else {
            throw new Error(data.error_description || 'Error desconocido');
        }
        */
    }

    async startDashboard() {
        this.updateAuthStatus();
        
        try {
            await this.loadUserInfo();
            this.startStatsUpdates();
        } catch (error) {
            console.error('Error starting dashboard:', error);
            this.showAlert('❌ Error al cargar el dashboard');
        }
    }

    async loadUserInfo() {
        this.showLoading('Cargando información del usuario...');
        
        try {
            // Simulamos datos de usuario para desarrollo
            this.userInfo = {
                display_name: 'Usuario Demo',
                follower_count: 12500,
                following_count: 234,
                likes_count: 89750,
                avatar_url: 'https://via.placeholder.com/100x100/ff0050/ffffff?text=👤'
            };
            
            this.updateUserInfo();
            this.hideLoading();
            
            // En producción, harías esto:
            /*
            const response = await fetch(`${CONFIG.API.USER_INFO_URL}?access_token=${this.accessToken}&fields=display_name,follower_count,following_count,likes_count,avatar_url`);
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }
            
            this.userInfo = data.data;
            this.updateUserInfo();
            */
        } catch (error) {
            this.hideLoading();
            throw error;
        }
    }

    updateUserInfo() {
        const userInfoElement = document.getElementById('user-info');
        userInfoElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                <img src="${this.userInfo.avatar_url}" alt="Avatar" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--secondary-color);">
                <div>
                    <div style="font-weight: bold; font-size: 1.2rem;">${this.userInfo.display_name}</div>
                    <div style="opacity: 0.8;">@usuario_demo</div>
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem;">
                <div>👥 ${this.formatNumber(this.userInfo.follower_count)} seguidores</div>
                <div>➕ ${this.formatNumber(this.userInfo.following_count)} siguiendo</div>
                <div style="grid-column: 1 / -1;">❤️ ${this.formatNumber(this.userInfo.likes_count)} likes totales</div>
            </div>
        `;
    }

    startStatsUpdates() {
        this.updateStats();
        
        // Actualizar cada 5 segundos
        setInterval(() => {
            this.updateStats();
        }, CONFIG.DASHBOARD.UPDATE_INTERVAL);
    }

    async updateStats() {
        try {
            // Simulamos estadísticas en tiempo real para desarrollo
            this.generateMockStats();
            this.updateUI();
            this.checkForAlerts();
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    generateMockStats() {
        // Simular cambios realistas en las estadísticas
        const now = Date.now();
        
        // Viewers fluctúan
        this.stats.viewers = Math.max(0, this.stats.viewers + Math.floor(Math.random() * 20 - 10));
        if (this.stats.viewers === 0) this.stats.viewers = Math.floor(Math.random() * 100) + 50;
        
        // Likes aumentan gradualmente
        if (Math.random() < 0.7) {
            this.stats.likes += Math.floor(Math.random() * 5) + 1;
        }
        
        // Seguidores aumentan ocasionalmente
        if (Math.random() < 0.1) {
            this.stats.follows += Math.floor(Math.random() * 3) + 1;
        }
        
        // Shares ocasionales
        if (Math.random() < 0.05) {
            this.stats.shares += 1;
        }
        
        // Generar comentarios ficticios
        if (Math.random() < 0.3) {
            const mockComments = [
                'Increíble contenido! 🔥',
                'Me encanta tu stream!',
                'Saludos desde México! 🇲🇽',
                'Más contenido así por favor',
                'Eres el mejor! ⭐',
                'Qué buena música!',
                'Tutorial por favor! 🙏',
                'Increíble talento'
            ];
            
            const mockUsers = ['Usuario123', 'FanTikTok', 'StreamLover', 'ContentFan', 'ViewerPro'];
            
            this.stats.comments.unshift({
                user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
                comment: mockComments[Math.floor(Math.random() * mockComments.length)],
                timestamp: now
            });
            
            // Mantener solo los últimos 10 comentarios
            if (this.stats.comments.length > CONFIG.DASHBOARD.MAX_COMMENTS) {
                this.stats.comments = this.stats.comments.slice(0, CONFIG.DASHBOARD.MAX_COMMENTS);
            }
        }
    }

    updateUI() {
        // Actualizar contadores
        this.updateCounter('viewers-count', this.stats.viewers);
        this.updateCounter('likes-count', this.stats.likes);
        this.updateCounter('follows-count', this.stats.follows);
        this.updateCounter('shares-count', this.stats.shares);
        
        // Actualizar comentarios
        this.updateComments();
    }

    updateCounter(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = this.formatNumber(value);
        }
    }

    updateComments() {
        const commentsList = document.getElementById('comments-list');
        
        if (this.stats.comments.length === 0) {
            commentsList.innerHTML = '<div class="no-data">Esperando comentarios...</div>';
            return;
        }
        
        commentsList.innerHTML = this.stats.comments.map(comment => `
            <div class="comment">
                <div class="comment-user">@${comment.user}</div>
                <div class="comment-text">${comment.comment}</div>
            </div>
        `).join('');
    }

    checkForAlerts() {
        // Alerta por nuevos seguidores
        if (this.stats.follows > this.lastStats.follows) {
            const newFollows = this.stats.follows - this.lastStats.follows;
            this.showAlert(`🎉 ¡${newFollows} nuevo${newFollows > 1 ? 's' : ''} seguidor${newFollows > 1 ? 'es' : ''}!`);
        }
        
        // Alerta por hitos de likes
        const likesThreshold = CONFIG.ALERTS.LIKE_THRESHOLD;
        if (Math.floor(this.stats.likes / likesThreshold) > Math.floor(this.lastStats.likes / likesThreshold)) {
            this.showAlert(`❤️ ¡${this.formatNumber(this.stats.likes)} likes alcanzados!`);
        }
        
        // Actualizar stats anteriores
        this.lastStats = { ...this.stats };
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
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new TikTokDashboard();
});

export default TikTokDashboard;
