 class Adherent {

    #nom="";
    #prenom="";
    #mail="";
    #adresse="";
    #cotisation="";
    #codeAdherent=0;

    constructor(nom,prenom,mail,adresse,cotisation,codeAdherent){
        if(nom === null || nom == undefined) throw new Error ("Err : le nom est null");
       this.#setNom(nom);
       this.#setPrenom(prenom);
       this.#setMail(mail);
       this.#setAdresse(adresse);
       this.#setCotisation(cotisation);
       this.#setCodeAdherent(codeAdherent);
    }

    #setNom(nom){
       // if(!nom)throw new Error("ERR : Aucun nom renseingé.");
        if(/^[a-zA-Z-]{3,}$/.test(nom.trim())===false) throw new Error ("ERR : Le nom doit comporter au moin 3 caractéres et seulement des lettres.")
        else this.#nom = nom;
    }
    #setPrenom(prenom){
        if(/^[a-zA-Z-]{3,}$/.test(prenom.trim())===false) throw new Error ("ERR : Le prenom doit comporter au moin 3 caractéres et seulement des lettres.")
        else this.#prenom = prenom;
    }
    #setMail(mail){
        if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/.test(mail.trim())===false) throw new Error ("ERR : Le format E-mail n'est pas correcte.")
        else this.#mail = mail;
    }
    #setAdresse(adresse){
        this.#adresse = adresse;
    }
    #setCotisation(cotisation){
        this.#cotisation = cotisation;
    }
    #setCodeAdherent(codeAdherent){
        this.#codeAdherent = codeAdherent;
    }

    getNom(){
        return this.#nom;
    }
    getPrenom(){
        return this.#prenom;
    }
    getMail(){
        return this.#mail;
    }
    getAdresse(){
        return this.#adresse;
    }
    getCotisation(){
        return this.#cotisation
    }
    getCodeAdherent(){
        return this.#codeAdherent;
    }
}