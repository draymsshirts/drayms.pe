import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

// Detectar usuario
onAuthStateChanged(auth, async (user) => {

  if (user) {

    // Mostrar correo
    document.getElementById("user-email").textContent = user.email;

    // 🔥 TRAER DATOS DE FIRESTORE
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // 👉 Mostrar nombre
      document.getElementById("user-name").value = data.nombre || "";
      document.getElementById("user-dni").value = data.dni || "";
    }

  } else {
    window.location.href = "login.html";
  }

});

// Logout
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "login.html";
  });
};