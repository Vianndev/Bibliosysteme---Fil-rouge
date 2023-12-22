
    ////////////////////////////////////////////////////////// DECLARATION VARIABLES ///////////////////////////////////////////////////

    var divSuppAdherent =document.getElementById('divSuppAdherent');
    var divMetAJourAdherent =document.getElementById('divMetAJourAdherent');
    var divForm =document.getElementById('divFormAjouterAdherent');
    var infoAdherentModif =document.getElementById('infoAdherentModif');
    var infoAdherentSupp =document.getElementById('infoAdherentSupp');
    var mettreAjour =document.getElementById('mettreAjour');
    var ajouter =document.getElementById('ajouter');
    var supprimer =document.getElementById('supprimer');
    var fondOpaque =document.getElementById('fondOpaque');
    var alerteAmende = document.getElementById('alerteAmende');
    var txtCotisation = document.getElementById('txtCotisation');
    var btnReloadDiv = document.getElementById('reloadDiv');
    var btnReloadDivModif = document.getElementById('reloadDivModif');
    var btnReloadDivSupp = document.getElementById('reloadDivSupp');
    var inputMail = document.getElementById('mail');
    var divCodeAdherent = document.getElementById("divCodeAdherent");
    var inputNom = document.getElementById('nom');
    var inputPrenom = document.getElementById('prenom');
    var inputMail = document.getElementById('mail');
    var inputAdresse = document.getElementById('adresse');
    var inputNom1= document.getElementById('nom1');
    var inputPrenom1 = document.getElementById('prenom1');
    var inputMail1 = document.getElementById('mail1');
    var inputAdresse1 = document.getElementById('adresse1');
    var inputAmende1 = document.getElementById('inputAmende1');
    var inputBd1 = document.getElementById('inputBd1');
    var inputCot1 = document.getElementById('inputCot1');
    var inputId1 = document.getElementById('inputId1');
    var exampleModal = document.getElementById('exampleModal');
    var btnModifier = document.getElementById('btnModifier');
    var myTable = document.getElementById('myTable');
    var navbar = document.getElementById('navbar');
    var fermeDiv = document.getElementById('fermeDiv');
    var divFormModifierAdherent =document.getElementById('divFormModifierAdherent');
    var btnChecked = document.getElementById('btn-check-outlined');
    var confirmAlerteAmende = document.getElementById('confirmAlerteAmende');
    var divAlerteAmendeTexte = document.getElementById('divAlerteAmendeTexte');
    var divErr = document.getElementById('divErr');
    var divErrModif = document.getElementById('divErrModif');
    var divSuccesModif= document.getElementById('divSuccesModif');
    var divSuccesSupp= document.getElementById('divSuccesSupp');
    var divSucces = document.getElementById('divSucces');
    var divSuccesmod = document.getElementById('divSuccesmod');
    var divErrmod =document.getElementById('divErrmod');
    var viderls = document.getElementById("viderls");
    var btnAjouterSupprimerAdherent = document.getElementById('btnAjouterSupprimerAdherent');
    var nDate = new Date();
    var ladate = nDate.getDate()+"/"+(nDate.getMonth()+1)+"/"+nDate.getFullYear();
    var valideDate = nDate.getDate()+"/"+(nDate.getMonth()+1)+"/"+(nDate.getFullYear()+1);
    var json = JSON.stringify(Object.fromEntries(listeMapAdherent)).split(";");
    var nbr = 0;
    var mesMajOk = "Les mise a jour a aboutie avec succés";
    var mesAjoutOk = "L'adhérent a etait ajouté avec succés";
    var champVide = "";
   

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  
    divErrmod.classList.add('divErrmodi');
    btnModifier.classList.add('btnModifierCss');
    divFormModifierAdherent.classList.add('divFormModifierAdhere');
    btnAjouterSupprimerAdherent.classList.add('btnAjouteAdherent');
    myTable.classList.add('matable');
    divForm.classList.add('divFormulaire');
    divMetAJourAdherent.classList.add('divModAdherent');
    divSuppAdherent.classList.add('divSupAdherent');
    mettreAjour.classList.add('btnMettreAJour');
    ajouter.classList.add('btnAjouter');
    supprimer.classList.add('btnSupprimer');
    txtCotisation.classList.add('txtCot');
    btnGenereNewAdherent.classList.add('genereNewAdherent');
    divCodeAdherent.classList.add('divAdherent');
    divErr.classList.add('divError');
    divSucces.classList.add('divSucc');
    divErrModif.classList.add('diverreur');
    divSuccesModif.classList.add('divsucce');
    divSuccesSupp.classList.add('divSuccesSupprime');
    fondOpaque.classList.add('fondOpa');
    divSuccesmod.classList.add('divSuccesmodi');

    ///////////////////////////////////////////////////// PROGRAMME PRINCIPALE /////////////////////////////////////////////////////////////////

    // Initialisation de la datatable
    let table = new DataTable('#myTable', {
        scrollY: 500,columnDefs: [
            { type: "extract-date-fr", targets: [1]}
        ],
        //Creer le tableau en francais
        language: {
          zeroRecords: "Aucun résultat trouvé - désolé",
          info: "Affichage de la page _PAGE_ sur _PAGES_",
          infoEmpty: "",
          infoFiltered: "",
          loadingRecords: "Chargement...",
          processing: "Traitement...",
          lengthMenu: "",
          search: "Rechercher un adhérent :",
          zeroRecords: "Aucun adhérent correspondant trouvé",
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
        iDisplayLength: 30,
        searching: true,
        responsive: true,
        select: true
        });

    /////ACTION CLICK SUR LE BOUTON GENERER UN NUMERO UNIQUE ADHERENT APPEL FONCTION "GENERATE"
    btnGenereNewAdherent.addEventListener("click",function(){
        divCodeAdherent.classList.add('fenetreApparaitDisparait');
        generate(divCodeAdherent);
    });
    //#############################################################################################
    //################################## BOUTON DE VALIDATION DE FORMULAIRE #######################

    /////// ACTION DU CLICK SUR LE BOUTON DE VALIDATION AJOUTER UN ADHERENT APPEL LA FONCTION "AJOUTENOM"
    ajouter.addEventListener("click", ajouteNom);
     /////// ACTION CLICK BOUTON MODIFIER ADHERENT APPEL LA FONCTION "METAJOURADHERENT"
     mettreAjour.addEventListener('click', function () {
        metAJourAdherent(recupDonneDiv(divMetAJourAdherent,-33,-27));
    });
    //////  ACTION CLICKE BOUTON CONFIRMER SUPPRIMER ADHERENT
    supprimer.addEventListener('click',function () {
        suprimeAdherent(recupDonneDiv(divSuppAdherent,"-29","-23"));
    });
    ////// ACTION CLICK BOUTON VALIDER MODIF ADHERENT
    btnModifier.addEventListener('click',function () {
        ajouteNomModifAdherent();
    });
    ////// Vide le local storage
    viderls.addEventListener("click", function () {
      localStorage.clear();
      location.reload();
    });
    //#############################################################################################
    //################################## BOUTON D'ACTION ##########################################

     /////// ACTION CLICK SUR BOUTON AJOUTER A JOUR ADHERENT
     btnAjouterSupprimerAdherent.addEventListener("click",function () {
        divForm.classList.add('fenetreApparaitDisparait');
        navbar.classList.add('navbare');
        fondOpaque.classList.add('fondOpaApparait');
    });
    //##############################################################################################
    //################################# BOUTON FERME POPUP #########################################

    /////// ACTION CLICK BOUTON FERME POPUP MET A JOUR ADHERENT
    btnReloadDivModif.addEventListener('click',function () {
        divMetAJourAdherent.classList.remove('fenetreApparaitDisparait');
        divErrModif.classList.remove('fenetreApparaitDisparait');
        divSuccesModif.classList.remove('fenetreApparaitDisparait');
        location.reload();
        fondOpaque.classList.remove('fondOpaApparait');
        navbar.classList.add('navbare');
    });
    /////// ACTION CLICK BOUTON FERME POPUP SUPPRIME ADHERENT
    btnReloadDivSupp.addEventListener('click',function () {
        divSuppAdherent.classList.remove('fenetreApparaitDisparait');
        location.reload();
        divSuccesSupp.classList.remove('fenetreApparaitDisparait');
        fondOpaque.classList.remove('fondOpaApparait');
        navbar.classList.add('navbare');
    })
    /////// ACTION CLICK BOUTON FERMER DIV MODIFIER ADHERENT
    fermeDiv.addEventListener('click',function () {
        inputNom1.value="";
            inputPrenom1.value="";
            inputMail1.value="";
            inputAdresse1.value="";
            inputId1.value="";
            inputCot1.value="";
            inputBd1.value="";
            inputAmende1.value="";
        divFormModifierAdherent.classList.remove('fenetreApparaitDisparait');
        fondOpaque.classList.remove('fondOpaApparait')
        location.reload();
        navbar.classList.add('navbare');
    })
     /////// ACTION CLICK SUR BOUTON FERMER FORMULAIRE
     btnReloadDiv.addEventListener('click', function(){
        videChamp();
        divCodeAdherent.classList.remove('fenetreApparaitDisparait');
        gereDiv(champVide,champVide,champVide,champVide);
        divForm.classList.remove('fenetreApparaitDisparait');
        location.reload();
        fondOpaque.classList.remove('fondOpaApparait');
        navbar.classList.remove('navbare');
    });
    //###############################################################################################
    //localStorage.clear()
    //Permet de ne charger la map qu'une seul fois et de travailler ensuite a partir du localstorage
    if (localStorage.length<1) {
        stockLocalStorage(json);
    };
    afficheAdherentTableaux();

    //Initialise les popovers
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
    
    
    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////// FUNCTION /////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Permet de génerer un id unique qui sert de clef dans le local storage
     * @param {string} uniqueID 
     */
    function generate(uniqueID) {
        let id = () => {
        return Math.floor((1 + Math.random()) * 0x1000000)
            .toString(16)
            .substring(1);
        }
        uniqueID.innerHTML = id();
    };
    //#################################################################################################################

    /**
     * Permet d'ajoutert un adherent, de controler les champ via la classe Adherent et de le stocker dans le local storage
     */
    function ajouteNom() {
        var nom = inputNom.value;
        var prenom = inputPrenom.value;
        var mail = inputMail.value;
        var adresse = inputAdresse.value;
        var idUnique = document.getElementById('divCodeAdherent').innerText;
        var txtCotis = "Nom: "+nom+", Prenom: "+prenom+", cotisation valable jusqu'au: "+valideDate;
        var bdlouer = 0 ;
        var amend = 0 ;
       
        try {
            var adherent = creerAdherent(nom, prenom, mail, adresse, ladate, idUnique);
            if (idUnique==="") {
                throw new Error ("ERR: Veuillez générer un code adhérent");
            }
            for (let i = 0; i < localStorage.length; i++) {
                var tAdherent = localStorage.key(i);
                var valAdherent = localStorage.getItem(tAdherent).split(";");
                
                for(let j in valAdherent) {
                    var adherent_JSON = JSON.parse(valAdherent[j]);
                    if (adherent_JSON.idUnique===idUnique) {
                        throw new Error ('ERR: ID deja existant veuillez générer un nouvelle ID'); 
                    };
                    if (adherent_JSON.mail===mail) {
                        throw new Error ('ERR: E-mail deja existant'); 
                    };
                };
            };
            // Sauvegarde adherent
            if (btnChecked.checked) {
                stockStorage(nom,prenom,mail,adresse,bdlouer,amend,valideDate,idUnique);
            }else stockStorage(nom,prenom,mail,adresse,bdlouer,amend,ladate,idUnique);
                
            divCodeAdherent.classList.remove('fenetreApparaitDisparait');
            afficheAdherentTableaux();
            videChamp();
            gereDiv(txtCotis,champVide,mesAjoutOk,champVide);
        } catch (err) {
            divErr.innerText = err.message;
            console.log(err.message);
        };
    };

    //##############################################################################################################################

    /**
     * Permet de modifier l'adherent, le supprime du local storage et le recré en controlant les informations saisie via la classe Adherent 
     */
    function ajouteNomModifAdherent() {
        var nom = inputNom1.value;
        var prenom = inputPrenom1.value;
        var mail = inputMail1.value;
        var adresse = inputAdresse1.value;
        var idUnique = inputId1.value;
        var cotisation = inputCot1.value;
        var bdlouer = inputBd1.value ;
        var amend = inputAmende1.value ;
        var valAdent = localStorage.getItem(idUnique).split(";");
        var jsonValAdhent = JSON.parse(valAdent);
        
        try {
            var adherent = creerAdherent(nom, prenom, mail, adresse,bdlouer,amend,cotisation, idUnique);
            localStorage.removeItem(idUnique);
            for (let i = 0; i < localStorage.length; i++) {
                var tAdherent = localStorage.key(i);
                var valAdherent = localStorage.getItem(tAdherent).split(";");
                console.log(valAdherent);
                for(let j in valAdherent) {
                
                    var adherent_JSON = JSON.parse(valAdherent[j]);
                    if (adherent_JSON.mail === mail) {
                        throw new Error ('ERR: E-mail deja existant'); 
                    };
                };
            };
            // Sauvegarde adherent
            stockStorage(nom,prenom,mail,adresse,bdlouer,amend,cotisation,idUnique);
            afficheAdherentTableaux();
            divSuccesmod.classList.add('fenetreApparaitDisparait');
            divErrmod.classList.remove('fenetreApparaitDisparait');
            divSuccesmod.innerText="La modification a aboutie avec succés";
        } catch (err) {
            divErrmod.classList.add('fenetreApparaitDisparait');
            divSuccesmod.classList.remove('fenetreApparaitDisparait');
            divErrmod.innerText = err.message;
            stockStorage(jsonValAdhent.nom,jsonValAdhent.prenom,jsonValAdhent.mail,jsonValAdhent.adresse,jsonValAdhent.bdLoue,jsonValAdhent.amende,jsonValAdhent.cotisation,jsonValAdhent.idUnique);
        };
    };

    //###############################################################################################################################

    function creerAdherent(nom, prenom, mail, adresse,cotisation, idUnique) {
        console.log(
          "creerAdherent",
          nom,
          prenom,
          mail,
          adresse,
          cotisation,
          idUnique
        );
        var adherent = new Adherent (nom, prenom, mail, adresse, cotisation, idUnique);
        return adherent;
    }

    //################################################################################################################################

    /**
     * Permet de creer chaque ligne du tableau avec ses éléments associé
     * @param {string} id 
     * @param {string} name 
     * @param {string} prenom 
     * @param {string} date 
     * @param {string} nbrLivre 
     * @param {string} nbrAmende 
     * @param {string} mail 
     */
    function addNewRow(id, name, prenom, date,nbrLivre, nbrAmende,mail) {
        
        var ann = date.slice(-4);
        var mois = date.slice(-7,-5);
        var jour =date.slice(-10,-8);
        
        if (parseInt(nbrAmende)>0) {
            if (parseInt(nbrLivre)=== 0) {
                table.row.add([
                    '<font class="d-none d-md-inline-block ">'+name+" / "+prenom+" / "+id+'</font><font size="-1" class="d-inline-block d-md-none">'+name+" / "+prenom+" / "+id+'</font><button type="button" class="btnPopover btn col-lg-2 col-sm-1" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="'+mail+'">+</button>',
                    '<font color="red" class="d-none d-md-inline-block ">'+date+'</font><font color="red" class="d-inline-block d-md-none"><font size="-1">'+date+'</font></font>',
                    '<font color="red" class="col-lg-2 col-sm-1">'+nbrLivre+'</font>',
                    '',
                    '<p><font color="red" class="d-none d-md-inline-block ">Compte bloqué '+nbrAmende+' amende en cours</font></p>   <p class="d-inline-block d-md-none"><font color="red" class="col-lg-2 col-sm-1">'+nbrAmende+'</font></p>',
                    '<font color="red"><span class="material-symbols-outlined">block</span></font>'
                ])
                  .draw(false);  
            }else table.row.add([
                '<font class="d-none d-md-inline-block ">'+name+" / "+prenom+" / "+id+'</font><font size="-1" class="d-inline-block d-md-none">'+name+" / "+prenom+" / "+id+'</font><button type="button" class="btnPopover btn col-lg-2 col-sm-1" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="'+mail+'">+</button>',
                '<font color="red" class="d-none d-md-inline-block ">'+date+'</font><font color="red" class="d-inline-block d-md-none"><font size="-1">'+date+'</font>',
                '<font color="red" class="col-lg-2 col-sm-1">'+nbrLivre+'</font>',
                '<button type="button" class="pretRestBtn btn btn-dark btn-sm d-none d-md-inline-block" >Réstitution</button> <button type="button" class="pretRestBtn btn btn-dark btn-sm d-block d-md-none p-0" ><span class="material-symbols-outlined">arrow_left_alt</span>',
                '<p><font color="red" class="d-none d-md-inline-block ">Compte bloqué '+nbrAmende+' amende en cours</font></p>   <p class="d-inline-block d-md-none"><font color="red" class="col-lg-2 col-sm-1">'+nbrAmende+'</font></p>',
                '<font color="red"><span class="material-symbols-outlined">block</span></font>'
            ])
              .draw(false);      
        }else if(parseInt(nbrLivre)=== 3) {
                table.row.add([
                '<font class="d-none d-md-inline-block ">'+name+" / "+prenom+" / "+id+'</font><font size="-1" class="d-inline-block d-md-none">'+name+" / "+prenom+" / "+id+'</font><button type="button" class="btnPopover btn" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="'+mail+'">+</button>',
                '<font class="d-none d-md-inline-block ">'+date+'</font><font class="d-inline-block d-md-none"><font size="-1">'+date+'</font></font>',
                '<p><font color="#f98017">'+nbrLivre+'</font></p>',
                '<button type="button" class="pretRestBtn btn btn-dark btn-sm d-none d-md-inline-block" >Réstitution</button>   <button type="button" class="pretRestBtn btn btn-dark btn-sm d-block d-md-none p-0" ><span class="material-symbols-outlined">arrow_left_alt</span></button>',
                nbrAmende,
                '<button type="button" class="modifBtn btn btn-warning btn-sm d-none d-md-inline-block" onclick=apparaitdivMetAJourAdherent(this)>Modifier</button>  <button type="button" class="modifBtn btn btn-warning btn-sm d-block d-md-none p-0" onclick=apparaitdivMetAJourAdherent(this)><span class="material-symbols-outlined">contract_edit</span></button>'
            ])
            .draw(false);
        }else if (parseInt(nbrLivre)>0){
            table.row.add([
                '<font class="d-none d-md-inline-block ">'+name+" / "+prenom+" / "+id+'</font><font size="-1" class="d-inline-block d-md-none">'+name+" / "+prenom+" / "+id+'</font><button type="button" class="btnPopover btn" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="'+mail+'">+</button>',
                '<font class="d-none d-md-inline-block ">'+date+'</font><font class="d-inline-block d-md-none"><font size="-1">'+date+'</font></font>',
                nbrLivre,
                '<button type="button" class="pretRestBtn btn btn-dark btn-sm d-none d-md-inline-block" >Prêt</button>&#160<button type="button" class="pretRestBtn btn btn-dark btn-sm d-none d-md-inline-block" >Réstitution</button>   <button type="button" class="pretRestBtn btn btn-dark btn-sm d-block d-md-none p-0" ><span class="material-symbols-outlined">arrow_right_alt</span></button>&#160<button type="button" class="pretRestBtn btn btn-dark btn-sm d-block d-md-none p-0" ><span class="material-symbols-outlined">arrow_left_alt</span></button>',
                nbrAmende,
                '<button type="button" class="modifBtn btn btn-warning btn-sm d-none d-md-inline-block" onclick=apparaitdivMetAJourAdherent(this)>Modifier</button>  <button type="button" class="modifBtn btn btn-warning btn-sm d-block d-md-none p-0" onclick=apparaitdivMetAJourAdherent(this)><span class="material-symbols-outlined">contract_edit</span></button>'
            ])
            .draw(false);
        }else if (ann<=nDate.getFullYear()){
                if ((mois == nDate.getMonth()+1 && jour <= nDate.getDate())||(mois < nDate.getMonth()+1)) {
                        table.row.add([
                            '<font class="d-none d-md-inline-block ">'+name+" / "+prenom+" / "+id+'</font><font size="-1" class="d-inline-block d-md-none">'+name+" / "+prenom+" / "+id+'</font><button type="button" class="btnPopover btn" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="'+mail+'">+</button>',
                            '<font class="d-none d-md-inline-block ">'+date+'</font><font class="d-inline-block d-md-none"><font size="-1">'+date+'</font></font>&#160&#160&#160&#160&#160&#160&#160&#160&#160&#160<button type="button" class="btn btn-success btn-sm d-none d-md-inline-block" onclick=apparaitDivModif(this)>Mettre a jour</button>  <button type="button" class="btn btn-success btn-sm d-bloc d-md-none p-0" onclick=apparaitDivModif(this)><span class="material-symbols-outlined">published_with_changes</span></button>',
                            nbrLivre,
                            '',
                            nbrAmende,
                            '<button type="button" class="modifBtn btn btn-warning btn-sm d-none d-md-inline-block" onclick=apparaitdivMetAJourAdherent(this)>Modifier</button>&#160<button type="button" class="suppBtn btn btn-danger btn-sm d-none d-md-inline-block" onclick=apparaitDivSupprimer(this)>Archiver</button>    <button type="button" class="modifBtn btn btn-warning btn-sm d-block d-md-none p-0" onclick=apparaitdivMetAJourAdherent(this)><span class="material-symbols-outlined">contract_edit</span></button>&#160<button type="button" class="suppBtn btn btn-danger btn-sm d-block d-md-none p-0" onclick=apparaitDivSupprimer(this)><span class="material-symbols-outlined">delete</span></button>'
                        ])
                        .draw(false);
                }
        }else table.row.add([
            '<font class="d-none d-md-inline-block ">'+name+" / "+prenom+" / "+id+'</font><font size="-1" class="d-inline-block d-md-none">'+name+" / "+prenom+" / "+id+'</font><button type="button" class="btnPopover btn " data-bs-container="body" data-bs-toggle="popover" data-bs-placement="right" data-bs-content="'+mail+'">+</button>',
            '<font class="d-none d-md-inline-block ">'+date+'</font><font class="d-inline-block d-md-none"><font size="-1">'+date+'</font></font>',
            nbrLivre,
            '<button type="button" class="pretRestBtn btn btn-dark btn-sm d-none d-md-inline-block" >Prêt</button>  <button type="button" class="pretRestBtn btn btn-dark btn-sm d-block d-md-none p-0" ><span class="material-symbols-outlined">arrow_right_alt</span></button>',
            nbrAmende,
            '<button type="button" class="modifBtn btn btn-warning btn-sm d-none d-md-inline-block" onclick=apparaitdivMetAJourAdherent(this)>Modifier</button>&#160<button type="button" class="suppBtn btn btn-danger btn-sm d-none d-md-inline-block" onclick=apparaitDivSupprimer(this)>Archiver</button>    <button type="button" class="modifBtn btn btn-warning btn-sm d-block d-md-none p-0" onclick=apparaitdivMetAJourAdherent(this)><span class="material-symbols-outlined">contract_edit</span></button>&#160<button type="button" class="suppBtn btn btn-danger btn-sm d-block d-md-none p-0" onclick=apparaitDivSupprimer(this)><span class="material-symbols-outlined">delete</span></button>'
        ])
        .draw(false);
    }

    //###################################################################################################################

    /**
     * Permet de parcourir une map stringifier et d'appeler une fonction qui stock dans le local storage
     * @param {string} valeur 
     */
    function stockLocalStorage(valeur){
   
        if (valeur) {
            for(let i in valeur) {
                var adherent_JSON = JSON.parse(valeur[i]);

                for (let j in adherent_JSON){
                    stockStorage(adherent_JSON[j].nom, adherent_JSON[j].prenom, adherent_JSON[j].mail, adherent_JSON[j].adresse,adherent_JSON[j].bdLoue,adherent_JSON[j].amende,adherent_JSON[j].cotisation, adherent_JSON[j].idUnique)
                };
            };
        };
    };

    //######################################################################################################################

    /**
     * Permet de parcourir le local storage pour appeler la fonction qui creer la ligne associé a la clef fournie
     */
    function afficheAdherentTableaux(){
        
        for (let i = 0; i < localStorage.length; i++) {
            var tAdherent = localStorage.key(i);
            var valAdherent = localStorage.getItem(tAdherent).split(";");
            
            for(let j in valAdherent) {
                var adherent_JSON = JSON.parse(valAdherent[j]);
                var adhere = new Adherent(adherent_JSON.nom, adherent_JSON.prenom, adherent_JSON.mail, adherent_JSON.adresse, adherent_JSON.cotisation, adherent_JSON.idUnique);
                    
                if (adhere.getCodeAdherent().length>6) {
                    break;
                }else addNewRow(adhere.getCodeAdherent(),adhere.getNom(),adhere.getPrenom(),adhere.getCotisation(),adherent_JSON.bdLoue,adherent_JSON.amende,adhere.getMail()) ;
            };
        };
    };

    //########################################################################################################################

    /**
     * Permet de mettre a jour la cotisation de l'adherent en le supprime du local storage et le recrée avec la nouvelle date a jour
     * @param {*} key 
     */
    function metAJourAdherent(key){

        console.log(key);
        var valAdherent = localStorage.getItem(key).split(";");
        var tAdhere = JSON.parse(valAdherent);

        try {
            localStorage.removeItem(key)
            stockStorage(tAdhere.nom,tAdhere.prenom,tAdhere.mail,tAdhere.adresse,tAdhere.bdLoue,tAdhere.amende,valideDate,tAdhere.idUnique)
            infoAdherentModif.innerText = "";
            divSuccesModif.classList.add('fenetreApparaitDisparait');
            divSuccesModif.innerText = "La cotisation a etait mise a jour avec succes"+"\n"+"date de validité jusqu'au "+valideDate;
            mettreAjour.style.display="none"
        }catch (err) {
            divErrModif.classList.add('fenetreApparaitDisparait');
            divErrModif.innerText = err.message;
            mettreAjour.style.display="none"
        };   
    };

    ///############################################################################################################################################

    /**
     * Permet de stocker dans le local storage avec comme clef l'ID unique
     * @param {*} nom1 
     * @param {*} prenom1 
     * @param {*} mail1 
     * @param {*} adresse1 
     * @param {*} bdloue1 
     * @param {*} amende1 
     * @param {*} cotisation1 
     * @param {*} idUnique1 
     */
    function stockStorage(nom1,prenom1,mail1,adresse1,bdloue1,amende1,cotisation1,idUnique1) {
        var serial = '{"nom": "' + nom1 + '", "prenom":"' + prenom1 + '", "mail":"' + mail1 + '", "adresse":"' + adresse1 + '", "bdLoue":"' + bdloue1 + '", "amende":"' + amende1 + '", "cotisation":"' + cotisation1 + '", "idUnique":"' + idUnique1 +'"' + '}'; 
        
        if (serial) localStorage.setItem(idUnique1,serial); 
    } 
    
    //##############################################################################################################################################

    function videChamp() {
        inputNom.value = "";
        inputPrenom.value = "";
        inputMail.value = "";
        inputAdresse.value = "";
    }

    //################################################################################################################################################

    function gereDiv(txt1,txt2,txt3,txt4) {
        txtCotisation.innerText =txt1;
        divErr.innerText=txt2;
        divSucces.innerText=txt3;
        divCodeAdherent.innerText=txt4;
    }
 
    //######################################################################################################################################################

    function apparaitDivModif(button){
        divMetAJourAdherent.classList.add('fenetreApparaitDisparait');
        fondOpaque.classList.add('fondOpaApparait'); 
        navbar.classList.add('navbare');
        idOfRowBtn = recupIdButton(button);
        console.log(idOfRowBtn);
        afficheAdherentAddSupp(idOfRowBtn,infoAdherentModif);
    }

    //#######################################################################################################################################################

    function apparaitDivSupprimer(button) {
        divSuppAdherent.classList.add('fenetreApparaitDisparait');
        fondOpaque.classList.add('fondOpaApparait');
        navbar.classList.add('navbare');
        idOfRowBtn = recupIdButton(button);
        afficheAdherentAddSupp(idOfRowBtn,infoAdherentSupp);
    }

    //########################################################################################################################################################

    function apparaitdivMetAJourAdherent(button) {
        divFormModifierAdherent.classList.add('fenetreApparaitDisparait');
        fondOpaque.classList.add('fondOpaApparait');
        navbar.classList.add('navbare');
        idOfRowBtn = recupIdButton(button);
        console.log(idOfRowBtn);
        rempliInputModif(idOfRowBtn);
    }
    
    //########################################################################################################################################################

    function recupIdButton(button) {
        var ligne = button.parentNode;
        var ligneTot = ligne.parentNode;
        var idOfRowBtn = ligneTot.firstChild.innerText;
        idOfRowBtn= idOfRowBtn.slice(-7,-1);
        return idOfRowBtn;
    }

    //#################################################################################################################################"#########################
    
    /**
     * Permet d'afficher les informations de l'adherent dans la fenetre fournie en parametre
     * @param {*} params 
     * @param {*} parametre 
     */
    function afficheAdherentAddSupp(params,parametre) {
        var valAdherent = localStorage.getItem(params).split(";");
        
        for(let i in valAdherent) {
            var adherent_JSON = JSON.parse(valAdherent[i]);
            parametre.innerHTML = '<p>Nom : <span class="fw-lighter text-warning">'+adherent_JSON.nom+'</span></p> '+"\n"+'<p>Prenom : <span class="fw-lighter text-warning">'+adherent_JSON.prenom+'</span></p>'+"\n"+'<p>Mail : <span class="fw-lighter text-warning">'+adherent_JSON.mail+'</span></p>'+"\n"+'<p>Adresse : <span class="fw-lighter text-warning">'+adherent_JSON.adresse+'</span></p>'+"\n"+'<p>Nombre de BD en cours : <span class="fw-lighter text-warning">'+adherent_JSON.bdLoue+'</span></p>'+"\n"+'<p>Amende : <span class="fw-lighter text-warning">'+adherent_JSON.amende+'</span></p>'+"\n"+'<p>Cotisation : <span class="fw-lighter text-warning">'+adherent_JSON.cotisation+'</span></p>'+"\n"+'<p>Id: <span class="fw-lighter text-warning">'+adherent_JSON.idUnique+'</span></p>';
        }
    }

    //############################################################################################################################################################

    function rempliInputModif(params) {
        var valAdherent = localStorage.getItem(params).split(";");
        
        for(let i in valAdherent) {
            var adherent_JSON = JSON.parse(valAdherent[i]);
            inputNom1.setAttribute('value', adherent_JSON.nom);
            inputPrenom1.setAttribute('value', adherent_JSON.prenom);
            inputMail1.setAttribute('value', adherent_JSON.mail);
            inputAdresse1.setAttribute('value', adherent_JSON.adresse);
            inputBd1.setAttribute('value',adherent_JSON.bdLoue);
            inputCot1.setAttribute('value',adherent_JSON.cotisation);
            inputAmende1.setAttribute('value',adherent_JSON.amende);
            inputId1.setAttribute('value',adherent_JSON.idUnique);
        }
    }
    
    //##########################################################################################################################################################

    function recupDonneDiv(param,nbr1,nbr2) {
        return param.innerText.slice(nbr1,nbr2);
    }

    //############################################################################################################################################################

    /**
     * Permet de supprimer un adherent du tableaux tout en le gardant dans notre BDD
     * @param {*} key 
     */
    function suprimeAdherent(key){
        var archive = "Archive";
        var valAdherent = localStorage.getItem(key).split(";");
        var tAdhere = JSON.parse(valAdherent);
        for (var i = 0; i < localStorage.length; i++ ) {
            localStorage.removeItem(key);
        }; 
        for (var i = 0; i < localStorage.length; i++ ) {
            localStorage.removeItem(key);
            stockStorage(tAdhere.nom,tAdhere.prenom,tAdhere.mail,tAdhere.adresse,tAdhere.bdLoue,tAdhere.amende,valideDate,tAdhere.idUnique+archive);
    }; 
        infoAdherentSupp.innerText = "";
        divSuccesSupp.classList.add('fenetreApparaitDisparait');
        divSuccesSupp.innerText = "L'archivage a aboutie avec succés";
        supprimer.style.display='none';
    };

    //##############################################################################################################################################################

   