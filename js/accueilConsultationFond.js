const SRC_IMG = "images/"; // emplacement des images de l'appli
const ALBUM_DEFAULT_MINI = SRC_IMG + "noComicsMini.jpeg";
const ALBUM_DEFAULT = SRC_IMG + "noComics.jpeg";
const SRC_ALBUM_MINI = "albumsMini/"; // emplacement des images des albums en petit
const SRC_ALBUM = "albums/"; // emplacement des images des albums en grand
const DIVTABLEBODY = document.getElementById("tabListLivresBody");
const currentAlbumHover = document.getElementById("currentAlbumHover");
const albumPopUp = document.getElementById("albumPopUp");
const responsiveList = document.getElementById("responsiveList");
const containerHomepageBooks = document.getElementById(
  "containerHomepageBooks"
);
var count = 0,
  table,
  isWidthSmall = false,
  totalPages,
  currentPage = 1;
  resultsID = [],
  resultsDiv = [];
window.addEventListener("resize", manageWidth);

document.addEventListener("DOMContentLoaded", init);

/**
 * Initialise la page
 */
function init() {
  table = $("#homePageTabBooks").DataTable({
    columnDefs: [
      { orderable: false, targets: [0] },
      { orderable: true, targets: [1, 2, 3] },
    ],
    //Creer le tableau en francais
    language: {
      lengthMenu: "Afficher _MENU_ albums par page",
      zeroRecords: "Aucun résultat trouvé - désolé",
      info: "Affichage de la page _PAGE_ sur _PAGES_",
      infoEmpty: "Aucun albums disponible",
      infoFiltered: "(filtré parmi un total de _MAX_ albums)",
      loadingRecords: "Chargement...",
      processing: "Traitement...",
      lengthMenu: "Afficher _MENU_ éléments",
      search: "Rechercher :",
      zeroRecords: "Aucun album correspondant trouvé",
      paginate: {
        first: "Premier",
        last: "Dernier",
        next: "Suivant",
        previous: "Précédent",
      },
    },
    aria: {
      sortAscending: ": activer pour trier la colonne par ordre croissant",
      sortDescending: ": activer pour trier la colonne par ordre décroissant",
    },
    responsive: true,
  });
  $("#searchInput").on("keyup search input paste cut", function () {
    table.search(this.value).draw();
    manageSearch(this.value);
  });
   $(".navbar-toggler").on("click", function () {
     $("#navbarNav").collapse("toggle");
   });
  afficheAlbums();
  manageSearch();
  manageWidth();
}
/**
 * Gere la recherche 
 */
function manageSearch() {
  searchInTable();
  if (getIsWidthSmall() === true) afficheCard();
}
/**
 * Renvoie et affiche les cartes visible/cherché en fonction de la recherche du tableau.
 * Coordonne le resultat de la recherche dans le tableau avec les cartes
 */
function searchInTable() {
  var searchResults = table.rows({ search: "applied" }).data();
  var resultsArray = searchResults.toArray();

  resultsID.length = 0;
  resultsDiv.length = 0;
  if (getIsWidthSmall() === true) {
    for (let i = 0; i < resultsArray.length; i++) {
      //recupere l'id de chaque Ligne qui peut etre affichée apres ou sans recherche
      var currentImgStr = resultsArray[i][0];
      var idMatch = currentImgStr.match(/id="(\d+)"/);
      var imageID = idMatch[1];
      resultsID.push(imageID);
    }
    return [resultsID, resultsDiv];
  } else return [resultsID, resultsDiv];
}
// --------------------------Gestion de la responsivité-----------------------------
/**
 * Vérifie la taille de l'écran et ajuste l'affichage en conséquence.
 * @returns {Bool}Renvoie si l'ecran est petit
 */
function getIsWidthSmall() {
  if (window.matchMedia("(min-width: 576px)").matches)
    return false; // Écran large
  else return true;
}
/**
 * Gere l'affichage selon la taille de l'ecran
 */
function manageWidth() {
  if (getIsWidthSmall() === true) manageSmallScreen();
  else manageOtherBigScreen();
}
/**
 * Gere l'affichage des elements lorsque l'ecran EST petit
 */
function manageSmallScreen() {
  responsiveList.style.display = "flex";
  containerHomepageBooks.style.display = "none";
  var cardAlbums = document.querySelectorAll(".cardAlbum");
  cardAlbums.forEach(function (cardAlbum) {
    cardAlbum.style.display = "block"; 
  });
  afficheCard();
}
/**
 * Gere l'affichage des elements lorsque l'ecran n'est PAS petit
 */
function manageOtherBigScreen() {
  // Écran large
   //reset la pagination
  var pagination = document.getElementById("pagination");
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }
  containerHomepageBooks.style.display = "block";
  responsiveList.style.display = "none";
}
/**
 * Methode qui affiche les albums en Cartes pour mobile et appelle la gestion la pagination
 * @param {*} params
 */
function afficheCard() {
  searchInTable();
  //  Reset l'element pagination 
  var pagination = document.getElementById("pagination");
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }
  // Masquage de toutes les cartes
    $(".cardAlbum").hide();


  // Parcours les albums puis afficher ceux des cherché/visibles
  for (const [key, value] of albums) {
    if (resultsID.includes(key)) {
      var currentAlbum = document.getElementById(`card${key}`);
       console.log(`afficheCard ${key}${currentAlbum}`);
      resultsDiv.push(currentAlbum);
    }
  }

  document.getElementById("noSearchFound").style.display = "none"; //Initialise "Aucun album correspondant trouvé" pour les cartes en le cachant
  if (document.getElementsByClassName("dataTables_empty")[0] != undefined) {
    //Si le tableau affiche "Aucun album correspondant trouvé" , on l'affiche pour les cartes
    document.getElementById("noSearchFound").style.display = "block";
    return;
  }

  // Calcul du nombre total de pages
  totalPages = Math.ceil(resultsDiv.length / 10);

  // Génération de la pagination
  document.getElementById("pagination").innerHTML = createPagination(currentPage);

  for (var i = 1; i <= totalPages; i++) {
    if (totalPages <= 1) {
      //Suprimme la pagination si il n'y a qu'une seule page ou pas de resultats
      $("#pagination ul").remove();
      break;
    }
  }
}
/**
 * Gere la pagination (pour petit ecran ) et creer la pagination a chaque click sur un element
 * @param {*} page 
 * @returns 
 */
function createPagination(pageCourante) {
  let str = '<ul class="pagination justify-content-center my-2">';
  let active;
  let pageCoupeBasse = pageCourante - 1;
  let pageCoupeHaute = pageCourante + 1;
  manageCardShowPerPage(pageCourante);

  // Afficher le bouton Précédent
  if (pageCourante > 1) {
    str +=
      '<li class="page-item previous no"><a onclick="createPagination(' +
      (pageCourante - 1) +
      ')">Précédent</a></li>';
  }
  // S'il y a moins de six pages, afficher tous les boutons de pagination
  if (totalPages < 6) {
    for (let p = 1; p <= totalPages; p++) {
      active = pageCourante == p ? "active" : "no";
      str +=
        '<li class="' +
        active +
        '"><a class="page-link"  href="#" onclick="createPagination(' +
        p +
        ')">' +
        p +
        "</a></li>";
    }
  } else {
    // Ajouter "..." pour reculer de deux pages derrière le bouton précédent
    if (pageCourante > 2) {
      str +=
        '<li class="no page-item"><a onclick="createPagination(1)">1</a></li>';
      if (pageCourante > 3) {
        str +=
          '<li class="out-of-range"><a onclick="createPagination(' +
          (pageCourante - 2) +
          ')">...</a></li>';
      }
    }

    // Déterminer combien de pages afficher après l'indice de la page actuelle
    if (pageCourante === 1) {
      pageCoupeHaute += 2;
    } else if (pageCourante === 2) {
      pageCoupeHaute += 1;
    }
    // Déterminer combien de pages afficher avant l'indice de la page actuelle
    if (pageCourante === totalPages) {
      pageCoupeBasse -= 2;
    } else if (pageCourante === totalPages - 1) {
      pageCoupeBasse -= 1;
    }
    // Afficher les indexes des pages comprises entre pageCoupeBasse et pageCoupeHaute
    for (let p = pageCoupeBasse; p <= pageCoupeHaute; p++) {
      if (p === 0) {
        p += 1;
      }
      if (p > totalPages) {
        continue;
      }
      active = pageCourante == p ? "active" : "no";
      str +=
        '<li class="page-item ' +
        active +
        '"><a onclick="createPagination(' +
        p +
        ')">' +
        p +
        "</a></li>";
    }
    // Afficher la toute dernière page précédée de "..." à la fin de la section de pagination
    // (avant le bouton Suivant)
    if (pageCourante < totalPages - 1) {
      if (pageCourante < totalPages - 2) {
        str +=
          '<li class="out-of-range"><a onclick="createPagination(' +
          (pageCourante + 2) +
          ')">...</a></li>';
      }
      str +=
        '<li class="page-item no"><a onclick="createPagination(totalPages)">' +
        totalPages +
        "</a></li>";
    }
  }
  // Afficher le bouton Suivant seulement si vous êtes sur une page autre que la dernière
  if (pageCourante < totalPages) {
    str +=
      '<li class="page-item next no"><a onclick="createPagination(' +
      (pageCourante + 1) +
      ')">Suivant</a></li>';
  }
  str += "</ul>";
  // Renvoyer la chaîne de pagination pour être affichée dans les modèles Pug
  document.getElementById("pagination").innerHTML = str;
  return str;
}

/**
 * Gere le nombre de carte a afficher sur chaque page (ecran petit)
 * @param {*} pageCourante 
 */
function manageCardShowPerPage(pageCourante) {
  // Calcul des index de début et de fin pour les éléments à afficher pour 10 elements par page
  var start = (pageCourante - 1) * 10;
  var end = start + 10;
  //  Cache toutes les cartes
  $(".cardAlbum").hide();
  // Affichage des éléments pour la page sélectionnée
  resultsDiv.slice(start, end).forEach(function (element) {
    element.style.setProperty("display", "block");
  });

  // Mise à jour de la classe active pour la pagination
  $(".pagination li").removeClass("active");
  $(pageCourante).addClass("active");
}
/**
 * Affiche les albums dans un tableau  et creer les src des images mini et grandes.
 * Les informations sur l'auteur, la série et les images des albums sont récupérées.
 * Chaque album est ajouté à la table et à la liste de cartes.
 */
async function afficheAlbums() {
  for (const [key, value] of albums) {
    // Récupération du nom de l'auteur et de la série grace ID
    var serieName = series.get(value.idSerie).nom;
    var auteurName = auteurs.get(value.idAuteur).nom;
    var numeroAlbum = key.toString(),
        exemplairesKeyTab = [];
    // Génération du nom de fichier pour les images
    let nomFic = serieName + "-" + value.numero + "-" + value.titre;
    nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, ""); // Suppression des caractères non autorisés

    // Donne les src des images aux albums
    value.miniImg = SRC_ALBUM_MINI + nomFic + ".jpg";
    value.bigImg = SRC_ALBUM + nomFic + ".jpg";
    //  Ajoute l'isbn si iil n'est pas déjà rentré
    if (value.isbn === undefined && value.isbnAlreadySearched != true) {
      var titreAuteur = value.titre + " " + auteurName;
      const isbnArray = await getIsbnApi(titreAuteur);
        if (isbnArray != false) {
              value.isbn =isbnArray;
        } else{
          value.isbn === undefined;
          value.isbnAlreadySearched = true;
        } 
    }
    //addAlbumToLocal(key, value);
    // Renvoie la clé et la valeur de chaque examplaire disponible d'un album dans un tableau
    exemplairesKeyTab = getExemplairesPerAlbum(numeroAlbum);
    pushExemplairesDataToAlbum(exemplairesKeyTab ,key);
    console.log(exemplairesKeyTab)
    // Ajout de l'album à la table et à la liste de cartes
    addNewRow(key, value.miniImg, value.titre, serieName, auteurName);
    addNewCard(
      key,
      value.bigImg,
      value.titre,
      serieName,
      auteurName,
      value.nombreExemplairesDispo,
      value.emplacement
    );

    // Affichage des détails de l'album dans la console
    console.log(`Album ID: ${key}`);
    console.log(`Album isbn : ${value.isbn}`)
    console.log(`Titre: ${value.titre}`);
    console.log(`Numero: ${value.numero}`);
    console.log(`ID Serie: ${value.idSerie}, Nom de la série: ${serieName}`);
    console.log(`ID Auteur: ${value.idAuteur}, Nom: ${auteurName}`);
    console.log(`Prix: ${value.prix}`);
    console.log(value.miniImg, value.bigImg);
    console.log("------------------------");
  }
}

// ------------------------------- Gestion Exemplaires ----------------------------------
/**
 * Renvoie la clé et la valeur de chaque examplaire disponible d'un album dans un tableau
 * @param {number} numeroAlbum Nombre de l'album que vous voulez verifier
 * @returns {2DArray}  clé et la valeur de chaque examplaire disponible
 */
function getExemplairesPerAlbum(numeroAlbum) {
  var exemplairesKeyTab = [];
  
  // Parcourt chaque élément dans 'exemplaires' pour trouver les exemplaires disponibles pour l'album spécifié
  for (const [key, value] of exemplaires) {
    if (value.keyAlbum.toString() == numeroAlbum) {
      exemplairesKeyTab.push([key, value]); // Ajoute la clé et la valeur de chaque exemplaire trouvé
    }
  }

  // Renvoie le tableau des exemplaires si au moins un exemplaire est disponible, sinon renvoie null
  if (exemplairesKeyTab.length != 0) {
    return exemplairesKeyTab;
  } else {
    return null;
  }
}

/**
 * Ajoute les données d'exemplaires à un album spécifique s'il en possède.
 * @param {2DArray|null} exemplairesKeyTab Tableau contenant la clé et la valeur de chaque exemplaire
 * @param {string} key Clé de l'album à gérer  (utile quand le tableau est == null
 */
function pushExemplairesDataToAlbum(exemplairesKeyTab, albumKey) {
  // Vérifie s'il y a des exemplaires pour l'album et attribue les valeurs correspondantes
  if (exemplairesKeyTab !== null) {
    var nombreExemplairesDispo = 0;
    var exemplairesAlbumKey = exemplairesKeyTab[0][1].keyAlbum.toString();
    var album = albums.get(exemplairesAlbumKey);
   // var albumMap = getAlbumFromLocal();
    //var album = albumMap.get(exemplairesAlbumKey)
    // Attribue la clé de chaque exemplaire de cet album dans un tableau
    for (let i = 0; i < exemplairesKeyTab.length; i++) {
      var exemplairesKey = exemplairesKeyTab[i][0].toString();

      // Si l'exemplaire actuel est disponible, incrémente le compteur d'exemplaires disponibles
      if (exemplairesKeyTab[i][1].isDispo === true) {
        nombreExemplairesDispo++;
      }

      // Crée un tableau avec chaque exemplaire pour cet album s'il n'existe pas encore
      if (album.exemplairesKeyTab === undefined) {
        album.exemplairesKeyTab = [];
      }
      album.exemplairesKeyTab.push(exemplairesKey);
    }
    album.nombreExemplairesDispo = nombreExemplairesDispo;
    album.emplacement = exemplairesKeyTab[0][1].emplacement;
    //addAlbumToLocal(exemplairesAlbumKey, album);
    console.log(album);
  } else {
    // Affecte des valeurs par défaut à l'album s'il n'a pas d'exemplaires
    var album = albums.get(albumKey);
    album.exemplairesKeyTab = [];
    album.nombreExemplairesDispo = 0;
    album.emplacement = null;
    //addAlbumToLocal(exemplairesAlbumKey, album);
    console.log(album);
  }
}
/**
 * Creer les cartes respectives de chaque album
 * @param {Number} id
 * @param {String} bigImg
 * @param {String} titre
 * @param {String} serieName
 * @param {String} auteurName
 */
function addNewCard(id, bigImg, titre, serieName, auteurName,
nombreExemplairesDispo,emplacement) {
  console.log(emplacement);
  var currentCard = document.createElement("div");
  currentCard.classList.add(
    "card",
    "cardAlbum",
    "text-center",
    "col-5",
    "col-md-10",
    "mt-3",
    "p-0"
  );
  currentCard.setAttribute("id", `card${id}`);
  //----------------------------Card header------------------------------------------
  var cardHeader = document.createElement("div");
  cardHeader.className = "card-header p-0";

  var cardImg = document.createElement("img");
  cardImg.setAttribute("class", "w-100");
  cardImg.src = bigImg;

  cardHeader.appendChild(cardImg);
  //----------------------------Card body------------------------------------------
  var cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");

  var cardTitle = document.createElement("h5");
  cardTitle.setAttribute("class", "card-title");
  cardTitle.innerText = titre;

  var cardSerie = document.createElement("p");
  cardSerie.setAttribute("class", "card-text");
  cardSerie.innerText = serieName;

  var cardExemplairesInfo = document.createElement("div");
  cardExemplairesInfo.setAttribute(
    "class",
    "d-flex justify-content-between flex-column flex-sm-row"
  );
  var cardExemplairesNb = document.createElement("p");
  // Gere l'affichage du nb d'exemplaire dispo et de l'emplacement
 if (nombreExemplairesDispo >= 1) {
   cardExemplairesNb.setAttribute("class","col-12 col-sm-5");
   cardExemplairesNb.innerHTML = `Nombres d'exemplaires disponible : <span class="text-success">${nombreExemplairesDispo}</span>`;
    cardExemplairesInfo.appendChild(cardExemplairesNb);
   if (emplacement != null) {
    var cardExemplairesLocation = document.createElement("ul");
    cardExemplairesLocation.setAttribute(
      "class",
      "list-unstyled col-12 col-md-5"
    );
       cardExemplairesLocation.innerHTML = `<li>Emplacement</li>
                                            <li>${emplacement.etage}</li>
                                            <li>${emplacement.rayon}</li>
                                            <li>Numero: ${emplacement.numero}</li>`;
    cardExemplairesInfo.appendChild(cardExemplairesLocation);
   }
 }  else if (nombreExemplairesDispo === 0) {
  cardExemplairesNb.innerHTML = `<span class="text-danger">Aucun exemplaire Disponible</span>`;
 cardExemplairesInfo.appendChild(cardExemplairesNb);
 }
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardSerie);
   cardBody.appendChild(cardExemplairesInfo);
  //----------------------------Card Footer------------------------------------------
   var cardFooterContainer = document.createElement("div");
   cardFooterContainer.setAttribute(
     "class",
     "d-flex flex-column align-content-center flex-wrap flex-grow position-absolute bottom-0 w-100"
   );
  var cardFooter = document.createElement("div");
  cardFooter.setAttribute("class", "card-footer align-content-center");
  cardFooter.innerText = auteurName;
  cardFooterContainer.appendChild(cardFooter);
  // Insertion dans la div
  currentCard.appendChild(cardHeader);
  currentCard.appendChild(cardBody);
  currentCard.appendChild(cardFooterContainer);
  
  responsiveList.appendChild(currentCard);
}

/**
 * Methode qui ajoute une nouvelle ligne au tableau avec un examplaire
 * @param {*} key
 * @param {*} miniImg
 * @param {*} titre
 * @param {*} serieName
 * @param {*} auteurName
 */
function addNewRow(id, miniImg, titre, serieName, auteurName) {
  var currentId = id;
  var rowNode = table.row
    .add([
      `<img src="${miniImg}" alt="Image de ${titre}" id="${id}" class="table-img imgColumn"">`,
      `<p class="table-text">${titre}</p>`,
      `<p class="table-text">${serieName}</p>`,
      `<p class="table-text">${auteurName}</p>`,
    ])
    .draw(false);
  $(rowNode.node()).on("click", function () {
    showAlbumPopUp(currentId);
  });
}
/**
 * Affiche le détails de la bd lors que l'ecran est grand
 * @param {*} id 
 */
function showAlbumPopUp(id) {
  var currentAlbum = document.getElementById(`card${id}`).cloneNode(true);
 currentAlbum.style.display = "block";
  var modalContent = document.getElementById(`popUpLivre`);
  console.log(modalContent);
   if (modalContent.firstChild) modalContent.removeChild(modalContent.firstChild);

  modalContent.appendChild(currentAlbum);
  $("#albumPopUp").modal("show");
}