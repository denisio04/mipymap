# MipyMap

**Directorio interactivo de MiPyMEs en Cienfuegos, Cuba — mapa, búsqueda de productos y gestión de microempresas.**

MipyMap es una plataforma web que conecta a las Micro, Pequeñas y Medianas Empresas (MiPyMEs) de Cienfuegos con sus clientes a través de un mapa interactivo, búsqueda de productos y gestión de inventario en tiempo real.

---

## Funcionalidades

### Mapa Interactivo
- Visualización de todas las MiPyMEs en un mapa de Cienfuegos (Leaflet + OpenStreetMap)
- Popups con información del negocio, imagen y acceso a productos
- Geolocalización para encontrar negocios cercanos
- Vuelo animado a ubicaciones específicas

### Búsqueda y Listado
- Búsqueda de productos con autocompletado y debounce
- Filtros: más baratos, cercanía, aceptan transferencia
- Vista en lista con tarjetas de resultados agrupadas por MiPyME

### Panel de Administración
- CRUD completo de MiPyMEs (crear, editar, eliminar)
- Vista en mapa de todas las MiPyMEs con modo administrador
- Gestión de ubicación y datos del negocio

### Panel MiPyME (dueños)
- Dashboard con contador de interacciones en vivo
- Gestión de productos (crear, editar, eliminar)
- Control de stock y precios

### Autenticación
- Login por credenciales (usuario/contraseña)
- Roles: ADMIN y MIPYME
- Sesiones JWT con next-auth

---

## Stack Tecnológico

| Tecnología | Versión |
|---|---|
| [Next.js](https://nextjs.org/) | 16 (App Router) |
| [React](https://react.dev/) | 19 |
| [TypeScript](https://www.typescriptlang.org/) | 5 |
| [Tailwind CSS](https://tailwindcss.com/) | 4 |
| [Prisma](https://www.prisma.io/) | 5 + SQLite |
| [next-auth](https://next-auth.js.org/) | 4 |
| [Leaflet / react-leaflet](https://react-leaflet.js.org/) | Mapas |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Hash de contraseñas |
| [lucide-react](https://lucide.dev/) | Iconos |
| [use-debounce](https://github.com/xnimorz/use-debounce) | Búsqueda |
| [Supabase](https://supabase.com/) (opcional) | Storage producción |

---

## Empezar

### Requisitos

- Node.js 20+
- npm / yarn / pnpm / bun

### Instalación

```bash
git clone https://github.com/tu-usuario/mipymap.git
cd mipymap

npm install

cp .env.example .env
# Editar .env con los valores necesarios

npx prisma db push
npx prisma db seed

npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Seed por defecto

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | ADMIN |
| `mipyme1` | `mipyme123` | MIPYME |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/       # Páginas públicas (mapa, lista, búsqueda)
│   │   ├── page.tsx    # Mapa principal
│   │   ├── lista/      # Listado con filtros
│   │   └── buscar/     # Búsqueda de productos
│   ├── admin/          # Panel de administración
│   ├── mipyme/         # Panel de dueños de MiPyME
│   └── api/            # API routes (auth, upload, interact)
├── components/
│   ├── admin/          # Componentes del panel admin
│   ├── mipyme/         # Componentes del panel MiPyME
│   ├── MapView.tsx     # Mapa Leaflet interactivo
│   ├── SearchView.tsx  # Búsqueda con debounce y filtros
│   └── TopNav.tsx      # Navegación principal
├── lib/
│   ├── auth.ts         # Configuración de next-auth
│   ├── prisma.ts       # Cliente Prisma singleton
│   ├── supabase.ts     # Cliente Supabase (opcional)
│   └── constants.ts    # Constantes (centro mapa, zoom, etc.)
└── types/
    └── index.ts        # Tipos TypeScript compartidos

prisma/
├── schema.prisma       # Modelos de base de datos
└── seed.ts             # Datos de prueba
```

---

## Diseño

- Tema oscuro brutalista con bordes rectos (border-radius: 0)
- Paleta: fondo `#0f172a`, acento `#38bdf8` (cyan)
- Popups de mapa semitransparentes con efecto blur
- Interfaz responsive adaptable a móvil

---

## Licencia

MIT
