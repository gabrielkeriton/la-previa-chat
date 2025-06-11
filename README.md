# La Previa Chat - Documentación del Proyecto

## Descripción
La Previa Chat es una aplicación de chat social inspirada en Bate-Papo UOL, adaptada para usuarios argentinos. La aplicación permite a los usuarios conectarse en salas de chat temáticas, enviar mensajes en tiempo real, buscar otros usuarios y disfrutar de funciones premium con la suscripción VIP.

## Tecnologías Utilizadas
- **Frontend**: React 19.1.0 con Vite
- **Estilos**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Iconos**: Lucide React
- **Gestión de Estado**: React Context API

## Funcionalidades Implementadas

### 1. Autenticación
- ✅ Login con email y contraseña
- ✅ Registro con datos personales completos
- ✅ Login con Google (configurado para demo)
- ✅ Manejo de estado de sesión con Context API
- ✅ Validaciones de formulario

### 2. Salas de Chat
- ✅ Listado de salas en tiempo real
- ✅ Salas públicas, privadas y VIP
- ✅ Navegación entre salas
- ✅ Contador de participantes
- ✅ Salas predeterminadas argentinas

### 3. Chat en Tiempo Real
- ✅ Envío y recepción de mensajes instantáneos
- ✅ Soporte para texto y emojis
- ✅ Mensajes de audio (solo VIP)
- ✅ Mensajes de imagen
- ✅ Burbujas de mensaje con timestamps
- ✅ Scroll automático a nuevos mensajes

### 4. Perfiles de Usuario
- ✅ Perfil editable con foto
- ✅ Datos personales (nickname, edad, género, ubicación, intereses)
- ✅ Vista pública de perfiles de otros usuarios
- ✅ Subida de fotos de perfil
- ✅ Validación de nickname único

### 5. Búsqueda de Usuarios
- ✅ Búsqueda por nickname
- ✅ Resultados en tiempo real
- ✅ Vista previa de perfiles
- ✅ Filtros y información detallada

### 6. Seguridad y Moderación
- ✅ Sistema de bloqueo de usuarios
- ✅ Reportes de mensajes y usuarios
- ✅ Almacenamiento seguro de reportes
- ✅ Validación de contenido

### 7. Modelo Freemium
- ✅ Usuarios gratuitos vs VIP
- ✅ Funciones limitadas para usuarios gratuitos
- ✅ Banner publicitario para no-VIP
- ✅ Acceso a salas exclusivas VIP
- ✅ Envío de audios solo para VIP

### 8. UI/UX y Responsividad
- ✅ Diseño mobile-first
- ✅ Interfaz adaptativa para desktop y móvil
- ✅ Navegación inferior en móvil
- ✅ Header con menú de usuario
- ✅ Componentes reutilizables
- ✅ Animaciones suaves
- ✅ Tema argentino y colores amigables

## Estructura del Proyecto

```
src/
├── components/
│   ├── auth/
│   │   └── AuthForm.jsx
│   ├── chat/
│   │   ├── RoomList.jsx
│   │   ├── ChatWindow.jsx
│   │   ├── MessageInput.jsx
│   │   └── MessageItem.jsx
│   ├── profile/
│   │   ├── UserSearch.jsx
│   │   ├── UserProfile.jsx
│   │   └── UserPublicProfile.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── BottomNav.jsx
│   └── common/
│       ├── LoadingSpinner.jsx
│       └── AdBanner.jsx
├── contexts/
│   ├── AuthContext.jsx
│   └── ChatContext.jsx
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── roomService.js
│   ├── messageService.js
│   ├── moderationService.js
│   └── storageService.js
├── firebase/
│   ├── firebaseConfig.js
│   └── firebase.js
├── utils/
│   ├── constants.js
│   └── helpers.js
├── App.jsx
├── App.css
└── main.jsx
```

## Configuración de Firebase

El proyecto está configurado para usar Firebase con las siguientes colecciones:

### Firestore Collections:
- **users**: Perfiles de usuario
- **rooms**: Salas de chat
- **messages**: Mensajes (subcolección de rooms)
- **reports**: Reportes de moderación

### Firebase Storage:
- **profile-pictures/**: Fotos de perfil
- **audio-messages/**: Mensajes de audio
- **image-messages/**: Imágenes compartidas

## Características Argentinas

- Textos en español argentino
- Provincias argentinas en formularios
- Moneda en pesos argentinos (ARS)
- Salas temáticas adaptadas al público argentino
- Expresiones locales en la interfaz

## Instalación y Uso

1. Instalar dependencias:
```bash
npm install
# o
pnpm install
```

2. Configurar Firebase:
   - Crear proyecto en Firebase Console
   - Habilitar Authentication, Firestore y Storage
   - Actualizar credenciales en `src/firebase/firebaseConfig.js`

3. Ejecutar en desarrollo:
```bash
npm run dev
# o
pnpm run dev
```

4. Construir para producción:
```bash
npm run build
# o
pnpm run build
```

## Funciones Pendientes (Para Futuras Versiones)

- Mensajes privados entre usuarios
- Notificaciones push
- Sistema de pagos real para VIP
- Moderación automática de contenido
- Salas temporales
- Videollamadas
- Stickers y GIFs
- Temas personalizables

## Notas de Desarrollo

- La configuración de Firebase actual es para demo/desarrollo
- Las credenciales reales deben configurarse en variables de entorno
- El sistema de pagos VIP está simulado
- Las reglas de seguridad de Firestore deben implementarse en producción
- Se recomienda implementar rate limiting para prevenir spam

## Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles iOS/Android
- ✅ Tablets

## Rendimiento

- Lazy loading de componentes
- Optimización de imágenes
- Debounce en búsquedas
- Paginación de mensajes
- Compresión de assets

---

**Desarrollado por Manus AI para el proyecto La Previa Chat**

