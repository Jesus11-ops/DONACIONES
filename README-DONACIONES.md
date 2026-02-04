# 💰 Sistema de Control de Donaciones

Sistema web para gestionar donaciones de congregaciones con Firebase.

## 📋 Características

- ✅ Autenticación de usuarios (máximo 4 usuarios)
- 📝 Registro de donaciones con:
  - Nombre de Congregación
  - Nombre del Pastor
  - Ofrenda Solidaria
  - Aporte Personal (opcional)
  - Foto de comprobante
- 📊 Exportación a Excel con totales
- 🔒 Seguridad con Firebase Auth
- ☁️ Almacenamiento de fotos en Firebase Storage
- 📱 Diseño responsive

## 🚀 Configuración Inicial

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto (si aún no lo has hecho) o usa el existente "donaciones-1572f"
3. Habilita los siguientes servicios:
   - **Authentication** → Email/Password
   - **Firestore Database** → Modo producción
   - **Storage** → Modo producción

### 2. Obtener configuración de Firebase

1. En Firebase Console, ve a **Configuración del proyecto** (⚙️)
2. En la sección "Tus aplicaciones", selecciona "Web"
3. Copia el objeto `firebaseConfig`

### 3. Configurar los archivos

Reemplaza `TU_API_KEY`, `TU_AUTH_DOMAIN`, etc. en estos 3 archivos:

**📁 donaciones-auth.js** (línea 7-13)
**📁 donaciones-app.js** (línea 7-13)
**📁 donaciones-exportar.js** (línea 6-12)

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "donaciones-1572f",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 4. Configurar reglas de seguridad

#### Firestore Rules
En Firebase Console → Firestore Database → Reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Colección de donaciones
    match /Donaciones/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Colección de usuarios (solo lectura para autenticados)
    match /users/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
En Firebase Console → Storage → Reglas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /donaciones/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024  // Máx 5MB
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 5. Crear primer usuario

1. Abre `donaciones-index.html` en tu navegador
2. Haz clic en "Crear usuario"
3. Ingresa email y contraseña
4. El sistema permite máximo 4 usuarios

## 📂 Estructura de Archivos

```
proyecto-donaciones/
├── donaciones-index.html       # Página de login
├── donaciones-dashboard.html   # Dashboard principal
├── donaciones-auth.js          # Autenticación
├── donaciones-app.js           # Lógica principal
├── donaciones-exportar.js      # Exportar a Excel
├── donaciones-style.css        # Estilos
└── README.md                   # Este archivo
```

## 🗄️ Estructura de Datos en Firestore

### Colección: `Donaciones`

```javascript
{
  fecha: "2024-01-15",
  diaSemana: "Lunes",
  nombreCongregacion: "Congregación Central",
  nombrePastor: "Pastor Juan Pérez",
  ofrendaSolidaria: 5000000,
  tieneAportePersonal: true,
  aportePersonal: "María López",
  aporteIndividual: 500000,
  foto: "https://firebasestorage.googleapis.com/...",
  fotoPath: "donaciones/12345_comprobante.jpg",
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

### Colección: `users`

```javascript
{
  uid: "abc123...",
  email: "usuario@ejemplo.com",
  createdAt: "2024-01-15T10:00:00.000Z"
}
```

## 💡 Uso del Sistema

### Registrar Donación

1. Selecciona la fecha
2. Ingresa nombre de congregación
3. Ingresa nombre del pastor
4. Ingresa monto de ofrenda solidaria
5. (Opcional) Marca "¿Incluye Aporte Personal?"
   - Ingresa nombre de la persona
   - Ingresa monto del aporte
   - Sube foto del comprobante
6. Haz clic en "Guardar Donación"

### Exportar a Excel

1. Haz clic en "Exportar Excel"
2. Se descargará un archivo con:
   - Todas las donaciones
   - Formato profesional con colores
   - Fila de totales al final

### Editar/Eliminar

- Cada tarjeta de donación tiene botones para editar o eliminar
- Al eliminar se borra también la foto del Storage

## 🔒 Seguridad

- ✅ Máximo 4 usuarios
- ✅ Autenticación requerida para acceder
- ✅ Reglas de Firestore y Storage configuradas
- ✅ Fotos limitadas a 5MB
- ✅ Solo imágenes permitidas

## 🛠️ Solución de Problemas

### Error: "Firebase: Error (auth/wrong-password)"
- Verifica que la contraseña sea correcta

### Error: "Missing or insufficient permissions"
- Verifica que las reglas de Firestore estén publicadas
- Asegúrate de estar autenticado

### Las fotos no se suben
- Verifica las reglas de Storage
- Verifica que el archivo sea una imagen
- Verifica que sea menor a 5MB

### No puedo crear más usuarios
- El sistema solo permite 4 usuarios máximo
- Elimina un usuario existente desde Firebase Console

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones recientes)
- ✅ Dispositivos móviles (iOS, Android)
- ✅ Tablets

## 📞 Soporte

Para problemas técnicos:
1. Revisa la consola del navegador (F12)
2. Verifica la configuración de Firebase
3. Verifica que las reglas estén publicadas

---

**Iglesia Pentecostal Unida de Colombia**
Sistema desarrollado para el control de donaciones
