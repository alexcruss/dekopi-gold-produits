/* Animations de la page CimentStock avec GSAP (../vendor/gsap.min.js) et ScrollTrigger.
   Règles du site : jamais de boucle, une seule fois par élément, jamais de contenu qui reste caché
   si le script échoue, et rien du tout quand la personne a demandé moins de mouvement
   (la classe « anim » est posée par ../anim-tete.js seulement dans ce cas). */
(function(){
  var racine = document.documentElement;
  if(!window.gsap || !window.ScrollTrigger || !racine.classList.contains("anim")) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var RENDRE = "transform,opacity,visibility";
  var limite = window.innerHeight * 0.92;
  function sousLePli(e){ return e.getBoundingClientRect().top > limite; }

  /* 1. Haut de page : le texte (donc le titre, mesuré par Google pour le LCP) reste visible dès le
        premier affichage. Seul l'écran du logiciel monte doucement, puis les trois points forts glissent. */
  gsap.fromTo(".hero .fen", { y: 34 }, { y: 0, duration: 0.9, ease: "power3.out", clearProps: "transform" });
  gsap.fromTo(".hero .puces li", { x: -14 }, { x: 0, duration: 0.6, ease: "power2.out", stagger: 0.12, delay: 0.35, clearProps: "transform" });

  /* 2. Apparition en cascade au défilement : on ne cache que ce qui est sous la partie visible
        au chargement, et seulement si le script tourne (sans JavaScript tout est visible). */
  function cascade(zoneSel, itemsSel, depart, ecart){
    var zone = document.querySelector(zoneSel);
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

  cascade(".situations",   "li",            { y: 26 }, 0.14);   /* les quatre situations, une à une */
  cascade(".benefices .cartes", ".carte",   { y: 30 }, 0.14);   /* les trois choses montrées */
  cascade(".liste-etapes", "li",            { y: 26 }, 0.16);   /* les trois étapes dans l'ordre */
  cascade(".inclus",       "li",            { x: -18 }, 0.08);  /* la liste de ce qui est compris */
  cascade(".offre-grid",   ".prix-carte",   { y: 30 }, 0);      /* la carte du prix */
  cascade(".bande-garantie .wrap", "h2, p",   { y: 18 }, 0.12);   /* la garantie */
  cascade(".final .wrap",  "h2, .places, .btn, .micro", { y: 22 }, 0.1);

  /* 3. Barre WhatsApp du téléphone : elle reste cachée tant que le gros bouton du haut de page est
        visible, puis monte une fois. Sans le script, la règle CSS la montre au bout de 3 s. */
  var barre = document.querySelector(".barre-bas");
  var bouton = document.querySelector(".hero .btn-grand");
  if(barre && bouton){
    barre.style.animation = "none";
    gsap.set(barre, { yPercent: 110 });
    ScrollTrigger.create({
      trigger: bouton, start: "bottom top+=70",
      onEnter: function(){ gsap.to(barre, { yPercent: 0, duration: 0.35, ease: "power2.out", overwrite: true }); },
      onLeaveBack: function(){ gsap.to(barre, { yPercent: 110, duration: 0.3, ease: "power2.in", overwrite: true }); }
    });
  }

  /* La page change de hauteur quand l'image arrive et quand on ouvre une question */
  function recalculer(){ ScrollTrigger.refresh(); }
  window.addEventListener("load", recalculer);
  document.querySelectorAll("details").forEach(function(d){
    d.addEventListener("toggle", function(){ setTimeout(recalculer, 60); });
  });
})();
