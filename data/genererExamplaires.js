// Fonction pour générer des emplacements de livres
function genererEmplacements(nbEmplacements) {
  let emplacements = [];
  const etages = ["Etage 1", "Etage 2", "Etage 3"]; // Exemple d'étages
  const rayons = ["Rayon A", "Rayon B", "Rayon C"]; // Exemple de rayons

  for (let i = 0; i < nbEmplacements; i++) {
    let etage = etages[Math.floor(Math.random() * etages.length)]; // Sélection aléatoire d'un étage
    let rayon = rayons[Math.floor(Math.random() * rayons.length)]; // Sélection aléatoire d'un rayon
    let numero = i + 1; // Numéro de l'emplacement

    let emplacement = {
      etage: etage,
      rayon: rayon,
      numero: numero,
    };

    emplacements.push(emplacement);
  }

  return emplacements;
}
let currentDate = new Date();

// Displaying the current date
console.log("Current date:", currentDate);
// Générer 20 emplacements de livres
let emplacementsLivres = genererEmplacements(20);

// Afficher les emplacements générés
console.log("Emplacements de livres générés :", emplacementsLivres);

const textRegex = /[\p{L}\p{Lu}\p{N}\p{P}\s]+/gu;

const isTitreValid = textRegex.test("Zep ");
console.log(isTitreValid); // This should output true