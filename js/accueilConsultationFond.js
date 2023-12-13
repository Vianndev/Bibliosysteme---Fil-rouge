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
    managaSearch(this.value);
  });
  afficheAlbums();
  managaSearch();
  manageWidth();
}
function managaSearch() {
  searchInTable();
  if (getIsWidthSmall() === true) afficheCard();
}
/**
 * Rnvoie et affiche les cartes visible/cherché.
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
 */
function getIsWidthSmall() {
  if (window.matchMedia("(min-width: 576px)").matches)
    return false; // Écran large
  else return true;
}

function manageWidth() {
  if (getIsWidthSmall() === true) manageSmallScreen();
  else manageOtherBigScreen();
}
function manageSmallScreen() {
  responsiveList.style.display = "flex";
  containerHomepageBooks.style.display = "none";
  var cardAlbums = document.querySelectorAll(".cardAlbum");
  cardAlbums.forEach(function (cardAlbum) {
    cardAlbum.style.display = "block"; // Set display to empty to remove inline style
  });
  afficheCard();
}
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
 * Methode qui affiche les albums en Cartes pour mobile et gère la pagination
 * @param {*} params
 */
function afficheCard(params) {
  searchInTable();
  //reset la pagination
  var pagination = document.getElementById("pagination");
  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }
  // Masquage de toutes les cartes et suppression de la pagination existante
  $(".cardAlbum").hide();

  // Parcours les albums puis afficher ceux des cherché/visibles
  for (const [key, value] of albums) {
    if (resultsID.includes(key)) {
      var currentAlbum = document.getElementById(`card${key}`);
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

  // Gestion de l'événement de clic sur la pagination
  /*
  $(".pagination").on("click", "li", function (e) {
    e.preventDefault();
    managePaginationClick(this);
  });*/
}

function createPagination(page) {
  let str = '<ul class="pagination justify-content-center my-2">';
  let active;
  let pageCutLow = page - 1;
  let pageCutHigh = page + 1;
  managePaginationClick(page); 
  // Show the Previous button only if you are on a page other than the first
  if (page > 1) {
    str +=
      '<li class="page-item previous no"><a onclick="createPagination(' +
      (page - 1) +
      ')">Previous</a></li>';
  }
  // Show all the pagination elements if there are less than 6 totalPages total
  if (totalPages < 6) {
    for (let p = 1; p <= totalPages; p++) {
      active = page == p ? "active" : "no";
      str +=
        '<li class="' +
        active +
        '"><a class="page-link"  href="#" onclick="createPagination(' +
        p +
        ')">' +
        p +
        "</a></li>";
    }
  }
  // Use "..." to collapse pages outside of a certain range
  else {
    // Show the very first page followed by a "..." at the beginning of the
    // pagination section (after the Previous button)
    if (page > 2) {
      str +=
        '<li class="no page-item"><a onclick="createPagination(1)">1</a></li>';
      if (page > 3) {
        str +=
          '<li class="out-of-range"><a onclick="createPagination(' +
          (page - 2) +
          ')">...</a></li>';
      }
    }

    // Determine how many pages to show after the current page index
    if (page === 1) {
      pageCutHigh += 2;
    } else if (page === 2) {
      pageCutHigh += 1;
    }
    // Determine how many pages to show before the current page index
    if (page === totalPages) {
      pageCutLow -= 2;
    } else if (page === totalPages - 1) {
      pageCutLow -= 1;
    }
    // Output the indexes for pages that fall inside the range of pageCutLow
    // and pageCutHigh
    for (let p = pageCutLow; p <= pageCutHigh; p++) {
      if (p === 0) {
        p += 1;
      }
      if (p > totalPages) {
        continue;
      }
      active = page == p ? "active" : "no";
      str +=
        '<li class="page-item ' +
        active +
        '"><a onclick="createPagination(' +
        p +
        ')">' +
        p +
        "</a></li>";
    }
    // Show the very last page preceded by a "..." at the end of the pagination
    // section (before the Next button)
    if (page < totalPages - 1) {
      if (page < totalPages - 2) {
        str +=
          '<li class="out-of-range"><a onclick="createPagination(' +
          (page + 2) +
          ')">...</a></li>';
      }
      str +=
        '<li class="page-item no"><a onclick="createPagination(totalPages)">' +
        totalPages +
        "</a></li>";
    }
  }
  // Show the Next button only if you are on a page other than the last
  if (page < totalPages) {
    str +=
      '<li class="page-item next no"><a onclick="createPagination(' +
      (page + 1) +
      ')">Next</a></li>';
  }
  str += "</ul>";
  // Return the pagination string to be outputted in the pug templates
  document.getElementById("pagination").innerHTML = str;
  return str;
}

function managePaginationClick(page) {
  currentPage = page;
  // Récupération du numéro de page cliqué
  var pageNum = $(page).text();

  // Calcul des index de début et de fin pour les éléments à afficher
  var start = (currentPage - 1) * 10;
  var end = start + 10;
  $(".cardAlbum").hide();

  // Affichage des éléments pour la page sélectionnée
  resultsDiv.slice(start, end).forEach(function (element) {
    element.style.setProperty("display", "block", "important");
  });

  // Mise à jour de la classe active pour la pagination
  $(".pagination li").removeClass("active");
  $(page).addClass("active");
}
/**
 * Affiche les albums dans un tableau  et creer les src des images mini et grandes.
 * Les informations sur l'auteur, la série et les images des albums sont récupérées.
 * Chaque album est ajouté à la table et à la liste de cartes.
 */
function afficheAlbums() {
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
    // Renvoie la clé et la valeur de chaque examplaire disponible d'un album dans un tableau
    exemplairesKeyTab = getExemplairesPerAlbum(numeroAlbum);
    console.log(exemplairesKeyTab);
    manageExemplaires(exemplairesKeyTab ,key);
    // Ajout de l'album à la table et à la liste de cartes
    addNewRow(key, value.miniImg, value.titre, serieName, auteurName);
    addNewCard(
      key,
      value.bigImg,
      value.titre,
      serieName,
      auteurName,
      value.exemplairesKeyTab,
      value.nombreExemplairesDispo,
      value.emplacement
    );

    // Affichage des détails de l'album dans la console
    console.log(`Album ID: ${key}`);
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
 * Gère les exemplaires pour un album donné en ajoutant les données d'exemplaires à l'album.
 * @param {2DArray |null} exemplairesKeyTab Tableau contenant la clé et la valeur de chaque exemplaire
 * @param {string} key Clé de l'album à gérer (utile quand le tableau est == null)
 */
function manageExemplaires(exemplairesKeyTab, key) {
  getExemplairesData(exemplairesKeyTab, key); // Appelle la fonction pour recuperer les données d'exemplaires à l'album

}

/**
 * Ajoute les données d'exemplaires à un album spécifique s'il en possède.
 * @param {2DArray|null} exemplairesKeyTab Tableau contenant la clé et la valeur de chaque exemplaire
 * @param {string} key Clé de l'album à gérer
 */
function getExemplairesData(exemplairesKeyTab, key) {
  // Vérifie s'il y a des exemplaires pour l'album et attribue les valeurs correspondantes
  if (exemplairesKeyTab !== null) {
    var nombreExemplairesDispo = 0;
    var exemplairesAlbumKey = exemplairesKeyTab[0][1].keyAlbum.toString();
    var album = albums.get(exemplairesAlbumKey);

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
    console.log(album);
  } else {
    // Affecte des valeurs par défaut à l'album s'il n'a pas d'exemplaires
    var album = albums.get(key);
    album.exemplairesKeyTab = [];
    album.nombreExemplairesDispo = 0;
    album.emplacement = null;
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
function addNewCard(id, bigImg, titre, serieName, auteurName, exemplairesKeyTab,
nombreExemplairesDispo,emplacement) {
  var currentCard = document.createElement("div");
  currentCard.classList.add(
    "card",
    "cardAlbum",
    "text-center",
    "col-5",
    "mt-3",
    "p-0"
  );
  currentCard.setAttribute("id", `card${id}`);
  //----------------------------Card header------------------------------------------
  var cardHeader = document.createElement("div");
  cardHeader.className = "card-header p-0";

  var cardImg = document.createElement("img");
  cardImg.className = "w-100";
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
  cardExemplairesInfo.setAttribute("class", "d-flex justify-content-between flex-row");
  var cardExemplairesNb = document.createElement("p");
 if (nombreExemplairesDispo > 1) {
   cardExemplairesNb.innerHTML = `Nombres d'exemplaires disponible : <span class="text-success">${nombreExemplairesDispo}</span>`;
 }
 cardExemplairesInfo.appendChild(cardExemplairesNb);
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardSerie);
   cardBody.appendChild(cardExemplairesInfo);
  //----------------------------Card Footer------------------------------------------
  var cardFooter = document.createElement("div");
  cardFooter.setAttribute("class", "card-footer");
  cardFooter.innerText = auteurName;
  // Insertion dans la div
  currentCard.appendChild(cardHeader);
  currentCard.appendChild(cardBody);
  currentCard.appendChild(cardFooter);

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
function showAlbumPopUp(id) {
  var currentAlbum = document.getElementById(`card${id}`);
  var modalContent = document.getElementById(`modal-dialog`);
  modalContent.removeChild(modalContent.firstChild);

  modalContent.appendChild(currentAlbum);
  $("#albumPopUp").modal("show");
} /*
/*
// Lecture d'un album
console.log("Lecture d'un album");
var album = albums.get("5");
var serie = series.get(album.idSerie);
var auteur = auteurs.get(album.idAuteur);
console.log(album.titre+" "+serie.nom+" "+auteur.nom);
*/

/*
console.log("Liste des albums");
albums.forEach(album => {
    serie = series.get(album.idSerie);
    auteur = auteurs.get(album.idAuteur);
    console.log(album.titre+" N°"+album.numero+" Série:"+serie.nom+" Auteur:"+auteur.nom);
});
*/

/*
console.log("Liste des albums par série");
for(var [idSerie, serie] of series.entries()) {
    // Recherche des albums de la série
    for (var [idAlbum, album] of albums.entries()) {
        if (album.idSerie == idSerie) {
            console.log(serie.nom+", Album N°"+album.numero+" "+album.titre+", Auteur:"+auteurs.get(album.idAuteur).nom);
        }
    }
    
}
*/

/*
console.log("Liste des albums par auteur");
for(var [idAuteur, auteur] of auteurs.entries()) {
    // Recherche des albums de l'auteur
    for (var [idAlbum, album] of albums.entries()) {
        if (album.idAuteur == idAuteur) {
            console.log(auteur.nom+", Album N°"+album.numero+" "+album.titre+", Série:"+series.get(album.idSerie).nom);
        }
    }
    
}
*/
/*
  // Affichage des BD
  var txtSerie = document.getElementById("serie");
  var txtNumero = document.getElementById("numero");
  var txtTitre = document.getElementById("titre");
  var txtAuteur = document.getElementById("auteur");
  var txtPrix = document.getElementById("prix");
  var imgAlbum = document.getElementById("album");
  var imgAlbumMini = document.getElementById("albumMini");

  imgAlbum.addEventListener("error", function () {
    prbImg(this);
  });

  imgAlbumMini.addEventListener("error", function () {
    prbImg(this);
  });

  var id = document.getElementById("id");
  id.addEventListener("change", function () {
    getAlbum(this);
  });
/*
/**
 * Récupération de l'album par son id et appel de
 * la fonction d'affichage
 *
 * @param {number} num
 *//*
function getAlbum(num) {
 var album = albums.get(num.value);

 if (album === undefined || num < 0 || typeof num != "number") throw Error("Input num invalide ou livre non trouvé ")
 else {
   var serie = series.get(album.idSerie);
   var auteur = auteurs.get(album.idAuteur);
   txtSerie.value = serie.nom;
   txtNumero.value = album.numero;
   txtTitre.value = album.titre;
   txtAuteur.value = auteur.nom;
   txtPrix.value = album.prix;

   var nomFic = serie.nom + "-" + album.numero + "-" + album.titre;

   // Utilisation d'une expression régulière pour supprimer
   // les caractères non autorisés dans les noms de fichiers : '!?.":$
   nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, "");
   console.log(album)
  
   
 afficheAlbums(
   $("#albumMini"),
   $("#album"),
   SRC_ALBUM_MINI + nomFic + ".jpg",
   SRC_ALBUM + nomFic + ".jpg"
 );
 }
}*/ /*

/**
 * Affichage des images, les effets sont chainés et traités
 * en file d'attente par jQuery d'où les "stop()) et "clearQueue()"
 * pour éviter l'accumulation d'effets si défilement rapide des albums.
 *
 * @param {object jQuery} $albumMini
 * @param {object jQuery} $album
 * @param {string} nomFic
 * @param {string} nomFicBig
function afficheAlbums($albumMini, $album, nomFicMini, nomFic) {
  $album
    .stop(true, true)
    .clearQueue()
    .fadeOut(100, function () {
      $album.attr("src", nomFic);
      $albumMini
        .stop(true, true)
        .clearQueue()
        .fadeOut(150, function () {
          $albumMini.attr("src", nomFicMini);
          $albumMini.slideDown(200, function () {
            $album.slideDown(200);
          });
        });
    });
}
 */
/**
 * Affichage de l'image par défaut si le chargement de l'image de l'album
 * ne s'est pas bien passé
 *
 * @param {object HTML} element
 *//*
function prbImg(element) {
 // console.log(element);
 if (element.id === "albumMini") element.src = ALBUM_DEFAULT_MINI;
 else element.src = ALBUM_DEFAULT;
}
*/
