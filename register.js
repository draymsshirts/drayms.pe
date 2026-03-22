import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.register = async function () {

  const nombre = document.getElementById("nombre").value;
  const dni = document.getElementById("dni").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  try {

    // 🔐 Crear usuario
    const userCredential = await createUserWithEmailAndPassword(window.auth, email, password);
    const user = userCredential.user;

    // 🗄️ GUARDAR EN FIRESTORE (AQUÍ ESTÁ LA CLAVE)
    await setDoc(doc(window.db, "usuarios", user.uid), {
      nombre: nombre,
      dni: dni,
      email: email
    });

    window.location.href = "account.html";
    setTimeout(() => {
  window.location.href = "login.html";
}, 1500);

  } catch (error) {
    mensaje.textContent = error.message;
  }
};