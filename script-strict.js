import CONFIG from './config-real-strict.js';
import TikTokRealStrictAPI from './tiktok-real-strict-api.js';

class TikTokStrictDashboard {
    constructor() {
        this.api = new TikTokRealStrictAPI(CONFIG);
        this.userInfo = null;
        this.lastStats = {};
        this.updateInterval = null;
        this.isLive = false;
        this.errorState = false;
        this.currentError = null;
        
        console.log('🔴 TikTok Strict Dashboard - SOLO DATOS REALES');
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.showLoading('🔍 Obteniendo SOLO datos reales de TikTok...');
        
        try {
            await this.loadRealUserInfo();
            this.hideLoading();
            this.showAlert('✅ ¡Datos reales obtenidos exitosamente!');
            this.updateAuthStatus(true);
        } catch (error) {
            this.hideLoading();
            this.handleError(error, 'inicialización');
        }
    }

    setupEventListeners() {
        const authButton = document.getElementById('auth-button');
        authButton.addEventListener('click', () => this.handleAuthButtonClick());
        
        // Botón para reintentar manualmente
        const retryButton = document.createElement('button');
        retryButton.textContent = '🔄 Reintentar Datos Reales';
        retryButton.className = 'retry-btn';
        retryButton.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(255, 68, 68, 0.9);
            border: none;
            border-radius: 25px;
            padding: 12px 24px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(10px);
            display: none;
        `;
        document.body.appendChild(retryButton);
        
        retryButton.addEventListener('click', () => this.retryRealData());
        
        // Botón para mostrar errores detallados
        const errorButton = document.createElement('button');
        errorButton.textContent = '🔍 Ver Errores Detallados';
        errorButton.className = 'error-details-btn';
        errorButton.style.cssText = `
            position: fixed;
            top: 130px;
            right: 20px;
            background: rgba(255, 152, 0, 0.9);
            border: none;
            border-radius: 25px;
            padding: 12px 24px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(10px);
            display: none;
        `;
        document.body.appendChild(errorButton);
        
        errorButton.addEventListener('click', () => this.showDetailedErrors());
        
        // Referencias para mostrar/ocultar botones
        this.retryButton = retryButton;
        this.errorButton = errorButton;
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r' && e.ctrlKey) {
                e.preventDefault();
                this.retryRealData();
            }
            if (e.key === 'e' && e.ctrlKey) {
                e.preventDefault();
                this.showDetailedErrors();
            }
        });
    }

    async loadRealUserInfo() {
        console.log('🔄 Cargando información real del usuario...');
        
        try {
            this.userInfo = await this.api.getUserData(CONFIG.TARGET_USER.username);
            this.updateUserInfoUI();
            this.errorState = false;
            this.hideErrorButtons();
            console.log('✅ Información real cargada exitosamente');
        } catch (error) {
            this.errorState = true;
            this.currentError = error;
            throw error; // Re-throw para que sea manejado por el caller
        }
    }

    handleAuthButtonClick() {
        if (this.errorState) {
            // Si hay error, el botón funciona como retry
            this.retryRealData();
        } else if (this.isLive) {
            this.stopLive();
        } else {
            this.startLive();
        }
    }

    async startLive() {
        if (this.errorState) {
            this.showAlert('❌ No se puede iniciar live sin datos reales. Usar "Reintentar" primero.');
            return;
        }

        this.showLoading('📺 Verificando si el usuario está en vivo...');
        
        try {
            // Verificar si el usuario está realmente en vivo
            await this.api.getRealLiveStats(CONFIG.TARGET_USER.username);
            
            this.isLive = true;
            this.updateAuthStatus(true);
            
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            
            this.updateInterval = setInterval(() => {
                this.updateRealLiveStats();
            }, CONFIG.DASHBOARD.UPDATE_INTERVAL);
            
            this.hideLoading();
            this.showAlert('🔴 ¡Live real iniciado!');
            this.addSystemComment('🎉 ¡Live real de TikTok iniciado! Datos en tiempo real.');
            
        } catch (error) {
            this.hideLoading();
            this.handleError(error, 'iniciar live');
        }
    }

    stopLive() {
        this.isLive = false;
        this.updateAuthStatus(true);
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.showAlert('⏹️ Live terminado');
        this.addSystemComment('👋 Live terminado. Gracias por acompañarnos.');
    }

    async updateRealLiveStats() {
        if (!this.isLive || this.errorState) return;
        
        try {
            console.log('📊 Actualizando stats reales de live...');
            const currentStats = await this.api.getRealLiveStats(CONFIG.TARGET_USER.username);
            
            this.checkForAlerts(currentStats);
            this.updateStatsUI(currentStats);
            this.updateCommentsUI(currentStats.comments);
            
            this.lastStats = { ...currentStats };
            
        } catch (error) {
            console.error('❌ Error actualizando stats de live:', error);
            
            if (CONFIG.DASHBOARD.RETRY_ON_ERROR && this.shouldRetry(error)) {
                console.log('🔄 Reintentando en unos segundos...');
                setTimeout(() => {
                    if (this.isLive) this.updateRealLiveStats();
                }, CONFIG.ERROR_HANDLING.ERROR_RETRY_DELAY);
            } else {
                this.handleError(error, 'actualizar estadísticas de live');
                this.stopLive();
            }
        }
    }

    async retryRealData() {
        this.showLoading('🔄 Reintentando obtener datos reales...');
        this.currentError = null;
        
        try {
            await this.loadRealUserInfo();
            this.hideLoading();
            this.showAlert('✅ ¡Datos reales obtenidos en el reintento!');
            this.updateAuthStatus(true);
        } catch (error) {
            this.hideLoading();
            this.handleError(error, 'reintento de datos');
        }
    }

    handleError(error, context) {
        this.errorState = true;
        this.currentError = error;
        
        console.error(`❌ Error en ${context}:`, error);
        
        // Mostrar botones de error
        this.showErrorButtons();
        
        // Actualizar UI con estado de error
        this.updateErrorUI(error, context);
        
        // Mostrar alerta con error resumido
        const shortError = error.categoryText || error.message || 'Error desconocido';
        this.showAlert(`❌ ${shortError} - Ver detalles con Ctrl+E`, 8000);
        
        // Detener live si estaba activo
        if (this.isLive) {
            this.stopLive();
        }
    }

    updateErrorUI(error, context) {
        const userInfoElement = document.getElementById('user-info');
        const statusText = document.getElementById('status-text');
        const authButton = document.getElementById('auth-button');
        
        // Actualizar información del usuario con error
        userInfoElement.innerHTML = `
            <div class="error-state" style="
                padding: 20px;
                background: rgba(255, 68, 68, 0.1);
                border: 2px solid #ff4444;
                border-radius: 15px;
                text-align: center;
            ">
                <div style="font-size: 3rem; margin-bottom: 10px;">❌</div>
                <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 10px;">
                    Error en ${context}
                </div>
                <div style="margin-bottom: 15px; opacity: 0.9;">
                    ${error.categoryText || 'Error obteniendo datos reales'}
                </div>
                <div style="font-size: 0.9rem; opacity: 0.7; margin-bottom: 15px;">
                    Usuario objetivo: @${CONFIG.TARGET_USER.username}
                </div>
                <div style="font-size: 0.8rem; color: #ff4444;">
                    ${error.message || 'Error desconocido'}
                </div>
            </div>
        `;
        
        // Actualizar status
        statusText.innerHTML = '<span style="color: #ff4444;">❌ Error - Solo datos reales</span>';
        authButton.textContent = '🔄 Reintentar Datos Reales';
        
        // Limpiar stats
        this.updateStatsUI({
            viewers: 0,
            likes: 0,
            follows: 0,
            shares: 0
        });
        
        // Mostrar mensaje en comentarios
        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = `
            <div class="error-message" style="
                padding: 15px;
                background: rgba(255, 68, 68, 0.1);
                border-radius: 10px;
                text-align: center;
                color: #ff4444;
            ">
                ❌ No se pueden obtener comentarios sin datos reales<br>
                <small>Usar "Reintentar" para obtener datos reales</small>
            </div>
        `;
    }

    showDetailedErrors() {
        if (!this.currentError) {
            this.showAlert('ℹ️ No hay errores para mostrar');
            return;
        }
        
        const errorDetails = this.formatDetailedError(this.currentError);
        
        // Crear modal con errores detallados
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        modal.innerHTML = `
            <div style="
                background: rgba(26, 26, 26, 0.95);
                border: 2px solid #ff4444;
                border-radius: 20px;
                padding: 30px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                color: white;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #ff4444; margin: 0;">🔍 Errores Detallados</h2>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: none;
                        border: none;
                        color: #ff4444;
                        font-size: 1.5rem;
                        cursor: pointer;
                        padding: 5px;
                    ">✕</button>
                </div>
                <div style="font-family: monospace; font-size: 0.9rem;">
                    ${errorDetails}
                </div>
                <div style="margin-top: 20px; text-align: center;">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: #ff4444;
                        border: none;
                        border-radius: 15px;
                        padding: 10px 20px;
                        color: white;
                        font-weight: bold;
                        cursor: pointer;
                    ">Cerrar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    formatDetailedError(error) {
        let html = `
            <div style="margin-bottom: 15px;">
                <strong style="color: #ff4444;">Categoría:</strong> ${error.category}<br>
                <strong style="color: #ff4444;">Descripción:</strong> ${error.categoryText}<br>
                <strong style="color: #ff4444;">Usuario:</strong> @${error.username}<br>
                <strong style="color: #ff4444;">Método:</strong> ${error.method}<br>
                <strong style="color: #ff4444;">Timestamp:</strong> ${error.timestamp}
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong style="color: #ff6666;">Mensaje de Error:</strong><br>
                <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; margin-top: 5px;">
                    ${error.message}
                </div>
            </div>
        `;
        
        if (error.suggestions && error.suggestions.length > 0) {
            html += `
                <div style="margin-bottom: 15px;">
                    <strong style="color: #ffaa00;">Sugerencias:</strong><br>
                    <ul style="margin: 5px 0; padding-left: 20px;">
                        ${error.suggestions.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (error.allErrors && error.allErrors.length > 0) {
            html += `
                <div>
                    <strong style="color: #ff8888;">Todos los errores (${error.allErrors.length}):</strong><br>
                    <div style="background: rgba(0,0,0,0.5); padding: 10px; border-radius: 5px; margin-top: 5px; max-height: 200px; overflow-y: auto;">
                        ${error.allErrors.map(e => `
                            <div style="margin-bottom: 5px; padding: 5px; border-left: 2px solid #ff4444;">
                                <strong>[${e.category}]</strong> ${e.message}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        return html;
    }

    shouldRetry(error) {
        const nonRetryableErrors = ['API_KEY_ERROR', 'USER_NOT_FOUND'];
        return !nonRetryableErrors.includes(error.category);
    }

    showErrorButtons() {
        this.retryButton.style.display = 'block';
        this.errorButton.style.display = 'block';
    }

    hideErrorButtons() {
        this.retryButton.style.display = 'none';
        this.errorButton.style.display = 'none';
    }

    updateUserInfoUI() {
        const userInfoElement = document.getElementById('user-info');
        if (!this.userInfo) return;
        
        userInfoElement.innerHTML = `
            <div class="real-data-indicator" style="
                position: absolute;
                top: 10px;
                right: 10px;
                background: #ff4444;
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: bold;
                animation: pulse 2s infinite;
            ">
                🔴 DATOS REALES
            </div>
            
            <div class="user-profile">
                <div class="user-avatar">
                    <img src="${this.userInfo.avatar_url}" alt="Avatar" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #ff4444;" />
                    ${this.userInfo.verified ? '<div class="verified-badge" style="position: absolute; bottom: 0; right: 0; background: #00f2ea; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px;">✓</div>' : ''}
                </div>
                <div class="user-details">
                    <div class="user-name" style="font-weight: bold; font-size: 1.2rem;">
                        ${this.userInfo.display_name}
                        ${this.userInfo.verified ? '<span class="verified" style="color: #00f2ea; margin-left: 5px;">✓</span>' : ''}
                    </div>
                    <div class="user-handle" style="opacity: 0.8;">@${this.userInfo.username}</div>
                    <div class="user-bio" style="margin-top: 10px; font-size: 0.9rem; opacity: 0.9;">${this.userInfo.bio}</div>
                    <div class="data-source-info" style="margin-top: 10px; font-size: 0.8rem; opacity: 0.7;">
                        Fuente: ${this.userInfo.source} | ${new Date(this.userInfo.timestamp).toLocaleString()}
                    </div>
                </div>
            </div>
            <div class="user-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-number" style="font-weight: bold; color: #ff4444;">${this.formatNumber(this.userInfo.follower_count)}</div>
                    <div class="stat-label" style="font-size: 0.8rem; opacity: 0.8;">Seguidores</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-number" style="font-weight: bold; color: #ff4444;">${this.formatNumber(this.userInfo.following_count)}</div>
                    <div class="stat-label" style="font-size: 0.8rem; opacity: 0.8;">Siguiendo</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-number" style="font-weight: bold; color: #ff4444;">${this.formatNumber(this.userInfo.likes_count)}</div>
                    <div class="stat-label" style="font-size: 0.8rem; opacity: 0.8;">Likes</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-number" style="font-weight: bold; color: #ff4444;">${this.formatNumber(this.userInfo.video_count)}</div>
                    <div class="stat-label" style="font-size: 0.8rem; opacity: 0.8;">Videos</div>
                </div>
            </div>
        `;
    }

    updateAuthStatus(isActive) {
        const statusText = document.getElementById('status-text');
        const authButton = document.getElementById('auth-button');

        if (this.errorState) {
            statusText.innerHTML = '<span style="color: #ff4444;">❌ Error - Solo datos reales</span>';
            authButton.textContent = '🔄 Reintentar Datos Reales';
        } else if (isActive) {
            statusText.innerHTML = this.isLive ? 
                '<span style="color: #ff4444;">🔴 EN VIVO REAL</span>' : 
                '<span style="color: #4caf50;">🟢 Listo (Datos Reales)</span>';
            authButton.textContent = this.isLive ? '⏹️ Terminar Live Real' : '🔴 Iniciar Live Real';
        } else {
            statusText.innerHTML = '<span style="color: #666;">⚫ Desconectado</span>';
            authButton.textContent = '🔄 Obtener Datos Reales';
        }
    }

    updateStatsUI(stats) {
        this.updateCounter('viewers-count', stats.viewers || 0);
        this.updateCounter('likes-count', stats.likes || 0);
        this.updateCounter('follows-count', stats.follows || 0);
        this.updateCounter('shares-count', stats.shares || 0);
    }

    updateCounter(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            if (this.errorState) {
                element.textContent = '—';
                element.style.color = '#666';
            } else {
                element.style.transform = 'scale(1.1)';
                element.style.color = '#ff4444';
                element.textContent = this.formatNumber(value);
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                    element.style.color = '';
                }, 200);
            }
        }
    }

    updateCommentsUI(comments) {
        const commentsList = document.getElementById('comments-list');
        
        if (this.errorState || !comments || comments.length === 0) {
            commentsList.innerHTML = '<div class="no-data">Esperando datos reales de comentarios...</div>';
            return;
        }
        
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment" data-comment-id="${comment.id}" style="${comment.isSystem ? 'background: rgba(255, 68, 68, 0.1); border-left-color: #ff4444;' : ''}">
                <div class="comment-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <span class="comment-user" style="font-weight: bold; color: ${comment.isSystem ? '#ff4444' : 'var(--secondary-color)'};">@${comment.user}</span>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="comment-time" style="font-size: 0.8rem; opacity: 0.6;">${this.formatTime(comment.timestamp)}</span>
                        <span style="color: #ff4444; font-size: 0.7rem;" title="Datos reales">●</span>
                    </div>
                </div>
                <div class="comment-text" style="margin-bottom: 5px;">${comment.text}</div>
                <div class="comment-likes" style="font-size: 0.8rem; opacity: 0.7;">❤️ ${comment.likes || 0}</div>
            </div>
        `).join('');
    }

    addSystemComment(text) {
        // Solo agregar comentarios del sistema si no hay error
        if (this.errorState) return;
        
        const systemComment = {
            id: 'system_' + Date.now(),
            user: 'Sistema',
            text: text,
            timestamp: Date.now(),
            likes: 0,
            isSystem: true
        };
        
        // Crear lista de comentarios si no existe
        if (!this.lastStats.comments) {
            this.lastStats.comments = [];
        }
        
        this.lastStats.comments.unshift(systemComment);
        this.updateCommentsUI(this.lastStats.comments);
    }

    checkForAlerts(currentStats) {
        if (this.errorState) return;
        
        // Alerta por nuevos seguidores
        if (this.lastStats.follows && currentStats.follows > this.lastStats.follows) {
            const newFollows = currentStats.follows - this.lastStats.follows;
            this.showAlert(`🎉 ¡${newFollows} nuevo${newFollows > 1 ? 's' : ''} seguidor${newFollows > 1 ? 'es' : ''}! (REAL)`);
        }
        
        // Alerta por hitos de likes
        const threshold = CONFIG.DASHBOARD.THRESHOLDS.LIKES_MILESTONE;
        const likesMilestone = Math.floor(currentStats.likes / threshold) * threshold;
        const lastLikesMilestone = Math.floor((this.lastStats.likes || 0) / threshold) * threshold;
        
        if (likesMilestone > lastLikesMilestone && likesMilestone > 0) {
            this.showAlert(`❤️ ¡${this.formatNumber(likesMilestone)} likes reales alcanzados!`);
        }
        
        // Alerta por pico de viewers
        const viewerThreshold = CONFIG.DASHBOARD.THRESHOLDS.VIEWER_PEAK;
        if (currentStats.viewers > (this.lastStats.viewers || 0) + viewerThreshold) {
            this.showAlert(`👥 ¡Pico de ${currentStats.viewers} espectadores reales!`);
        }
    }

    showAlert(message, duration = null) {
        const alertOverlay = document.getElementById('alert-overlay');
        const alertText = document.getElementById('alert-text');
        
        alertText.textContent = message;
        alertOverlay.classList.add('show');
        
        setTimeout(() => {
            alertOverlay.classList.remove('show');
        }, duration || CONFIG.DASHBOARD.ALERT_DURATION);
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

// Inicializar la aplicación estricta
document.addEventListener('DOMContentLoaded', () => {
    new TikTokStrictDashboard();
});

export default TikTokStrictDashboard;
