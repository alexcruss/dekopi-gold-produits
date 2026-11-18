/* Anneau 3D des offres (page d'accueil).
   Principe : N panneaux posés en cercle (rotateY(i × pas) puis translateZ(rayon)) ;
   le défilement de la page fait tourner l'anneau. Aucune adresse externe, aucun script en ligne. */
(function () {
  "use strict";

  var ring = document.getElementById("ring");
  var piste = document.getElementById("anneau-piste");
  if (!ring || !piste) return;

  // Les neuf offres, dans l'ordre de la page Produits (sauf CimentStock et ASSIMETO en tête).
  // fond: true = image petite, affichée entière sur un fond flou plutôt que recadrée.
  var OFFRES = [
    { id: "cimentstock", img: "cimentstock.webp", alt: "CimentStock : tableau de bord des ventes et du stock",
      nom: ["CimentStock", "CimentStock"], type: ["Logiciel · Commerce de ciment", "Software · Cement shops"], prix: ["12 000 FCFA / mois", "12,000 FCFA / month"] },
    { id: "assimeto", img: "assimeto.webp", alt: "ASSIMETO : courses, stock et plats togolais",
      nom: ["ASSIMETO", "ASSIMETO"], type: ["Application · Cuisine et courses", "App · Cooking and groceries"], prix: ["Abonnement Flooz / T-Money · prix à fixer", "Flooz / T-Money subscription · price TBD"] },
    { id: "formation-alibaba-pinduoduo", img: "formation-alibaba-pinduoduo.webp", alt: "Affiche de la formation Alibaba et Pinduoduo : 10 000 F seulement",
      nom: ["Commander sur Alibaba et Pinduoduo", "Ordering on Alibaba and Pinduoduo"], type: ["Formation pratique · Alibaba et Pinduoduo", "Hands-on training · Alibaba and Pinduoduo"], prix: ["10 000 FCFA", "10,000 FCFA"] },
    { id: "sagesse", img: "sagesse.jpg", alt: "Application Sagesse : citations, auteurs et favoris",
      nom: ["Sagesse", "Sagesse"], type: ["Application mobile · Citations", "Mobile app · Quotes"], prix: ["Prix à confirmer", "Price to be confirmed"] },
    { id: "automatisation", img: "automatisation.webp", alt: "Un tableau Excel dont les PDF sont générés par une macro VBA",
      nom: ["Automatisation sur mesure", "Custom automation"], type: ["Service · Excel, VBA, Access", "Service · Excel, VBA, Access"], prix: ["Diagnostic gratuit, puis devis", "Free diagnosis, then quote"] },
    { id: "site-vitrine", img: "site-vitrine.webp", alt: "Les sites BrendaSTYLE et Dongshoes dans des fenêtres de navigateur",
      nom: ["Site vitrine pour votre commerce", "Showcase website for your shop"], type: ["Service · Site vitrine", "Service · Showcase website"], prix: ["Sur devis · livré en 3 jours", "On quote · delivered in 3 days"] },
    { id: "garde-la-flamme", img: "garde-la-flamme.webp", alt: "Affiche du guide Garde la flamme, même à distance",
      nom: ["Garde la flamme, même à distance", "Keep the flame alive, even from afar"], type: ["Guide PDF", "PDF guide"], prix: ["4 900 FCFA · paiement sur Chariow", "4,900 FCFA · payment on Chariow"] },
    { id: "formation-solimi", img: "solimi-affiche.webp", alt: "Affiche Solimi : votre carte prépayée est enfin disponible", fond: true,
      nom: ["Savoir utiliser la carte Solimi", "How to use the Solimi card"], type: ["Formation · YouTube et visio", "Training · YouTube and video call"], prix: ["500 FCFA · YouTube ou visio", "500 FCFA · YouTube or video call"] },
    { id: "cgi-lpf", img: "cahier-fiscal.webp", alt: "Cahier fiscal : principales dispositions de la loi de finances 2026", fond: true,
      nom: ["CGI et LPF du Togo, à jour 2025", "Togo CGI and LPF, updated for 2025"], type: ["Documents PDF · version 2025", "PDF documents · 2025 version"], prix: ["500 FCFA chacun · 1 000 FCFA les deux", "500 FCFA each · 1,000 FCFA for both"] }
  ];

  var N = OFFRES.length;          // 9 panneaux : 40° chacun
  var pas = 360 / N;
  var DEG_PAR_PX = 0.3;           // le défilement fait tourner l'anneau de 0,3° par pixel : un tour = 1 200 px
  var rayon = 0, PW = 0, panneaux = [];
  var rot = 0, cible = 0, devant = -1, attente = false;

  var elNum = document.getElementById("a-num"), elNom = document.getElementById("a-nom"),
      elType = document.getElementById("a-type"), elPrix = document.getElementById("a-prix"),
      elLien = document.getElementById("a-lien");
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)");

  function langue() { return document.documentElement.lang === "en" ? 1 : 0; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function construire() {
    var vw = document.documentElement.clientWidth, vh = window.innerHeight;
    // Panneau de face : environ 43 % de la largeur sur ordinateur, 80 % sur téléphone, sans dépasser la hauteur utile.
    var petit = vw <= 640;
    PW = Math.round(petit ? Math.min(vw * 0.8, 380) : Math.max(280, Math.min(vw * 0.43, 720, vh * 0.64)));
    // Rayon qui ferme l'anneau sans trou : (largeur / 2) / tan(pas / 2)
    rayon = (PW / 2) / Math.tan((pas / 2) * Math.PI / 180);
    ring.style.setProperty("--pw", PW + "px");
    ring.style.setProperty("--ph", Math.round(PW * 0.625) + "px");
    ring.textContent = "";
    panneaux = [];
    for (var i = 0; i < N; i++) {
      var o = OFFRES[i];
      var a = document.createElement("a");
      a.className = "panneau" + (o.fond ? " panneau-fond" : "");
      a.href = "produits.html#" + o.id;
      a.setAttribute("aria-label", o.nom[0]);
      a.style.transform = "rotateY(" + (i * pas) + "deg) translateZ(" + rayon.toFixed(1) + "px)";
      if (o.fond) {
        var f = document.createElement("img");
        f.className = "p-fond"; f.src = o.img; f.alt = ""; f.setAttribute("aria-hidden", "true");
        a.appendChild(f);
      }
      var img = document.createElement("img");
      img.className = "p-img"; img.src = o.img; img.alt = o.alt; img.decoding = "async";
      a.appendChild(img);
      ring.appendChild(a);
      panneaux.push(a);
    }
    devant = -1;
    lireDefilement();
    rot = cible;
    dessiner();
  }

  function legende(f) {
    var o = OFFRES[f];
    elNum.textContent = pad(f + 1) + " / " + pad(N);
    // On garde les deux langues dans les attributs : le bouton FR/EN du site remet le bon texte tout seul.
    [[elNom, o.nom], [elType, o.type], [elPrix, o.prix]].forEach(function (p) {
      p[0].setAttribute("data-fr", p[1][0]); p[0].setAttribute("data-en", p[1][1]);
      p[0].textContent = p[1][langue()];
    });
    elLien.href = "produits.html#" + o.id;
  }

  function lireDefilement() {
    var haut = piste.getBoundingClientRect().top + window.pageYOffset;
    var s = Math.max(0, window.pageYOffset - haut);
    cible = s * DEG_PAR_PX;
  }

  function dessiner() {
    // L'anneau recule d'un rayon : le panneau de face garde sa taille réelle
    ring.style.transform = "translateZ(" + (-rayon).toFixed(1) + "px) rotateY(" + rot.toFixed(3) + "deg)";
    for (var i = 0; i < N; i++) {
      var ang = (((i * pas + rot) % 360) + 360) % 360;      // 0 = face
      var c = Math.cos(ang * Math.PI / 180);
      // Dos atténué : opacité = 0,35 + 0,65 × (cos(angle) + 1) / 2
      var op = 0.35 + 0.65 * (c + 1) / 2;
      // Trois images au maximum : au-delà d'un pas et demi de la face, le panneau s'efface
      var dist = Math.min(ang, 360 - ang);
      var fondu = Math.max(0, Math.min(1, (1.5 - dist / pas) / 0.5));
      panneaux[i].style.opacity = (op * fondu).toFixed(3);
      var actif = c > 0.7 && fondu > 0.5;
      panneaux[i].style.pointerEvents = actif ? "auto" : "none";
      panneaux[i].tabIndex = actif ? 0 : -1;
    }
    // Panneau de face = Math.round(-rotation / pas) modulo N
    var f = ((Math.round(-rot / pas) % N) + N) % N;
    if (f !== devant) { devant = f; legende(f); }
  }

  function image() {
    attente = false;
    var k = reduit.matches ? 1 : 0.14;           // lissage, sauf si moins de mouvement est demandé
    rot += (cible - rot) * k;
    if (Math.abs(cible - rot) < 0.01) rot = cible;
    dessiner();
    if (rot !== cible) demander();
  }
  function demander() { if (!attente) { attente = true; requestAnimationFrame(image); } }

  window.addEventListener("scroll", function () { lireDefilement(); demander(); }, { passive: true });

  var minuterie = 0, largeur = document.documentElement.clientWidth, hauteur = window.innerHeight;
  window.addEventListener("resize", function () {
    clearTimeout(minuterie);
    minuterie = setTimeout(function () {
      var w = document.documentElement.clientWidth, h = window.innerHeight;
      if (Math.abs(w - largeur) > 8 || Math.abs(h - hauteur) > 80) { largeur = w; hauteur = h; construire(); }
      else { lireDefilement(); demander(); }
    }, 150);
  });

  // Le site change la langue des éléments [data-fr] ; on remet la légende dans la bonne langue au clic sur FR/EN.
  var bouton = document.getElementById("lang");
  if (bouton) bouton.addEventListener("click", function () { setTimeout(function () { legende(devant < 0 ? 0 : devant); }, 0); });

  construire();
})();
