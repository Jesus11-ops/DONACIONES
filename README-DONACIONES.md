# 💰 Sistema de Control de Donaciones - ACTUALIZADO

Sistema web para gestionar donaciones de congregaciones con Firebase.

## 🆕 NOVEDADES EN ESTA VERSIÓN

### ✅ Nuevas Funcionalidades:

1. **Campo de Congregación en Aportes Personales**
   - Ahora cuando registras un aporte personal/individual, también puedes especificar a qué congregación pertenece la persona
   - Esto permite un mejor seguimiento por congregación

2. **Contadores de Cantidad de Aportes**
   - El resumen general ahora muestra:
     - Cantidad de ofrendas solidarias (ej: "7 aportes")
     - Cantidad de aportes individuales (ej: "5 aportes")
     - Total de donaciones (suma de ambos)

3. **Tabla de Totales por Congregación**
   - Nueva sección que muestra un resumen por cada congregación:
     - Total de ofrendas solidarias y su cantidad
     - Total de aportes individuales y su cantidad
     - Total general por congregación
   - Las congregaciones se ordenan alfabéticamente

## 📋 Características Principales

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
- ✅ Resumen con totales monetarios Y cantidades de aportes
- ✅ Tabla de totales agrupados por congregación
- ✅ Exportación a Excel con todos los datos
- ✅ Almacenamiento de fotos en Firebase Storage
- ✅ Diseño responsive para móviles y tablets

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

**📁 donaciones-auth.js** (líneas 7-13)
**📁 donaciones-app.js** (líneas 7-13)
**📁 donaciones-exportar.js** (líneas 6-12)

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
proyecto-donaciones/
├── index.html                  # Página de login
├── donaciones-dashboard.html   # Dashboard principal
├── donaciones-auth.js          # Autenticación
├── donaciones-app.js           # Lógica principal
├── donaciones-exportar.js      # Exportar a Excel
├── donaciones-style.css        # Estilos
└── README.md                   # Este archivo
```

## 🗄️ Estructura de Datos en Firestore

### Ofrenda Solidaria (Congregación)
```javascript
{
  fecha: "2024-01-15",
  diaSemana: "Lunes",
  nombreCongregacion: "Congregación Central",
  nombrePastor: "Pastor Juan Pérez",
  ofrendaSolidaria: 5000000,
  tieneAportePersonal: false,
  aporteIndividual: 0,
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

### Aporte Personal/Individual
```javascript
{
  fecha: "2024-01-15",
  diaSemana: "Lunes",
  nombreCongregacion: "Congregación Norte",  // ← NUEVO: Congregación de la persona
  aportePersonal: "María López",
  aporteIndividual: 500000,
  tieneAportePersonal: true,
  ofrendaSolidaria: 0,
  nombrePastor: "",
  foto: "https://firebasestorage.googleapis.com/...",
  fotoPath: "donaciones/12345_comprobante.jpg",
  createdAt: "2024-01-15T10:30:00.000Z"
}
```

## 💡 Uso del Sistema

### Registrar Ofrenda Solidaria (Congregación)

1. Selecciona la fecha
2. **NO marques** el checkbox "¿Es un Aporte Personal?"
3. Ingresa:
   - Nombre de congregación
   - Nombre del pastor
   - Monto de ofrenda solidaria
4. Haz clic en "Guardar Donación"

### Registrar Aporte Personal/Individual

1. Selecciona la fecha
2. **Marca** el checkbox "¿Es un Aporte Personal?"
3. Ingresa:
   - **Congregación a la que pertenece la persona** (NUEVO)
   - Nombre de la persona
   - Monto del aporte
   - (Opcional) Foto del comprobante
4. Haz clic en "Guardar Donación"

### Ver Resumen General

El sistema muestra automáticamente:
- **Total de Ofrendas Solidarias**: Suma y cantidad (ej: $5,000,000 - 7 aportes)
- **Total de Aportes Individuales**: Suma y cantidad (ej: $2,500,000 - 5 aportes)
- **Total Recolectado**: Suma total y cantidad total

### Ver Totales por Congregación

Debajo del resumen general encontrarás una tabla que muestra:
- Nombre de cada congregación
- Total de ofrendas solidarias de esa congregación y cantidad
- Total de aportes individuales de personas de esa congregación y cantidad
- Total general por congregación

**Ejemplo de tabla:**
```
Congregación        | Ofrendas  | Cant | Aportes Ind | Cant | Total
--------------------|-----------|------|-------------|------|----------
Congregación Centro | $5,000,000|  3   | $1,000,000  |  2   | $6,000,000
Congregación Norte  | $3,000,000|  2   | $500,000    |  1   | $3,500,000
```

### Exportar a Excel

1. Haz clic en "Exportar Excel"
2. El archivo incluirá:
   - Todas las donaciones con sus detalles
   - Nombre de congregación (para ambos tipos)
   - Fila de totales al final
   - Formato profesional con colores

## 🔄 Diferencias Clave entre Tipos de Donación

| Aspecto | Ofrenda Solidaria | Aporte Personal |
|---------|------------------|-----------------|
| Congregación | ✅ Obligatorio | ✅ Obligatorio (NUEVO) |
| Pastor | ✅ Obligatorio | ❌ No aplica |
| Nombre persona | ❌ No aplica | ✅ Obligatorio |
| Monto | Ofrenda Solidaria | Aporte Individual |
| Foto comprobante | ❌ No disponible | ✅ Opcional |

## 🎯 Casos de Uso Comunes

### Caso 1: Congregación hace ofrenda solidaria
```
Tipo: Ofrenda Solidaria
Congregación: "Congregación Sur"
Pastor: "Pastor Carlos Gómez"
Monto: $2,000,000
```

### Caso 2: Persona de una congregación hace aporte personal
```
Tipo: Aporte Personal
Congregación: "Congregación Sur"  ← La persona es de esta congregación
Persona: "Ana Martínez"
Monto: $300,000
Foto: [comprobante.jpg]
```

**Resultado en la tabla por congregación:**
```
Congregación Sur:
- Ofrendas Solidarias: $2,000,000 (1 aporte)
- Aportes Individuales: $300,000 (1 aporte)
- Total: $2,300,000
```

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones recientes)
- ✅ Dispositivos móviles (iOS, Android)
- ✅ Tablets
- ✅ Responsive design

## 🔒 Seguridad

- Máximo 4 usuarios autenticados
- Reglas de Firestore y Storage configuradas
- Fotos limitadas a 5MB
- Solo imágenes permitidas

## 🛠️ Solución de Problemas

### No veo el campo de congregación en aportes personales
- Verifica que estés usando la versión actualizada del dashboard
- Asegúrate de marcar el checkbox "¿Es un Aporte Personal?"

### La tabla de congregaciones no se muestra
- Verifica que haya al menos una donación registrada
- Revisa la consola del navegador (F12) para errores

### Los contadores no se actualizan
- Refresca la página
- Verifica tu conexión a internet
- Revisa las reglas de Firestore

---

**Iglesia Pentecostal Unida de Colombia**
Sistema desarrollado para el control de donaciones
Versión 2.0 - Con totales por congregación y contadores