# 🔴 TikTok Live Dashboard - DATOS REALES

Un dashboard completo para TikTok Live que puede usar **datos reales** o simulación alternativa.

## 🌟 Características

### ✅ **Datos Reales de TikTok**
- **Obtiene información real** de perfiles públicos de TikTok
- **Web scraping inteligente** de múltiples fuentes
- **APIs públicas** para datos adicionales
- **Cache automático** para mejorar performance
- **Rate limiting** para evitar bloqueos

### ⚡ **Simulación Alternativa**
- **Datos realistas** basados en patrones reales
- **Sin dependencias externas**
- **Funciona siempre** como fallback

### 🔄 **Sistema Híbrido**
- **Cambio automático** entre datos reales y simulación
- **Botón manual** para alternar fuentes
- **Indicadores visuales** del tipo de datos
- **Fallback inteligente** cuando fallan APIs

## 🚀 URLs de la Aplicación

### 📊 **Dashboards Disponibles:**

1. **Dashboard con Datos Reales:**
   - URL: `https://derf2001.github.io/tiktok-live-api/real.html`
   - Intenta obtener datos reales de TikTok
   - Fallback automático a simulación si falla

2. **Dashboard Simulado (Original):**
   - URL: `https://derf2001.github.io/tiktok-live-api/index.html`
   - Solo simulación (sin APIs externas)
   - Funciona siempre, sin dependencias

3. **Panel de Pruebas:**
   - URL: `https://derf2001.github.io/tiktok-live-api/test.html`
   - Prueba todos los componentes
   - Debugging y logs del sistema

## 🎮 Cómo Usar

### **1. Dashboard de Datos Reales** (recomendado)
```
https://derf2001.github.io/tiktok-live-api/real.html
```

**Características:**
- 🔍 **Auto-detección** - Busca datos reales automáticamente
- 🔴 **Indicador visual** - Banner rojo indica datos reales
- 🔄 **Cambio manual** - Botón en esquina superior derecha
- ⌨️ **Atajos de teclado:**
  - `Ctrl+S` = Cambiar fuente de datos
  - `Ctrl+R` = Reiniciar sesión

### **2. Controles del Dashboard**

1. **🔴 Iniciar Live** - Comienza la transmisión
2. **⏹️ Terminar Live** - Detiene la transmisión
3. **🔄 Cambiar Fuente** - Alterna entre real/simulado
4. **Actualizaciones automáticas** cada 5 segundos (datos reales) o 3 segundos (simulado)

### **3. Fuentes de Datos Reales**

El sistema intenta obtener datos de:

1. **TikTok Web Interface** (scraping público)
2. **APIs públicas de terceros**
3. **Web scraping inteligente**
4. **Cache local** (para mejorar velocidad)

Si todas fallan, usa **simulación realista** automáticamente.

## 🔧 Personalización

### **Cambiar Usuario Objetivo:**
Edita `config-real.js`:
```javascript
TARGET_USER: {
    username: 'tu_usuario_aqui', // Cambia por el username real
    display_name: 'Tu Nombre'
}
```

### **Configurar APIs Externas (Opcional):**
```javascript
REAL_API: {
    RAPIDAPI_KEY: 'tu_api_key_aqui', // Para APIs premium
    RATE_LIMIT_MS: 2000, // Tiempo entre requests
}
```

### **Ajustar Intervalos:**
```javascript
DASHBOARD: {
    UPDATE_INTERVAL: 5000, // 5 segundos para datos reales
    ALERT_DURATION: 4000,
    MAX_COMMENTS: 20
}
```

## 📁 Estructura de Archivos

```
📦 TikTok Live Dashboard
├── 🏠 index.html              # Dashboard simulado (original)
├── 🔴 real.html               # Dashboard con datos reales
├── 🧪 test.html               # Panel de pruebas
├── ⚙️ config.js               # Configuración simulada
├── ⚙️ config-real.js          # Configuración datos reales
├── 📊 script-alternative.js   # Lógica simulada
├── 📊 script-hybrid.js        # Lógica híbrida (real + simulado)
├── 🔗 tiktok-real-api.js      # API para datos reales
├── 🔗 tiktok-alternative-api.js # API simulada
├── 🎨 styles.css              # Estilos CSS
└── 🐍 server.py               # Servidor de desarrollo
```

## 🛠️ Desarrollo Local

```bash
# 1. Clonar repositorio
git clone https://github.com/Derf2001/tiktok-live-api.git
cd tiktok-live-api

# 2. Ejecutar servidor local
python server.py

# 3. Abrir en navegador:
# - Datos reales: http://localhost:8000/real.html
# - Simulado: http://localhost:8000/index.html  
# - Pruebas: http://localhost:8000/test.html
```

## 🔍 Solución de Problemas

### **Si no se obtienen datos reales:**
1. **Verificar conexión a internet**
2. **Probar con usuario público popular** (ej: charlidamelio)
3. **Esperar unos segundos** - el sistema tiene rate limiting
4. **Usar botón "Cambiar Fuente"** para alternar manualmente

### **Si aparecen errores CORS:**
- Es normal, el sistema usa múltiples proxies CORS
- El fallback automático manejará la situación

### **Para mejorar obtención de datos reales:**
1. **Agregar API keys** en `config-real.js`
2. **Usar RapidAPI** para APIs premium
3. **Ajustar rate limiting** si es necesario

## 🎯 Usuarios Recomendados para Pruebas

```javascript
// Usuarios públicos populares que funcionan bien:
'charlidamelio'     // Charli D'Amelio - Muy popular
'addisonre'         // Addison Rae - Activa
'zachking'          // Zach King - Contenido viral  
'lorengray'         // Loren Gray - Muchos followers
'spencerx'          // Spencer X - Beatboxer
```

## 📈 Próximas Funciones

- [ ] **API de TikTok Research** oficial
- [ ] **Notificaciones push** para eventos importantes
- [ ] **Historial de estadísticas**
- [ ] **Múltiples usuarios** simultáneos
- [ ] **Integración con OBS** para streaming

## 💡 Tips de Uso

### **Para Streamers:**
- Usa `real.html` para datos reales de tu perfil
- Configura tu username en `config-real.js`
- El dashboard se actualiza automáticamente

### **Para Desarrolladores:**
- Usa `test.html` para debugging
- Revisa la consola para logs detallados
- APIs tienen rate limiting automático

### **Para Presentaciones:**
- `index.html` siempre funciona (simulado)
- `real.html` para impresionar con datos reales
- Ambos tienen el mismo diseño profesional

---

## 🔗 Links Útiles

- **Dashboard Datos Reales:** https://derf2001.github.io/tiktok-live-api/real.html
- **Dashboard Simulado:** https://derf2001.github.io/tiktok-live-api/
- **Panel de Pruebas:** https://derf2001.github.io/tiktok-live-api/test.html
- **Repositorio:** https://github.com/Derf2001/tiktok-live-api

---

**¡Disfruta tu dashboard TikTok con datos reales! 🔥**
