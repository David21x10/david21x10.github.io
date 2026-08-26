(function () {
  const body = document.getElementById('terminalBody');
  if (!body) return;

const script = [

  { type: 'cmd', text: 'whoami' },

  { type: 'out', text: 'Software Engineer / Full-Stack Developer' },

  { type: 'gap' },

  { type: 'cmd', text: 'stack --list' },

  { type: 'list', text: '[Frontend]  React • Angular • JavaScript' },

  { type: 'list', text: '[Backend ]  C# • .NET • Node.js' },

  { type: 'list', text: '[Mobile  ]  Ionic • Capacitor • TypeScript' },

  { type: 'list', text: '[Database]  SQL Server • MySQL' },

  { type: 'list', text: '[DevTools] Docker • Git • GitHub' },

  { type: 'gap' },

  { type: 'cmd', text: 'status --availability' },

  { type: 'out', text: 'Disponible para nuevas oportunidades ✓' },

];


  const SPEED = 26;        
  const LINE_PAUSE = 260;  
  let cancelled = false;

  function makeLineEl(entry) {
    const line = document.createElement('div');
    line.className = 'term-line ' + entry.type;
    if (entry.type === 'gap') return line;

    if (entry.type === 'cmd') {
      const prompt = document.createElement('span');
      prompt.className = 'prompt';
      prompt.textContent = 'david@dev:~$ ';
      const cmdText = document.createElement('span');
      cmdText.className = 'cmd-text';
      line.appendChild(prompt);
      line.appendChild(cmdText);
      line._target = cmdText;
    } else if (entry.type === 'list') {
      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '>';
      const txt = document.createElement('span');
      line.appendChild(arrow);
      line.appendChild(txt);
      line._target = txt;
    } else {
      const txt = document.createElement('span');
      line.appendChild(txt);
      line._target = txt;
    }
    return line;
  }

  function typeInto(el, text) {
    return new Promise((resolve) => {
      if (cancelled) return resolve();
      let i = 0;
      const tick = () => {
        if (cancelled) return resolve();
        el.textContent += text[i];
        i++;
        if (i < text.length) {
          setTimeout(tick, SPEED);
        } else {
          resolve();
        }
      };
      tick();
    });
  }

  async function runScript() {
    for (const entry of script) {
      const line = makeLineEl(entry);
      body.appendChild(line);
      if (entry.type !== 'gap') {
        await typeInto(line._target, entry.text);
      }
      await new Promise((r) => setTimeout(r, LINE_PAUSE));
      if (cancelled) return;
    }
    const finalLine = document.createElement('div');
    finalLine.className = 'term-line cmd';
    const prompt = document.createElement('span');
    prompt.className = 'prompt';
    prompt.textContent = 'david@dev:~$ ';
    const cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    finalLine.appendChild(prompt);
    finalLine.appendChild(cursor);
    body.appendChild(finalLine);
  }

  const terminalWindow = document.querySelector('.terminal-window');
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    runScript();
  };

  if ('IntersectionObserver' in window && terminalWindow) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          start();
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    obs.observe(terminalWindow);
  } else {
    start();
  }
})();


(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
})();


let galleryImages = [];
let galleryIndex = 0;

function renderGallery() {
  const main = document.getElementById('galleryMain');
  const thumbs = document.getElementById('galleryThumbs');
  const counter = document.getElementById('galleryCounter');

  main.innerHTML = '';
  if (!galleryImages.length) {
    const empty = document.createElement('div');
    empty.className = 'gallery-empty';
    empty.textContent = 'Sin imágenes disponibles.';
    main.appendChild(empty);
    thumbs.innerHTML = '';
    counter.textContent = '';
    return;
  }

  const img = document.createElement('img');
  img.src = galleryImages[galleryIndex];
  img.alt = 'Captura de pantalla ' + (galleryIndex + 1);
  main.appendChild(img);

  if (galleryImages.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.className = 'gallery-nav-btn prev';
    prevBtn.setAttribute('aria-label', 'Anterior');
    prevBtn.textContent = '‹';
    prevBtn.onclick = (e) => { e.stopPropagation(); galleryPrev(); };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'gallery-nav-btn next';
    nextBtn.setAttribute('aria-label', 'Siguiente');
    nextBtn.textContent = '›';
    nextBtn.onclick = (e) => { e.stopPropagation(); galleryNext(); };

    main.appendChild(prevBtn);
    main.appendChild(nextBtn);
  }

  thumbs.innerHTML = '';
  galleryImages.forEach((src, i) => {
    const t = document.createElement('img');
    t.src = src;
    t.className = i === galleryIndex ? 'active' : '';
    t.onclick = () => { galleryIndex = i; renderGallery(); };
    thumbs.appendChild(t);
  });

  counter.textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
}

function galleryNext() {
  if (!galleryImages.length) return;
  galleryIndex = (galleryIndex + 1) % galleryImages.length;
  renderGallery();
}

function galleryPrev() {
  if (!galleryImages.length) return;
  galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
  renderGallery();
}

function openGallery(title, subtitle, images) {
  galleryImages = images || [];
  galleryIndex = 0;
  document.getElementById('galleryTitle').textContent = title || 'Proyecto';
  document.getElementById('gallerySubtitle').textContent = subtitle || '';
  renderGallery();
  document.getElementById('galleryOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  document.getElementById('galleryOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

function closeGalleryOnBackdrop(event) {
  if (event.target.id === 'galleryOverlay') closeGallery();
}

document.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('galleryOverlay');
  if (!overlay || !overlay.classList.contains('active')) return;
  if (e.key === 'Escape') closeGallery();
  if (e.key === 'ArrowRight') galleryNext();
  if (e.key === 'ArrowLeft') galleryPrev();
});