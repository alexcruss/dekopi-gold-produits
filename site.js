/* anciens liens avec ancre (le site tenait sur une seule page) : on renvoie vers la bonne page */
(function(){
  var ANCIENNES = {
    "#produits":"produits.html", "#recommandes":"recommandes.html", "#realisations":"realisations.html",
    "#temoignages":"realisations.html#temoignages", "#commande":"contact.html#commande", "#besoin":"contact.html#besoin",
    "#apropos":"a-propos.html#apropos", "#preuves":"a-propos.html#preuves"
  };
  var cible = ANCIENNES[location.hash];
  if(cible && document.querySelector(".hero")) location.replace(cible);
})();

(function(){
  var NUM = "22891512041";
  var lang = "fr";
  try{ var s = localStorage.getItem("dg-lang"); if(s) lang = s; }catch(e){}

  function setWA(){
    document.querySelectorAll("[data-wa]").forEach(function(a){
      a.href = "https://wa.me/"+NUM+"?text="+encodeURIComponent(a.getAttribute("data-wa"));
      a.target = "_blank"; a.rel = "noopener";
    });
  }
  function apply(){
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-fr]").forEach(function(el){
      el.textContent = el.getAttribute("data-"+lang);
    });
    document.querySelectorAll("[data-ph-fr]").forEach(function(el){
      el.placeholder = el.getAttribute("data-ph-"+lang);
    });
    document.getElementById("lang").textContent = lang==="fr" ? "EN" : "FR";
    var titre = document.documentElement.getAttribute("data-title-"+lang);
    if(titre) document.title = titre;
  }
  document.getElementById("lang").addEventListener("click", function(){
    lang = lang==="fr" ? "en" : "fr";
    try{ localStorage.setItem("dg-lang", lang); }catch(e){}
    apply();
  });

  document.querySelectorAll(".filtres button").forEach(function(b){
    b.addEventListener("click", function(){
      document.querySelectorAll(".filtres button").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on");
      var f = b.getAttribute("data-f");
      document.querySelectorAll("#produits .carte").forEach(function(c){
        c.hidden = !(f==="tous" || c.getAttribute("data-cat")===f);
      });
    });
  });

  /* carrousel : on duplique la série 3 fois pour une boucle sans coupure */
  (function(){
    var piste = document.getElementById("piste");
    if(!piste) return;
    var base = Array.prototype.slice.call(piste.children);
    for(var k=0;k<3;k++){
      base.forEach(function(li){
        var c = li.cloneNode(true);
        c.setAttribute("aria-hidden","true");
        c.querySelector("a").setAttribute("tabindex","-1");
        piste.appendChild(c);
      });
    }
    document.getElementById("defile").classList.add("anime");
  })();

  /* bloc de chiffres : apparition décalée + compteurs, une seule fois, quand le bloc entre à l'écran */
  (function(){
    var bloc = document.querySelector(".preuves");
    if(!bloc || !("IntersectionObserver" in window)) return;
    var reduit = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var nombres = Array.prototype.slice.call(bloc.querySelectorAll(".n[data-to]"));
    if(reduit){ return; }
    bloc.classList.add("anim");
    nombres.forEach(function(n){ n.textContent = "0" + (n.getAttribute("data-suffix") || ""); });
    function compter(n, delai){
      var fin = parseInt(n.getAttribute("data-to"), 10), suf = n.getAttribute("data-suffix") || "", duree = 1400, debut = null;
      function pas(t){
        if(debut === null) debut = t;
        var p = Math.min(1, (t - debut) / duree), e = 1 - Math.pow(1 - p, 3);
        n.textContent = Math.round(fin * e) + suf;
        if(p < 1) requestAnimationFrame(pas);
      }
      setTimeout(function(){ requestAnimationFrame(pas); }, delai);
    }
    var obs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(!en.isIntersecting) return;
        bloc.classList.add("vu");
        nombres.forEach(function(n, i){ compter(n, i * 180); });
        obs.disconnect();
      });
    }, {threshold:0.35});
    obs.observe(bloc);
  })();

  /* formulaire de besoin : le message part vers WhatsApp ou la messagerie, rien n'est stocké */
  (function(){
    var form = document.getElementById("form-besoin");
    if(!form) return;
    var statut = document.getElementById("f-statut");
    var msg = document.getElementById("f-message");
    var compte = document.getElementById("f-compte");
    var MAIL = "pierredegboevi@gmail.com";
    var T = {
      fr:{hello:"Bonjour DEKOPI GOLD, voici mon besoin :", nom:"Nom", ent:"Entreprise", tel:"Téléphone", type:"Besoin", delai:"Délai", msg:"Description", src:"Envoyé depuis produits.pierredegboevi.com", subj:"Demande de devis", ok_wa:"WhatsApp s’ouvre : relisez votre message puis envoyez-le.", ok_mail:"Votre messagerie s’ouvre : relisez votre message puis envoyez-le.", bad:"Merci de remplir les champs marqués d’une étoile."},
      en:{hello:"Hello DEKOPI GOLD, here is what I need:", nom:"Name", ent:"Company", tel:"Phone", type:"Need", delai:"Timeline", msg:"Description", src:"Sent from produits.pierredegboevi.com", subj:"Quote request", ok_wa:"WhatsApp is opening: read your message, then send it.", ok_mail:"Your mail app is opening: read your message, then send it.", bad:"Please fill in the fields marked with a star."}
    };
    function txt(sel){ return sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].textContent : ""; }
    function update(){ compte.textContent = msg.value.length; }
    msg.addEventListener("input", update); update();

    form.addEventListener("submit", function(e){
      e.preventDefault();
      var t = T[lang] || T.fr;
      if(!form.checkValidity()){ statut.textContent = t.bad; form.reportValidity(); return; }
      var f = form.elements;
      var lignes = [t.hello, ""];
      lignes.push(t.nom+" : "+f.nom.value.trim());
      if(f.entreprise.value.trim()) lignes.push(t.ent+" : "+f.entreprise.value.trim());
      if(f.tel.value.trim()) lignes.push(t.tel+" : "+f.tel.value.trim());
      lignes.push(t.type+" : "+txt(f.type));
      if(txt(f.delai)) lignes.push(t.delai+" : "+txt(f.delai));
      lignes.push("", t.msg+" :", f.message.value.trim(), "", "("+t.src+")");
      var canal = (e.submitter && e.submitter.value) || "wa";
      if(canal === "mail"){
        var sujet = t.subj+" — "+txt(f.type);
        location.href = "mailto:"+MAIL+"?subject="+encodeURIComponent(sujet)+"&body="+encodeURIComponent(lignes.join("\r\n"));
        statut.textContent = t.ok_mail;
      } else {
        window.open("https://wa.me/"+NUM+"?text="+encodeURIComponent(lignes.join("\n")), "_blank", "noopener");
        statut.textContent = t.ok_wa;
      }
    });
  })();

  /* Invitation : après 5 secondes, service ou formation, puis message WhatsApp.
     Elle revient à chaque visite (chaque chargement de la page). */
  (function(){
    var dlg = document.getElementById("invite");
    if(!dlg || typeof dlg.showModal !== "function") return;
    var MSG = {
      service:   {fr:"Bonjour DEKOPI GOLD, j'ai besoin d'un service.", en:"Hello DEKOPI GOLD, I need a service."},
      formation: {fr:"Bonjour DEKOPI GOLD, je voudrais une formation.", en:"Hello DEKOPI GOLD, I would like some training."}
    };
    var q = document.getElementById("inv-q"), r = document.getElementById("inv-wa"), lien = document.getElementById("inv-lien");

    function etape(n){
      q.hidden = n !== 1; r.hidden = n !== 2;
      dlg.setAttribute("aria-labelledby", n === 1 ? "inv-titre" : "inv-titre2");
    }
    function ouvrir(){
      if(dlg.open) return;
      var a = document.activeElement;
      if(a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName)){ setTimeout(ouvrir, 5000); return; } /* pas pendant la saisie */
      etape(1); dlg.showModal();
    }

    dlg.addEventListener("click", function(e){
      if(e.target === dlg){ dlg.close(); return; }          /* clic sur le fond */
      var c = e.target.closest("[data-choix]");
      if(c){
        lien.setAttribute("data-wa", MSG[c.getAttribute("data-choix")][lang]);
        setWA(); etape(2); lien.focus(); return;
      }
      if(e.target.closest("[data-fermer]") || e.target.closest("#inv-lien")) dlg.close();
    });

    setTimeout(ouvrir, 5000);
  })();

  /* Carrousel des offres recommandées : glisser, flèches, défilement automatique toutes les 5 s (en pause au survol) */
  (function(){
    var car = document.getElementById("car-pub");
    if(!car) return;
    var piste = document.getElementById("car-piste"), prev = car.querySelector(".car-prev"), next = car.querySelector(".car-next");
    var pause = false, reprise = null;
    function pas(){
      var c = piste.querySelector(".carte");
      return (c ? c.getBoundingClientRect().width : 300) + (parseFloat(getComputedStyle(piste).columnGap) || 0);
    }
    function boutons(){ var trop = piste.scrollWidth > piste.clientWidth + 4; prev.hidden = next.hidden = !trop; }
    function aller(d){
      var fin = piste.scrollLeft + piste.clientWidth >= piste.scrollWidth - 4;
      if(d > 0 && fin) piste.scrollTo({left:0, behavior:"auto"});
      else if(d < 0 && piste.scrollLeft <= 4) piste.scrollTo({left:piste.scrollWidth, behavior:"auto"});
      else piste.scrollBy({left:d*pas(), behavior:"smooth"});
    }
    prev.addEventListener("click", function(){ aller(-1); });
    next.addEventListener("click", function(){ aller(1); });
    car.addEventListener("mouseenter", function(){ pause = true; });
    car.addEventListener("mouseleave", function(){ pause = false; });
    car.addEventListener("focusin", function(){ pause = true; });
    car.addEventListener("focusout", function(){ pause = false; });
    car.addEventListener("touchstart", function(){ pause = true; clearTimeout(reprise); }, {passive:true});
    car.addEventListener("touchend", function(){ clearTimeout(reprise); reprise = setTimeout(function(){ pause = false; }, 6000); }, {passive:true});
    if(!window.matchMedia("(prefers-reduced-motion:reduce)").matches){
      setInterval(function(){ if(!pause && !document.hidden && !next.hidden) aller(1); }, 5000);
    }
    window.addEventListener("resize", boutons);
    boutons();
  })();

  setWA(); apply();
})();
