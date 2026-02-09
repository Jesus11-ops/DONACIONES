# 💰 Sistema de Control de Donaciones - ACTUALIZADO v2.1

Sistema web para gestionar donaciones de congregaciones con Firebase.

## 🆕 NOVEDADES EN ESTA VERSIÓN

### ✅ Nuevas Funcionalidades de Filtrado:

**🔍 Filtros en Tabla de Congregaciones**
- Ahora la tabla de totales por congregación incluye 3 botones de filtro:
  1. **📊 Todos**: Muestra todas las columnas (Ofrendas Solidarias + Aportes Individuales + Total)
  2. **⛪ Ofrendas Solidarias**: Muestra solo congregaciones con ofrendas solidarias y sus cantidades
  3. **👤 Aportes Individuales**: Muestra solo congregaciones con aportes individuales y sus cantidades

- Los filtros ocultan automáticamente las congregaciones que no tienen datos del tipo seleccionado
- El botón activo se destaca visualmente con color azul
- Diseño responsive para móviles

### ✅ Funcionalidades Anteriores:

1. **Campo de Congregación en Aportes Personales**
   - Cuando registras un aporte personal/individual, puedes especificar a qué congregación pertenece la persona
   - Permite un mejor seguimiento por congregación

2. **Contadores de Cantidad de Aportes**
   - El resumen general muestra:
     - Cantidad de ofrendas solidarias (ej: "7 aportes")
     - Cantidad de aportes individuales (ej: "5 aportes")
     - Total de donaciones (suma de ambos)

3. **Tabla de Totales por Congregación**
   - Resumen por cada congregación:
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
- ✅ **Tabla con filtros** de totales agrupados por congregación
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
proyecto-donaciones/
├── index.html                  # Página de login
├── donaciones-dashboard.html   # Dashboard principal
├── donaciones-auth.js          # Autenticación
├── donaciones-app.js           # Lógica principal + filtros
├── donaciones-exportar.js      # Exportar a Excel
├── donaciones-style.css        # Estilos + estilos de filtros
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
  nombreCongregacion: "Congregación Norte",
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

### Usar los Filtros de Congregaciones

**Ubicación**: Debajo del "Resumen General", en la sección "⛪ Totales por Congregación"

**Botones disponibles**:

1. **📊 Todos** (predeterminado)
   - Muestra todas las congregaciones con todas sus columnas
   - Columnas: Congregación, Ofrendas Solidarias, Cantidad, Aportes Individuales, Cantidad, Total

2. **⛪ Ofrendas Solidarias**
   - Muestra solo congregaciones que tienen ofrendas solidarias (oculta las que tienen $0)
   - Columnas: Congregación, Ofrendas Solidarias, Cantidad

3. **👤 Aportes Individuales**
   - Muestra solo congregaciones que tienen aportes individuales (oculta las que tienen $0)
   - Columnas: Congregación, Aportes Individuales, Cantidad

**Cómo usar**:
1. Haz clic en el botón del tipo de información que deseas ver
2. La tabla se actualizará automáticamente
3. El botón seleccionado se destacará en azul

**Casos de uso**:
- Ver qué congregaciones han hecho ofrendas solidarias: Click en "⛪ Ofrendas Solidarias"
- Ver qué congregaciones tienen miembros con aportes personales: Click en "👤 Aportes Individuales"
- Ver el panorama completo: Click en "📊 Todos"

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
   - **Congregación a la que pertenece la persona**
   - Nombre de la persona
   - Monto del aporte
   - (Opcional) Foto del comprobante
4. Haz clic en "Guardar Donación"

### Ver Resumen General

El sistema muestra automáticamente:
- **Total de Ofrendas Solidarias**: Suma y cantidad (ej: $5,000,000 - 7 aportes)
- **Total de Aportes Individuales**: Suma y cantidad (ej: $2,500,000 - 5 aportes)
- **Total Recolectado**: Suma total y cantidad total

### Ver Totales por Congregación con Filtros

Debajo del resumen general encontrarás:
- **Botones de filtro** para seleccionar qué tipo de información ver
- **Tabla dinámica** que se actualiza según el filtro seleccionado
- Las congregaciones siempre se muestran en orden alfabético

**Ejemplo con filtro "Todos":**
```
Congregación        | Ofrendas  | Cant | Aportes Ind | Cant | Total
--------------------|-----------|------|-------------|------|----------
Congregación Centro | $5,000,000|  3   | $1,000,000  |  2   | $6,000,000
Congregación Norte  | $3,000,000|  2   | $500,000    |  1   | $3,500,000
```

**Ejemplo con filtro "Ofrendas Solidarias":**
```
Congregación        | Ofrendas  | Cant
--------------------|-----------|------
Congregación Centro | $5,000,000|  3
Congregación Norte  | $3,000,000|  2
```

**Ejemplo con filtro "Aportes Individuales":**
```
Congregación        | Aportes Ind | Cant
--------------------|-------------|------
Congregación Centro | $1,000,000  |  2
Congregación Norte  | $500,000    |  1
```

### Exportar a Excel

1. Haz clic en "Exportar Excel"
2. El archivo incluirá:
   - Todas las donaciones con sus detalles
   - Nombre de congregación (para ambos tipos)
   - Fila de totales al final
   - Formato profesional con colores

## 📄 Diferencias Clave entre Tipos de Donación

| Aspecto | Ofrenda Solidaria | Aporte Personal |
|---------|------------------|-----------------|
| Congregación | ✅ Obligatorio | ✅ Obligatorio |
| Pastor | ✅ Obligatorio | ❌ No aplica |
| Nombre persona | ❌ No aplica | ✅ Obligatorio |
| Monto | Ofrenda Solidaria | Aporte Individual |
| Foto comprobante | ❌ No disponible | ✅ Opcional |
| Aparece en filtro "Ofrendas" | ✅ Sí | ❌ No |
| Aparece en filtro "Aportes" | ❌ No | ✅ Sí |

## 🎯 Casos de Uso con Filtros

### Caso 1: Ver solo congregaciones que han hecho ofrendas
```
1. Busca la sección "⛪ Totales por Congregación"
2. Haz click en el botón "⛪ Ofrendas Solidarias"
3. Verás solo las congregaciones con ofrendas > $0
```

### Caso 2: Ver solo congregaciones con aportes personales
```
1. Busca la sección "⛪ Totales por Congregación"
2. Haz click en el botón "👤 Aportes Individuales"
3. Verás solo las congregaciones con miembros que hicieron aportes
```

### Caso 3: Ver el panorama completo
```
1. Busca la sección "⛪ Totales por Congregación"
2. Haz click en el botón "📊 Todos" (es el predeterminado)
3. Verás todas las congregaciones con ambos tipos de aportes
```

## 📱 Compatibilidad

- ✅ Chrome, Firefox, Safari, Edge (versiones recientes)
- ✅ Dispositivos móviles (iOS, Android)
- ✅ Tablets
- ✅ Responsive design
- ✅ Botones de filtro adaptados a pantallas pequeñas

## 🔒 Seguridad

- Máximo 4 usuarios autenticados
- Reglas de Firestore y Storage configuradas
- Fotos limitadas a 5MB
- Solo imágenes permitidas

## 🛠️ Solución de Problemas

### Los filtros no funcionan
- Verifica que hayas reemplazado los 3 archivos: HTML, JS y CSS
- Refresca la página (Ctrl+F5 o Cmd+Shift+R)
- Revisa la consola del navegador (F12) para errores

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

## 📋 Archivos Modificados en v2.1

- ✅ **donaciones-dashboard.html**: Agregados botones de filtro
- ✅ **donaciones-app.js**: Agregada lógica de filtrado
- ✅ **donaciones-style.css**: Agregados estilos para botones de filtro
- ⚪ **donaciones-auth.js**: Sin cambios
- ⚪ **donaciones-exportar.js**: Sin cambios
- ⚪ **index.html**: Sin cambios

---

**Iglesia Pentecostal Unida de Colombia**
Sistema desarrollado para el control de donaciones
**Versión 2.1 - Con filtros en tabla de congregaciones**