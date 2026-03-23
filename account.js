import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const auth = window.auth;
const db = window.db;

// 🔥 FUNCIÓN
function getPasoEstado(estado) {
  switch (estado) {
    case "pendiente": return 1;
    case "confirmado": return 2;
    case "en camino": return 3;
    case "entregado": return 4;
    default: return 1;
  }
}

// Detectar usuario
onAuthStateChanged(auth, async (user) => {

  if (user) {

    document.getElementById("user-email").textContent = user.email;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      document.getElementById("user-name").value = data.nombre || "";
      document.getElementById("user-dni").value = data.dni || "";
    }

    cargarPedidos(user);

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

// Mostrar secciones
window.mostrarPedidos = function () {
  document.getElementById("seccion-datos").classList.add("hidden");
  document.getElementById("seccion-pedidos").classList.remove("hidden");
};

window.mostrarDatos = function () {
  document.getElementById("seccion-datos").classList.remove("hidden");
  document.getElementById("seccion-pedidos").classList.add("hidden");
};

// 🔥 CARGAR PEDIDOS
async function cargarPedidos(user) {
  const contenedor = document.getElementById("mis-pedidos");

  const q = query(
    collection(db, "pedidos"),
    where("userId", "==", user.uid)
  );

  const snapshot = await getDocs(q);

  contenedor.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const paso = getPasoEstado(data.estado);

    contenedor.innerHTML += `
    <div class="border border-white/10 p-5 rounded-xl space-y-4">

      <!-- 🔥 BARRA -->
      <div class="flex items-center justify-between text-xs text-zinc-400">

        ${["Recibido", "Confirmado", "En camino", "Entregado"].map((etapa, i) => {

          let icono = "";

          if (etapa === "Confirmado") {
            icono = '<img src="img/LOGO-NEGRO.jpg" class="w-6 h-6 mb-1">';
          }

          if (etapa === "En camino") {
            icono = '<img src="img/LOGO-NEGRO.jpg" class="w-6 h-6 mb-1">';
          }

          if (etapa === "Entregado") {
            icono = '<img src="img/LOGO-NEGRO.jpg" class="w-6 h-6 mb-1">';
          }

          return `
            <div class="flex-1 flex flex-col items-center relative gap-1">

              ${icono}

              <div class="w-8 h-8 flex items-center justify-center rounded-full border 
              ${paso > i ? "bg-purple-600 border-purple-600 text-white" : "border-zinc-600"}">
                ${paso > i ? "✓" : ""}
              </div>

              <p class="mt-2">${etapa}</p>

              ${i < 3 ? `<div class="absolute top-1/2 -translate-y-1/2 left-full w-full h-[2px] 
              ${paso > i+1 ? "bg-purple-600" : "bg-zinc-700"}"></div>` : ""}

            </div>
          `;
        }).join("")}

      </div>

      <!-- 📅 FECHA -->
      <p class="text-xs text-zinc-500">
        ${data.fecha ? new Date(data.fecha.seconds * 1000).toLocaleString() : ""}
      </p>

      <!-- 🛒 PRODUCTOS -->
      <div class="space-y-3">
        ${data.productos ? data.productos.map(p => `
          <div class="flex items-center gap-3">

            <img src="${p.image}" class="w-14 h-14 object-cover rounded-lg">

            <div>
              <p class="text-sm">${p.name}</p>
              <p class="text-xs text-zinc-500">${p.size || ""}</p>
            </div>

          </div>
        `).join("") : ""}
      </div>

    </div>
    `;
  });
}