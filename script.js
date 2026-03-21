const promoItems = [
  { label: 'ENVÍOS A TODO EL PERÚ' },
  
  { label: 'STREETWEAR HECHO EN PERÚ' },
];



const products = [
  {
    id: 'second-emotion',
    name: 'NOT A LOT, JUST FOREVER',
    price: 'S/. 45.00',
    oldPrice: 'S/. 55.00',
    badge: 'Oferta',
    image: 'img/NOT A LOT, JUST FOREVER.jpg',
  },
  {
    id: 'players-only',
    name: 'STREET BALL',
    price: 'S/. 45.00',
    oldPrice: 'S/. 55.00',
    badge: 'Oferta',
    image: 'img/streetball.jpg',
  },
  {
    id: 'get-blue',
    name: 'DRAYMS TO DEATH',
    price: 'S/. 45.00',
    oldPrice: 'S/. 55.00',
    badge: 'Oferta',
    image: 'img/to herat n.jpg',
  },
  {
    id: 'smoke',
    name: 'DRAYMS CHERRY',
    price: 'S/. 45.00',
    oldPrice: 'S/. 55.00',
    badge: 'Oferta',
    image: 'img/cherryb.jpg',
  },
  {
    id: 'witness',
    name: 'CLUB 1994',
    price: 'S/. 45.00',
    oldPrice: 'S/. 55.00',
    badge: 'Oferta',
    image: 'img/CLUB 1994.jpg',
  },
  {
    id: 'stay-lucid',
    name: 'DRS TAG',
    price: 'S/. 45.00',
    oldPrice: 'S/. 55.00',
    badge: 'Oferta',
    image: 'img/DRS.jpg',
  },
  {
    id: 'stay-lucid2',
    name: 'DRS 8 BALL',
    price: 'S/. 45.00',
    oldPrice: 'S/. 55.00',
    badge: 'Oferta',
    image: 'img/8BALL.jpg',
  },
];

function updateCartCounter() {
  const cart = JSON.parse(localStorage.getItem('drayms_cart') || '[]');
  const countElement = document.getElementById('cart-count');
  if (countElement) countElement.textContent = cart.length;
}

const promoBar = document.getElementById('promo-bar');
const categoriesGrid = document.getElementById('categories-grid');
const productsGrid = document.getElementById('products-grid');

promoBar.innerHTML = [...promoItems, ...promoItems, ...promoItems, ...promoItems]
  .map((item) => `<span>${item.label}</span>`)
  .join('');

if (categoriesGrid) {
  categoriesGrid.innerHTML = categories
    .map(
      (item) => `
        <article class="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
          <img src="${item.image}" class="h-80 w-full object-cover" />
          <div class="absolute bottom-0 p-5">
            <h4 class="text-lg font-semibold uppercase">${item.name}</h4>
          </div>
        </article>
      `
    )
    .join('');
}

/* 🔥 AQUÍ ESTÁ EL CAMBIO */
productsGrid.innerHTML = products
  .map(
    (product) => `
      <a href="product.html?id=${product.id}&img=${product.image}" class="block">
        <article class="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
          <div class="relative overflow-hidden">
            <img src="${product.image}" alt="${product.name}" class="h-[430px] w-full object-cover transition duration-500 group-hover:scale-105" />
            <div class="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-black">${product.badge}</div>
          </div>
          <div class="p-5">
            <h4 class="text-lg font-semibold uppercase leading-snug">${product.name}</h4>
            <div class="mt-3 flex items-center gap-3">
              <span class="text-lg font-bold">${product.price}</span>
              <span class="text-sm text-zinc-500 line-through">${product.oldPrice}</span>
            </div>
          </div>
        </article>
      </a>
    `
  )
  .join('');

updateCartCounter();

function renderProducts(lista) {
  productsGrid.innerHTML = lista
    .map(
      (product) => `
        <a href="product.html?id=${product.id}&img=${product.image}" class="block">
          <article class="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
            <div class="relative overflow-hidden">
              <img src="${product.image}" class="h-[430px] w-full object-cover" />
            </div>
            <div class="p-5">
              <h4 class="text-lg font-semibold uppercase">${product.name}</h4>
              <span class="text-lg font-bold">${product.price}</span>
            </div>
          </article>
        </a>
      `
    )
    .join('');
}

const searchInput = document.getElementById('search-input');

if (searchInput) {
  searchInput.addEventListener('input', function () {
    const input = this.value.toLowerCase();

    if (input === "") {
      renderProducts(products); // muestra todo
      return;
    }

    const resultados = products.filter(product =>
      product.name.toLowerCase().includes(input)
    );

    if (resultados.length === 0) {
      productsGrid.innerHTML = `<p class="text-zinc-400">No se encontró 😢</p>`;
      return;
    }

    renderProducts(resultados);
  });
}

function abrirBuscador() {
  const modal = document.getElementById('search-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function cerrarBuscador() {
  const modal = document.getElementById('search-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
document.getElementById('search-modal').addEventListener('click', function(e) {
  if (e.target.id === 'search-modal') {
    cerrarBuscador();
  }
});

const inputModal = document.getElementById('search-modal-input');

if (inputModal) {
  inputModal.addEventListener('input', function() {
    const input = this.value.toLowerCase();
    const resultsContainer = document.getElementById('search-results');

    const resultados = products.filter(product =>
      product.name.toLowerCase().includes(input)
    );

    resultsContainer.innerHTML = resultados.map(product => `
      <a href="product.html?id=${product.id}&img=${product.image}">
        <div class="text-center">
          <img src="${product.image}" class="w-full h-32 object-cover rounded-lg" />
          <p class="text-sm mt-2">${product.name}</p>
          <p class="text-xs font-bold">${product.price}</p>
        </div>
      </a>
    `).join('');
  });
}

function abrirChat() {
  document.getElementById("chat-box").style.display = "block";
}

function cerrarChat() {
  document.getElementById("chat-box").style.display = "none";
}

function enviarWhatsApp() {
  let mensaje = document.getElementById("mensaje").value;

  let numero = "51907024964"; // tu número

  let url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

function abrirChat() {
  const chat = document.getElementById("chat-box");
  chat.classList.remove("chat-hidden");

  setTimeout(() => {
    chat.classList.add("active");
  }, 10);
}

function cerrarChat() {
  const chat = document.getElementById("chat-box");

  chat.classList.remove("active");

  setTimeout(() => {
    chat.classList.add("chat-hidden");
  }, 300);
}

function enviarWhatsApp() {
  let mensaje = document.getElementById("mensaje").value;

  if (mensaje.trim() === "") {
    alert("Escribe un mensaje 😅");
    return;
  }

  let numero = "51907024964";

  let url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}