// Configuración de la aplicación TikTok
const CONFIG = {
    // Tu configuración de TikTok Developers
    TIKTOK: {
        CLIENT_KEY: 'aw4y40bznp0oipbm',
        CLIENT_SECRET: 'QCbezE5nwNXBq2CKEsuwvrA1EgJbKeq0', // Solo para referencia, NO uses en producción
        REDIRECT_URI: 'https://tu-usuario.github.io/tiktok-live-api/callback.html',
        SCOPES: 'user.info.basic,user.info.profile,user.info.stats'
    },
    
    // URLs del API de TikTok
    API: {
        AUTH_URL: 'https://www.tiktok.com/auth/authorize/',
        TOKEN_URL: 'https://open-api.tiktok.com/oauth/access_token/',
        USER_INFO_URL: 'https://open-api.tiktok.com/user/info/',
        VIDEO_LIST_URL: 'https://open-api.tiktok.com/video/list/'
    },
    
    // Configuración del dashboard
    DASHBOARD: {
        UPDATE_INTERVAL: 5000, // 5 segundos
        ALERT_DURATION: 3000,  // 3 segundos
        MAX_COMMENTS: 10       // Máximo de comentarios mostrados
    },
    
    // Configuración de alertas
    ALERTS: {
        FOLLOW_THRESHOLD: 1,    // Alerta por cada nuevo seguidor
        LIKE_THRESHOLD: 100,    // Alerta cada 100 likes
        VIEWER_THRESHOLD: 50    // Alerta cada 50 espectadores nuevos
    }
};

// ⚠️ IMPORTANTE: En producción, el CLIENT_SECRET debe manejarse en el backend
// GitHub Pages es solo frontend, así que usaremos un approach diferente

export default CONFIG;
