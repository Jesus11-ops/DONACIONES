# 💰 Sistema de Control de Donaciones - ACTUALIZADO v3.0

Sistema web para gestionar donaciones de congregaciones con Firebase.

## 🆕 NOVEDADES EN VERSIÓN 3.0

### ✅ ID Numérico para Cada Donación

Cada donación ahora tiene un **ID numérico único y secuencial** que aparece en:
- 🏷️ Badge dorado en la esquina superior de cada tarjeta de registro  
- 📊 Columna "IDs" en la tabla de congregaciones (filtros Ofrendas/Aportes)
- 💡 Facilita la relación visual entre la tabla resumen y las tarjetas detalladas

**Ejemplo:**
- Tarjeta muestra: `#15 👤 María López`
- Tabla muestra: `María López (#15)` o en columna IDs: `#15, #16`

### ✅ Columna "Donante" en Tabla de Congregaciones

La tabla ahora tiene una **columna "ID"** al inicio y muestra quiénes donaron:

**Modo "Todos":**
- Primera columna "ID" muestra todos los IDs de esa congregación: `#5, #12, #18`
- Columna "Donante" lista solo los nombres: `María López, Juan Pérez`
- Fácil relacionar: ves el ID #5, buscas abajo la tarjeta con badge #5

**Modo "Ofrendas Solidarias":**
- Columna "ID" muestra los IDs de las ofrendas: `#5, #12`
- Columna "Pastor" muestra el nombre del pastor

**Modo "Aportes Individuales":**
- Columna "ID" muestra los IDs: `#15, #16, #22`
- Columna "Donante" lista nombres: `María López, Juan Pérez, Ana García`

### ✅ Relación Visual Tabla-Tarjetas

Ahora puedes:
1. Ver el ID en la tabla (ej: `#15`)
2. Scroll hacia abajo
3. Ubicar rápidamente la tarjeta con el badge `#15`

## 📋 Características Completas del Sistema

- ✅ Autenticación de usuarios (máximo 4 usuarios)
- ✅ Registro de donaciones con:
  - **Ofrendas Solidarias** (de congregación)
    - Nombre de Congregación
    - Nombre del Pastor
    - Monto de ofrenda
  - **Aportes Personales/Individuales** (de personas)
    - Nombre de la Congregación a la que pertenece
    - Nombre de la Persona
    - Monto del aporte
    - Foto de comprobante (opcional)
- ✅ **ID numérico visible** en cada donación
- ✅ Resumen con totales monetarios Y cantidades de aportes
- ✅ **Tabla con filtros** mostrando personas e IDs
- ✅ Exportación a Excel con todos los datos
- ✅ Almacenamiento de fotos en Firebase Storage
- ✅ Diseño responsive para móviles y tablets

## 🎯 Ejemplos de Uso de los IDs

### Caso 1: Verificar un aporte específico
```
Usuario: "Quiero verificar el aporte de María López"
1. Ir a tabla de congregaciones
2. Click en filtro "👤 Individuales"
3. Buscar congregación de María
4. Ver en columna "ID": "#15, #16" y en columna "Donante": "María López, Juan Pérez"
5. Identificar que María es el #15 (primer nombre, primer ID)
6. Scroll abajo y buscar tarjeta con badge "#15"
7. Verificar monto y detalles
```

### Caso 2: Revisar todas las ofrendas de una congregación
```
1. Tabla → filtro "⛪ Solidarias"
2. Ver congregación "IPUC Centro"
3. Columna "ID" muestra: "#5, #12, #18"
4. Scroll abajo
5. Ubicar tarjetas #5, #12 y #18
6. Revisar fechas y montos
```
5. Revisar fechas y montos
```

### Caso 3: Auditoría completa
```
1. Tabla → filtro "📊 Todos"
2. Ver todas las congregaciones con:
   - Columna "ID": todos los IDs de esa congregación
   - Columna "Donante": quiénes aportaron individualmente
   - Totales por tipo de aporte
3. Usar IDs para verificar tarjetas individuales abajo
```

## 🚀 Configuración Inicial

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa el existente "donaciones-1572f"
3. Habilita los siguientes servicios:
   - **Authentication** → Email/Password
   - **Firestore Database** → Modo producción
   - **Storage** → Modo producción

### 2. Configurar los archivos

Reemplaza la configuración de Firebase en estos 3 archivos:

**📄 donaciones-auth.js** (líneas 7-13)
**📄 donaciones-app.js** (líneas 7-13)
**📄 donaciones-exportar.js** (líneas 6-12)

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

### 3. Configurar reglas de seguridad

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /Donaciones/{document} {
      allow read, write: if request.auth != null;
    }
    match /users/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /donaciones/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.resource.size < 5 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 📂 Estructura de Archivos

```
proyecto-donaciones-v3/
├── index.html                  # Página de login
├── donaciones-dashboard.html   # Dashboard principal
├── donaciones-auth.js          # Autenticación
├── donaciones-app.js           # Lógica principal + IDs + filtros
├── donaciones-exportar.js      # Exportar a Excel
├── donaciones-style.css        # Estilos + badges de ID
└── README.md                   # Este archivo
```

## 💡 Guía Visual de la Interfaz v3.0

### Tarjetas de Donación con ID

```
┌─────────────────────────────────────────┐
│ #15  👤 María López          $500.000   │
│      ⛪ IPUC Centro                     │
│      📅 Lunes • 2026-02-09              │
├─────────────────────────────────────────│
│ 💰 Aporte Individual: $500.000          │
│ [Imagen del comprobante]                 │
└─────────────────────────────────────────┘
```

### Tabla con Columna ID y Donante (Modo "Todos")

```
┌──────┬──────────────┬───────────────┬──────────┬──────┬─────────────┬──────┬─────────┐
│  ID  │ Congregación │ Donante       │ Ofrendas │ Cant │ Aportes Ind │ Cant │ Total   │
├──────┼──────────────┼───────────────┼──────────┼──────┼─────────────┼──────┼─────────┤
│#5,   │ IPUC Centro  │ María López,  │$1.000.000│  2   │  $1.500.000 │  3   │$2.500.000│
│#12,  │              │ Juan Pérez,   │          │      │             │      │         │
│#15,  │              │ Ana García    │          │      │             │      │         │
│#16,  │              │               │          │      │             │      │         │
│#22   │              │               │          │      │             │      │         │
└──────┴──────────────┴───────────────┴──────────┴──────┴─────────────┴──────┴─────────┘
```

### Tabla Modo "Aportes Individuales"

```
┌──────┬──────────────┬───────────────┬─────────────┬──────┐
│  ID  │ Congregación │ Donante       │ Aportes Ind │ Cant │
├──────┼──────────────┼───────────────┼─────────────┼──────┤
│#15,  │ IPUC Centro  │ María López,  │ $1.500.000  │  3   │
│#16,  │              │ Juan Pérez,   │             │      │
│#22   │              │ Ana García    │             │      │
└──────┴──────────────┴───────────────┴─────────────┴──────┘
```

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones recientes)
- ✅ Dispositivos móviles (iOS, Android)
- ✅ Tablets
- ✅ Responsive design
- ✅ Badges de ID adaptados a pantallas pequeñas

## 🔄 Actualización desde v2.1

Si ya tienes la versión 2.1 instalada:

1. Respalda tus archivos actuales
2. Reemplaza estos 2 archivos:
   - `donaciones-app.js` (contiene lógica de IDs)
   - `donaciones-style.css` (contiene estilos de badges)
3. Los demás archivos pueden quedarse igual
4. Refresca el navegador (Ctrl+F5)

**Nota:** Los IDs se generan automáticamente al cargar, no necesitas modificar la base de datos.

## 📋 Archivos Modificados en v3.0

- ✅ **donaciones-app.js**: Agregada lógica de IDs, columna persona, relación tabla-tarjetas
- ✅ **donaciones-style.css**: Agregados estilos para badges de ID y columna persona
- ⚪ **donaciones-dashboard.html**: Sin cambios
- ⚪ **donaciones-auth.js**: Sin cambios
- ⚪ **donaciones-exportar.js**: Sin cambios
- ⚪ **index.html**: Sin cambios

---

**Iglesia Pentecostal Unida de Colombia**
Sistema desarrollado para el control de donaciones
**Versión 3.0 - Con IDs numéricos y columna de personas**