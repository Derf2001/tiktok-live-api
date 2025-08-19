// Configuración para datos REALES de TikTok - SIN FALLBACK AUTOMÁTICO
const CONFIG = {
    // 🎯 Modo solo datos reales - NO usar simulación como fallback
    MODE: 'real_only', // 'real_only' = solo datos reales, mostrar errores si falla
    
    // Usuario objetivo para obtener datos REALES
    TARGET_USER: {
        username: 'Jassy_gg', // Usuario real configurado
        display_name: 'Jassy_gg',
        tiktok_id: 'jassy_gg'
    },
    
    // APIs para datos reales
    REAL_API: {
        // Claves de APIs externas
        RAPIDAPI_KEY: '0ba5cdb6d7mshe298cee90a4ff9fp116182jsnf2c985f3466f',
        SCRAPER_API_KEY: null,
        
        // Endpoints para datos reales
        TIKTOK_SCRAPER: 'https://tiktok-scraper7.p.rapidapi.com',
        USER_INFO: 'https://tiktok-video-no-watermark2.p.rapidapi.com',
        LIVE_ROOM: 'https://tiktok-live-api.herokuapp.com',
        
        // Configuración de rate limiting
        RATE_LIMIT_MS: 2000, // 2 segundos entre requests
        MAX_RETRIES: 3,
        CACHE_DURATION: 300000, // 5 minutos
        TIMEOUT_MS: 10000 // 10 segundos timeout por request
    },
    
    // APIs proxy para CORS
    CORS_PROXIES: [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://cors-anywhere.herokuapp.com/',
        'https://thingproxy.freeboard.io/fetch/'
    ],
    
    // Headers para requests reales
    REQUEST_HEADERS: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    },
    
    // Configuración del dashboard - SOLO DATOS REALES
    DASHBOARD: {
        UPDATE_INTERVAL: 8000, // 8 segundos (más conservador para datos reales)
        ALERT_DURATION: 6000, // Alertas más largas para leer errores
        MAX_COMMENTS: 15,
        ANIMATION_SPEED: 500,
        
        // NO USAR FALLBACK - Mostrar errores detallados
        SHOW_DETAILED_ERRORS: true,
        FALLBACK_TO_SIMULATION: false, // ¡IMPORTANTE! No cambiar a simulación
        RETRY_ON_ERROR: true,
        MAX_ERROR_RETRIES: 5,
        
        // Umbrales para alertas
        THRESHOLDS: {
            NEW_FOLLOWERS: 1,
            LIKES_MILESTONE: 50,
            VIEWER_PEAK: 10
        }
    },
    
    // Configuración de debugging y errores
    ERROR_HANDLING: {
        SHOW_ALL_ERRORS: true, // Mostrar todos los errores al usuario
        LOG_TO_CONSOLE: true, // Logs detallados en consola
        ERROR_RETRY_DELAY: 5000, // 5 segundos antes de reintentar
        SHOW_API_RESPONSES: true, // Mostrar respuestas de APIs para debugging
        
        // Tipos de errores a mostrar
        ERROR_CATEGORIES: {
            NETWORK_ERROR: 'Error de conexión de red',
            API_KEY_ERROR: 'Error de API Key',
            USER_NOT_FOUND: 'Usuario no encontrado',
            RATE_LIMITED: 'Límite de requests excedido',
            CORS_ERROR: 'Error de CORS (bloqueo de navegador)',
            TIMEOUT_ERROR: 'Timeout en la petición',
            PARSE_ERROR: 'Error procesando respuesta',
            UNKNOWN_ERROR: 'Error desconocido'
        }
    },
    
    // URLs para desarrollo
    DEVELOPMENT: {
        LOCAL_SERVER: 'http://localhost:8000',
        TEST_MODE: false,
        DEBUG_MODE: true // Activar debug en desarrollo
    },
    
    // URLs de producción
    PRODUCTION: {
        GITHUB_PAGES: 'https://derf2001.github.io/tiktok-live-api',
        DOMAIN: null
    }
};

// Configuración dinámica basada en el entorno
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    CONFIG.DEVELOPMENT.TEST_MODE = true;
    CONFIG.DEVELOPMENT.DEBUG_MODE = true;
    CONFIG.DASHBOARD.UPDATE_INTERVAL = 5000; // Más rápido en desarrollo
    CONFIG.ERROR_HANDLING.SHOW_ALL_ERRORS = true;
}

export default CONFIG;
