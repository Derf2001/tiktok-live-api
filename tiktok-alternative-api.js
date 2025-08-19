// TikTok Alternative API - Sin necesidad de TikTok Developers
class TikTokAlternativeAPI {
    constructor(config) {
        this.config = config;
        this.cache = new Map();
        this.stats = {
            viewers: config.LIVE_SIMULATOR.BASE_VIEWERS,
            likes: config.LIVE_SIMULATOR.BASE_LIKES,
            follows: config.LIVE_SIMULATOR.BASE_FOLLOWS,
            shares: 0,
            comments: [],
            isLive: true
        };
    }

    // Obtener datos públicos de usuario (sin autenticación)
    async getUserData(username) {
        const cacheKey = `user_${username}`;
        
        // Check cache primero (evitar spam de requests)
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < 300000) { // 5 minutos
                return cached.data;
            }
        }

        try {
            // Método 1: Intentar obtener datos públicos
            const userData = await this.fetchPublicUserData(username);
            
            // Guardar en cache
            this.cache.set(cacheKey, {
                data: userData,
                timestamp: Date.now()
            });
            
            return userData;
        } catch (error) {
            console.warn('No se pudo obtener datos reales, usando simulador:', error);
            return this.generateMockUserData(username);
        }
    }

    async fetchPublicUserData(username) {
        // Intentar diferentes métodos para obtener datos públicos
        const cleanUsername = username.replace('@', '');
        
        // Método 1: API pública (puede estar limitada)
        try {
            const response = await fetch(`${this.config.ALTERNATIVE_APIS.CORS_PROXY}${encodeURIComponent(`https://www.tiktok.com/@${cleanUsername}`)}`);
            const html = await response.text();
            
            // Extraer datos del HTML (método básico)
            const userData = this.parseUserDataFromHTML(html, cleanUsername);
            if (userData) {
                return userData;
            }
        } catch (error) {
            console.log('Método 1 falló, intentando método 2...');
        }

        // Método 2: Generar datos realistas basados en patrones
        return this.generateRealisticUserData(cleanUsername);
    }

    parseUserDataFromHTML(html, username) {
        // Buscar patrones conocidos en el HTML de TikTok
        try {
            // Buscar el script con datos de usuario
            const scriptMatch = html.match(/<script[^>]*>window\.__UNIVERSAL_DATA_FOR_REHYDRATION__\s*=\s*(.+?)<\/script>/);
            
            if (scriptMatch) {
                const data = JSON.parse(scriptMatch[1]);
                const userInfo = data?.default?.webapp?.user-detail?.userInfo;
                
                if (userInfo) {
                    return {
                        display_name: userInfo.user.nickname || username,
                        username: `@${username}`,
                        follower_count: userInfo.stats?.followerCount || 0,
                        following_count: userInfo.stats?.followingCount || 0,
                        likes_count: userInfo.stats?.heartCount || 0,
                        video_count: userInfo.stats?.videoCount || 0,
                        avatar_url: userInfo.user?.avatarLarger || `https://via.placeholder.com/150/ff0050/ffffff?text=${username.charAt(0).toUpperCase()}`,
                        verified: userInfo.user?.verified || false,
                        bio: userInfo.user?.signature || '',
                        isLive: false // Detectar live es más complejo
                    };
                }
            }
        } catch (error) {
            console.warn('Error parsing HTML data:', error);
        }
        
        return null;
    }

    generateRealisticUserData(username) {
        // Generar datos realistas basados en patrones comunes
        const baseFollowers = Math.floor(Math.random() * 50000) + 1000;
        
        return {
            display_name: username.charAt(0).toUpperCase() + username.slice(1),
            username: `@${username}`,
            follower_count: baseFollowers,
            following_count: Math.floor(baseFollowers * 0.1) + Math.floor(Math.random() * 500),
            likes_count: Math.floor(baseFollowers * 25) + Math.floor(Math.random() * 10000),
            video_count: Math.floor(Math.random() * 200) + 10,
            avatar_url: `https://via.placeholder.com/150/ff0050/ffffff?text=${username.charAt(0).toUpperCase()}`,
            verified: Math.random() > 0.9, // 10% chance of verified
            bio: this.generateRandomBio(),
            isLive: Math.random() > 0.7 // 30% chance of being live
        };
    }

    generateMockUserData(username) {
        return {
            display_name: this.config.TARGET_USER.display_name,
            username: username,
            follower_count: this.config.LIVE_SIMULATOR.BASE_FOLLOWS,
            following_count: Math.floor(this.config.LIVE_SIMULATOR.BASE_FOLLOWS * 0.08),
            likes_count: this.config.LIVE_SIMULATOR.BASE_LIKES * 20,
            video_count: 127,
            avatar_url: `https://via.placeholder.com/150/ff0050/ffffff?text=${username.charAt(1).toUpperCase()}`,
            verified: false,
            bio: '🔥 Content Creator | 🎵 Music Lover | 📱 Tech Enthusiast',
            isLive: true
        };
    }

    generateRandomBio() {
        const bios = [
            '🎵 Music lover | Content creator',
            '📱 Tech enthusiast | Gamer',
            '🎨 Artist | Creative mind',
            '🌟 Living my best life',
            '🔥 Content creator | Influencer',
            '🎭 Entertainer | Performer',
            '📚 Sharing knowledge | Educator',
            '🏆 Always learning | Growing',
            '🌈 Spreading positivity',
            '⚡ Energy | Passion | Dreams'
        ];
        return bios[Math.floor(Math.random() * bios.length)];
    }

    // Simular estadísticas de live en tiempo real
    updateLiveStats() {
        const simulator = this.config.LIVE_SIMULATOR;
        
        // Actualizar viewers (fluctúa)
        const viewerChange = Math.floor(Math.random() * (simulator.VIEWER_RANGE[1] - simulator.VIEWER_RANGE[0] + 1)) + simulator.VIEWER_RANGE[0];
        this.stats.viewers = Math.max(0, this.stats.viewers + viewerChange);
        
        // Actualizar likes (siempre aumenta)
        const likeIncrease = Math.floor(Math.random() * (simulator.LIKES_RANGE[1] - simulator.LIKES_RANGE[0] + 1)) + simulator.LIKES_RANGE[0];
        this.stats.likes += likeIncrease;
        
        // Posible nuevo seguidor
        if (Math.random() < simulator.FOLLOW_CHANCE) {
            this.stats.follows += Math.floor(Math.random() * 3) + 1;
        }
        
        // Posible share
        if (Math.random() < 0.02) { // 2% chance
            this.stats.shares += 1;
        }
        
        // Posible nuevo comentario
        if (Math.random() < simulator.COMMENT_CHANCE) {
            this.addNewComment();
        }
        
        return this.stats;
    }

    addNewComment() {
        const simulator = this.config.LIVE_SIMULATOR;
        const comment = {
            id: Date.now() + Math.random(),
            user: simulator.SAMPLE_USERS[Math.floor(Math.random() * simulator.SAMPLE_USERS.length)],
            text: simulator.SAMPLE_COMMENTS[Math.floor(Math.random() * simulator.SAMPLE_COMMENTS.length)],
            timestamp: Date.now(),
            likes: Math.floor(Math.random() * 10)
        };
        
        this.stats.comments.unshift(comment);
        
        // Mantener solo los comentarios más recientes
        if (this.stats.comments.length > this.config.DASHBOARD.MAX_COMMENTS) {
            this.stats.comments = this.stats.comments.slice(0, this.config.DASHBOARD.MAX_COMMENTS);
        }
    }

    // Obtener estadísticas actuales
    getCurrentStats() {
        return {
            ...this.stats,
            lastUpdate: Date.now(),
            uptime: Math.floor((Date.now() - (Date.now() - 3600000)) / 1000) // 1 hora de uptime simulado
        };
    }

    // Reset stats (simular inicio de nuevo live)
    resetLiveSession() {
        this.stats = {
            viewers: this.config.LIVE_SIMULATOR.BASE_VIEWERS,
            likes: 0,
            follows: this.stats.follows, // Mantener seguidores
            shares: 0,
            comments: [],
            isLive: true
        };
    }
}

export default TikTokAlternativeAPI;
