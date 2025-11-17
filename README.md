# Suite Tributaria – BackOffice Clientes

Aplicación web responsiva (desktop/tablet/móvil) construida con React 19 + TypeScript + Vite. UI con Material UI 7, estado global con Zustand, tablas con TanStack Table (pendiente) y utilidades (date-fns, lodash, nanoid).

## Requisitos
- Node.js 18+

## Instalación
```powershell
npm install
```

## Scripts
```powershell
npm run dev      # Servidor de desarrollo
npm run build    # Compilación de producción
npm run preview  # Previsualización de build
npm run lint     # Linter
```

## Credenciales demo
- Usuario: `Nestor`
- Contraseña: `1005`

## Deploy en GitHub Pages
La aplicación está configurada para despliegue automático en GitHub Pages mediante GitHub Actions.

**URL de producción:** https://codelab369.github.io/Clientes/

### Flujo automático:
1. Cada push a `main` ejecuta el workflow `.github/workflows/pages.yml`
2. El build de Vite genera la carpeta `dist/` con base `/Clientes/`
3. GitHub Actions sube y despliega automáticamente

### Activar Pages (primera vez):
1. Ve a **Settings > Pages** del repositorio
2. Selecciona **Source: GitHub Actions**
3. Espera a que termine el workflow en **Actions**

### Deploy manual:
```powershell
npm run build
git add .
git commit -m "Update"
git push
```

## Notas
- Tema claro/oscuro/sistema con Plus Jakarta Sans y fondos con gradientes (Material You / neón suave).
- Accesibilidad: skip link, focus visible, labels, tooltips.
- Secciones: Login, Clientes, SIN, Comprimir, Configuración.

