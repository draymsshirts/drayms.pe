import {  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔥 SI YA ESTÁ LOGUEADO → LO MANDO A SU CUENTA
onAuthStateChanged(window.auth, (user) => {
  if (user) {
    window.location.href = "account.html";
  }
});



// 🔐 LOGIN REAL
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  if (!email || !password) {
    mensaje.innerText = "Completa todos los campos ❌";
    return;
  }

  try {
    await signInWithEmailAndPassword(window.auth, email, password);
    mensaje.innerText = "Bienvenido 🔥";

    setTimeout(() => {
      window.location.href = "account.html";
    }, 1000);

  } catch (error) {
    mensaje.innerText = "❌ " + traducirError(error.code);
  }
};

// 🆕 REGISTRO REAL
window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  if (!email || !password) {
    mensaje.innerText = "Completa los campos ❌";
    return;
  }

  try {
    await createUserWithEmailAndPassword(window.auth, email, password);
    mensaje.innerText = "Cuenta creada 🚀";

    setTimeout(() => {
      window.location.href = "account.html";
    }, 1000);

  } catch (error) {
    mensaje.innerText = "❌ " + traducirError(error.code);
  }
};

// 🎯 MENSAJES MÁS BONITOS
function traducirError(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "Ese correo ya está registrado";
    case "auth/invalid-email":
      return "Correo inválido";
    case "auth/weak-password":
      return "La contraseña debe tener mínimo 6 caracteres";
    case "auth/user-not-found":
      return "Usuario no encontrado";
    case "auth/wrong-password":
      return "Contraseña incorrecta";
    default:
      return "Error: " + code;
  }
}