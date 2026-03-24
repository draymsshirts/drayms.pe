const carrito = JSON.parse(localStorage.getItem("drayms_cart")) || [];

const contenedor = document.getElementById("resumen-carrito");
const totalEl = document.getElementById("total");

let total = 0;

carrito.forEach(p => {
  const precio = parseFloat(p.price.replace('S/. ', ''));
  total += precio;

  contenedor.innerHTML += `
    <div class="flex items-center justify-between mb-4 border border-white/10 rounded-2xl px-4 py-3">

      <div class="flex items-center gap-3">
        <img src="${p.image}" class="w-16 h-16 object-cover rounded">

        <div>
          <p class="text-sm">${p.name}</p>
          <p class="text-xs text-zinc-500">
            ${p.size} / ${p.fit || 'oversize'}
          </p>
        </div>
      </div>

      <p class="text-sm">S/. ${precio.toFixed(2)}</p>

    </div>
  `;
});

totalEl.textContent = "S/. " + total.toFixed(2);


// 📸 SUBIR IMAGEN
window.seleccionarImagen = function () {
  document.getElementById("comprobante").click();
}

document.getElementById("comprobante").addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  const maxSize = 1 * 1024 * 1024; // 1MB

  // ❌ BLOQUEAR SI ES MUY PESADO
  if (file.size > maxSize) {
    alert("La imagen no puede pesar más de 1MB ❌");

    this.value = ""; // limpiar input
    document.getElementById("file-name").textContent = "Ningún archivo seleccionado";
    return;
  }

  document.getElementById("file-name").textContent = "✔ " + file.name;
});

async function subirImagenCloudinary(file) {

  const url = "https://api.cloudinary.com/v1_1/dcz9qerar/image/upload";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "drayms_upload");

  const res = await fetch(url, {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  return data.secure_url; // 🔥 ESTA ES LA URL DE LA IMAGEN
}


function volverAlProducto() {
  const productPage = localStorage.getItem('productPage');

  if (productPage) {
    window.location.href = productPage;
  } else {
    window.location.href = "index.html";
  }
}

function copiarMonto() {
  const totalTexto = document.getElementById("total").textContent;

  // Extraer solo el número (sin "S/. ")
  const monto = totalTexto.replace("S/. ", "");

  navigator.clipboard.writeText(monto);

  document.getElementById("mensaje-copiado").textContent = "Monto copiado ✅";
}

const mensaje = document.getElementById("mensaje-copiado");

if (mensaje) {
  mensaje.textContent = "Monto copiado ✅";

  setTimeout(() => {
    mensaje.textContent = "";
  }, 2000);
}

import { addDoc, collection, doc, getDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



// 🔥 AQUÍ VA EL PASO 3
onAuthStateChanged(window.auth, async (user) => {
  

  if (!user) return;

  const ref = doc(window.db, "usuarios", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const data = snap.data();
  const direcciones = data.direcciones || [];


  // 🔥 NUEVO
  const dniPerfil = data.dni || "";

     console.log("DATA:", data);
     console.log("DIRECCIONES:", direcciones); 


  const contenedor = document.getElementById("lista-direcciones");

  contenedor.innerHTML = "";

  direcciones.forEach((dir) => {

    const div = document.createElement("div");

    div.className = "border border-white/20 rounded-xl p-4 cursor-pointer hover:border-white transition";

    div.innerHTML = `
      <div class="flex items-start gap-3">

        <input type="radio" name="direccion" ${dir.principal ? "checked" : ""}>

        <div>
          <p class="text-sm font-medium">
            ${dir.nombre} ${dir.apellido}
          </p>

          <p class="text-xs text-zinc-400">
            ${dir.direccion}, ${dir.distrito}
          </p>

          <p class="text-xs text-zinc-500">
            ${dir.region}
          </p>

          ${dir.principal ? `<span class="text-xs bg-white text-black px-2 py-1 rounded-full mt-1 inline-block">Predeterminada</span>` : ""}
        </div>

      </div>
    `;

    div.addEventListener("click", () => {

      document.getElementById("nombre").value = dir.nombre || "";
      document.getElementById("apellidos").value = dir.apellido || "";
      document.getElementById("direccion").value = dir.direccion || "";
      document.getElementById("distrito").value = dir.distrito || "";
      document.getElementById("region").value = dir.region || "";
      document.getElementById("telefono").value = dir.telefono || "";

      document.querySelectorAll('input[name="direccion"]').forEach(r => r.checked = false);
      div.querySelector("input").checked = true;

    });

    contenedor.appendChild(div);

  });
  // 🔥 AUTOCARGAR DIRECCIÓN PREDETERMINADA
const predeterminada = direcciones.find(d => d.principal);

if (predeterminada) {
  
  document.getElementById("nombre").value = predeterminada.nombre || "";
  document.getElementById("apellidos").value = predeterminada.apellido || "";
  document.getElementById("direccion").value = predeterminada.direccion || "";
  document.getElementById("distrito").value = predeterminada.distrito || "";
  document.getElementById("region").value = predeterminada.region || "";
  document.getElementById("telefono").value = predeterminada.telefono || "";


  document.getElementById("dni").value = dniPerfil;
}


});





window.confirmarPedido = async function () {
  console.log("CLICK CONFIRMAR");

  const user = window.auth.currentUser;

// 🔥 VALIDAR FORMULARIO
const nombre = document.getElementById("nombre").value.trim();
const apellidos = document.getElementById("apellidos").value.trim();
const dni = document.getElementById("dni").value.trim();
const correo = document.getElementById("correo").value.trim();
const telefono = document.getElementById("telefono").value.trim();
const direccion = document.getElementById("direccion").value.trim();
const distrito = document.getElementById("distrito").value.trim();
const region = document.getElementById("region").value;

// puedes agregar más si quieres
// const telefono = document.querySelector("input[placeholder='Teléfono']").value.trim();

// 🔥 VALIDAR TODO
if (
  !nombre ||
  !apellidos ||
  !dni ||
  !correo ||
  !telefono ||
  !direccion ||
  !distrito ||
  !region
) {
  alert("Completa todos los campos ❌");
  return;
}



if (!nombre || !direccion || !distrito) {
  alert("Completa todos los datos del formulario ❌");
  return;
}



  if (!user) {
    alert("Inicia sesión primero");
    window.location.href = "login.html";
    return;
  }

  const fileInput = document.getElementById("comprobante");
  const file = fileInput.files[0];

  if (!file) {
    alert("Sube tu comprobante 😢");
    return;
  }

  const cart = JSON.parse(localStorage.getItem("drayms_cart") || "[]");

  try {
console.log("Archivo:", file);
    // 🔥 1. Subir imagen a Cloudinary
    const imagenComprimida = await comprimirImagen(file);
    // 🔥 VALIDAR DESPUÉS DE COMPRIMIR
if (imagenComprimida.size > 1 * 1024 * 1024) {
  alert("La imagen sigue siendo muy pesada ❌");
  return;
}
    const imageUrl = await subirImagenCloudinary(imagenComprimida);

    // 🔥 2. Guardar pedido con imagen
await addDoc(collection(window.db, "pedidos"), {
  userId: user.uid,

  // 🧾 DATOS DEL CLIENTE
  nombre: nombre,
  apellidos: apellidos,
  dni: dni,
  correo: correo,
  telefono: telefono,
  direccion: direccion,
  distrito: distrito,
  region: region,

  // 🛒 PEDIDO
  productos: cart,
  comprobante: imageUrl,

  // 📅 INFO
  fecha: new Date(),
  estado: "pendiente"
});

    alert("Pedido enviado 🔥");

    localStorage.removeItem("drayms_cart");
    window.location.href = "index.html";

  } catch (error) {
    console.error(error);
    alert("Error ❌");
  }
};



async function comprimirImagen(file) {
  return new Promise((resolve) => {

    const img = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");

      // 🔥 REDUCCIÓN (puedes ajustar)
      const maxWidth = 800;
      const scale = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 🔥 CALIDAD (0.7 = buen balance)
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.7);
    };
  });
}


window.addEventListener("DOMContentLoaded", () => {
document.getElementById("btn-confirmar").addEventListener("click", () => {
  console.log("CLICK CONFIRMAR");
  window.confirmarPedido();});
});