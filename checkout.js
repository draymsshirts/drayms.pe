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
function seleccionarImagen() {
  document.getElementById("comprobante").click();
}

document.getElementById("comprobante").addEventListener("change", function () {
  const file = this.files[0];
  document.getElementById("file-name").textContent =
    file ? "✔ " + file.name : "Ningún archivo";
});


// 🚨 VALIDACIÓN
function confirmarPedido() {
  const file = document.getElementById("comprobante").files[0];

  if (!file) {
    alert("Sube tu comprobante");
    return;
  }

  alert("Pedido listo (siguiente: Firebase 🔥)");
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