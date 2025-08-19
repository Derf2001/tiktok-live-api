// Configuración alternativa SIN TikTok Developers
const CONFIG = {
    // 🎯 Modo alternativo - Sin API oficial
    MODE: 'alternative', // 'official', 'alternative', 'demo'
    
    // Usuario objetivo para obtener datos
    TARGET_USER: {
        username: '@derf2001', // Cambia por tu username real
        display_name: 'Derf2001',
        tiktok_id: 'derf2001'
    },
    
    // APIs alternativas (sin autenticación)
    ALTERNATIVE_APIS: {
        // API no oficial para datos públicos
        TIKTOK_SCRAPER: 'https://tiktok-scraper-api.p.rapidapi.com',
        USER_DATA: 'https://www.tiktok.com/api/user/detail/?uniqueId=',
        LIVE_DATA: 'https://webcast.tiktok.com/webcast/room/',
        
        // APIs proxy gratuitas
        CORS_PROXY: 'https://api.allorigins.win/get?url=',
        PROXY_2: 'https://cors-anywhere.herokuapp.com/'
    },
    
    // Configuración del dashboard
    DASHBOARD: {
        UPDATE_INTERVAL: 3000, // 3 segundos
        ALERT_DURATION: 4000,  // 4 segundos
        MAX_COMMENTS: 15,      // Máximo de comentarios
        AUTO_REFRESH: true     // Auto-actualizar datos
    },
    
    // Simulador realista de datos en vivo
    LIVE_SIMULATOR: {
        ENABLED: true,
        BASE_VIEWERS: 45,      // Espectadores base
        BASE_LIKES: 1250,      // Likes base
        BASE_FOLLOWS: 8940,    // Seguidores base
        
        // Rangos de variación
        VIEWER_RANGE: [-15, 25],    // Variación de espectadores
        LIKES_RANGE: [1, 8],        // Nuevos likes por update
        FOLLOW_CHANCE: 0.05,        // 5% probabilidad de nuevo seguidor
        COMMENT_CHANCE: 0.3,        // 30% probabilidad de comentario
        
        // Comentarios realistas
        SAMPLE_COMMENTS: [
            '¡Increíble contenido! 🔥',
            'Me encanta tu stream',
            'Saludos desde México 🇲🇽',
            '¿Cuándo el próximo live?',
            'Eres el mejor! ⭐',
            'Qué buena música 🎵',
            'Tutorial por favor! 🙏',
            'Increíble talento',
            'More content please!',
            '¡Sigue así! 💪',
            'From Spain! 🇪🇸',
            'Love your style',
            '¿Qué aplicación usas?',
            'Amazing skills! 👏',
            'Te sigo desde hace tiempo'
        ],
        
        SAMPLE_USERS: [
            'musicfan2024', 'streamer_pro', 'contentlover', 
            'tiktoker_mx', 'livefan', 'viewer_123',
            'fan_derf', 'music_addict', 'stream_viewer',
            'tiktok_user', 'live_watcher', 'content_fan'
        ]
    },
    
    // Configuración visual
    UI: {
        THEME: 'gradient', // 'gradient', 'dark', 'tiktok'
        ANIMATIONS: true,
        SOUND_ALERTS: false,
        NOTIFICATIONS: true
    },
    
    // GitHub Pages
    GITHUB_PAGES: {
        BASE_URL: 'https://derf2001.github.io/tiktok-live-api',
        REPO_URL: 'https://github.com/derf2001/tiktok-live-api'
    }
};

export default CONFIG;
