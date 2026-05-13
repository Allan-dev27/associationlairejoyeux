// ─── NAVIGATION : fixée avec ombre au scroll ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


// ─── MENU HAMBURGER MOBILE ───────────────────────────────────────────────────
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');
const navOverlay = document.getElementById('nav-overlay');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  navOverlay.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

navOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.nav-link-item').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeMenu(); }
});


// ─── COMPTEUR ANIMÉ ─────────────────────────────────────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const prefix   = el.dataset.prefix || '';
  const duration = 1200;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(eased * target);
    el.textContent = prefix + current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));


// ─── LIGHTBOX GALERIE ────────────────────────────────────────────────────────
const lightbox        = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose   = document.getElementById('lightbox-close');
const lightboxPrev    = document.getElementById('lightbox-prev');
const lightboxNext    = document.getElementById('lightbox-next');

const galerieItems = Array.from(document.querySelectorAll('.galerie-item[data-index]'));
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const item  = galerieItems[index];
  const svgEl = item.querySelector('svg').cloneNode(true);

  lightboxContent.innerHTML = '';
  lightboxContent.appendChild(svgEl);
  lightboxCaption.textContent = item.dataset.caption || '';

  lightbox.style.display = 'flex';
  requestAnimationFrame(() => lightbox.classList.add('open'));
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  setTimeout(() => { lightbox.style.display = 'none'; }, 250);
  document.body.style.overflow = '';
}

function showPrev() {
  currentIndex = (currentIndex - 1 + galerieItems.length) % galerieItems.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % galerieItems.length;
  openLightbox(currentIndex);
}

galerieItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', showPrev);
lightboxNext.addEventListener('click', showNext);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});

let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
});


// ─── ANIMATION AU SCROLL (cards) ────────────────────────────────────────────
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(
  '.activite-card, .actu-card, .galerie-item, .contact-item'
).forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  scrollObserver.observe(el);
});

document.head.insertAdjacentHTML(
  'beforeend',
  '<style>.visible { opacity: 1 !important; transform: translateY(0) !important; }</style>'
);


// ─── FORMULAIRE D'ADHÉSION ───────────────────────────────────────────────────
const formAdhesion = document.querySelector('.adhesion-form');
if (formAdhesion) {
  formAdhesion.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = formAdhesion.querySelector('.btn-form');
    btn.textContent = 'Demande envoyée ✓';
    btn.style.background = '#EAF4EF';
    btn.style.color = '#2A6B4E';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Envoyer ma demande →';
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      formAdhesion.reset();
    }, 3000);
  });
}


// ─── FORMULAIRE DE CONTACT ───────────────────────────────────────────────────
const formContact = document.querySelector('.contact-form');
if (formContact) {
  formContact.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn = formContact.querySelector('.btn-contact');
    btn.textContent = 'Message envoyé ✓';
    btn.style.background = '#4A9470';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Envoyer le message →';
      btn.style.background = '';
      btn.disabled = false;
      formContact.reset();
    }, 3000);
  });
}


// ─── BARRE DE PROGRESSION ────────────────────────────────────────────────────
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const scrollTop  = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  progressBar.style.width = (scrollTop / scrollHeight * 100) + '%';
}, { passive: true });


// ─── BANDEAU D'ANNONCE ───────────────────────────────────────────────────────
const bandeauClose = document.getElementById('bandeau-close');
const bandeau      = document.getElementById('bandeau');
if (bandeauClose) {
  bandeauClose.addEventListener('click', () => {
    bandeau.classList.add('hidden');
    sessionStorage.setItem('bandeau-closed', '1');
  });
  if (sessionStorage.getItem('bandeau-closed')) {
    bandeau.classList.add('hidden');
  }
}


// ─── BOUTON RETOUR EN HAUT ───────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ─── MODE SOMBRE ─────────────────────────────────────────────────────────────
const darkToggle = document.getElementById('dark-toggle');
const body       = document.body;

// Charger la préférence sauvegardée
if (localStorage.getItem('dark-mode') === '1') body.classList.add('dark');

darkToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('dark-mode', body.classList.contains('dark') ? '1' : '0');
});


// ─── CAROUSEL TÉMOIGNAGES ────────────────────────────────────────────────────
const track    = document.getElementById('temoignages-track');
const prevBtn  = document.getElementById('temo-prev');
const nextBtn  = document.getElementById('temo-next');
const dotsContainer = document.getElementById('temo-dots');

if (track) {
  const cards = track.querySelectorAll('.temoignage-card');
  let perView = window.innerWidth <= 900 ? 1 : 3;
  let current = 0;
  const total  = cards.length;

  // Créer les dots
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'temo-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Témoignage ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    dotsContainer.querySelectorAll('.temo-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    const cardWidth = cards[0].offsetWidth + 24; // gap = 1.5rem ≈ 24px
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play toutes les 5s
  let autoplay = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(autoplay));
  track.addEventListener('mouseleave', () => { autoplay = setInterval(() => goTo(current + 1), 5000); });

  // Swipe mobile
  let touchStart = 0;
  track.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goTo(current + 1) : goTo(current - 1);
  });

  window.addEventListener('resize', () => {
    perView = window.innerWidth <= 900 ? 1 : 3;
    goTo(current); // recalc position
  });
}


// ─── BOUTONS DON ─────────────────────────────────────────────────────────────
const donMontants = document.querySelectorAll('.don-montant');
const btnDon      = document.getElementById('btn-don');

donMontants.forEach(btn => {
  btn.addEventListener('click', () => {
    donMontants.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const montant = btn.dataset.montant;
    if (montant === 'autre') {
      btnDon.textContent = 'Choisir un montant →';
      btnDon.href = 'https://www.helloasso.com';
    } else {
      btnDon.textContent = `Faire un don de ${montant} € →`;
      btnDon.href = `https://www.helloasso.com`;
    }
  });
});


// ─── WIDGET DISCORD ──────────────────────────────────────────────────────────
// Remplacez VOTRE_SERVER_ID par l'ID numérique de votre serveur Discord
// et activez le widget dans Paramètres → Widget dans votre serveur Discord.
const DISCORD_SERVER_ID = null; // ex: '123456789012345678'
const DISCORD_INVITE    = 'https://discord.gg/exemple'; // ← votre vrai lien d'invitation

const elOnline  = document.getElementById('discord-online');
const elMembers = document.getElementById('discord-members');
const btnDiscord = document.getElementById('btn-discord');

if (btnDiscord) btnDiscord.href = DISCORD_INVITE;

if (DISCORD_SERVER_ID) {
  // API Widget Discord (nécessite que le widget soit activé côté Discord)
  fetch(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`)
    .then(r => r.json())
    .then(data => {
      if (elOnline)  elOnline.textContent  = data.presence_count ?? '–';
      if (elMembers) elMembers.textContent = data.member_count   ?? '–';
    })
    .catch(() => {
      // En cas d'erreur, on laisse les tirets
    });
} else {
  // Pas encore de serveur configuré : on affiche des valeurs démo
  if (elOnline)  elOnline.textContent  = '5';
  if (elMembers) elMembers.textContent = '42';
}
