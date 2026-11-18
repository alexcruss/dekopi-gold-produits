/* Animations du site avec GSAP (vendor/gsap.min.js) et ScrollTrigger.
   Règles : jamais de boucle, jamais de contenu qui reste caché si le script échoue,
   et rien du tout quand la personne a demandé moins de mouvement (voir anim-tete.js). */
(function(){
  var racine = document.documentElement;
  if(!window.gsap || !window.ScrollTrigger || !racine.classList.contains("anim")) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* 1. Entrée du haut de page : le texte reste visible dès le premier affichage (c'est lui que Google
        mesure pour le LCP), seuls les écrans montent doucement. Aucun fondu sur ce qui est déjà à l'écran. */
  var hero = document.querySelector(".hero");
  if(hero){
    gsap.fromTo(hero.querySelectorAll(".fen"),
      { y: 34 },
      { y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, clearProps: "transform" });
  }

  /* 2. Apparition au défilement : seulement les blocs qui sont sous la partie visible au chargement,
        pour ne jamais retarder l'affichage de ce que la personne voit en arrivant */
  var limite = window.innerHeight * 0.92;
  var cibles = gsap.utils.toArray(
    ".grille > .carte, .etape, .etapes-courtes > div, .avis, .entete, .apropos-grille, .carte-wa, .autres, .chiffres > div, .contact h2"
  ).filter(function(e){ return e.getBoundingClientRect().top > limite; });
  if(cibles.length){
    gsap.set(cibles, { autoAlpha: 0, y: 28 });
    ScrollTrigger.batch(cibles, {
      start: "top 90%",
      once: true,
      onEnter: function(lot){
        gsap.to(lot, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.09,
          overwrite: true, clearProps: "transform,opacity,visibility" });
      }
    });
  }

  /* 3. Chiffres : ils comptent de 0 jusqu'à leur valeur, une seule fois, quand ils apparaissent */
  document.querySelectorAll(".preuves .n[data-to]").forEach(function(n, i){
    var fin = parseInt(n.getAttribute("data-to"), 10);
    var suffixe = n.getAttribute("data-suffix") || "";
    var etat = { v: 0 };
    n.textContent = "0" + suffixe;
    ScrollTrigger.create({
      trigger: n, start: "top 90%", once: true,
      onEnter: function(){
        gsap.to(etat, { v: fin, duration: 1.6, delay: i * 0.15, ease: "power2.out",
          onUpdate: function(){ n.textContent = Math.round(etat.v) + suffixe; } });
      }
    });
  });

  /* 4. Téléphones de Sagesse : chacun monte à son tour depuis le bas de l'image */
  document.querySelectorAll(".sag-phones").forEach(function(zone){
    var tels = zone.querySelectorAll(".tel");
    gsap.set(tels, { autoAlpha: 0, y: 70 });
    ScrollTrigger.create({
      trigger: zone, start: "top 92%", once: true,
      onEnter: function(){
        gsap.to(tels, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15,
          delay: zone.closest(".hero") ? 0.6 : 0, clearProps: "transform,opacity,visibility" });
      }
    });
  });

  /* Les positions changent quand les images arrivent, quand on filtre, ouvre le formulaire ou change de langue */
  function recalculer(){ ScrollTrigger.refresh(); }
  window.addEventListener("load", recalculer);
  document.querySelectorAll(".filtres button, #lang").forEach(function(b){
    b.addEventListener("click", function(){ setTimeout(recalculer, 60); });
  });
  var formulaire = document.getElementById("formulaire");
  if(formulaire) formulaire.addEventListener("toggle", recalculer);
})();
