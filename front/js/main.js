// ACTIONS LORS DU PREMIER CHARGEMENT DE LA PAGE
$("section").hide();
nbContact();
let tab = new Set();
tab = categories(tab);
$(".dashboard").show();

// AFFICHE LA LISTE DES CONTACTS APRES CLIC SUR "LISTE DES CONTACTS"
$(document).on("click", "#liste-contacts", function (e) {
  e.preventDefault();
  $("section").hide();
  $("a.nav-link").removeClass("active");
  $("#liste-contacts").addClass("active");
  $(".liste").show();
  liste();
});

// AFFICHE LE FORMULAIRE D'AJOUT DE CONTACT APRES CLIC SUR "NOUVEAU CONTACT"
$(document).on("click", "#nv-contact", function (e) {
  e.preventDefault();
  $("section").hide();
  $("a.nav-link").removeClass("active");
  $("#nv-contact").addClass("active");
  $(".ajout-contact").show();
});

// AJOUTE LE NOUVEAU CONTACT
$(document).on("submit", ".ajout-contact form", function (e) {
  e.preventDefault();
  ajoutContact();
});

// AFFICHE LE FORMULAIRE DE MODIFICATION D'UN CONTACT APRES CLIC SUR LE BOUTON "MODIFIER"
$(document).on("click", "button.modif-contact", function () {
  $("section").hide();
  $("section.modif-contact").show();
  modifContact($(this).attr("id"));
});

// MET A JOUR LE CONTACT
$(document).on("submit", ".modif-contact form", function (e) {
  e.preventDefault();
  majContact($(".modif-contact .maj-contact").attr("id"));
  $("section").hide();
  $(".liste").show();
});

// SUPPRIME LE CONTACT APRES CLIC SUR LE BOUTON "SUPPRIMER"
$(document).on("click", ".supp-contact", function () {
  suppContact($(this).attr("id"));
});

// AFFICHE LE TABLEAU DE BORD APRES CLIC SUR "TABLEAU DE BORD"
$(document).on("click", "#dashboard", function (e) {
  e.preventDefault();
  $("section").hide();
  nbContact();
  $("a.nav-link").removeClass("active");
  $("#dashboard").addClass("active");
  let tab = new Set();
  tab = categories(tab);
  $(".dashboard").show();
});

// GENERER LA LISTE DES CONTACTS
function liste() {
  let request = $.ajax({
    type: "GET",
    url: "http://localhost:3000/contacts",
    dataType: "json",
  });

  request.done(function (response) {
    let html = "";
    if (response.length !== 0) {
      // Si l'objet JSON n'est pas vide...
      // Tête du tableau des contacts
      html = `
          <h1>Liste des contacts</h1>
          <table class="table table-striped tab-contact" id="myTable">
            <thead>
                <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Prénom</th>
                    <th scope="col">Catégorie</th>
                    <th scope="col"></th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>`;
      // Parcours des objets et génération du HTML pour chaque objet
      response.map((contact) => {
        html += `
            <tr>
              <td>${contact.nom}</td>
              <td>${contact.prenom}</td>
              <td class="font-italic">${contact.categorie}</td>
              <td>
                  <!-- Button trigger modal -->
                  <a type="button" data-toggle="modal" data-target="#contact-modal-${contact.id}"><i class="fas fa-eye"></i> Voir plus</a>

                  <!-- Modal -->
                  <div class="modal fade" id="contact-modal-${contact.id}" tabindex="-1" aria-labelledby="contact-modal-label" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="contact-modal-label">
                            <i class="fas fa-user"></i>&nbsp;&nbsp;${contact.prenom} ${contact.nom}
                          </h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <p>
                            <span class="font-weight-bold">Adresse :</span><br />
                            ${contact.rue}<br />
                            ${contact.appt}<br />
                            ${contact.codePostal} ${contact.ville}<br /><br />
                            <a href="https://google.fr/maps/place/${contact.rue}+${contact.codePostal}+${contact.ville}" target="_blank">Visualiser l'adresse sur une carte <i class="fas fa-external-link-alt"></i></a>
                          </p>
                          <p><span class="font-weight-bold">Email :</span><br /><a href="mailto:${contact.email}">${contact.email}</a></p>
                          <p><span class="font-weight-bold">Téléphone :</span><br /><a href="telto:${contact.tel}">${contact.tel}</a></p>
                          <p><span class="font-weight-bold">Catégorie :</span><br />${contact.categorie}</p>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                        </div>
                      </div>
                    </div>
                  </div>
              </td>
              <td>
                  <button type="button" class="btn btn-info modif-contact" id="${contact.id}">
                  <i class="fas fa-edit mr-1"></i>Modifier</button>

                  <button type="button" class="btn btn-danger supp-contact" id="${contact.id}">
                  <i class="fas fa-trash-alt mr-1"></i>Supprimer</button>
                                  
              </td>
            </tr>
        `;
      });

      // Fin du tableau
      html += `    </tbody>
                    </table>`;
    } else {
      // Sinon message d'alerte
      html = `<div class="alert alert-danger" role="alert">
      <i class="fas fa-exclamation-triangle"></i> &nbsp;Aucun contact ne figure dans la liste !
        </div>`;
    }
    $(".liste").html(html); // Afficher le tout sur la page
  });

  request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
  });
}

// AJOUTER UN CONTACT
function ajoutContact() {
  let request = $.ajax({
    type: "POST",
    url: "http://localhost:3000/contacts",
    data: {
      id: new Date().getTime(),
      nom: $("#nom").val(),
      prenom: $("#prenom").val(),
      email: $("#mail").val(),
      tel: $("#tel").val(),
      rue: $("#rue").val(),
      appt: $("#appt").val(),
      codePostal: $("#codePostal").val(),
      ville: $("#ville").val(),
      categorie: $("#categorie").val(),
    },
    dataType: "json",
  });

  request.done(function (response) {
    liste();
  });

  request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
  });
}

// RECUPERER LES INFORMATIONS D'UN CONTACT POUR LES AFFICHER DANS LE FORMULAIRE DE MODIFICATION
function modifContact(id) {
  let request = $.ajax({
    type: "GET",
    url: `http://localhost:3000/contacts/${id}`,
    dataType: "json",
  });

  request.done(function (response) {
    $(".modif-contact #nom").val(response.nom);
    $(".modif-contact #prenom").val(response.prenom);
    $(".modif-contact #mail").val(response.email);
    $(".modif-contact #tel").val(response.tel);
    $(".modif-contact #rue").val(response.rue);
    $(".modif-contact #appt").val(response.appt);
    $(".modif-contact #codePostal").val(response.codePostal);
    $(".modif-contact #ville").val(response.ville);
    $(".modif-contact #categorie").val(response.categorie);
    $(".maj-contact").attr("id", response.id);
  });

  request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
  });
}

// METTRE A JOUR UN CONTACT
function majContact(id) {
  let request = $.ajax({
    type: "PUT",
    url: `http://localhost:3000/contacts/${id}`,
    data: {
      nom: $(".modif-contact #nom").val(),
      prenom: $(".modif-contact #prenom").val(),
      email: $(".modif-contact #mail").val(),
      tel: $(".modif-contact #tel").val(),
      rue: $(".modif-contact #rue").val(),
      appt: $(".modif-contact #appt").val(),
      codePostal: $(".modif-contact #codePostal").val(),
      ville: $(".modif-contact #ville ").val(),
      categorie: $(".modif-contact #categorie").val(),
    },
    dataType: "json",
  });

  request.done(function (response) {
    liste();
  });

  request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
  });
}

// SUPPRIMER UN CONTACT
function suppContact(id) {
  let request = $.ajax({
    type: "DELETE",
    url: `http://localhost:3000/contacts/${id}`,
    dataType: "json",
  });

  request.done(function (response) {
    liste();
  });

  request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
  });
}

// AFFICHER LE NOMBRE DE CONTACT SUR LE TABLEAU DE BORD
function nbContact() {
  let request = $.ajax({
    type: "GET",
    url: "http://localhost:3000/contacts",
    dataType: "json",
  });

  request.done(function (response) {
    $(".nbContact").html(`${response.length}`);
  });

  request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
  });
}

// AFFICHAGE DES DIFFERENTES FONCTIONNALITES CONCERNANT LES CATEGORIES SUR LE TABLEAU DE BORD
function categories(tabSet) {
  let request = $.ajax({
    type: "GET",
    url: `http://localhost:3000/contacts`,
    dataType: "json",
  });

  request.done(function (response) {
    let html = "";

    // RECUPERATION DU NOM DES DIFFERENTES CATEGORIES DE MANIERE UNIQUE
    response.map(function (caseResponse) {
      tabSet.add(caseResponse.categorie);
    });
    $(".nbCategorie").html(tabSet.size);

    // AFFICHAGE LISTE DES CATEGORIES
    if (tabSet.size !== 0) {
      // S'il y a des catégories...
      for (const element of tabSet) {
        html += `<button class="btn btn-info btn-block" id="bouton${element}">
        ${element} <span class="badge badge-light" id="categorie${element}"></span>
      </button>`;
      }
    } else {
      // Sinon afficher message d'alerte
      html = `<div class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-triangle"></i> &nbsp;Aucune catégorie ne figure dans la liste !
          </div>`;
    }
    $(".liste-cat").html(html);

    // AFFICHAGE NOMBRE D'OCCURENCES DES CATEGORIES
    let numOccurences = 0;
    for (const caseSearch of tabSet) {
      numOccurences = $.grep(response, function (caseResponse) {
        //grep(objet JSON, fonction(case actuelle de l'objet))
        return caseResponse.categorie === caseSearch; // retourne la catégorie de la case actuelle de l'objet si elle correspond à la condition de filtrage
      }).length; // la longueur du tableau généré par grep
      // numOccurences = longueur du tableau généré par grep après parcours de l'objet JSON
      $(`#categorie${caseSearch}`).html(numOccurences);
    }

    // DIAGRAMME CATEGORIE
    // RECUPERATION DES DONNEES
    let xValues = [];
    let yValues = [];
    for (const element of tabSet) {
      xValues.push(element); // Récupère le nom des catégories pour les mettre dans un tableau pour le graphique
      yValues.push(parseInt($(`#categorie${element}`).text())); // Récupère le nombre d'occurences des catégories pour le graphique
    }

    // COULEURS DU GRAPHIQUE
    let barColors = [
      "#007bff",
      "#28a745",
      "#c82333",
      "#ffc107",
      "#ff9200",
      "#81cf00",
      "#aaaaaa",
      "#00ffff",
      "#ff7ab1",
      "#990066",
      "#000000",
      "#ff0092",
      "#b06b00",
      "#000080",
      "#42bec0",
      "#ffff00",
    ];

    //GENERER LE DIAGRAMME
    new Chart("chartCategorie", {
      type: "doughnut",
      data: {
        labels: xValues,
        datasets: [
          {
            backgroundColor: barColors,
            data: yValues,
          },
        ],
      },
    });
  });

  request.fail(function (http_error) {
    let server_msg = http_error.responseText;
    let code = http_error.status;
    let code_label = http_error.statusText;
    alert("Erreur " + code + " (" + code_label + ") : " + server_msg);
  });
}

// ALGO CATEGORIE
// - RECHERCHER TOUTES LES CATEGORIES ET LES METTRE DANS UN TABLEAU
// - PARCOURIR LE TABLEAU ET COMPTER LE NOMBRE D'OCCURENCES
//

/*
OBJET D'ORIGINE :

{
  "contacts": [
    {
      "id": "1644970279085",
      "nom": "Rerum voluptates sed",
      "prenom": "Rerum labore irure e"
    },
    {
      "id": "1645140574309",
      "nom": "Fugit impedit offi",
      "prenom": "Impedit velit tempo"
    },
    {
      "id": "1645141867947",
      "nom": "hidri pp",
      "prenom": "ryan pp"
    },
    {
      "id": "1645143977964",
      "nom": "test nom",
      "prenom": "test prenom"
    },
    {
      "id": "1645612509797",
      "nom": "Et excepteur molesti",
      "prenom": "Molestiae eos corru"
    }
  ]
}
*/
