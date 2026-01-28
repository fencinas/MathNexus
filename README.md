
# MathNexus - Modern AI Calculator

MathNexus es una calculadora científica avanzada potenciada por Inteligencia Artificial (Google Gemini). Ofrece una interfaz moderna, minimalista y altamente responsive diseñada para ingenieros, estudiantes y entusiastas de las matemáticas.

## ✨ Características Principales

- **Calculadora Científica:** Funciones trigonométricas, logarítmicas, raíces y constantes (π, e).
- **Asistente de IA (Gemini):** Resuelve problemas matemáticos complejos mediante texto o imágenes. Obtén explicaciones paso a paso.
- **Conversor de Unidades:** Longitud, Peso, Temperatura, Área y Volumen en tiempo real.
- **Multilenguaje:** Soporte nativo para Inglés y Español con detección automática.
- **Historial Persistente:** Guarda tus cálculos locales automáticamente utilizando `localStorage`.
- **Interfaz Premium:** Diseño Dual (Oscuro/Claro) con estética *glassmorphism*.

## 🚀 Opciones de Despliegue Gratuito

Para publicar esta aplicación en internet de forma profesional y gratuita, se recomiendan las siguientes plataformas:

### 1. Vercel (Recomendado)
1. Sube tu código a un repositorio de GitHub.
2. Crea una cuenta en [Vercel](https://vercel.com) y conecta tu repositorio.
3. **Importante:** En la configuración del proyecto, ve a "Environment Variables" y añade:
   - `API_KEY`: Tu clave de Google Gemini.
4. Vercel te proporcionará una URL `https://tu-proyecto.vercel.app`.

### 2. Netlify
1. Conecta tu repositorio en [Netlify](https://netlify.com).
2. Configura la variable de entorno `API_KEY` en el panel de control (Site configuration > Build & deploy > Environment).
3. Despliega con un solo clic.

### 3. Cloudflare Pages
1. Ideal por su velocidad global y ancho de banda ilimitado.
2. Configura las variables de entorno en el panel de Cloudflare tras conectar GitHub.

## 🔐 Seguridad y API Keys

Como MathNexus es una aplicación de cliente (Frontend), la `API_KEY` se utiliza en las peticiones que hace el navegador. Para un entorno de producción seguro:
- **Restricción de API Key:** Ve a [Google Cloud Console](https://console.cloud.google.com/) y restringe tu clave de API para que solo funcione desde el dominio donde has publicado tu app (ej: `tu-app.vercel.app`).
- **Proxy/Edge Functions:** Considera mover la llamada a Gemini a una función de servidor (Serverless Function) para ocultar completamente la clave del cliente.

## 🛠️ Tecnologías Utilizadas

- **React 19:** Interfaz de usuario declarativa.
- **TypeScript:** Estabilidad y tipado.
- **Tailwind CSS:** Estética moderna y responsive.
- **Google Gemini API:** Motor de IA de última generación.

---
Desarrollado con ❤️ por **Encinas** - 15 años de experiencia creando soluciones web intuitivas.
