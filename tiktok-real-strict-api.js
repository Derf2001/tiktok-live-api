// TikTok Real API - SOLO DATOS REALES, SIN FALLBACK, CON ERRORES DETALLADOS
class TikTokRealStrictAPI {
    constructor(config) {
        this.config = config;
        this.apiKey = config.REAL_API?.RAPIDAPI_KEY || null;
        this.corsProxies = config.CORS_PROXIES || [];
        this.lastFetchTime = 0;
        this.cache = new Map();
        this.errorLog = [];
        this.currentProxyIndex = 0;
        
        console.log('🔴 TikTok Real Strict API initialized - NO FALLBACK MODE');
        console.log('📋 Config:', {
            user: config.TARGET_USER.username,
            hasApiKey: !!this.apiKey,
            proxies: this.corsProxies.length,
            mode: config.MODE
        });
    }

    // Método principal - SIN FALLBACK, CON ERRORES DETALLADOS
    async getUserData(username) {
        console.log(`🔍 [REAL ONLY] Obteniendo datos reales para: ${username}`);
        this.clearErrorLog();
        
        try {
            // Intentar obtener datos reales de múltiples fuentes
            const userData = await this.fetchFromAllSources(username);
            
            if (!userData || !userData.success) {
                throw new Error('No se pudieron obtener datos reales de ninguna fuente');
            }
            
            console.log('✅ Datos reales obtenidos exitosamente:', userData.source);
            return this.formatUserData(userData, username);
            
        } catch (error) {
            // NO usar fallback - Mostrar error detallado
            const detailedError = this.createDetailedError(error, 'getUserData', username);
            console.error('❌ [REAL API ERROR]', detailedError);
            throw detailedError;
        }
    }

    async fetchFromAllSources(username) {
        const sources = [
            { name: 'RapidAPI Premium', method: () => this.fetchFromRapidAPI(username) },
            { name: 'TikTok Web Scraping', method: () => this.fetchFromTikTokWeb(username) },
            { name: 'Public APIs', method: () => this.fetchFromPublicAPI(username) }
        ];

        let lastError = null;
        
        for (const source of sources) {
            try {
                console.log(`🔄 Intentando fuente: ${source.name}`);
                const data = await source.method();
                
                if (data && data.success) {
                    console.log(`✅ Éxito con: ${source.name}`);
                    return data;
                }
                
                this.logError(`❌ ${source.name}: No data returned`, 'NO_DATA');
                
            } catch (error) {
                lastError = error;
                const errorMsg = `❌ ${source.name}: ${error.message}`;
                console.warn(errorMsg);
                this.logError(errorMsg, this.categorizeError(error));
            }
        }

        // Si llegamos aquí, todas las fuentes fallaron
        const allErrors = this.errorLog.map(e => `• ${e.message}`).join('\n');
        throw new Error(`Todas las fuentes de datos reales fallaron:\n${allErrors}`);
    }

    // Fuente 1: RapidAPI (Premium con API Key)
    async fetchFromRapidAPI(username) {
        if (!this.apiKey || this.apiKey === 'TU_RAPIDAPI_KEY_AQUI') {
            throw new Error('API Key de RapidAPI no configurada o es placeholder');
        }

        const endpoints = [
            {
                url: `https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${username}`,
                headers: {
                    'X-RapidAPI-Key': this.apiKey,
                    'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com'
                }
            }
        ];

        for (const endpoint of endpoints) {
            try {
                await this.respectRateLimit();
                console.log(`🔑 Usando RapidAPI: ${endpoint.url}`);
                
                const response = await this.makeRequest(endpoint.url, {
                    method: 'GET',
                    headers: {
                        ...this.config.REQUEST_HEADERS,
                        ...endpoint.headers
                    },
                    timeout: this.config.REAL_API.TIMEOUT_MS
                });

                if (response.data || response.user) {
                    return {
                        success: true,
                        source: 'rapidapi_premium',
                        data: response.data || response.user,
                        raw: response
                    };
                }
                
            } catch (error) {
                if (error.message.includes('401') || error.message.includes('403')) {
                    throw new Error(`API Key inválida o sin permisos: ${error.message}`);
                }
                if (error.message.includes('429')) {
                    throw new Error(`Límite de requests excedido en RapidAPI: ${error.message}`);
                }
                throw error;
            }
        }

        throw new Error('RapidAPI no devolvió datos válidos');
    }

    // Fuente 2: TikTok Web Scraping
    async fetchFromTikTokWeb(username) {
        const url = `https://www.tiktok.com/@${username}`;
        
        try {
            await this.respectRateLimit();
            console.log(`🌐 Scraping TikTok Web: ${url}`);
            
            const response = await this.makeRequestWithProxies(url);
            
            if (response.contents) {
                const parsedData = this.parseHTMLData(response.contents, username);
                if (parsedData.success) {
                    return parsedData;
                }
            }
            
        } catch (error) {
            if (error.message.includes('CORS')) {
                throw new Error(`Error CORS scrapeando TikTok: ${error.message}`);
            }
            throw error;
        }

        throw new Error('Web scraping no pudo extraer datos del HTML');
    }

    // Fuente 3: APIs públicas
    async fetchFromPublicAPI(username) {
        const apis = [
            `https://tiktok-video-no-watermark2.p.rapidapi.com/user/info?unique_id=${username}`,
            `https://api.tiktokv.com/aweme/v1/user/?user_id=${username}`
        ];

        for (const apiUrl of apis) {
            try {
                await this.respectRateLimit();
                console.log(`🔌 Probando API pública: ${apiUrl}`);
                
                const response = await this.makeRequestWithProxies(apiUrl);
                
                if (response.data || response.user_info) {
                    return {
                        success: true,
                        source: 'public_api',
                        data: response.data || response.user_info
                    };
                }
                
            } catch (error) {
                console.warn(`API pública falló: ${error.message}`);
            }
        }

        throw new Error('APIs públicas no disponibles o sin datos');
    }

    // Hacer request con múltiples proxies CORS
    async makeRequestWithProxies(url) {
        let lastError = null;
        
        for (let i = 0; i < this.corsProxies.length; i++) {
            const proxyUrl = this.corsProxies[this.currentProxyIndex];
            this.currentProxyIndex = (this.currentProxyIndex + 1) % this.corsProxies.length;
            
            try {
                console.log(`🔄 Intentando proxy ${i + 1}/${this.corsProxies.length}: ${proxyUrl}`);
                
                const response = await this.makeRequest(proxyUrl + encodeURIComponent(url));
                
                if (response) {
                    console.log(`✅ Éxito con proxy: ${proxyUrl}`);
                    return response;
                }
                
            } catch (error) {
                lastError = error;
                console.warn(`❌ Proxy falló: ${proxyUrl} - ${error.message}`);
            }
        }
        
        throw new Error(`Todos los proxies CORS fallaron. Último error: ${lastError?.message}`);
    }

    // Hacer request con timeout
    async makeRequest(url, options = {}) {
        const timeout = options.timeout || this.config.REAL_API.TIMEOUT_MS || 10000;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.abort
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (this.config.ERROR_HANDLING.SHOW_API_RESPONSES) {
                console.log('📥 API Response:', data);
            }
            
            return data;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout después de ${timeout}ms`);
            }
            
            throw error;
        }
    }

    parseHTMLData(html, username) {
        try {
            console.log('🔍 Parseando HTML de TikTok...');
            
            const patterns = {
                followers: /"followerCount":(\d+)/,
                following: /"followingCount":(\d+)/,
                likes: /"heartCount":(\d+)/,
                videos: /"videoCount":(\d+)/,
                displayName: /"nickname":"([^"]+)"/,
                verified: /"verified":(true|false)/,
                bio: /"signature":"([^"]+)"/,
                avatar: /"avatarLarger":"([^"]+)"/
            };

            const extractedData = {};
            let extractedCount = 0;
            
            for (const [key, pattern] of Object.entries(patterns)) {
                const match = html.match(pattern);
                if (match) {
                    extractedData[key] = key === 'verified' ? match[1] === 'true' : 
                                       ['displayName', 'bio', 'avatar'].includes(key) ? match[1] : parseInt(match[1]);
                    extractedCount++;
                }
            }

            if (extractedCount === 0) {
                throw new Error('No se pudieron extraer datos del HTML de TikTok');
            }

            console.log(`✅ Extraídos ${extractedCount} campos del HTML`);

            return {
                success: true,
                source: 'html_parsing',
                data: {
                    display_name: extractedData.displayName || username,
                    username: username,
                    follower_count: extractedData.followers || 0,
                    following_count: extractedData.following || 0,
                    likes_count: extractedData.likes || 0,
                    video_count: extractedData.videos || 0,
                    verified: extractedData.verified || false,
                    bio: extractedData.bio || "Usuario de TikTok",
                    avatar_url: extractedData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
                }
            };
            
        } catch (error) {
            throw new Error(`Error parseando HTML: ${error.message}`);
        }
    }

    formatUserData(rawData, username) {
        const data = rawData.data;
        
        return {
            display_name: data.display_name || data.nickname || username,
            username: username,
            follower_count: this.parseCount(data.follower_count || data.followerCount || 0),
            following_count: this.parseCount(data.following_count || data.followingCount || 0),
            likes_count: this.parseCount(data.likes_count || data.heartCount || data.digg_count || 0),
            video_count: this.parseCount(data.video_count || data.videoCount || data.aweme_count || 0),
            verified: data.verified || data.is_verified || false,
            bio: data.bio || data.signature || "Usuario de TikTok",
            avatar_url: data.avatar_url || data.avatar || data.avatarLarger || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            source: rawData.source || 'unknown',
            timestamp: Date.now()
        };
    }

    // Sistema de Live Stats - SOLO DATOS REALES
    async getRealLiveStats(username) {
        console.log(`📺 [REAL ONLY] Obteniendo stats de live para: ${username}`);
        
        try {
            // Intentar obtener datos reales de live
            const liveData = await this.fetchLiveRoomData(username);
            
            if (liveData && liveData.is_live) {
                console.log('✅ Usuario está en vivo - datos reales obtenidos');
                return {
                    is_live: true,
                    viewers: liveData.viewer_count || 0,
                    likes: liveData.total_likes || 0,
                    follows: liveData.new_follows || 0,
                    shares: liveData.shares || 0,
                    comments: liveData.recent_comments || [],
                    source: 'real_live_api'
                };
            } else {
                throw new Error(`Usuario ${username} no está en vivo actualmente`);
            }
            
        } catch (error) {
            const detailedError = this.createDetailedError(error, 'getRealLiveStats', username);
            console.error('❌ [LIVE STATS ERROR]', detailedError);
            throw detailedError;
        }
    }

    async fetchLiveRoomData(username) {
        const liveAPIs = [
            `https://tiktok-live-api.herokuapp.com/live/${username}`,
            `https://api.tiktokv.com/live/room/${username}`,
            `https://webcast.tiktok.com/webcast/room/enter/?aid=1988`
        ];

        for (const api of liveAPIs) {
            try {
                await this.respectRateLimit();
                console.log(`📺 Verificando live API: ${api}`);
                
                const response = await this.makeRequestWithProxies(api);
                
                if (response && response.status === 'live') {
                    return response;
                }
                
            } catch (error) {
                console.warn(`Live API failed: ${api} - ${error.message}`);
            }
        }

        return { is_live: false };
    }

    // Utilidades para manejo de errores
    logError(message, category = 'UNKNOWN') {
        const error = {
            message,
            category,
            timestamp: new Date().toISOString(),
            user: this.config.TARGET_USER.username
        };
        
        this.errorLog.push(error);
        
        if (this.config.ERROR_HANDLING.LOG_TO_CONSOLE) {
            console.error(`[${category}] ${message}`);
        }
    }

    clearErrorLog() {
        this.errorLog = [];
    }

    createDetailedError(error, method, username) {
        const category = this.categorizeError(error);
        const categoryText = this.config.ERROR_HANDLING.ERROR_CATEGORIES[category] || 'Error desconocido';
        
        return {
            message: error.message,
            category,
            categoryText,
            method,
            username,
            timestamp: new Date().toISOString(),
            allErrors: this.errorLog,
            suggestions: this.getSuggestions(category)
        };
    }

    categorizeError(error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('network') || message.includes('fetch')) return 'NETWORK_ERROR';
        if (message.includes('api key') || message.includes('401') || message.includes('403')) return 'API_KEY_ERROR';
        if (message.includes('user') && message.includes('not found')) return 'USER_NOT_FOUND';
        if (message.includes('429') || message.includes('rate limit')) return 'RATE_LIMITED';
        if (message.includes('cors')) return 'CORS_ERROR';
        if (message.includes('timeout')) return 'TIMEOUT_ERROR';
        if (message.includes('parse') || message.includes('json')) return 'PARSE_ERROR';
        
        return 'UNKNOWN_ERROR';
    }

    getSuggestions(category) {
        const suggestions = {
            'NETWORK_ERROR': ['Verificar conexión a internet', 'Intentar más tarde'],
            'API_KEY_ERROR': ['Verificar API key de RapidAPI', 'Renovar suscripción si expiró'],
            'USER_NOT_FOUND': ['Verificar que el username existe', 'El perfil puede estar privado'],
            'RATE_LIMITED': ['Esperar antes de intentar nuevamente', 'Considerar plan premium'],
            'CORS_ERROR': ['Problema del navegador, no del código', 'Intentar desde otro navegador'],
            'TIMEOUT_ERROR': ['Conexión muy lenta', 'Intentar con mejor internet'],
            'PARSE_ERROR': ['API devolvió formato inesperado', 'Revisar logs de respuesta'],
            'UNKNOWN_ERROR': ['Error no identificado', 'Revisar consola para más detalles']
        };
        
        return suggestions[category] || ['Error desconocido'];
    }

    parseCount(value) {
        if (typeof value === 'string') {
            if (value.includes('K')) return parseFloat(value) * 1000;
            if (value.includes('M')) return parseFloat(value) * 1000000;
        }
        return parseInt(value) || 0;
    }

    async respectRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastFetchTime;
        
        if (timeSinceLastRequest < this.config.REAL_API.RATE_LIMIT_MS) {
            const delay = this.config.REAL_API.RATE_LIMIT_MS - timeSinceLastRequest;
            console.log(`⏳ Rate limit: esperando ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        this.lastFetchTime = Date.now();
    }
}

export default TikTokRealStrictAPI;
