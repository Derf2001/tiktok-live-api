// Configuración de la aplicación TikTok
const CONFIG = {
    // Tu configuración de TikTok Developers
    TIKTOK: {
        CLIENT_KEY: 'aw4y40bznp0oipbm',
        CLIENT_SECRET: 'QCbezE5nwNXBq2CKEsuwvrA1EgJbKeq0',
        // URL actualizada con tu usuario real
        REDIRECT_URI: 'https://derf2001.github.io/tiktok-live-api/callback.html',
        SCOPES: 'user.info.basic,user.info.profile,user.info.stats,video.list'
    },
    
    // URLs del API de TikTok
    API: {
        BASE_URL: 'https://open-api.tiktok.com',
        AUTH_URL: 'https://www.tiktok.com/auth/authorize/',
        TOKEN_URL: 'https://open-api.tiktok.com/oauth/access_token/'
    },
    
    GITHUB_PAGES: {
        BASE_URL: 'https://derf2001.github.io/tiktok-live-api'
    }
};

// ⚠️ IMPORTANTE: En producción, el CLIENT_SECRET debe manejarse en el backend
// GitHub Pages es solo frontend, así que usaremos un approach diferente

export default CONFIG;
