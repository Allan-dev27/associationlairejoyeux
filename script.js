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


// ─── BARRE DE PROGRESSION DON ─────────────────────────────────────────────
const donBarre    = document.getElementById('don-barre');
const donPourcent = document.getElementById('don-pourcent');
if (donBarre) {
  const collecte  = 1240;
  const objectif  = 2000;
  const pct       = Math.round((collecte / objectif) * 100);
  // Déclenche l'animation après le chargement
  setTimeout(() => {
    donBarre.style.width = pct + '%';
    if (donPourcent) donPourcent.textContent = pct + ' %';
  }, 600);
}


// ─── BARRE DE RECHERCHE ──────────────────────────────────────────────────────
const searchToggle  = document.getElementById('search-toggle');
const searchOverlay = document.getElementById('search-overlay');
const searchInput   = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchClear   = document.getElementById('search-clear');

// Index de contenu du site à chercher
const searchIndex = [
  { titre: 'Distribution alimentaire', section: '#activites', tag: 'Activité', extrait: 'Chaque semaine, nous distribuons des colis alimentaires aux familles dans le besoin.' },
  { titre: 'Soutien scolaire', section: '#activites', tag: 'Activité', extrait: 'Aide aux devoirs pour les collégiens et lycéens, par des bénévoles qualifiés.' },
  { titre: 'Café convivial', section: '#activites', tag: 'Activité', extrait: 'Un espace de rencontre mensuel ouvert à tous, autour d\'un café et de la bonne humeur.' },
  { titre: 'Vestiboutique solidaire', section: '#activites', tag: 'Activité', extrait: 'Dépôt et redistribution de vêtements en bon état à prix libre.' },
  { titre: 'Accompagnement administratif', section: '#activites', tag: 'Activité', extrait: 'Aide aux démarches administratives, accès aux droits, constitution de dossiers.' },
  { titre: 'Permanences d\'accueil', section: '#agenda', tag: 'Agenda', extrait: 'Mardi & Jeudi 9h–12h, Vendredi 14h–17h au 12 rue de la Solidarité.' },
  { titre: 'Collecte de vêtements – fin 31 mai', section: '#agenda', tag: 'Agenda', extrait: 'Dépôt à la Vestiboutique jusqu\'au 31 mai. Ne ratez pas l\'échéance !' },
  { titre: 'Fête de la Musique – 21 juin', section: '#agenda', tag: 'Agenda', extrait: 'Animation solidaire place de la Mairie, Val-de-Reuil.' },
  { titre: 'Adhésion à l\'association', section: '#adhesion', tag: 'Adhésion', extrait: 'Rejoignez L\'Aire Joyeux dès 5 € / an. Formulaire en ligne disponible.' },
  { titre: 'Faire un don', section: '#don', tag: 'Don', extrait: 'Votre don est défiscalisable à 66 %. Paiement sécurisé via HelloAsso.' },
  { titre: 'Devenir bénévole', section: '#benevolat', tag: 'Bénévolat', extrait: 'Rejoignez notre équipe ! Formulaire de candidature disponible.' },
  { titre: 'FAQ – Questions fréquentes', section: '#faq', tag: 'Info', extrait: 'Adhésion, bénévolat, dons, défiscalisation… Toutes les réponses.' },
  { titre: 'Nous trouver – Carte', section: '#carte', tag: 'Contact', extrait: '12 rue de la Solidarité, 27100 Val-de-Reuil.' },
  { titre: 'Newsletter', section: '#newsletter', tag: 'Info', extrait: 'Inscrivez-vous pour recevoir nos actualités une fois par mois.' },
  { titre: 'Collecte de printemps – résultats', section: '#actualites', tag: 'Actualité', extrait: 'Plus de 300 kg de denrées récoltés grâce à votre générosité.' },
  { titre: 'Partenariat Mairie de Val-de-Reuil', section: '#actualites', tag: 'Actualité', extrait: 'Accord de collaboration signé pour renforcer l\'accompagnement social.' },
];

function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function renderResults(query) {
  if (!query || query.length < 2) { searchResults.innerHTML = ''; return; }
  const q = query.toLowerCase();
  const hits = searchIndex.filter(item =>
    item.titre.toLowerCase().includes(q) || item.extrait.toLowerCase().includes(q)
  );
  if (!hits.length) {
    searchResults.innerHTML = `<div class="search-vide">Aucun résultat pour « ${query} »</div>`;
    return;
  }
  searchResults.innerHTML = hits.map(item => `
    <a href="${item.section}" class="search-result-item" onclick="closeSearch()">
      <span class="search-result-tag${item.tag === 'Agenda' || item.tag === 'Don' ? ' or' : ''}">${item.tag}</span>
      <div>
        <div class="search-result-titre">${highlight(item.titre, query)}</div>
        <div class="search-result-extrait">${highlight(item.extrait, query)}</div>
      </div>
    </a>
  `).join('');
}

function openSearch() {
  searchOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => searchInput && searchInput.focus(), 50);
}

function closeSearch() {
  searchOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (searchInput) { searchInput.value = ''; searchResults.innerHTML = ''; }
}

if (searchToggle)  searchToggle.addEventListener('click', openSearch);
if (searchOverlay) searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
if (searchClear)   searchClear.addEventListener('click', () => { searchInput.value = ''; searchResults.innerHTML = ''; searchInput.focus(); });
if (searchInput)   searchInput.addEventListener('input', e => renderResults(e.target.value));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('open')) closeSearch();
  // Raccourci Ctrl+K / Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
});


// ─── FAQ ACCORDÉON ────────────────────────────────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // Fermer tous les autres
    document.querySelectorAll('.faq-question').forEach(b => {
      b.setAttribute('aria-expanded', 'false');
      b.nextElementSibling.classList.remove('open');
    });
    // Ouvrir celui-ci si ce n'était pas déjà ouvert
    if (!expanded) {
      btn.setAttribute('aria-expanded', 'true');
      btn.nextElementSibling.classList.add('open');
    }
  });
});


// ─── FORMULAIRE BÉNÉVOLAT ────────────────────────────────────────────────────
const formBenevolat = document.getElementById('benevolat-form');
if (formBenevolat) {
  formBenevolat.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-benevolat');
    btn.textContent = 'Candidature envoyée ✓';
    btn.style.background = '#EAF4EF';
    btn.style.color = '#2A6B4E';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Envoyer ma candidature →';
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
      formBenevolat.reset();
    }, 3000);
  });
}


// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
const formNewsletter = document.getElementById('newsletter-form');
if (formNewsletter) {
  formNewsletter.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-newsletter');
    btn.textContent = 'Inscription confirmée ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'S\'inscrire →';
      btn.disabled = false;
      formNewsletter.reset();
    }, 3000);
  });
}


// ─── BOUTON PARTAGER ─────────────────────────────────────────────────────────
document.querySelectorAll('.btn-partager').forEach(btn => {
  btn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const titre = btn.dataset.titre || document.title;
    const url   = window.location.href;

    // Web Share API (mobile natif)
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, text: 'Découvrez L\'Aire Joyeux, association de solidarité à Val-de-Reuil.', url });
        return;
      } catch (_) {}
    }

    // Fallback : popup de choix
    let popup = btn.nextElementSibling;
    if (!popup || !popup.classList.contains('partage-popup')) {
      popup = document.createElement('div');
      popup.className = 'partage-popup';
      popup.innerHTML = `
        <div class="partage-option" data-action="facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook
        </div>
        <div class="partage-option" data-action="twitter">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DA1F2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.4 5.6 3.9 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> Twitter / X
        </div>
        <div class="partage-option" data-action="linkedin">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
        </div>
        <div class="partage-option" data-action="copier">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier le lien
        </div>
      `;
      btn.parentElement.style.position = 'relative';
      btn.parentElement.appendChild(popup);

      popup.querySelectorAll('.partage-option').forEach(opt => {
        opt.addEventListener('click', () => {
          const encodedUrl   = encodeURIComponent(url);
          const encodedTitre = encodeURIComponent(titre);
          const actions = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter:  `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitre}`,
            linkedin: `https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitre}`,
          };
          const action = opt.dataset.action;
          if (actions[action]) window.open(actions[action], '_blank', 'width=600,height=400');
          if (action === 'copier') {
            navigator.clipboard.writeText(url).then(() => {
              opt.textContent = '✓ Lien copié !';
              setTimeout(() => { opt.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier le lien'; }, 2000);
            });
          }
          popup.classList.remove('open');
        });
      });
    }

    popup.classList.toggle('open');
  });
});

// Fermer le popup partage en cliquant ailleurs
document.addEventListener('click', () => {
  document.querySelectorAll('.partage-popup.open').forEach(p => p.classList.remove('open'));
});
