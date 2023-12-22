var albums = new Map();
albums.set("1", {
  titre: "Croc vert",
  numero: "23",
  idSerie: "6",
  idAuteur: "13",
  prix: "24.50",
});
albums.set("2", {
  titre: "Machine qui rêve",
  numero: "46",
  idSerie: "2",
  idAuteur: "14",
  prix: "23.50",
});
albums.set("3", {
  titre: "La guerre des gloutons (II)",
  numero: "13",
  idSerie: "16",
  idAuteur: "11",
  prix: "14.50",
});
albums.set("4", {
  titre: "Le jour du Mayflower",
  numero: "20",
  idSerie: "10",
  idAuteur: "16",
  prix: "12",
});
albums.set("6", {
  titre: "La griffe de Rome",
  numero: "03",
  idSerie: "17",
  idAuteur: "9",
  prix: "14.50",
});
albums.set("7", {
  titre: "Le Waltras",
  numero: "07",
  idSerie: "13",
  idAuteur: "8",
  prix: "15.20",
});
albums.set("8", {
  titre: "Le sang des comètes",
  numero: "08",
  idSerie: "18",
  idAuteur: "10",
  prix: "14.50",
});
albums.set("9", {
  titre: "La bête fabuleuse",
  numero: "08",
  idSerie: "9",
  idAuteur: "10",
  prix: "14.50",
});
albums.set("10", {
  titre: "(Avant la quête) L'ami Javin",
  numero: "A01",
  idSerie: "22",
  idAuteur: "18",
  prix: "14.10",
});
albums.set("11", {
  titre: "Le sens de la vie",
  numero: "12",
  idSerie: "23",
  idAuteur: "19",
  prix: "10.50",
});
albums.set("13", {
  titre: "Mes meilleurs copains",
  numero: "11",
  idSerie: "23",
  idAuteur: "19",
  prix: "11",
});
albums.set("15", {
  titre: "Nadia se marie",
  numero: "10",
  idSerie: "23",
  idAuteur: "19",
  prix: "12.50",
});
albums.set("18", {
  titre: "La loi du préau",
  numero: "09",
  idSerie: "23",
  idAuteur: "19",
  prix: "10.50",
});
albums.set("19", {
  titre: "Gare aux garous",
  numero: "03",
  idSerie: "24",
  idAuteur: "20",
  prix: "11.40",
});
albums.set("20", {
  titre: "Le Walou Walou ancestral",
  numero: "02",
  idSerie: "24",
  idAuteur: "20",
  prix: "13.90",
});
albums.set("21", {
  titre: "Les runes de Gartagueul",
  numero: "01",
  idSerie: "24",
  idAuteur: "20",
  prix: "14.20",
});
albums.set("22", {
  titre: "Le temple de Boavista",
  numero: "08",
  idSerie: "6",
  idAuteur: "21",
  prix: "10.95",
});
albums.set("23", {
  titre: "L'or de Boavista",
  numero: "07",
  idSerie: "6",
  idAuteur: "21",
  prix: "12",
});
albums.set("24", {
  titre: "Fordlandia",
  numero: "06",
  idSerie: "6",
  idAuteur: "21",
  prix: "9.98",
});
albums.set("25", {
  titre: "Baby Prinz",
  numero: "05",
  idSerie: "6",
  idAuteur: "21",
  prix: "11",
});
albums.set("26", {
  titre: "Le pollen du monte Urticando",
  numero: "04",
  idSerie: "6",
  idAuteur: "21",
  prix: "10.25",
});
albums.set("27", {
  titre: "Mars le noir",
  numero: "03",
  idSerie: "6",
  idAuteur: "21",
  prix: "12.20",
});
albums.set("28", {
  titre: "Le bébé du bout du monde",
  numero: "02",
  idSerie: "6",
  idAuteur: "22",
  prix: "11.33",
});
albums.set("29", {
  titre: "La queue du Marsupilami",
  numero: "01",
  idSerie: "6",
  idAuteur: "22",
  prix: "10.47",
});
albums.set("30", {
  titre: "Capturez un Marsupilami !",
  numero: "00",
  idSerie: "6",
  idAuteur: "23",
  prix: "10.54",
});
albums.set("31", {
  titre: "Le rayon noir",
  numero: "44",
  idSerie: "2",
  idAuteur: "14",
  prix: "9.98",
});
albums.set("32", {
  titre: "Luna fatale",
  numero: "45",
  idSerie: "2",
  idAuteur: "14",
  prix: "10.00",
});
albums.set("33", {
  titre: "A Moscou",
  numero: "42",
  idSerie: "2",
  idAuteur: "14",
  prix: "10.95",
});
albums.set("34", {
  titre: "Vito la déveine",
  numero: "43",
  idSerie: "2",
  idAuteur: "14",
  prix: "10.42",
});
albums.set("35", {
  titre: "La vallée des bannis",
  numero: "41",
  idSerie: "2",
  idAuteur: "14",
  prix: "11.50",
});
albums.set("36", {
  titre: "La frousse aux trousses",
  numero: "40",
  idSerie: "2",
  idAuteur: "14",
  prix: "12.50",
});
albums.set("37", {
  titre: "A New York",
  numero: "39",
  idSerie: "2",
  idAuteur: "14",
  prix: "10.50",
});
albums.set("38", {
  titre: "Le réveil du Z",
  numero: "37",
  idSerie: "2",
  idAuteur: "14",
  prix: "10.45",
});
albums.set("39", {
  titre: "L'horloger de la comète",
  numero: "36",
  idSerie: "2",
  idAuteur: "14",
  prix: "10.26",
});
albums.set("40", {
  titre: "Mise à jour",
  numero: "03",
  idSerie: "25",
  idAuteur: "24",
  prix: "10",
});

/*
// Met la map Album en JSON
var albumsJSON = JSON.stringify([...albumsMAP]);

// Met le Json dans le localstorage
localStorage.setItem("albumsData", albumsJSON);

/**
 * Ajouter un album à la map 'albums' et met à jour le stockage local
 * @param {*} id
 * @param {*} albumContent
 */
/*
function addAlbumToLocal(id, albumContent) {
  console.log(`addAlbumToLocal ${id} , ${albumContent}`);
  // Supposons que 'albums' soit votre carte existante stockée  en local
  var currentAlbumsJSON = localStorage.getItem("albumsData");
  var albumsMap = new Map(JSON.parse(currentAlbumsJSON));
  console.log(id, typeof id);
  if (typeof id != "string" && id) id = id.toString();
  // Ajouter le nouvel album à la carte 'albumsMap'
  albumsMap.set(id, albumContent);

  //  Transforme la map Album UPDATED en JSON
  var albumsMisAJourJSON = JSON.stringify([...albums]);

  // Stocker le JSON UPDATED en local
  localStorage.setItem("albumsData", albumsMisAJourJSON);
}
*/
/*
function refreshAlbumLocal(mapOfAllAlbums) {
  var albumsMisAJourJSON = JSON.stringify([...mapOfAllAlbums]);
  localStorage.setItem("albumsData", albumsMisAJourJSON);
}
*/
/**
 * Retourne La map d'album depuis le localstorage
 * @returns Map
 */
/*
function getAlbumFromLocal() {
  var currentAlbumsJSON = localStorage.getItem("albumsData");
  if (currentAlbumsJSON) {
    return new Map(JSON.parse(currentAlbumsJSON));
  } else {
    return new Map(); // Retourne une nouvelle carte vide si aucune donnée n'est trouvée
  }
}
var albums = getAlbumFromLocal();
*/