// Configuración para datos REALES de TikTok
const CONFIG = {
    // 🎯 Modo real - Con datos reales de TikTok
    MODE: 'real', // 'alternative', 'real', 'hybrid'
    
    // Usuario objetivo para obtener datos REALES
    TARGET_USER: {
        username: 'Jassy_gg', // Usuario real popular para pruebas
        display_name: 'Jassy_gg',
        tiktok_id: 'Jassy_gg'
    },
    
    // APIs para datos reales
    REAL_API: {
        // Claves de APIs externas (opcionales)
        RAPIDAPI_KEY: '0ba5cdb6d7mshe298cee90a4ff9fp116182jsnf2c985f3466f', // Agregar si tienes una key de RapidAPI
        SCRAPER_API_KEY: null, // Para APIs de scraping premium
        
        // Endpoints para datos reales
        TIKTOK_SCRAPER: 'https://tiktok-scraper7.p.rapidapi.com',
        USER_INFO: 'https://tiktok-video-no-watermark2.p.rapidapi.com',
        LIVE_ROOM: 'https://tiktok-live-api.herokuapp.com',
        
        // ✅ AGREGAR ESTOS NUEVOS ENDPOINTS:
        BACKUP_ENDPOINTS: [
            'https://tiktok-video-feature-summary.p.rapidapi.com',
            'https://tiktok-scraper-2022.p.rapidapi.com',
            'https://tiktok.p.rapidapi.com'
        ],
        
        // Configuración de rate limiting
        RATE_LIMIT_MS: 2000, // 2 segundos entre requests
        MAX_RETRIES: 3,
        CACHE_DURATION: 300000 // 5 minutos
    },
    
    // APIs proxy para CORS
    CORS_PROXIES: [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest='
    ],
    
    // Configuración del dashboard
    DASHBOARD: {
        UPDATE_INTERVAL: 5000, // 5 segundos (más lento para datos reales)
        ALERT_DURATION: 4000,
        MAX_COMMENTS: 20, // Más comentarios para datos reales
        ANIMATION_SPEED: 300,
        
        // Umbrales para alertas
        THRESHOLDS: {
            NEW_FOLLOWERS: 1, // Alertar por cualquier nuevo seguidor
            LIKES_MILESTONE: 50, // Cada 50 likes
            VIEWER_PEAK: 10 // Pico de 10+ espectadores
        }
    },
    
    // Configuración de simulación realista
    LIVE_SIMULATOR: {
        ENABLED: true, // Habilitar cuando no hay live real
        BASE_VIEWERS: 50, // Basado en datos reales del perfil
        GROWTH_RATE: 0.1, // Crecimiento más realista
        COMMENT_FREQUENCY: 8000, // Cada 8 segundos
        REALISTIC_NAMES: true,
        
        // Patrones basados en datos reales
        VIEWER_PATTERNS: {
            MIN_MULTIPLIER: 0.01, // 1% de followers
            MAX_MULTIPLIER: 0.05, // 5% de followers
            VOLATILITY: 0.2 // Variación del 20%
        }
    },
    
    // Configuración de fallback
    FALLBACK: {
        USE_ALTERNATIVE_WHEN_REAL_FAILS: true,
        CACHE_REAL_DATA: true,
        RETRY_FAILED_REQUESTS: true,
        MAX_FALLBACK_TIME: 60000 // 1 minuto antes de usar fallback
    },
    
    // URLs para desarrollo
    DEVELOPMENT: {
        LOCAL_SERVER: 'http://localhost:8000',
        TEST_MODE: false
    },
    
    // URLs de producción
    PRODUCTION: {
        GITHUB_PAGES: 'https://derf2001.github.io/tiktok-live-api',
        DOMAIN: null // Si tienes dominio personalizado
    }
};

// Configuración dinámica basada en el entorno
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.DEVELOPMENT.TEST_MODE = true;
    CONFIG.DASHBOARD.UPDATE_INTERVAL = 3000; // Más rápido en desarrollo
}

export default CONFIG;
