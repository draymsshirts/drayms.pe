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

document.getElementById("mensaje-copiado").textContent = "Monto copiado ✅";

setTimeout(() => {
  document.getElementById("mensaje-copiado").textContent = "";
}, 2000);


import { 
  addDoc, 
  collection, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.confirmarPedido = async function () {

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