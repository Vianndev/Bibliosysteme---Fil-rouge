const SRC_IMG = "images/"; // emplacement des images de l'appli
const ALBUM_DEFAULT_MINI = SRC_IMG + "noComicsMini.jpeg";
const ALBUM_DEFAULT = SRC_IMG + "noComics.jpeg";
const SRC_ALBUM_MINI = "albumsMini/"; // emplacement des images des albums en petit
const SRC_ALBUM = "albums/"; // emplacement des images des albums en grand
const DIVTABLEBODY = document.getElementById("tabListLivresBody");
const currentAlbumHover = document.getElementById("currentAlbumHover");
const albumPopUp = document.getElementById("albumPopUp");
const responsiveList = document.getElementById("responsiveList");
const containerHomepageBooks = document.getElementById("containerHomepageBooks");
var count = 0,
  table,
  isWidthSmall = false,
  resultsID = [],
  resultsDiv = [];
window.addEventListener("resize", manageWidth);

document.addEventListener("DOMContentLoaded", init)

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
  if (getIsWidthSmall() === true)afficheCard();
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
    for (let i = 0; i < resultsArray.length; i++) {//recupere l'id de chaque Ligne qui peut etre affichée apres ou sans recherche
      var currentImgStr = resultsArray[i][0];
      var idMatch = currentImgStr.match(/id="(\d+)"/);
      var imageID = idMatch[1];
      resultsID.push(imageID);
    }
    return [resultsID,resultsDiv];
  }else return [resultsID, resultsDiv]

}
// --------------------------Gestion de la responsivité-----------------------------
/**
 * Vérifie la taille de l'écran et ajuste l'affichage en conséquence.
 */
function getIsWidthSmall() {
  if (window.matchMedia("(min-width: 576px)").matches) return false;// Écran large
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
  var pagination = document.querySelector(".pagination");
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
  }/*
if (resultsDiv.length === 0) {
  h2 = `<h2 id="noSearchFound" class="text-center mt-4">Aucun album correspondant trouvé</h2>`;
  responsiveList.appendChild(h2);
}*/
  // Affichage des dix premières cartes
  resultsDiv.slice(0, 10).forEach(function (element) {
    element.style.display = "block";
  });

  // Calcul du nombre total de pages
  var totalPages = Math.ceil(resultsDiv.length / 10);

  // Génération de la pagination
  for (var i = 1; i <= totalPages; i++) {
    if (totalPages <= 1) {
      //Suprimme la pagination si il n'y a qu'une seule page ou pas de resultats
      $(".pagination li").remove();
      break;
    }
    $(".pagination").append(
      '<li class="page-item"><a class="page-link" href="#">' + i + "</a></li>"
    );
  }

  // Gestion de l'événement de clic sur la pagination
  $(".pagination").on("click", "li", function (e) {
    e.preventDefault();

    // Récupération du numéro de page cliqué
    var pageNum = $(this).text();

    // Calcul des index de début et de fin pour les éléments à afficher
    var start = (pageNum - 1) * 10;
    var end = start + 10;
    $(".cardAlbum").hide();

    // Affichage des éléments pour la page sélectionnée
    resultsDiv.slice(start, end).forEach(function (element) {
      element.style.display = "block";
    });

    // Mise à jour de la classe active pour la pagination
    $(".pagination li").removeClass("active");
    $(this).addClass("active");
  });
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

    // Génération du nom de fichier pour les images
    let nomFic = serieName + "-" + value.numero + "-" + value.titre;
    nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, ""); // Suppression des caractères non autorisés

    // Donne les src des images aux albums
    value.miniImg = SRC_ALBUM_MINI + nomFic + ".jpg";
    value.bigImg = SRC_ALBUM + nomFic + ".jpg";

    // Ajout de l'album à la table et à la liste de cartes
    addNewRow(key, value.miniImg, value.titre, serieName, auteurName);
    addNewCard(key, value.bigImg, value.titre, serieName, auteurName);

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
/**
 * Creer les cartes respectives de chaque album
 * @param {Number} id 
 * @param {String} bigImg 
 * @param {String} titre 
 * @param {String} serieName 
 * @param {String} auteurName 
 */
function addNewCard(id, bigImg, titre, serieName, auteurName) {
  var currentCard = document.createElement("div");
  currentCard.classList.add("card", "cardAlbum", "text-center", "col-5", "mt-3", "p-0"); currentCard.setAttribute("id", `card${id}`);
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

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardSerie);
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
      `<img src="${miniImg}" alt="Image de ${titre}" id="${id}" class="table-img imgColumn" onclick="showMiniImg(${id})">`,
      `<p class="table-text">${titre}</p>`,
      `<p class="table-text">${auteurName}</p>`,
      `<p class="table-text">${serieName}</p>`,
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
}
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
    /*
  afficheAlbums(
    $("#albumMini"),
    $("#album"),
    SRC_ALBUM_MINI + nomFic + ".jpg",
    SRC_ALBUM + nomFic + ".jpg"
  );
  }
}*/

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