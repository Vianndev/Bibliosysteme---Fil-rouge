const ajouterLivreForm = document.getElementById("ajouterLivreForm");
const isbnInputLabel = document.getElementById("isbnInputLabel");
const isbnInput = document.getElementById("isbnInput");
const isbnInputBtn = document.getElementById("isbnInputBtn");
const titreInput = document.getElementById("titreInput");
const auteurInput = document.getElementById("auteurInput");
const serieInput = document.getElementById("serieInput");
const etatSelect = document.getElementById("etatSelect");
const etageSelect = document.getElementById("etageSelect");
const rayonSelect = document.getElementById("rayonSelect");
const numeroInput = document.getElementById("numeroInput");
const commentaireInput = document.getElementById("commentaireInput");
const imgFileInput = document.getElementById("imgFileInput");
const showImgInput = document.getElementById("showImgInput");
const codeExemplaireInput = document.getElementById("codeExemplaireInput");
const ajouterLivreSubmit = document.getElementById("ajouterLivreSubmit");

let apiData, isImageFromApi, currentImg,
 isImagePreview = true,
  lastSuggestedIsbn = [];

console.log("addexamplaire")

titreInput.addEventListener("input", titreInputSearch);
auteurInput.addEventListener("input", auteurInputSearch);
serieInput.addEventListener("input", serieInputSearch);
imgFileInput.addEventListener("change", handleImgChange);
ajouterLivreForm.addEventListener("submit", handleAjouterLivreSubmit);
isbnInputBtn.addEventListener("click", handleIsbnInput);
isbnInput.addEventListener("input", activateInput);

// ------------------ Gestion Form --------------------
/**
 * Fonction principale de l'ajout de livre du formulaire.
 * Appele les verifications
 * @param {*} event 
 */
function handleAjouterLivreSubmit(event) {
  event.preventDefault();
  console.log(event);
  var formData = new FormData(ajouterLivreForm);
  console.log(Object.fromEntries(formData));
  console.log(numeroInput.value)

  // S'execute si tout eles champs sont corrects
  if (validateInputs()) {
    var currentTitre = titreInput.value;
    var currentAuteur = auteurInput.value;
    var currentSerie = serieInput.value;

    var albumKey = isAlbumExist(currentTitre);
    if (albumKey !== false) {
      //Ajoute l'examplaire sans creer de nouveau album lorsqu'il existe deja
      addExemplaireFromInput(albumKey);
    } else {
      var serieKey = isSeriesExist(currentSerie);
      var auteurKey = isAuteursExist(currentAuteur);
      if (serieKey === false) serieKey = addSeriesFromInput(serieKey);
      if (auteurKey === false) auteurKey = addAuteursFromInput();
      console.log(serieKey, auteurKey);

      var serieName = series.get(serieKey.toString()).nom;
      var auteurName = auteurs.get(auteurKey.toString()).nom;

      albumKey = addAlbumFromInput(serieKey, auteurKey);
      var currentAlbum = albums.get(albumKey.toString());
      exemplaireKey = addExemplaireFromInput(albumKey);
      // Ajout de l'album à la table et à la liste de cartes
      addNewRow(
        albumKey,
        currentAlbum.miniImg,
        currentAlbum.titre,
        serieName,
        auteurName
      );
      addNewCard(
        albumKey,
        currentAlbum.bigImg,
        currentAlbum.titre,
        serieName,
        auteurName,
        currentAlbum.nombreExemplairesDispo,
        currentAlbum.emplacement
      );
    }
    afficheCard();
    activateInput();
    toastr.success("Livre bien ajouté !");
    $("#ajouterLivrePopUp").modal("hide");
     resetForm();
    ajouterLivreForm.reset();
  }
}
/**
 * Remet à zero les données du formulaire
 */
function resetForm() {
  activateInput();
  showImgInput.src = "./images/apercu.png";
  isImagePreview = true;
  isImageFromApi = false;
}
// ------------------ Gestion Isbn --------------------
/**
 * Gere la verification de l'isbn et appelle les fonctions pour trouver les données concordodantes
 * @param {*} event 
 */
async function handleIsbnInput(event) {
  let input = isbnInput.value;
  let isValidIsbn = isIsbnValid(isbnInput.value);
  let isbnInDB = isIsbnInDataBase(isbnInput.value);
  console.log("handleIsbnInput");

  if (isValidIsbn && isbnInDB === false) {
    try {
      apiData = await getApiBookData(input);
      if (apiData.numFound >= 1) {
        changeValuesByBookData();
      }else if(apiData.numFound === 0)toastr.warning("Le livre est introuvable sur internet.");
    } catch (error) {
      console.error("Erreur:", error.message);
    }
  } else if (typeof isbnInDB === "string") {
    console.log(`typeof isbnInDB === "string"${typeof isbnInDB} ${isbnInDB}`);
    changeValuesByAlbums(isbnInDB);
  }
}
/**
 * Renvoie false si l'isbn n'est pas deja dans la database 
 * et la key de l'album si deja dans dedans
 * @param {*} isbn 
 * @returns {Bool|Number}
 */
function isIsbnInDataBase(inputIsbn) {
  for (const [key, value] of albums) {
    console.log(value.isbn, inputIsbn);
    if (value.isbn && value.isbn.includes(inputIsbn)) return key;
  } console.log("isbn not found in data base");
  return false
}

// ------------------ Gestion Autcomplete  -------------------
/**
 * Gere l'auto completion des series
 */
function serieInputSearch() {
  var seriesName = [];
  for (const value of series.values()) {
    seriesName.push(value.nom);
  }
  $("#serieInput").autocomplete({
    source: seriesName,
  });
}
/**
 * Gere l'auto completion des titres
 */
async function titreInputSearch() {
  isbnInputLabel.innerText = "ISBN :";
  if (
    typeof lastSuggestedIsbn[1] !== "undefined" &&
    lastSuggestedIsbn[1].includes(titreInput.value) &&
    isbnInput.length != 10 &&
    isbnInput.length != 13
  ) { isbnInput.value = ""; }
  var titreNames = [];
  for (const value of albums.values()) {
    titreNames.push(value.titre);
  }
  activateInput();
  $("#titreInput").autocomplete({
    source: titreNames,
    select: async function (event, ui) {
      currentTitre = ui.item.value;
      console.log("Selected value:", ui.item.value);
      for (const [key, value] of albums) {
        if (currentTitre === value.titre) {
          console.log(value)
          // Récupération du nom de l'auteur et de la série grace ID
          var serieName = series.get(value.idSerie).nom;
          var auteurName = auteurs.get(value.idAuteur).nom;
          // Anonce que l'image vient de la base de données
          isImageFromApi = false;
          // Insere les noms d'autheurs , de serie et l'image et l'emplacement
          showImgInput.src = value.bigImg;
          auteurInput.value = auteurName;
          serieInput.value = serieName;
          if (value.emplacement != null) {
            etageSelect.value = value.etage,
              rayonSelect.value = value.rayon,
              numeroInput.value = value.numeroInput;
          };
          // Desactive la rentree de donnée
          imgFileInput.disabled = true;
          auteurInput.disabled = true;
          serieInput.disabled = true;
          console.log(isbnInput.value.length, value.isbn);
          // Si l'isbn est deja renseigné dans la base de donnée et pas encore ecrit dans le formulaire : l'afficher
          if (isbnInput.value.length === 0 && value.isbn != undefined) isbnInput.value = value.isbn;
          // Demande l'isbn à l'api si il n'est pas trouvé  et attribut sa valeur à l'input lorsqu'il est trouvé
          else if (isbnInput.value.length === 0) {
            console.log("appele funct isbnapi")
            var rechercheString = currentTitre + " " + auteurName;
            const isbn = await getIsbnApi(rechercheString);
            if (isbn != false) {
              isbnInput.value = isbn[0];
              lastSuggestedIsbn.push(isbn[0], value.titre); //Modifie la var globale qui sert à enlever l'ancien isbn lorsqu'on change de livre
              isbnInputLabel.innerText = "Suggestion d'ISBN :";
            } else isbnInput.placeholder = "Aucun ISBN trouvé sur Internet";
          }
        }
      }
    },
  });
}
/**
 * Gere l'auto completion des auteurs
 */
function auteurInputSearch() {
  var auteurName = [];
  // Met chaque nom d'auteur dans un Array
  for (const value of albums.values()) {
    var currentAuteur = auteurs.get(value.idAuteur).nom;
    if (!auteurName.includes(currentAuteur)) auteurName.push(currentAuteur);
  }
  $("#auteurInput").autocomplete({
    source: auteurName,
  });
}
// ------------------ Gestion Validation --------------------
/**
 * Reactive les rentrées de données sur les champs du formulaire
 */
function activateInput() {
  // Reactive la rentree de donnée
  isbnInput.disabled = false;
  titreInput.disabled = false;
  imgFileInput.disabled = false;
  auteurInput.disabled = false;
  serieInput.disabled = false;
}
/**
 * Verifie si le titre  existe deja 
 * @param {String} titre
 * @returns {Bool} false = existe deja
 */
function checkDoublonTitre(titre) {
   console.log("Size of titre map:", titre.size);
  for (const [key, value] of albums) {
     const value = titre.get(key);
    console.log(titre.toLowerCase(),value.titre.toLowerCase());
    if (titre.toLowerCase() == value.titre.toLowerCase()) {
      console.log("doublon de titre  trouvé");
      return false; // Il y a un doublon
    }
  }
  console.log("aucun doublon titre trouvé");
  return true
}
/**
 * Verifie si le code examplaire existe deja 
 * @param {String} codeExamplaire
 * @returns {Bool} false = existe deja
 */
function checkDoublonCodeExemplaire(code) {
  console.log("Size of exemplaires map:", exemplaires.size);

  for (const [key, value] of exemplaires) {
    let codeExemplaire = undefined;
    console.log(value)
    if (value.codeExemplaires !== undefined) {
      codeExemplaire = value.codeExemplaires.toLowerCase();
    }

    console.log(code.toLowerCase(), codeExemplaire);

    if (code.toLowerCase() === codeExemplaire) {
      console.log("Doublon codexamplaire trouvé");
      return false; // Il y a un doublon
    }
  }

  console.log("Aucun doublon codexamplaire trouvé");
  return true;
}
/**
 * Verifie si l'album existe et renvoie la key si oui
 * @returns {Bool|Number} False si non trouvé, autrement un number
 */
function isAlbumExist(currentTitre) {
  var currentKey = false;
  for (const [key, value] of albums) {
    if (value.titre.toLowerCase().includes(currentTitre.toLowerCase())) {
      currentKey = key;
      console.log(`Album existant: ${value.titre},${currentKey}`);
    }
  }
  return currentKey;
}
/**
 * Verifie si la serie existe et renvoie la key si oui
 * @returns {Bool|Number} False si non trouvé, autrement un number
 */
function isSeriesExist(currentSerie) {
  var currentKey = false;
  for (const [key, value] of series) {
    if (value.nom.toLowerCase().includes(currentSerie.toLowerCase())) {
      currentKey = key;
      console.log(`Serie existante: ${value.nom},${currentKey}`);
    }
  }
  return currentKey;
}
/**
 * Verifie si l'auteur existe et renvoie la key si oui
 * @returns {Bool|Number} False si non trouvé, autrement un number
 */
function isAuteursExist(currentAuteur) {
  var currentKey = false;
  for (const [key, value] of auteurs) {
    if (value.nom.toLowerCase().includes(currentAuteur.toLowerCase())) {
      currentKey = key;
      console.log(`Auteur existant: ${value.nom},${currentKey}`);
    }
  }
  return currentKey;
}
/**
 * Verifie la validation de tout les inputs
 * @returns 
 */
function validateInputs() {
  let nbrOfInvalidInput = 0;
  //const textRegex = /^[\p{L}\p{M}0-9.,'’\s]+$/gu;;
  // const textRegex = /^[\s\w\d\?><;,\{\}\[\]\-_\+=!@\#\$%^&\*\|\']*$/;
 // const textRegex = /[\p{L}\p{Lu}\p{N}\p{P}\s]+/gu;
  const textRegex = /[a-zA-Z\u00C0-\u00FF0-9.,'’éèàù\s!?]+$/i;
    const numberRegex = /^\d+$/;
  const numberAndTextRegex = /^[a-zA-Z0-9]+$/;

  const isValidIsbn = isIsbnValid(isbnInput.value);
  const isTitreValid = textRegex.test(titreInput.value.toString());
  textRegex.lastIndex = 0;
  const isAuteurValid = textRegex.test(auteurInput.value.toString());
  textRegex.lastIndex = 0;
  const isSerieValid = textRegex.test(serieInput.value.toString());
  textRegex.lastIndex = 0;
  const isCodeExemplaireValid = numberAndTextRegex.test(codeExemplaireInput.value.toString());
  const isCommentaireValid = numberAndTextRegex.test(commentaireInput.value.toString());
  const isNumberValid = numberRegex.test(numeroInput.value);
  const isCodeExemplaireDoublon = checkDoublonCodeExemplaire(codeExemplaireInput.value.toString());
  //const isTitreDoublon = checkDoublonTitre(titreInput.value.toString());
  if (!isCommentaireValid && commentaireInput.value.length >= 1) {
    commentaireInput.classList.add("is-invalid");
    console.log("Commentaire invalide");
    nbrOfInvalidInput++;
  } else {
    commentaireInput.classList.remove("is-invalid");
  }

  if (!isNumberValid) {
    numeroInput.classList.add("is-invalid");
    console.log("Numéro invalide");
    nbrOfInvalidInput++;
  } else {
    numeroInput.classList.remove("is-invalid");
  }

  if (!isValidIsbn) {
    isbnInput.classList.add("is-invalid");
    console.log("ISBN invalide");
    nbrOfInvalidInput++;
  } else {
    isbnInput.classList.remove("is-invalid");
  }

  if (!isTitreValid) {
    nbrOfInvalidInput++;
    titreInput.classList.add("is-invalid");
  } /* else if (!isTitreDoublon) {
    titreInput.classList.add("is-invalid");
    toastr.warning("Le code exemplaire existe déjà");
  } */else {
    titreInput.classList.remove("is-invalid");
  }

  if (!isAuteurValid) {
    nbrOfInvalidInput++;
    auteurInput.classList.add("is-invalid");
  } else {
    auteurInput.classList.remove("is-invalid");
  }

  if (!isCodeExemplaireValid) {
    nbrOfInvalidInput++;
    codeExemplaireInput.classList.add("is-invalid");
    console.log("Code exemplaire invalide");
  } else if (!isCodeExemplaireDoublon) {
    nbrOfInvalidInput++;
    codeExemplaireInput.classList.add("is-invalid");
    toastr.warning(
      "Le code exemplaire existe déjà"
    );

  } else {
    codeExemplaireInput.classList.remove("is-invalid");
  }

  if (!isSerieValid) {
    nbrOfInvalidInput++;
    serieInput.classList.add("is-invalid");
    console.log("Série invalide");
  } else {
    serieInput.classList.remove("is-invalid");
  }

  console.log(`nombre d'input invalide : ${nbrOfInvalidInput}`);
  if (nbrOfInvalidInput === 0) return true;
  else return false;
}

// ------------------ Gestion ISBN et api --------------------

/**
 * Verifie si l'isbn de l'input est valide
 * @param {*} params 
 * @returns {boolean}
 */
function isIsbnValid(input) {
  console.log(input);
  let regex10 = new RegExp(
    /^(?:ISBN(?:-10)?:?\ )?(?=[0-9X]{10}$|(?=(?:[0-9]+[-\ ]){3})[-\ 0-9X]{13}$)[0-9]{1,5}[-\ ]?[0-9]+[-\ ]?[0-9]+[-\ ]?[0-9X]$/
  );
  let regex13 = new RegExp(
    /^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/
  );
  if (regex13.test(input) == true || regex10.test(input === true)) {
    isbnInput.classList.remove("is-invalid");
    console.log("valide");
    return "true";
  } else {
    isbnInput.classList.add("is-invalid");
    console.log("invalie");
    return "false";
  }
}
/**
 * Change les valeurs des inputs (titre , auteurs ...), si l'isbn est deja renseigné
 * @param {*} params 
 */
function changeValuesByAlbums(albumKey) {
  var albumKey = albumKey.toString(),
    currentAlbum = albums.get(albumKey);
    if (typeof currentAlbum.idAuteur !== "string")currentAlbum.idAuteur = currentAlbum.idAuteur.toString();
    if (typeof currentAlbum.idSerie !== "string") currentAlbum.idSerie = currentAlbum.idSerie.toString();

      console.log(
        "current album",
        currentAlbum,
        `id auteur : ${currentAlbum.idAuteur}`
      );
  // Récupération du nom de l'auteur et de la série grace ID
  var serieName = series.get(currentAlbum.idSerie).nom;
   var auteurName = auteurs.get(currentAlbum.idAuteur).nom;
  //var auteurName = auteurs.get(currentAlbum.idAuteur).nom;
  // Anonce que l'image vient de la base de données
  isImageFromApi = false;
  // Insere les noms d'autheurs , de serie et l'image et l'emplacement
  titreInput.value = currentAlbum.titre;
  showImgInput.src = currentAlbum.bigImg;
  auteurInput.value = auteurName;
  serieInput.value = serieName;
  if (currentAlbum.emplacement != null) {
    (etageSelect.value = currentAlbum.etage),
      (rayonSelect.value = currentAlbum.rayon),
      (numeroInput.value = currentAlbum.numeroInput);
  }
  // Desactive la rentree de donnée
  titreInput.disabled = true;
  imgFileInput.disabled = true;
  auteurInput.disabled = true;
  serieInput.disabled = true;
}
/**
 * Change les valeurs des inputs (titre , auteurs ...), appelé apres l'api
 * @param {*} params 
 */
function changeValuesByBookData(params) {
  var bookData = apiData.docs[0],
    authorNames = bookData.author_name.toString(),
    titre = bookData.title,
    coverID = bookData.cover_i;
  if (coverID != undefined) {
    showImgInput.src = `http://covers.openlibrary.org/b/id/${coverID}-L.jpg`;
    // Annonce que l'image vient de l'api
    isImageFromApi = true;
    isImagePreview = false;
  } else {
    isImageFromApi = false;
    isImagePreview = true;
    showImgInput.src = "./images/apercu.png";
  }
  // Desactive la rentree de donnée
  titreInput.disabled = true;
  auteurInput.disabled = true;

  titreInput.value = titre;
  auteurInput.value = authorNames;
  console.log("changeValuesByBookData", bookData, authorNames);
}

/**
 * Demande à l'api des information sur le livre via l'isbn (ou un nom)
 * et
 * @returns {Json} dans la var globale apiData
 */
async function getApiBookData(input) {
  const url = `https://openlibrary.org/search.json?q=${input}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erreur avec l'api");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error:", error.message);
  }
}
/**
 * Demande à l'api l'isbn d'un livre 
 * @param {*} input (titre + auteur)
 * @returns {Bool|Number} retourne l'isbn ou false quand non trouvé
 */
async function getIsbnApi(input) {
  const url = `https://openlibrary.org/search.json?q=${input}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Erreur avec l'api");
    }
    const data = await response.json();
    if (data.numFound >= 1) {
      var isbnArray = data.docs[0].isbn;
      console.log(isbnArray);
      return isbnArray;
    } else {
      console.log("ISBN not found", data);
      return false;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ------------------ Gestion Image --------------------
/**
 * Change l'apercu de l'image , appelé lorsque l'api à trouver le livre
 * @param {*} params 
 */
function handleImgChange() {
  const image = imgFileInput.files[0];
  allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(image.type)) {
    toastr.warning(
      "Le fichier doit etre une image (jpg,jpeg,png) de moins de 2MB!"
    );
    return;
  }
  if (image.size > 2097152 && image != undefined) {
    toastr.warning("L'image doit faire moins de 2MB !");
    this.value = "";
    return;
  }
  if (image) {
    // Annonce que l'image vient de la base de données
    isImageFromApi = false;
    isImagePreview =false;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(image);
    fileReader.addEventListener("load", function () {
      showImgInput.src = this.result;
      currentImg = this.result;
      console.log("handleImgChange src image input", this.result);
      return currentImg;
    });
  }
}
// ------------------ Ajout serie/auteur --------------------
/**
 * Creer une serie lorsque celle entrée n'existe pas
 * @param {*} serieKey 
 * @returns 
 */
function addSeriesFromInput(serieKey) {
  var maxKey = 0;
for (const [key, value] of series) {
if (parseInt(key) > maxKey) maxKey = parseInt(key);   
 }
  console.log(`serie maxKey:${maxKey}`);
  var id = maxKey + 1;
  var nouvelleSerie = {
    nom: serieInput.value.toString(),
  };
  series.set(id.toString(), nouvelleSerie);
  console.log(series.get(id.toString()), "serie ajouté");
  return id;
}
/**
 * Creer un auteur lorsque celui entrée n'existe pas
 * @param {*} serieKey 
 * @returns 
 */
function addAuteursFromInput(auteurKey) {
    var maxKey = 0;
    for (const [key, value] of auteurs) {
      if (parseInt(key) > maxKey) maxKey = parseInt(key);
    }
      console.log(`auteurs maxKey:${maxKey}`);

    var id = maxKey + 1;
  var nouveauAuteur = {
    nom: auteurInput.value.toString(),
  };
  console.log(
    "nouveau auteur avant mis  dans le tab :",
    nouveauAuteur,
    auteurInput.value
  );
  auteurs.set(id.toString(), nouveauAuteur);
  console.log(auteurs.get(id.toString()),"auteur ajouté");
  return id;
}
// ------------------ Ajout examplaire/album --------------------
/**
 * Ajoute un exemplaire depuis les données rentrée
 * @param {*} albumKey 
 */
function addExemplaireFromInput(albumKey) {
  var maxKey = 0;
  for (const [key, value] of exemplaires) {
    if (parseInt(key) > maxKey) maxKey = parseInt(key);
  }
  var id = maxKey + 1;
  console.log(`exemplaires maxKey:${maxKey}`);
  var nouveauExemplaire = {
    codeExemplaires: codeExemplaireInput.value,
    keyAlbum: albumKey,
    isbn: isbnInput.value,
    emplacement: {
      etage: etageSelect.value,
      rayon: rayonSelect.value,
      numero: numeroInput.value,
    },
    isDispo: true,
    dateEmprunt: null,
    dateARendre: null,
    emprunteur: null,
    commentaires: commentaireInput.value,
    etat: etatSelect.value,
  };
  exemplaires.set(id.toString(), nouveauExemplaire);

  currentAlbum = albums.get(albumKey.toString());
  if (Array.isArray(currentAlbum.exemplairesKeyTab))
    currentAlbum.exemplairesKeyTab.push(id);
  currentAlbum.nombreExemplairesDispo++;
  console.log("exemplaire ajouter :", id.toString(), exemplaires.get(id.toString())
  );
}
/**
 * Ajoute un album depuis les données rentrée
 * @param {*} albumKey 
 */
function addAlbumFromInput(serieKey, auteurKey) {
 var maxKey = 0;
 for (const [key, value] of albums) {
   if (parseInt(key) > maxKey) maxKey = parseInt(key);
 }
     console.log(`albums maxKey:${maxKey}`);
 var id = maxKey + 1;
  var currentBigImg = "./images/apercu.png",
    currentMiniImg = "./images/apercu.png";
  if (isImageFromApi) {
    currentBigImg = `https://covers.openlibrary.org/b/isbn/${isbnInput.value}-L.jpg`;
    currentMiniImg = `https://covers.openlibrary.org/b/isbn/${isbnInput.value}-M.jpg`;
  } else if (isImageFromApi === false && !isImagePreview) {
    currentBigImg = handleImgChange();
    currentMiniImg = currentBigImg;
    console.log(currentBigImg);
  }
  var nouveauAlbum = {
    titre: titreInput.value,
    numero: numeroInput.value,
    isbn: isbnInput.value,
    idSerie: serieKey,
    idAuteur: auteurKey,
    prix: null,
    miniImg: currentMiniImg,
    bigImg: currentBigImg,
    exemplairesKeyTab: [],
    nombreExemplairesDispo: null,
    emplacement: {
      etage: etageSelect.value,
      rayon: rayonSelect.value,
      numero: numeroInput.value,
    },
  };
  albums.set(id.toString(), nouveauAlbum);
  //addAlbumToLocal(id.toString(), nouveauAlbum);
  console.log(albums.get(id.toString()));
  return id
}

