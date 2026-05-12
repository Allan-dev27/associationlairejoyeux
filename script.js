// Soumission du formulaire d'adhésion
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

// Soumission du formulaire de contact
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

// Animation d'apparition au scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
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
  observer.observe(el);
});

document.addEventListener('animationend', () => {}, { once: true });

// Ajout de la classe .visible (déclenchée par l'observer)
document.head.insertAdjacentHTML(
  'beforeend',
  '<style>.visible { opacity: 1 !important; transform: translateY(0) !important; }</style>'
);

// Menu mobile (hamburger) - base pour une future version responsive
const navLinks = document.querySelector('.nav-links');
