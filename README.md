# Horacio Soux — Portfolio

Portafolio estático con hero 3D, Experience, Skills y seis proyectos: Optimal, Eden, Pinnacle Box, Casa Obrador, Techla y Coloso.

## Empezar

1. Descomprime la carpeta completa. Conserva las carpetas ocultas `.github` y los archivos que empiezan con punto.
2. Instala Node.js 22 o superior si quieres revisarlo en tu computadora.
3. Abre una terminal dentro de esta carpeta y ejecuta:

```sh
npm run check
npm start
```

Abre **http://localhost:4176**. No requiere `npm install`. No abras `index.html` con doble clic: los módulos y modelos necesitan servirse por HTTP.

## Subir con GitHub Desktop — opción sencilla

1. Instala GitHub Desktop e inicia sesión.
2. En **File → Add Local Repository**, selecciona esta carpeta. Si indica que no es un repositorio, usa la opción para crear un repositorio aquí, conservando estos archivos. No crees una segunda carpeta vacía dentro.
3. Confirma que aparecen `site/`, `scripts/`, `README.md` y `.github/workflows/pages.yml`.
4. Crea el primer commit, por ejemplo: `Portfolio inicial`.
5. Usa **Publish repository**. Nombre sugerido: `portfolio`. El paquete no incluye credenciales ni necesita tokens en archivos.
6. Para GitHub Pages con una cuenta gratuita, el repositorio debe ser público. Eso también hace descargables los recursos del repositorio; revisa `THIRD_PARTY_NOTICES.md`.
7. En GitHub abre **Settings → Pages → Build and deployment → Source → GitHub Actions**.
8. En **Actions → Publish portfolio → Run workflow**, ejecuta el flujo en `main`. Las futuras actualizaciones de `main` se publican automáticamente.
9. Cuando termine en verde, el enlace estará en **Settings → Pages** y en el despliegue. Para un repositorio llamado `portfolio`, tendrá el formato `https://TU_USUARIO.github.io/portfolio/`.

**Comparte ese enlace de la web, no el ZIP ni localhost.** Funciona sin tener tu computadora encendida.

## Alternativa desde terminal

Crea en GitHub un repositorio vacío llamado `portfolio`, sin README ni licencia automática. Luego, dentro de esta carpeta:

```sh
git init -b main
git add .
git commit -m "Portfolio inicial"
git remote add origin https://github.com/TU_USUARIO/portfolio.git
git push -u origin main
```

Sustituye `TU_USUARIO` por tu usuario real. Después activa Pages como se explica arriba. Los archivos grandes deben subirse mediante GitHub Desktop o Git, no arrastrando la carpeta al formulario web.

## Contacto

Schedule y Let’s talk abren un correo dirigido a **h.soux13@gmail.com**, con nombre, email, fecha preferida y mensaje del formulario. El visitante debe enviarlo desde su aplicación de correo; la web no envía automáticamente ni reserva una reunión. Requiere tener un gestor de correo configurado.

El borrador se conserva localmente en el navegador del visitante. No hay base de datos ni un proveedor externo de formularios. Para cambiar el destinatario, modifica `site/app.js` y la nota visible en `site/index.html`.

## Qué contiene

- `site/`: sitio publicable, editable directamente. No requiere compilación.
- `site/app.js`, `style.css`: hero y navegación principal.
- `site/sections.js`, `sections.css`, `skills.js`: Experience, Skills y estilos de proyectos.
- `site/work.js`: carrusel de Work.
- `site/projects.js`, `techla.js`, `case-studies.js`, `study-interactions.js`: detalles de proyectos y comportamiento.
- `site/assets/`: imágenes, modelos, fuentes y videos locales.
- `site/vendor/`: módulos de Three.js y decodificador.
- `.github/workflows/pages.yml`: validación y publicación automática.
- `scripts/`: servidor local y verificación sin dependencias.
- `package-report.json`: inventario y archivos de prueba excluidos.
- `licenses/`, `THIRD_PARTY_NOTICES.md`: avisos de terceros.

Se retiraron originales duplicados, versiones comprimidas del servidor anterior y páginas de inspección. Se conservan los modelos optimizados y recursos necesarios. El peso total del paquete no se descarga en una sola visita: los proyectos y sus imágenes se cargan según su uso. Aun así, el hero 3D requiere descargar unos 27 MiB de modelos; conviene probar el enlace con datos móviles antes de enviarlo ampliamente.

## Antes de compartir

- Abre la URL pública en una ventana privada y en tu teléfono.
- Revisa los seis proyectos, las imágenes de Casa Obrador y ambos videos.
- Comprueba que Schedule abre tu aplicación de correo con el destinatario correcto.
- Revisa permisos de publicación de proyectos y licencias de fuentes.
- `Projects`, `Merch` y `Mag` conservan el estado de la copia actual; no se inventó contenido adicional.

## Actualizaciones

Edita los archivos en `site/`, ejecuta `npm run check`, revisa con `npm start`, crea un commit y haz **Push origin**. GitHub Actions vuelve a publicar. No vuelvas a subir el ZIP como archivo dentro del repositorio.

## Dominio propio

Puedes añadirlo más adelante en **Settings → Pages → Custom domain**, después de configurar el DNS de tu dominio. No se incluye `CNAME` porque todavía no se ha indicado un dominio.

Documentación oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Este paquete está preparado localmente. No crea un repositorio remoto ni publica la web por sí solo hasta que completes los pasos de GitHub.
