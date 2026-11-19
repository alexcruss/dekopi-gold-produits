/* Animations de la page CimentStock avec GSAP (../vendor/gsap.min.js) et ScrollTrigger.
   Règles du site : jamais de boucle, une seule fois par élément, jamais de contenu qui reste caché
   si le script échoue, et rien du tout quand la personne a demandé moins de mouvement
   (la classe « anim » est posée par ../anim-tete.js seulement dans ce cas).
   Version sobre : l'écran monte, la liste glisse, puis chaque bloc apparaît une fois en défilant. */
(function(){
  var racine = document.documentElement;
  if(!window.gsap || !window.ScrollTrigger || !racine.classList.contains("anim")) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var RENDRE = "transform,opacity,visibility";
  var limite = window.innerHeight * 0.92;
  function sousLePli(e){ return e.getBoundingClientRect().top > limite; }

  /* 1. Haut de page : le texte (donc le titre, mesuré par Google pour le LCP) reste visible dès le
        premier affichage. Seul l'écran du logiciel monte doucement, puis les quatre points glissent. */
  gsap.fromTo(".hero .fen", { y: 30 }, { y: 0, duration: 0.9, ease: "power3.out", clearProps: "transform" });
  gsap.fromTo(".hero .coches li", { x: -14 }, { x: 0, duration: 0.6, ease: "power2.out", stagger: 0.1, delay: 0.3, clearProps: "transform" });

  /* 2. Apparition au défilement : on ne cache que ce qui est sous la partie visible au chargement,
        et seulement si le script tourne (sans JavaScript tout est visible). */
  function cascade(zone, itemsSel, depart, ecart){
    if(!zone || !sousLePli(zone)) return;
    var items = zone.querySelectorAll(itemsSel);
    if(!items.length) return;
    gsap.set(items, Object.assign({ autoAlpha: 0 }, depart));
    ScrollTrigger.create({
      trigger: zone, start: "top 85%", once: true,
      onEnter: function(){
        gsap.to(items, { autoAlpha: 1, x: 0, y: 0, duration: 0.7, ease: "power2.out",
          stagger: ecart || 0.12, overwrite: true, clearProps: RENDRE });
      }
    });
  }
  function une(sel){ return document.querySelector(sel); }

  cascade(une(".choix-grille"), ".choix-carte", { y: 28 }, 0.14);      /* les trois problèmes, une carte après l'autre */
  document.querySelectorAll(".voir-ligne").forEach(function(l){        /* chaque capture arrive de son côté */
    cascade(l, ".voir-img", { y: 30 }, 0);
  });
  cascade(une(".etapes"), "li", { y: 26 }, 0.16);                      /* jour 1, semaine 1, jour 30 */
  cascade(une(".inclus"), "li", { x: -18 }, 0.07);                     /* ce qui est compris */
  cascade(une(".offre-grid"), ".prix-carte", { y: 30 }, 0);            /* la carte du prix */
  cascade(une(".final .wrap"), "h2, .places, .actions, .micro", { y: 20 }, 0.1);

  /* 3. Barre du téléphone : elle reste cachée tant que les boutons du haut de page sont visibles,
        puis monte une fois. Sans le script, la règle CSS la montre au bout de 3 s. */
  var barre = document.querySelector(".barre-bas");
  var boutons = document.querySelector(".hero .actions");
  if(barre && boutons){
    barre.style.animation = "none";
    gsap.set(barre, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: boutons, start: "bottom top+=70",
      onEnter: function(){ gsap.to(barre, { yPercent: 0, duration: 0.35, ease: "power2.out", overwrite: true }); },
      onLeaveBack: function(){ gsap.to(barre, { yPercent: 110, duration: 0.3, ease: "power2.in", overwrite: true }); }
    });
  }

  /* La page change de hauteur quand une image arrive et quand on ouvre une question */
  function recalculer(){ ScrollTrigger.refresh(); }
  window.addEventListener("load", recalculer);
  document.querySelectorAll("details").forEach(function(d){
    d.addEventListener("toggle", function(){ setTimeout(recalculer, 60); });
  });
})();
