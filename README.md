
# 🏛️ LaVozDelPueblo.es

Plataforma de participación ciudadana impulsada por Inteligencia Artificial donde los ciudadanos pueden explorar, votar y analizar temas de actualidad política con una visión equilibrada.

## 🚀 Cómo empezar

### 1. Clonar y ejecutar localmente
1. Clona este repositorio.
2. Ejecuta `npm install` para instalar las dependencias.
3. Crea un archivo `.env` en la raíz y añade tu clave de Gemini:
   ```env
   VITE_GEMINI_API_KEY=tu_clave_aqui
   ```
4. Ejecuta `npm run dev` para iniciar el servidor local.

### 2. Cómo publicar en GitHub (Pasos)
1. Crea un nuevo repositorio en tu cuenta de GitHub llamado `lavozdelpueblo`.
2. Abre una terminal en la carpeta de tu proyecto.
3. Ejecuta los siguientes comandos:
   ```bash
   git init
   git add .
   git commit -m "Primer despliegue de La Voz Del Pueblo"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/lavozdelpueblo.git
   git push -u origin main
   ```

## 🌐 Despliegue con Vercel
1. Ve a [Vercel.com](https://vercel.com) e inicia sesión con tu GitHub.
2. Haz clic en **"New Project"**.
3. Importa tu repositorio `lavozdelpueblo`.
4. En **Environment Variables**, añade:
   - `API_KEY`: Tu clave de Google AI Studio.
5. Haz clic en **"Deploy"**.

## 🔑 Configuración de Auth (Importante)
Para que el login de Google y Facebook funcione en tu web publicada:
- **Google Cloud Console:** Añade la URL de tu web de Vercel a "Orígenes de JavaScript autorizados".
- **Facebook Developers:** Añade la URL de tu web a "Configuración de inicio de sesión de Facebook".

---
*Desarrollado con React y Google Gemini API.*
