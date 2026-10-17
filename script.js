// --- BASE DE DATOS DE PRODUCTOS Y GALERÍA NORMALIZADA ---
const productos = [
    { id: 1, nombre: "Pin Metálico 25mm", categoria: "pins", precio: 1800, descripcion: "Pin metálico compacto ideal para mochilas.", imagen: "img/imagen1.jpeg" },
    { id: 2, nombre: "Pin Metálico 38mm", categoria: "pins", precio: 2000, descripcion: "El tamaño clásico más vendido.", imagen: "img/imagen2.jpeg" },
    { id: 3, nombre: "Pin Metálico 55mm", categoria: "pins", precio: 2500, descripcion: "Tamaño grande con máximo detalle.", imagen: "img/imagen3.jpeg" },
    { id: 4, nombre: "Llavero Individual", categoria: "llaveros", precio: 3000, descripcion: "Llavero resistente con argolla metálica.", imagen: "img/imagen4.jpeg" },
    { id: 5, nombre: "Llaveros Promo x2", categoria: "llaveros", precio: 5000, descripcion: "Llevate 2 llaveros con descuento especial.", imagen: "img/imagen5.jpeg" },
    { id: 6, nombre: "Pin Llavero 25mm", categoria: "pins-llaveros", precio: 2300, descripcion: "Función dual: pin y llavero en uno.", imagen: "img/imagen6.jpeg" },
    { id: 7, nombre: "Pin Llavero 38mm", categoria: "pins-llaveros", precio: 2900, descripcion: "Tamaño medio con doble función.", imagen: "img/imagen7.jpeg" },
    { id: 8, nombre: "Pin Llavero 55mm", categoria: "pins-llaveros", precio: 3300, descripcion: "Tamaño grande dual.", imagen: "img/imagen8.jpeg" }
];

const galeria = [
    { src: "img/imagen1.jpeg", alt: "Pin Destacado 1", caption: "Pin Metálico 25mm - Diseño Exclusivo" },
    { src: "img/imagen2.jpeg", alt: "Pin Destacado 2", caption: "Pin Metálico 38mm - Edición Limitada" },
    { src: "img/imagen4.jpeg", alt: "Llavero Personalizado", caption: "Llavero Acrílico con Argolla Reforzada" },
    { src: "img/imagen9.jpeg", alt: "Diseño Personalizado", caption: "Trabajo 100% Personalizado a Pedido" }
];
const testimonios = [
    { texto: '"¡Pedí 50 pines personalizados para mi evento y quedaron increíbles! La calidad es excelente."', autor: '- Camila R.' },
    { texto: '"Los llaveros son súper resistentes y llegaron re rápido por Mercado Pago."', autor: '- Lucas M.' },
    { texto: '"Excelente atención para armar mi diseño personalizado. 100% recomendados."', autor: '- Sofía T.' }
];

// --- ESTADO DE LA APLICACIÓN (localStorage) ---
let carrito = JSON.parse(localStorage.getItem('pixelCart')) || [];
let currentTestimonialIndex = 0;

// --- INICIALIZACIÓN AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGreetingAndYear();
    initGallery();
    renderProducts(productos);
    initFiltersAndSearch();
    initCalculator();
    initFAQ();
    initTestimonials();
    initContactValidation();
    initCountdown();
    updateCart();
});

// === NIVEL 1: DOM Y EVENTOS BÁSICOS ===

// Menú Hamburguesa Responsive
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navMenu = document.getElementById('navMenu');

if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('open');
    });
}

// Modo Claro / Oscuro con localStorage
const themeToggle = document.getElementById('themeToggle');

function initTheme() {
    const savedTheme = localStorage.getItem('pixelTheme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('pixelTheme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// Botón "Volver arriba"
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Saludo según la hora y año automático
function initGreetingAndYear() {
    const greetingMsg = document.getElementById('greetingMsg');
    const hour = new Date().getHours();
    let text = "¡Bienvenido a PixelPines!";

    if (hour >= 6 && hour < 12) text = "¡Buenos días! Bienvenido a G0thPines ☀️";
    else if (hour >= 12 && hour < 20) text = "¡Buenas tardes! Bienvenido a G0thPines 🌤️";
    else text = "¡Buenas noches! Bienvenido a G0thPines 🌙";

    if (greetingMsg) greetingMsg.textContent = text;
    
    const yearElem = document.getElementById('currentYear');
    if (yearElem) yearElem.textContent = new Date().getFullYear();
}

// Galería de imágenes interactiva
function initGallery() {
    const featuredImg = document.getElementById('galleryFeatured');
    const caption = document.getElementById('galleryCaption');
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');

    if (!featuredImg || !thumbnailsContainer) return;

    thumbnailsContainer.innerHTML = '';

    galeria.forEach((item, index) => {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt;
        img.className = `thumb-img ${index === 0 ? 'active' : ''}`;
        
        img.addEventListener('click', () => {
            featuredImg.src = item.src;
            if (caption) caption.textContent = item.caption;
            document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
            img.classList.add('active');
        });

        thumbnailsContainer.appendChild(img);
    });
}

// === NIVEL 2: ARRAYS, OBJETOS Y BUCLES ===

// Renderizar Catálogo de Productos
function renderProducts(items) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (items.length === 0) {
        productsGrid.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }

    items.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}">
            <div class="product-info">
                <h4 class="product-title">${prod.nombre}</h4>
                <p class="product-desc">${prod.descripcion}</p>
                <div class="product-price">$${prod.precio.toLocaleString('es-AR')}</div>
                <button class="btn btn-primary full-width" onclick="addToCart(${prod.id})">
                    <i class="fas fa-cart-plus"></i> Agregar
                </button>
            </div>
        `;
        productsGrid.appendChild(card);
    });
}

// Filtros por Categoría y Buscador
function initFiltersAndSearch() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndSearch();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterAndSearch);
    }
}

function filterAndSearch() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const category = activeBtn ? activeBtn.dataset.category : 'todos';
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = productos.filter(p => {
        const matchesCategory = category === 'todos' || p.categoria === category;
        const matchesSearch = p.nombre.toLowerCase().includes(query) || p.descripcion.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    renderProducts(filtered);
}

// Carrusel de Testimonios Automático
function initTestimonials() {
    const card = document.getElementById('testimonialCard');
    if (!card) return;

    setInterval(() => {
        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonios.length;
        const t = testimonios[currentTestimonialIndex];
        card.innerHTML = `
            <p class="testimonial-text">${t.texto}</p>
            <h5 class="testimonial-author">${t.autor}</h5>
        `;
    }, 4000);
}

// Acordeón Preguntas Frecuentes
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });
}

// === NIVEL 3 Y 4: FUNCIONES, LÓGICA Y CARRITO CON LOCALSTORAGE ===

// Calculadora de Presupuesto Personalizado
function initCalculator() {
    const typeSelect = document.getElementById('calcType');
    const qtyInput = document.getElementById('calcQty');

    if (!typeSelect || !qtyInput) return;

    function updateCalc() {
        const unitPrice = parseFloat(typeSelect.value);
        const qty = parseInt(qtyInput.value) || 1;
        let total = unitPrice * qty;
        let discountText = "";

        if (qty >= 10) {
            total *= 0.9; // 10% de descuento
            discountText = "¡10% de descuento aplicado por cantidad!";
        }

        const calcTotal = document.getElementById('calcTotal');
        const calcDiscount = document.getElementById('calcDiscount');

        if (calcTotal) calcTotal.textContent = `$${total.toLocaleString('es-AR')}`;
        if (calcDiscount) calcDiscount.textContent = discountText;
    }

    typeSelect.addEventListener('change', updateCalc);
    qtyInput.addEventListener('input', updateCalc);

    const addCustomBtn = document.getElementById('addCustomToCart');
    if (addCustomBtn) {
        addCustomBtn.addEventListener('click', () => {
            const typeText = typeSelect.options[typeSelect.selectedIndex].text.split('(')[0];
            const qty = parseInt(qtyInput.value) || 1;
            const unitPrice = parseFloat(typeSelect.value);
            let price = unitPrice * qty;
            if (qty >= 10) price *= 0.9;

            const customItem = {
                id: 'custom-' + Date.now(),
                nombre: `Personalizado: ${typeText} (x${qty})`,
                precio: price,
                cantidad: 1
            };

            carrito.push(customItem);
            saveAndCartUpdate();
            openCart();
        });
    }
}

// Carrito de Compras Lógica
function addToCart(productId) {
    const prod = productos.find(p => p.id === productId);
    if (!prod) return;

    const existing = carrito.find(item => item.id === productId);

    if (existing) {
        existing.cantidad += 1;
    } else {
        carrito.push({ ...prod, cantidad: 1 });
    }

    saveAndCartUpdate();
    openCart();
}

function removeFromCart(id) {
    carrito = carrito.filter(item => item.id != id);
    saveAndCartUpdate();
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalAmount = document.getElementById('cartTotalAmount');

    const totalQty = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrice = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    if (cartCount) cartCount.textContent = totalQty;
    if (cartTotalAmount) cartTotalAmount.textContent = `$${totalPrice.toLocaleString('es-AR')}`;

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (carrito.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
        return;
    }

    carrito.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${item.nombre}</strong>
                <p>$${item.precio.toLocaleString('es-AR')} x ${item.cantidad}</p>
            </div>
            <button onclick="removeFromCart('${item.id}')" style="background:none; border:none; color:#ff5252; cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(div);
    });
}

function saveAndCartUpdate() {
    localStorage.setItem('pixelCart', JSON.stringify(carrito));
    updateCart();
}

// Abrir y Cerrar Modal Carrito
const cartModal = document.getElementById('cartModal');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');

function openCart() { if (cartModal) cartModal.classList.add('open'); }
function closeCartModal() { if (cartModal) cartModal.classList.remove('open'); }

if (cartToggle) cartToggle.addEventListener('click', openCart);
if (closeCart) closeCart.addEventListener('click', closeCartModal);

// Pedido por WhatsApp con Mercado Pago (Nivel 3)
const btnWhatsapp = document.getElementById('btnWhatsapp');
if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        let msg = "¡Hola PixelPines! 👋 Quisiera realizar el siguiente pedido:\n\n";
        let total = 0;

        carrito.forEach(item => {
            msg += `• ${item.nombre} (x${item.cantidad}) - $${(item.precio * item.cantidad).toLocaleString('es-AR')}\n`;
            total += item.precio * item.cantidad;
        });

        msg += `\n*Total estimado:* $${total.toLocaleString('es-AR')}\n`;
        msg += `*Medio de Pago:* Mercado Pago 💙\n\nQuedo a la espera para coordinar el pago y envío de imágenes.`;

        const encoded = encodeURIComponent(msg);
        window.open(`https://wa.me/5493425112233?text=${encoded}`, '_blank');
    });
}

// Validación de Formulario (Nivel 3)
function initContactValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const msg = document.getElementById('contactMessage').value.trim();

        let valid = true;

        if (!name) {
            document.getElementById('nameError').textContent = "Por favor ingresa tu nombre.";
            valid = false;
        } else {
            document.getElementById('nameError').textContent = "";
        }

        if (!email || !email.includes('@')) {
            document.getElementById('emailError').textContent = "Ingresa un email válido.";
            valid = false;
        } else {
            document.getElementById('emailError').textContent = "";
        }

        if (!msg) {
            document.getElementById('messageError').textContent = "El mensaje no puede estar vacío.";
            valid = false;
        } else {
            document.getElementById('messageError').textContent = "";
        }

        if (valid) {
            document.getElementById('formSuccess').textContent = "¡Gracias por tu mensaje! Te responderemos pronto.";
            form.reset();
        }
    });
}

// Cuenta Regresiva de Promoción (Nivel 4)
function initCountdown() {
    const countdownElem = document.getElementById('countdown');
    if (!countdownElem) return;

    const targetDate = new Date().getTime() + (2 * 24 * 60 * 60 * 1000); // 2 días en el futuro

    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElem.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}