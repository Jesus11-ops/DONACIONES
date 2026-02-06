import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// ⚠️ IMPORTANTE: Reemplaza con tu configuración de Firebase del proyecto DONACIONES
const firebaseConfig = {
  apiKey: "AIzaSyC0Vbh4v0djnRcEq0bd_eCqLf8OKvtE4Mw",
  authDomain: "donaciones-1572f.firebaseapp.com",
  projectId: "donaciones-1572f",
  storageBucket: "donaciones-1572f.firebasestorage.app",
  messagingSenderId: "10897488932",
  appId: "1:10897488932:web:ec5942625384b7bea9ecb1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

console.log("🔥 Firebase Donaciones App conectado");

// ==================== FORMATEO DE NÚMEROS ====================
// Función para formatear números con separadores de miles
function formatearNumero(valor) {
  // Eliminar todo excepto números
  const numero = valor.replace(/\D/g, '');
  
  // Convertir a número y formatear
  if (numero === '') return '';
  
  return Number(numero).toLocaleString('es-CO');
}

// Función para obtener el valor numérico sin formato
function obtenerValorNumerico(valor) {
  const numero = valor.replace(/\D/g, '');
  return numero === '' ? 0 : Number(numero);
}

// Aplicar formateo a los campos numéricos
function aplicarFormateoNumero(inputId, hiddenId) {
  const input = document.getElementById(inputId);
  const hidden = document.getElementById(hiddenId);
  
  if (!input) return;
  
  input.addEventListener('input', function(e) {
    const cursorPos = e.target.selectionStart;
    const valorAnterior = e.target.value;
    const longitudAnterior = valorAnterior.length;
    
    // Formatear el valor
    const valorFormateado = formatearNumero(e.target.value);
    e.target.value = valorFormateado;
    
    // Guardar el valor numérico en el campo oculto
    if (hidden) {
      hidden.value = obtenerValorNumerico(valorFormateado);
    }
    
    // Ajustar posición del cursor
    const longitudNueva = valorFormateado.length;
    const diferencia = longitudNueva - longitudAnterior;
    const nuevaPosicion = cursorPos + diferencia;
    
    e.target.setSelectionRange(nuevaPosicion, nuevaPosicion);
  });
  
  // Formatear también al salir del campo (blur)
  input.addEventListener('blur', function(e) {
    if (e.target.value === '') {
      e.target.value = '0';
      if (hidden) hidden.value = '0';
    }
  });
  
  // Limpiar al enfocar si es 0
  input.addEventListener('focus', function(e) {
    if (e.target.value === '0') {
      e.target.value = '';
      if (hidden) hidden.value = '0';
    }
  });
}

// Inicializar formateo cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', () => {
  aplicarFormateoNumero('ofrendaSolidaria', 'ofrendaSolidariaValue');
  aplicarFormateoNumero('aporteIndividual', 'aporteIndividualValue');
  
  // Establecer fecha actual por defecto
  const fechaInput = document.getElementById('fecha');
  if(fechaInput){
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;
  }
});

// ==================== AUTENTICACIÓN ====================
// Verificar autenticación
onAuthStateChanged(auth, user => {
  if (!user) {
    if (!location.pathname.endsWith('donaciones-index.html') && !location.pathname.endsWith('/')) {
      window.location.href = 'donaciones-index.html';
    }
  } else {
    console.log('Usuario autenticado:', user.email);
  }
});

// Cerrar sesión
window.cerrarSesion = async function(){
  try{
    await signOut(auth);
    window.location.href = 'donaciones-index.html';
  }catch(e){
    console.error('Error cerrando sesión', e);
    alert('❌ Error al cerrar sesión');
  }
}

// ==================== TOGGLE TIPO DE DONACIÓN ====================
// Toggle para cambiar entre Congregación y Aporte Personal
window.toggleTipoDonacion = function(){
  const checkbox = document.getElementById('esAportePersonal');
  const seccionCongregacion = document.getElementById('seccionCongregacion');
  const seccionAportePersonal = document.getElementById('seccionAportePersonal');
  
  if(checkbox && seccionCongregacion && seccionAportePersonal){
    if(checkbox.checked){
      // Es aporte personal
      seccionCongregacion.style.display = 'none';
      seccionAportePersonal.style.display = 'block';
      
      // Limpiar solo campos específicos de congregación (pastor y ofrenda solidaria)
      document.getElementById('nombrePastor').value = '';
      document.getElementById('ofrendaSolidaria').value = '0';
      document.getElementById('ofrendaSolidariaValue').value = '0';
    } else {
      // Es congregación
      seccionCongregacion.style.display = 'block';
      seccionAportePersonal.style.display = 'none';
      
      // Limpiar campos de aporte personal
      document.getElementById('aportePersonalCongregacion').value = '';
      document.getElementById('aportePersonalNombre').value = '';
      document.getElementById('aporteIndividual').value = '0';
      document.getElementById('aporteIndividualValue').value = '0';
      document.getElementById('foto').value = '';
      document.getElementById('previewContainer').style.display = 'none';
    }
  }
}

// Toggle para mostrar/ocultar aporte personal (ya no se usa, pero lo dejamos por compatibilidad)
window.toggleAportePersonal = function(){
  toggleTipoDonacion();
}

// ==================== PREVIEW FOTO ====================
// Preview de la foto
const fotoInput = document.getElementById('foto');
if(fotoInput){
  fotoInput.addEventListener('change', function(e){
    const file = e.target.files[0];
    if(file){
      const reader = new FileReader();
      reader.onload = function(e){
        const preview = document.getElementById('preview');
        const container = document.getElementById('previewContainer');
        if(preview && container){
          preview.src = e.target.result;
          container.style.display = 'block';
        }
      }
      reader.readAsDataURL(file);
    }
  });
}

// ==================== GUARDAR DONACIÓN ====================
// Guardar donación
window.guardarDonacion = async function(){
  // Deshabilitar botón para evitar doble clic
  const btnGuardar = event.target;
  const textoOriginal = btnGuardar.textContent;
  btnGuardar.disabled = true;
  btnGuardar.textContent = '⏳ Guardando...';
  
  try{
    // Obtener valores del formulario
    const fecha = document.getElementById('fecha').value;
    const esAportePersonal = document.getElementById('esAportePersonal').checked;
    
    // Validar fecha
    if(!fecha){
      alert('⚠️ Seleccione una fecha');
      btnGuardar.disabled = false;
      btnGuardar.textContent = textoOriginal;
      return;
    }

    // Calcular día de la semana
    const [anio, mes, dia] = fecha.split("-");
    const fechaObj = new Date(anio, mes - 1, dia);
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaSemana = dias[fechaObj.getDay()];

    // Objeto base de donación
    const donacion = {
      fecha,
      diaSemana,
      tieneAportePersonal: esAportePersonal,
      createdAt: new Date().toISOString()
    };

    if(esAportePersonal){
      // Es un aporte personal
      const aportePersonalCongregacion = document.getElementById('aportePersonalCongregacion').value;
      const aportePersonalNombre = document.getElementById('aportePersonalNombre').value;
      const aporteIndividual = obtenerValorNumerico(document.getElementById('aporteIndividual').value);
      const fotoFile = document.getElementById('foto').files[0];

      if(!aportePersonalCongregacion.trim()){
        alert('⚠️ Ingrese el nombre de la congregación');
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
        return;
      }

      if(!aportePersonalNombre.trim()){
        alert('⚠️ Ingrese el nombre de la persona que hace el aporte');
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
        return;
      }

      if(aporteIndividual <= 0){
        alert('⚠️ Ingrese un monto válido para el aporte');
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
        return;
      }

      donacion.aportePersonal = aportePersonalNombre.trim();
      donacion.aporteIndividual = aporteIndividual;
      donacion.ofrendaSolidaria = 0;
      donacion.nombreCongregacion = aportePersonalCongregacion.trim();
      donacion.nombrePastor = '';

      // Subir foto si existe
      if(fotoFile){
        console.log('📸 Subiendo foto:', fotoFile.name, 'Tamaño:', (fotoFile.size / 1024 / 1024).toFixed(2), 'MB');
        
        // Validar tamaño de archivo (máx 5MB)
        if(fotoFile.size > 5 * 1024 * 1024){
          alert('⚠️ La foto es muy grande. El tamaño máximo es 5MB');
          btnGuardar.disabled = false;
          btnGuardar.textContent = textoOriginal;
          return;
        }
        
        // Validar tipo de archivo
        if(!fotoFile.type.startsWith('image/')){
          alert('⚠️ Solo se permiten archivos de imagen');
          btnGuardar.disabled = false;
          btnGuardar.textContent = textoOriginal;
          return;
        }
        
        btnGuardar.textContent = '📤 Subiendo foto...';
        
        try {
          const storageRef = ref(storage, `donaciones/${Date.now()}_${fotoFile.name}`);
          console.log('📁 Ruta de storage:', storageRef.fullPath);
          
          const snapshot = await uploadBytes(storageRef, fotoFile);
          console.log('✅ Foto subida exitosamente');
          
          const fotoURL = await getDownloadURL(snapshot.ref);
          console.log('🔗 URL obtenida:', fotoURL);
          
          donacion.foto = fotoURL;
          donacion.fotoPath = snapshot.ref.fullPath;
        } catch(uploadError) {
          console.error('❌ Error subiendo foto:', uploadError);
          alert(`❌ Error al subir la foto: ${uploadError.message}\n\nVerifique:\n1. Reglas de Storage en Firebase\n2. Tamaño del archivo (máx 5MB)\n3. Formato de imagen válido`);
          btnGuardar.disabled = false;
          btnGuardar.textContent = textoOriginal;
          return;
        }
      }
    } else {
      // Es una donación de congregación
      const nombreCongregacion = document.getElementById('nombreCongregacion').value;
      const nombrePastor = document.getElementById('nombrePastor').value;
      const ofrendaSolidaria = obtenerValorNumerico(document.getElementById('ofrendaSolidaria').value);

      if(!nombreCongregacion.trim()){
        alert('⚠️ Ingrese el nombre de la congregación');
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
        return;
      }

      if(!nombrePastor.trim()){
        alert('⚠️ Ingrese el nombre del pastor');
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
        return;
      }

      if(ofrendaSolidaria <= 0){
        alert('⚠️ Ingrese un monto válido para la ofrenda solidaria');
        btnGuardar.disabled = false;
        btnGuardar.textContent = textoOriginal;
        return;
      }

      donacion.nombreCongregacion = nombreCongregacion.trim();
      donacion.nombrePastor = nombrePastor.trim();
      donacion.ofrendaSolidaria = ofrendaSolidaria;
      donacion.aporteIndividual = 0;
    }

    // Guardar en Firestore
    btnGuardar.textContent = '💾 Guardando en base de datos...';
    console.log('💾 Guardando donación:', donacion);
    
    await addDoc(collection(db, 'Donaciones'), donacion);
    
    console.log('✅ Donación guardada exitosamente');
    alert('✅ Donación guardada correctamente');

    // Limpiar formulario
    limpiarFormulario();

  }catch(err){
    console.error('❌ Error guardando donación:', err);
    console.error('Detalles del error:', {
      code: err.code,
      message: err.message,
      stack: err.stack
    });
    alert(`❌ Error al guardar: ${err.message}\n\nRevise la consola del navegador (F12) para más detalles`);
  } finally {
    // Rehabilitar botón
    btnGuardar.disabled = false;
    btnGuardar.textContent = textoOriginal;
  }
}

// ==================== LIMPIAR FORMULARIO ====================
function limpiarFormulario(){
  const campos = ['fecha', 'nombreCongregacion', 'nombrePastor', 'aportePersonalCongregacion', 'aportePersonalNombre'];
  campos.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
  
  // Limpiar campos numéricos con formato
  const ofrendaInput = document.getElementById('aporteIndividual');
  const ofrendaHidden = document.getElementById('ofrendaSolidariaValue');
  if(ofrendaInput) ofrendaInput.value = '0';
  if(ofrendaHidden) ofrendaHidden.value = '0';
  
  const aporteInput = document.getElementById('aporteIndividual');
  const aporteHidden = document.getElementById('aporteIndividualValue');
  if(aporteInput) aporteInput.value = '0';
  if(aporteHidden) aporteHidden.value = '0';
  
  const checkbox = document.getElementById('esAportePersonal');
  if(checkbox) checkbox.checked = false;
  
  const foto = document.getElementById('foto');
  if(foto) foto.value = '';
  
  const preview = document.getElementById('previewContainer');
  if(preview) preview.style.display = 'none';
  
  // Mostrar sección de congregación por defecto
  const seccionCongregacion = document.getElementById('seccionCongregacion');
  const seccionAportePersonal = document.getElementById('seccionAportePersonal');
  if(seccionCongregacion) seccionCongregacion.style.display = 'block';
  if(seccionAportePersonal) seccionAportePersonal.style.display = 'none';
  
  // Poner foco en fecha
  const fechaEl = document.getElementById('fecha');
  if(fechaEl) fechaEl.focus();
}

// ==================== CARGAR Y MOSTRAR DONACIONES ====================
// Cargar y mostrar donaciones
const listaDonaciones = document.getElementById('listaDonaciones');

if(listaDonaciones){
  const q = query(collection(db, 'Donaciones'), orderBy('fecha', 'desc'));
  
  onSnapshot(q, (snapshot) => {
    if(snapshot.empty){
      listaDonaciones.innerHTML = '<p class="muted" style="text-align:center;padding:20px">No hay donaciones registradas aún</p>';
      actualizarTotales(0, 0, 0, 0, 0, 0, {});
      return;
    }

    let html = '<div class="donaciones-grid">';
    let totalOfrendas = 0;
    let totalAportes = 0;
    let conteo = 0;
    let cantidadOfrendas = 0;
    let cantidadAportes = 0;
    let congregaciones = {}; // Objeto para agrupar por congregación

    snapshot.forEach(docSnap => {
      const d = docSnap.data();
      conteo++;
      
      // Calcular totales
      const ofrendaSolidaria = d.ofrendaSolidaria || 0;
      const aporteIndividual = d.aporteIndividual || 0;
      totalOfrendas += ofrendaSolidaria;
      totalAportes += aporteIndividual;
      
      // Contar cantidades
      if(d.tieneAportePersonal){
        cantidadAportes++;
      } else {
        cantidadOfrendas++;
      }
      
      // Agrupar por congregación
      const nombreCong = d.nombreCongregacion || 'Sin nombre';
      if(!congregaciones[nombreCong]){
        congregaciones[nombreCong] = {
          totalSolidario: 0,
          totalIndividual: 0,
          cantidadSolidario: 0,
          cantidadIndividual: 0
        };
      }
      
      if(d.tieneAportePersonal){
        congregaciones[nombreCong].totalIndividual += aporteIndividual;
        congregaciones[nombreCong].cantidadIndividual++;
      } else {
        congregaciones[nombreCong].totalSolidario += ofrendaSolidaria;
        congregaciones[nombreCong].cantidadSolidario++;
      }
      
      const total = ofrendaSolidaria + aporteIndividual;
      
      // Si es aporte personal, mostrar nombre, congregación, valor y fecha
      if(d.tieneAportePersonal && d.aportePersonal){
        html += `
          <div class="donacion-card aporte-personal-card">
            <div class="donacion-header">
              <div>
                <h3>👤 ${d.aportePersonal}</h3>
                <p class="muted">⛪ ${d.nombreCongregacion || 'Sin congregación'}</p>
                <p class="muted">📅 ${d.diaSemana || ''} • ${d.fecha}</p>
              </div>
              <div class="donacion-total">$${aporteIndividual.toLocaleString('es-CO')}</div>
            </div>
            
            <div class="donacion-body">
              <div class="info-row">
                <span class="label">💰 Aporte Individual:</span>
                <span>$${aporteIndividual.toLocaleString('es-CO')}</span>
              </div>
              ${d.foto ? `
                <div style="margin-top:10px">
                  <img src="${d.foto}" alt="Comprobante" class="comprobante-foto" onclick="verFoto('${d.foto}')">
                </div>
              ` : ''}
            </div>
            
            <div class="donacion-actions">
              <button class="btn edit" onclick="editarDonacion('${docSnap.id}')">✏️ Editar</button>
              <button class="btn delete" onclick="eliminarDonacion('${docSnap.id}', '${d.fotoPath || ''}')">🗑️ Eliminar</button>
            </div>
          </div>
        `;
      } else {
        // Donación normal (congregación)
        html += `
          <div class="donacion-card">
            <div class="donacion-header">
              <div>
                <h3>⛪ ${d.nombreCongregacion}</h3>
                <p class="muted">📅 ${d.diaSemana || ''} • ${d.fecha}</p>
              </div>
              <div class="donacion-total">$${total.toLocaleString('es-CO')}</div>
            </div>
            
            <div class="donacion-body">
              <div class="info-row">
                <span class="label">👨‍🏫 Pastor:</span>
                <span>${d.nombrePastor}</span>
              </div>
              
              <div class="info-row">
                <span class="label">💵 Ofrenda Solidaria:</span>
                <span>$${ofrendaSolidaria.toLocaleString('es-CO')}</span>
              </div>
            </div>
            
            <div class="donacion-actions">
              <button class="btn edit" onclick="editarDonacion('${docSnap.id}')">✏️ Editar</button>
              <button class="btn delete" onclick="eliminarDonacion('${docSnap.id}', '${d.fotoPath || ''}')">🗑️ Eliminar</button>
            </div>
          </div>
        `;
      }
    });

    html += '</div>';
    listaDonaciones.innerHTML = html;
    
    // Actualizar totales
    actualizarTotales(totalOfrendas, totalAportes, totalOfrendas + totalAportes, conteo, cantidadOfrendas, cantidadAportes, congregaciones);
  });
}

// ==================== ACTUALIZAR TOTALES ====================
// Función para actualizar los totales en el resumen
function actualizarTotales(ofrendas, aportes, general, cantidad, cantOfrendas, cantAportes, congregaciones){
  const totalOfrendasEl = document.getElementById('totalOfrendas');
  const totalAportesEl = document.getElementById('totalAportes');
  const totalGeneralEl = document.getElementById('totalGeneral');
  const totalDonacionesEl = document.getElementById('totalDonaciones');
  const cantidadOfrendasEl = document.getElementById('cantidadOfrendas');
  const cantidadAportesEl = document.getElementById('cantidadAportes');
  
  if(totalOfrendasEl) totalOfrendasEl.textContent = `$${ofrendas.toLocaleString('es-CO')}`;
  if(totalAportesEl) totalAportesEl.textContent = `$${aportes.toLocaleString('es-CO')}`;
  if(totalGeneralEl) totalGeneralEl.textContent = `$${general.toLocaleString('es-CO')}`;
  if(totalDonacionesEl) totalDonacionesEl.textContent = `${cantidad} donaciones`;
  if(cantidadOfrendasEl) cantidadOfrendasEl.textContent = `${cantOfrendas} aportes`;
  if(cantidadAportesEl) cantidadAportesEl.textContent = `${cantAportes} aportes`;
  
  // Actualizar tabla de congregaciones
  const tablaCongregaciones = document.getElementById('tablaCongregaciones');
  if(tablaCongregaciones && congregaciones){
    let htmlTabla = '<div class="tabla-congregaciones-container">';
    htmlTabla += '<table class="tabla-congregaciones">';
    htmlTabla += `
      <thead>
        <tr>
          <th>Congregación</th>
          <th>Ofrendas Solidarias</th>
          <th>Cantidad</th>
          <th>Aportes Individuales</th>
          <th>Cantidad</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
    `;
    
    // Ordenar congregaciones alfabéticamente
    const congregacionesOrdenadas = Object.keys(congregaciones).sort();
    
    congregacionesOrdenadas.forEach(nombre => {
      const cong = congregaciones[nombre];
      const totalCong = cong.totalSolidario + cong.totalIndividual;
      
      htmlTabla += `
        <tr>
          <td class="cong-nombre">${nombre}</td>
          <td class="cong-valor">$${cong.totalSolidario.toLocaleString('es-CO')}</td>
          <td class="cong-cantidad">${cong.cantidadSolidario}</td>
          <td class="cong-valor">$${cong.totalIndividual.toLocaleString('es-CO')}</td>
          <td class="cong-cantidad">${cong.cantidadIndividual}</td>
          <td class="cong-total">$${totalCong.toLocaleString('es-CO')}</td>
        </tr>
      `;
    });
    
    htmlTabla += '</tbody></table></div>';
    tablaCongregaciones.innerHTML = htmlTabla;
  }
}

// ==================== VER FOTO ====================
// Ver foto en grande
window.verFoto = function(url){
  window.open(url, '_blank');
}

// ==================== EDITAR DONACIÓN ====================
// Editar donación
window.editarDonacion = async function(id){
  try{
    const ref = doc(db, 'Donaciones', id);
    const snap = await getDoc(ref);
    
    if(!snap.exists()){
      alert('❌ Donación no encontrada');
      return;
    }

    const data = snap.data();
    
    // Pedir nuevos valores
    const fecha = prompt('Fecha (YYYY-MM-DD):', data.fecha);
    if(fecha === null) return;
    
    const nombreCongregacion = prompt('Nombre Congregación:', data.nombreCongregacion);
    if(nombreCongregacion === null) return;
    
    const nombrePastor = prompt('Nombre Pastor:', data.nombrePastor);
    if(nombrePastor === null) return;
    
    const ofrendaSolidaria = prompt('Ofrenda Solidaria:', data.ofrendaSolidaria || 0);
    if(ofrendaSolidaria === null) return;

    // Calcular día de la semana
    const [anio, mes, dia] = fecha.split('-');
    const fechaObj = new Date(anio, mes - 1, dia);
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const diaSemana = dias[fechaObj.getDay()];

    const updateData = {
      fecha,
      diaSemana,
      nombreCongregacion: nombreCongregacion.trim(),
      nombrePastor: nombrePastor.trim(),
      ofrendaSolidaria: Number(ofrendaSolidaria)
    };

    // Si tiene aporte personal, permitir editarlo
    if(data.tieneAportePersonal){
      const aportePersonal = prompt('Nombre Persona (Aporte Personal):', data.aportePersonal || '');
      if(aportePersonal !== null){
        updateData.aportePersonal = aportePersonal.trim();
      }
      
      const aporteIndividual = prompt('Aporte Individual:', data.aporteIndividual || 0);
      if(aporteIndividual !== null){
        updateData.aporteIndividual = Number(aporteIndividual);
      }
    }

    await updateDoc(ref, updateData);
    alert('✅ Donación actualizada');

  }catch(err){
    console.error(err);
    alert('❌ Error al editar: ' + err.message);
  }
}

// ==================== ELIMINAR DONACIÓN ====================
// Eliminar donación
window.eliminarDonacion = async function(id, fotoPath){
  try{
    const conf = confirm('⚠️ ¿Está seguro de eliminar esta donación?');
    if(!conf) return;

    // Eliminar foto del storage si existe
    if(fotoPath){
      try{
        const fotoRef = ref(storage, fotoPath);
        await deleteObject(fotoRef);
        console.log('Foto eliminada del storage');
      }catch(err){
        console.warn('No se pudo eliminar la foto:', err);
      }
    }

    // Eliminar documento de Firestore
    const docRef = doc(db, 'Donaciones', id);
    await deleteDoc(docRef);
    
    alert('✅ Donación eliminada');

  }catch(err){
    console.error(err);
    alert('❌ Error al eliminar: ' + err.message);
  }
}