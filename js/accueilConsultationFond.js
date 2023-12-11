  const SRC_IMG = "images/"; // emplacement des images de l'appli
  const ALBUM_DEFAULT_MINI = SRC_IMG + "noComicsMini.jpeg";
  const ALBUM_DEFAULT = SRC_IMG + "noComics.jpeg";
  const SRC_ALBUM_MINI = "albumsMini/"; // emplacement des images des albums en petit
  const SRC_ALBUM = "albums/"; // emplacement des images des albums en grand
  const DIVTABLEBODY = document.getElementById("tabListLivresBody");
  const currentAlbumHover = document.getElementById("currentAlbumHover");
  var count = 0,
      table;

  /*
  while (count < 13) {
    albums.forEach((album, key) => {
      try {
        getAlbum(key);
        count++;
      } catch (error) {
        console.error(error);
      }
    });
  }*/
document.addEventListener("DOMContentLoaded", function () {
  table = $("#homePageTabBooks").DataTable({
    columnDefs: [
      { "orderable": false, targets: [0] }, // Disable sorting for the first column (index 0)
      { orderable: true, targets: [1, 2, 3] }, // Enable sorting for columns 1, 2, and 3
    ],
    responsive: true
  });
  afficheAlbums();
});


function afficheAlbums() {
  for (const [key, value] of albums) {
    //trouver le nom de l'auteur et de la serie a partir de leur id respectif
    var serieName = series.get(value.idSerie).nom;
    var auteurName = auteurs.get(value.idAuteur).nom;

    console.log(serieName, auteurName);
    //generation du lien de la petite et grande image:
    nomFic = serieName + "-" + value.numero + "-" + value.titre;

    // Utilisation d'une expression régulière pour supprimer
    // les caractères non autorisés dans les noms de fichiers : '!?.":$
    nomFic = nomFic.replace(/'|!|\?|\.|"|:|\$/g, "");

    //transfere l'emplacement des images a chaque album
    value.miniImg = SRC_ALBUM_MINI + nomFic + ".jpg";
    value.bigImg = SRC_ALBUM + nomFic + ".jpg";
    //------------------------------------------
    addNewRow(key,value.miniImg, value.titre, serieName, auteurName);
    console.log(`Album ID: ${key}`);
    console.log(`Titre: ${value.titre}`);
    console.log(`Numero: ${value.numero}`);
    console.log(`ID Serie: ${value.idSerie} , Nom de la serie: ${serieName}`);
    console.log(`ID Auteur: ${value.idAuteur} , Nom: ${auteurName}`);
    console.log(`Prix: ${value.prix}`);
    console.log(value.miniImg, value.bigImg);
    console.log("------------------------");
  }
}
/**
 * Methode Ajoute une nouvelle ligne au tableau avec un examplaire
 * @param {*} key 
 * @param {*} miniImg 
 * @param {*} titre 
 * @param {*} serieName 
 * @param {*} auteurName 
 */
function addNewRow(id,miniImg, titre, serieName, auteurName) {
var rowNode = table.row
  .add([
    `<img src="${miniImg}" alt="Image de ${titre}" id="${id}" class="table-img" onclick="showMiniImg(${id})">`,
    `<p class="table-text">${titre}</p>`,
    `<p class="table-text">${auteurName}</p>`,
    `<p class="table-text">${serieName}</p>`,
  ])
  .draw(false);
  $(rowNode.node()).on("click", function (id) {
    // Your onclick logic here
    console.log("Row clicked!", id);
    // You can add more actions here when the row is clicked
  });
//$(rowNode).css("color", "red").animate({ color: "black" });

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
*/
  /**
   * Récupération de l'album par son id et appel de
   * la fonction d'affichage
   *
   * @param {number} num
   */
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
      );*/
    }
  }

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
   */
  function prbImg(element) {
    // console.log(element);
    if (element.id === "albumMini") element.src = ALBUM_DEFAULT_MINI;
    else element.src = ALBUM_DEFAULT;
  }
