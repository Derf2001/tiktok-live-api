# 🚀 INSTRUCCIONES DE DEPLOYMENT - GITHUB PAGES

## 📋 Pasos para subir a GitHub y configurar GitHub Pages:

### 1. 📁 Preparar archivos para GitHub
```bash
# En tu terminal, ve a la carpeta del proyecto
cd "C:\Users\efren\OneDrive\Documentos\Pruebas Python"

# Crear repositorio Git
git init
git add .
git commit -m "🎉 Initial commit - TikTok Live Dashboard"
```

### 2. 🌐 Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre del repositorio: `tiktok-live-api` (o el que prefieras)
3. Descripción: "🔥 TikTok Live Dashboard - Real-time streaming statistics"
4. Público o Privado (tu elección)
5. NO marques "Add a README file" (ya tienes uno)
6. Haz clic en "Create repository"

### 3. 📤 Subir archivos a GitHub
```bash
# Conectar con tu repositorio
git remote add origin https://github.com/derf2001/tiktok-live-api.git
git branch -M main
git push -u origin main
```

### 4. ⚙️ Configurar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" (pestaña del repositorio)
3. En el menú lateral, busca "Pages"
4. En "Source", selecciona "Deploy from a branch"
5. En "Branch", selecciona "main" y folder "/ (root)"
6. Haz clic en "Save"

### 5. 🎯 URLs que obtendrás
Después de activar GitHub Pages, tendrás:
- **Dashboard principal:** https://derf2001.github.io/tiktok-live-api/
- **Callback OAuth:** https://derf2001.github.io/tiktok-live-api/callback.html
- **Políticas:** https://derf2001.github.io/tiktok-live-api/privacy.html

### 6. 🔧 Configurar TikTok Developers
Ve a https://developers.tiktok.com/ y actualiza tu aplicación con:

**Redirect URI:**
```
https://derf2001.github.io/tiktok-live-api/callback.html
```

**Privacy Policy URL:**
```
https://derf2001.github.io/tiktok-live-api/privacy.html
```

**Terms of Service URL:**
```
https://derf2001.github.io/tiktok-live-api/terms.html
```

### 7. 📝 Actualizar configuración
Edita el archivo `config.js` con tu URL real:
```javascript
REDIRECT_URI: 'https://derf2001.github.io/tiktok-live-api/callback.html'
```

### 8. 🔄 Actualizar cambios
```bash
# Después de hacer cambios
git add .
git commit -m "📝 Update configuration for production"
git push
```

## ⚡ ¡Ya está listo!

Tu dashboard estará disponible en:
**https://derf2001.github.io/tiktok-live-api/**

## 🎯 Ventajas de GitHub Pages:
✅ Gratuito
✅ HTTPS automático
✅ Dominio estable
✅ Fácil de actualizar
✅ Perfecto para TikTok Developers
✅ No requiere servidor

## 📱 Próximos pasos:
1. Sube a GitHub siguiendo estas instrucciones
2. Activa GitHub Pages
3. Actualiza TikTok Developers con la nueva URL
4. ¡Prueba tu dashboard en línea!

¿Necesitas ayuda con algún paso?
