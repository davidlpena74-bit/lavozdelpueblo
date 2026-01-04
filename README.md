# 🏛️ LaVozDelPueblo.es

Plataforma de participación ciudadana impulsada por Inteligencia Artificial donde los ciudadanos pueden explorar, votar y analizar temas de actualidad política con una visión equilibrada.

## 📂 Estructura del Proyecto

Para trabajar de forma organizada, definimos los siguientes entornos:

| Nombre | Descripción | Ubicación / URL | Comando clave |
| :--- | :--- | :--- | :--- |
| **Entorno Local** (Taller) | Donde desarrollamos y probamos cambios. | Tu ordenador (`.../azure-cluster`) | `npm run dev` |
| **Repositorio Remoto** (Almacén) | Copia de seguridad y colaboración. | [GitHub: davidlpena74-bit/lavozdelpueblo](https://github.com/davidlpena74-bit/lavozdelpueblo) | `git push` |
| **Producción** (Escaparate) | La web real que ven los usuarios. | [lavozdelpueblo.es](https://lavozdelpueblo.es) | `npm run deploy` |

## 🚀 Cómo trabajar

### 1. Desarrollo Local
1. Abre la terminal en la carpeta del proyecto.
2. Ejecuta `npm run dev`.
3. Abre `http://localhost:5173` en tu navegador.
4. Haz tus cambios en el código.

### 2. Guardar cambios (GitHub)
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### 3. Publicar en lavozdelpueblo.es
```bash
npm run deploy
```
*Esto construirá la aplicación y la subirá automáticamente a GitHub Pages.*

## 🔑 Configuración

### Variables de Entorno
Crea un archivo `.env` en la raíz si necesitas configurar claves API:
```env
VITE_GEMINI_API_KEY=tu_clave_aqui
```

### DNS (DonDominio)
Para que el dominio funcione, asegúrate de usar los **DNS de DonDominio** y añadir los registros A y CNAME indicados en el plan de despliegue.

---
*Desarrollado con React, Vite y Google Gemini API.*
