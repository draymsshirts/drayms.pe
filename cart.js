function loadCart() {
    const cart = JSON.parse(localStorage.getItem('drayms_cart') || '[]');
    const container = document.getElementById('cart-container');
    const summary = document.getElementById('cart-summary');
    const totalElement = document.getElementById('cart-total');

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center py-20 text-center">
                <p class="text-zinc-500 uppercase tracking-widest">Carrito vacío</p>
                <a href="index.html" class="mt-6 border border-white/20 px-6 py-2 text-xs uppercase hover:bg-white hover:text-black">Volver</a>
            </div>`;
        summary.classList.add('hidden');
        return;
    }

    summary.classList.remove('hidden');
    container.innerHTML = cart.map((item, index) => `
        <div class="flex items-center gap-6 py-6 border-b border-white/10">
            <img src="${item.image}" class="h-24 w-20 object-cover rounded-lg border border-white/10">
            <div class="flex-1">
                <h3 class="text-lg font-bold uppercase">${item.name}</h3>
                <p class="text-xs text-zinc-500 uppercase">
                 ${item.size} / ${item.fit || 'oversize'}
                    </p>
                <p class="text-sm mt-1">${item.price}</p>
            </div>
            <button onclick="removeItem(${index})" class="text-xs text-zinc-500 hover:text-white uppercase">Eliminar</button>
        </div>
    `).join('');

    let total = 0;
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('S/. ', ''));
        total += price;
    });
    totalElement.textContent = `S/. ${total.toFixed(2)}`;
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('drayms_cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('drayms_cart', JSON.stringify(cart));
    loadCart();
}

document.addEventListener('DOMContentLoaded', loadCart);

function finalizarCompra() {
  const cart = JSON.parse(localStorage.getItem('drayms_cart') || '[]');

  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let mensaje = "🛒 *Pedido DRAYMS*\n\n";
  let total = 0;

  cart.forEach((item, index) => {
    const price = parseFloat(item.price.replace('S/. ', ''));

    mensaje += `*${index + 1}. ${item.name}*\n`;
    mensaje += `Talla: ${item.size}\n`;
    mensaje += `Fit: ${item.fit}\n`;
    mensaje += `Precio: ${item.price}\n`;
    mensaje += `Imagen: ${item.image}\n\n`;

    total += price;
  });

  mensaje += `💰 *Total: S/. ${total.toFixed(2)}*`;

  const numero = "51907024964";

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, '_blank');
}