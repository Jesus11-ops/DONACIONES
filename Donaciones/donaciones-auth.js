import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ⚠️ IMPORTANTE: Reemplaza con tu configuración de Firebase del proyecto DONACIONES
const firebaseConfig = {
  apiKey: "AIzaSyC0Vbh4v0djnRcEq0bd_eCqLf8OKvtE4Mw",
  authDomain: "donaciones-1572f.firebaseapp.com",
  projectId: "donaciones-1572f",
  storageBucket: "donaciones-1572f.firebasestorage.app",
  messagingSenderId: "10897488932",
  appId: "1:10897488932:web:ec5942625384b7bea9ecb1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

console.log("🔥 Firebase Donaciones conectado");

window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  if(!email || !password){ 
    alert('⚠️ Ingrese correo y contraseña'); 
    return; 
  }

  console.log('Intentando login con', email);
  signInWithEmailAndPassword(auth, email.trim(), password)
    .then(() => {
      window.location.href = "donaciones-dashboard.html";
    })
    .catch((err) => {
      console.error('Login error', err);
      alert(`❌ Error al iniciar sesión: ${err.message}`);
    });
};

window.crearUsuario = async function(){
  const email = document.getElementById('newEmail').value;
  const password = document.getElementById('newPassword').value;
  
  if(!email || !password){ 
    alert('⚠️ Ingrese correo y contraseña'); 
    return; 
  }

  try{
    // Comprobar cuántos usuarios existen
    const col = collection(db, 'users');
    const snaps = await getDocs(col);
    
    if(snaps.size >= 5){ 
      alert('⚠️ Ya existen 4 usuarios. No se pueden crear más.'); 
      return; 
    }

    // Crear usuario en Firebase Auth
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    
    // Guardar metadata en Firestore
    await addDoc(col, { 
      uid: cred.user.uid, 
      email, 
      createdAt: new Date().toISOString() 
    });

    alert('✅ Usuario creado correctamente');
    
    // Limpiar campos
    document.getElementById('newEmail').value = '';
    document.getElementById('newPassword').value = '';
    
    // Cerrar el formulario
    toggleCrear();
  }catch(err){
    console.error(err);
    alert('❌ Error creando usuario: ' + (err.message || err));
  }
}

window.toggleCrear = function(){
  const box = document.getElementById('createUserBox');
  if(!box) return;
  box.style.display = (box.style.display === 'none' || box.style.display === '') ? 'block' : 'none';
}

export { app, auth, db };
