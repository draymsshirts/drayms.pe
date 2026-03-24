  
  // 1️⃣ IMPORTS (ARRIBA DE TODO)
  import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


 
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

        document.getElementById("user-name").textContent = data.nombre || "";
        document.getElementById("user-apellido").textContent = data.apellido || "";
        document.getElementById("user-dni").textContent = data.dni || "";
        document.getElementById("user-telefono").textContent = data.telefono || "";
      }

      cargarPedidos(user);
      cargarDirecciones(user);

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



  // 🔥 ABRIR MODAL PERFIL
  document.getElementById("btnEditarPerfil").onclick = async () => {
    const user = auth.currentUser;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      document.getElementById("editNombre").value = data.nombre || "";
      document.getElementById("editApellido").value = data.apellido || "";
      document.getElementById("editCorreo").value = user.email;
      document.getElementById("editDni").value = data.dni || "";
      document.getElementById("editTelefono").value = data.telefono || "";
    }

    modalPerfil.classList.remove("hidden");
    modalPerfil.classList.add("flex");
  };

  // 🔥 CERRAR MODAL
  document.getElementById("cerrarPerfil").onclick = () => {
    modalPerfil.classList.add("hidden");
  };

  document.getElementById("cancelarPerfil").onclick = () => {
    modalPerfil.classList.add("hidden");
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




  // 🔥 MODAL DIRECCION
  const modalDireccion = document.getElementById("modalDireccion");


  // ABRIR
  document.getElementById("btnAgregarDireccion").onclick = () => {
  document.getElementById("hacerPrincipal").classList.add("hidden");
    modalDireccion.classList.remove("hidden");
    modalDireccion.classList.add("flex");
  };

  // CERRAR (X)
  document.getElementById("cerrarDireccion").onclick = () => {
    modalDireccion.classList.add("hidden");
    modalDireccion.classList.remove("flex");
  };

  // CANCELAR
  document.getElementById("cancelarDireccion").onclick = () => {
    modalDireccion.classList.add("hidden");
    modalDireccion.classList.remove("flex");
  };





  // 🔥 GUARDAR DIRECCIÓN
  document.getElementById("guardarDireccion").onclick = async () => {

    const user = auth.currentUser;
    if (!user) return;

    const nuevaDireccion = {
      nombre: document.getElementById("dirNombre").value,
      apellido: document.getElementById("dirApellido").value,
      direccion: document.getElementById("dirDireccion").value,
      referencia: document.getElementById("dirReferencia").value,
      ciudad: document.getElementById("dirCiudad").value,
      region: document.getElementById("dirRegion").value,
      distrito: document.getElementById("dirDistrito").value,
      telefono: document.getElementById("dirTelefono").value,
      userId: user.uid,
      fecha: new Date(),

      principal: false

    };

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    let direcciones = [];

    if (docSnap.exists()) {
      direcciones = docSnap.data().direcciones || [];
    }

    // 🔥 SI ESTÁ EDITANDO
    if (window.editandoIndex !== undefined) {
      direcciones[window.editandoIndex] = nuevaDireccion;
      window.editandoIndex = undefined;
    } else {
      // ➕ NUEVA DIRECCIÓN
      direcciones.push(nuevaDireccion);
    }

    try {
      await updateDoc(docRef, { direcciones });

      alert("Dirección guardada 🔥");

      modalDireccion.classList.add("hidden");
      modalDireccion.classList.remove("flex");

      cargarDirecciones(user);

    } catch (error) {
      console.error(error);
      alert("Error ❌");
    }
  };


  // 🔥 GUARDAR PERFIL
  document.getElementById("guardarPerfil").onclick = async () => {

    const user = auth.currentUser;
    if (!user) return;

    const nombre = document.getElementById("editNombre").value;
    const apellido = document.getElementById("editApellido").value;
    const dni = document.getElementById("editDni").value;
    const telefono = document.getElementById("editTelefono").value;

    try {

      await updateDoc(doc(db, "usuarios", user.uid), {
        nombre: nombre,
        apellido: apellido,
        dni: dni,
        telefono: telefono
      });

      alert("Perfil actualizado 🔥");

      // 🔄 ACTUALIZAR EN PANTALLA (LOS INPUTS DE ARRIBA)
      document.getElementById("user-name").value = nombre;
      document.getElementById("user-apellido").value = apellido;
      document.getElementById("user-dni").value = dni;
      document.getElementById("user-telefono").textContent = telefono;

      // cerrar modal
      modalPerfil.classList.add("hidden");
      modalPerfil.classList.remove("flex");

    } catch (error) {
      console.error(error);
      alert("Error al actualizar ❌");
    }

  };




  async function cargarDirecciones(user) {
    const contenedor = document.getElementById("lista-direcciones");

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    contenedor.innerHTML = "";

    if (docSnap.exists()) {
      const data = docSnap.data();
      const direcciones = data.direcciones || [];

      if (direcciones.length === 0) {
        contenedor.innerHTML = `<p class="text-zinc-500">No tienes direcciones aún</p>`;
        return;
      }

      direcciones.forEach((dir, index) => {
        contenedor.innerHTML += `
          <div class="border border-white/10 p-4 rounded-lg flex justify-between items-start">

            <div class="text-sm space-y-1">
              <p class="font-semibold">${dir.nombre} ${dir.apellido}
              ${dir.principal ? '<span class="text-yellow-400 ml-2 text-xs">(Principal)</span>' : ''}
              </p>
              <p>${dir.direccion}</p>
              <p class="text-zinc-400">${dir.referencia || ""}</p>
              <p>${dir.distrito}, ${dir.region}</p>
              <p>${dir.ciudad}</p>
              <p>${dir.telefono}</p>
            </div>

            <!-- ✏️ botón editar -->
            <button onclick="editarDireccion(${index})" 
              class="text-white/60 hover:text-white">
              ✏️
            </button>

          </div>
        `;
      });
    }
  }




  window.editarDireccion = async function (index) {

    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    const data = docSnap.data();
    const direcciones = data.direcciones || [];

    const dir = direcciones[index];
    document.getElementById("eliminarDireccion").classList.remove("hidden");
    document.getElementById("hacerPrincipal").classList.remove("hidden");

    // 🔥 LLENAR MODAL CON DATOS
    document.getElementById("dirNombre").value = dir.nombre || "";
    document.getElementById("dirApellido").value = dir.apellido || "";
    document.getElementById("dirDireccion").value = dir.direccion || "";
    document.getElementById("dirReferencia").value = dir.referencia || "";
    document.getElementById("dirCiudad").value = dir.ciudad || "";
    document.getElementById("dirRegion").value = dir.region || "";
    document.getElementById("dirDistrito").value = dir.distrito || "";
    document.getElementById("dirTelefono").value = dir.telefono || "";

    // 🔥 ABRIR MODAL
    modalDireccion.classList.remove("hidden");
    modalDireccion.classList.add("flex");

    // ⚠️ GUARDAR INDEX TEMPORALMENTE
    window.editandoIndex = index;
  };



  document.getElementById("eliminarDireccion").onclick = async () => {

    const user = auth.currentUser;
    if (!user) return;

    // ⚠️ asegurar que estamos editando
    if (window.editandoIndex === undefined) return;

    const confirmar = confirm("¿Eliminar esta dirección?");
    if (!confirmar) return;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    let direcciones = docSnap.data().direcciones || [];

    // 🗑️ ELIMINAR POR INDEX
    direcciones.splice(window.editandoIndex, 1);

    try {
      await updateDoc(docRef, { direcciones });

      alert("Dirección eliminada 🗑️");

      // cerrar modal
      modalDireccion.classList.add("hidden");
      modalDireccion.classList.remove("flex");

      // reset
      window.editandoIndex = undefined;

      // recargar lista
      cargarDirecciones(user);

    } catch (error) {
      console.error(error);
      alert("Error al eliminar ❌");
    }

  };


  document.getElementById("hacerPrincipal").onclick = async () => {

    const user = auth.currentUser;
    if (!user) return;

    if (window.editandoIndex === undefined) return;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return;

    let direcciones = docSnap.data().direcciones || [];

    // ❗ quitar principal a todas
    direcciones = direcciones.map(d => ({
      ...d,
      principal: false
    }));

    // ⭐ poner principal a la elegida
    direcciones[window.editandoIndex].principal = true;

    try {
      await updateDoc(docRef, { direcciones });

      alert("Dirección principal actualizada ⭐");

      modalDireccion.classList.add("hidden");
      modalDireccion.classList.remove("flex");

      window.editandoIndex = undefined;

      cargarDirecciones(user);

    } catch (error) {
      console.error(error);
      alert("Error ❌");
    }

  };