/* =====================
   GALLERY / LIGHTBOX
===================== */

/** @type {string[]} */
let currentImages = [];
/** @type {number} */
let currentIndex = 0;

/**
 * Abre el modal de galería para un proyecto.
 * @param {string} title     - Nombre del proyecto
 * @param {string} subtitle  - Subtítulo / año / contexto
 * @param {string[]} images  - Array de rutas o URLs de las imágenes
 */
function openGallery(title, subtitle, images) {
  currentImages = images;
  currentIndex = 0;

  document.getElementById('galleryTitle').textContent = title;
  document.getElementById('gallerySubtitle').textContent = subtitle;

  renderGallery();
  document.getElementById('galleryOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

/** Cierra el modal de galería. */
function closeGallery() {
  document.getElementById('galleryOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * Cierra el modal si el clic fue directamente sobre el backdrop.
 * @param {MouseEvent} e
 */
function closeGalleryOnBackdrop(e) {
  if (e.target === document.getElementById('galleryOverlay')) {
    closeGallery();
  }
}

/** Renderiza la imagen principal, miniaturas y contador. */
function renderGallery() {
  const main      = document.getElementById('galleryMain');
  const thumbsEl  = document.getElementById('galleryThumbs');
  const counter   = document.getElementById('galleryCounter');

  /* Sin imágenes — mostrar placeholder */
  if (!currentImages || currentImages.length === 0) {
    main.innerHTML = `
      <div class="gallery-placeholder">
        <div class="gallery-placeholder-icon">◫</div>
        <p>Aún no hay imágenes para este proyecto.<br/>
           Para agregarlas, edita el código en el array <strong>images</strong>:<br/>
           <code>'carpeta/nombre-imagen.png'</code>
        </p>
      </div>`;
    thumbsEl.innerHTML = '';
    counter.textContent = 'Sin imágenes';
    return;
  }

  /* Imagen principal */
  const img = document.createElement('img');
  img.src = currentImages[currentIndex];
  img.alt = 'Captura del proyecto';

  main.innerHTML = '';

  if (currentImages.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-nav-btn prev';
    prevBtn.innerHTML = '‹';
    prevBtn.disabled = currentIndex === 0;
    prevBtn.onclick = () => navigate(-1);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-nav-btn next';
    nextBtn.innerHTML = '›';
    nextBtn.disabled = currentIndex === currentImages.length - 1;
    nextBtn.onclick = () => navigate(1);

    main.appendChild(prevBtn);
    main.appendChild(nextBtn);
  }

  main.appendChild(img);

  /* Miniaturas */
  thumbsEl.innerHTML = '';
  currentImages.forEach((src, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb' + (i === currentIndex ? ' active' : '');
    thumb.innerHTML = `<img src="${src}" alt="Miniatura ${i + 1}">`;
    thumb.onclick = () => {
      currentIndex = i;
      renderGallery();
    };
    thumbsEl.appendChild(thumb);
  });

  counter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
}

/**
 * Navega a la imagen anterior o siguiente.
 * @param {number} dir  - -1 (anterior) o 1 (siguiente)
 */
function navigate(dir) {
  const newIndex = currentIndex + dir;
  if (newIndex >= 0 && newIndex < currentImages.length) {
    currentIndex = newIndex;
    renderGallery();
  }
}

/* Navegación con teclado */
document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('galleryOverlay');
  if (!overlay.classList.contains('active')) return;
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'Escape')     closeGallery();
});

/* =====================
   REVEAL ON SCROLL
===================== */
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.1 });

reveals.forEach((el) => revealObserver.observe(el));