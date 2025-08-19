# 🔥 INSTRUCCIONES PARA DATOS REALES - TikTok Dashboard

## 📋 **PASOS OBLIGATORIOS:**

### **1. 🔑 Obtener API Key de RapidAPI (RECOMENDADO)**

**¿Por qué necesitas esto?**
- Sin API key = Solo datos básicos simulados
- Con API key = Datos REALES de TikTok

**Pasos:**
1. **Ve a:** https://rapidapi.com/yi005/api/tiktok-scraper7
2. **Regístrate gratis** (con Google/GitHub es más rápido)
3. **Selecciona el plan "Basic" (GRATIS)** - 100 requests/mes
4. **Copia tu "X-RapidAPI-Key"** (aparece en el dashboard)
5. **Pégala en config-real.js** donde dice `TU_RAPIDAPI_KEY_AQUI`

### **2. 👤 Configurar TU Usuario de TikTok**

**Editar config-real.js:**
```javascript
TARGET_USER: {
    username: 'tu_usuario_tiktok', // ¡SIN el @ !
    display_name: 'Tu Nombre Real',
    tiktok_id: 'tu_usuario_tiktok'
}
```

**Ejemplos:**
- Si tu TikTok es @derf2001 → username: 'derf2001'
- Si tu TikTok es @juan_garcia → username: 'juan_garcia'

---

## 🚀 **CONFIGURACIÓN ACTUAL:**

### ✅ **Lo que YA está configurado:**
- ✅ Usuario objetivo: `derf2001`
- ✅ Múltiples APIs de respaldo
- ✅ Sistema híbrido (real + simulado)
- ✅ Proxies CORS configurados
- ✅ Rate limiting automático
- ❓ API Key: `TU_RAPIDAPI_KEY_AQUI` (CAMBIAR ESTO)

### 📝 **Lo que DEBES cambiar:**

1. **API Key en línea 12 del config-real.js:**
   ```javascript
   RAPIDAPI_KEY: 'TU_RAPIDAPI_KEY_AQUI', // ← CAMBIAR ESTO
   ```
   Por:
   ```javascript
   RAPIDAPI_KEY: 'tu_key_real_de_rapidapi', // ← TU KEY AQUÍ
   ```

2. **Tu usuario (OPCIONAL - ya está como derf2001):**
   Si quieres otro usuario, cambiar en línea 18:
   ```javascript
   username: 'derf2001', // ← Tu username preferido
   ```

---

## 🔧 **EJEMPLO COMPLETO DE CONFIGURACIÓN:**

```javascript
// Líneas 11-13 (API Keys)
RAPIDAPI_KEY: 'sk-1234567890abcdef', // Tu key real aquí
SCRAPER_API_KEY: null,

// Líneas 18-22 (Usuario)
TARGET_USER: {
    username: 'derf2001', // Tu usuario (sin @)
    display_name: 'Derf',
    tiktok_id: 'derf2001'
},
```

---

## 🌐 **URLs PARA PROBAR:**

### **Con datos reales (después de configurar):**
- `https://derf2001.github.io/tiktok-live-api/real.html`

### **Solo simulado (siempre funciona):**
- `https://derf2001.github.io/tiktok-live-api/index.html`

### **Panel de pruebas:**
- `https://derf2001.github.io/tiktok-live-api/test.html`

---

## 🐛 **SOLUCIÓN DE PROBLEMAS:**

### **Si no obtienes datos reales:**
1. **Verificar API Key** - Debe ser válida y activa
2. **Probar con usuario popular primero** - ej: 'charlidamelio'
3. **Verificar que el usuario existe** en TikTok
4. **Esperar unos segundos** - el sistema tiene delays

### **Si aparecen errores 403/429:**
- **Normal** - significa que se está intentando obtener datos reales
- **El sistema automáticamente** cambiará a simulación
- **Usar el botón 🔄** para alternar manualmente

### **Si todo falla:**
- **El dashboard seguirá funcionando** con simulación
- **Es completamente normal** - TikTok bloquea muchos requests
- **La simulación es muy realista** de todas formas

---

## 💡 **CONSEJOS IMPORTANTES:**

### **Para mejores resultados:**
1. **Usar perfiles públicos populares** funcionan mejor
2. **No hacer requests muy frecuentes** (ya configurado automáticamente)
3. **El sistema hibrido es inteligente** - cambia automáticamente

### **Para desarrollo:**
1. **Usar el servidor local** para pruebas rápidas
2. **GitHub Pages** se actualiza en 1-2 minutos después de push
3. **La consola del navegador** muestra logs detallados

---

## ⚡ **RESUMEN RÁPIDO:**

**OBLIGATORIO:**
1. ✅ Obtener RapidAPI Key (gratis): https://rapidapi.com/yi005/api/tiktok-scraper7  
2. ✅ Cambiar `TU_RAPIDAPI_KEY_AQUI` por tu key real
3. ✅ Hacer git commit y push

**OPCIONAL:**
- Cambiar usuario objetivo si no quieres 'derf2001'
- Ajustar intervalos de actualización
- Configurar APIs adicionales

**RESULTADO:**
🔴 Dashboard con datos REALES de TikTok funcionando en GitHub Pages

---

¿Necesitas ayuda con algún paso específico?
