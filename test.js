//@see https://expressjs.com/
const express = require("express"); // Importation de la librairie express
const auth = require("basic-auth");

const app = express();  // Instanciation du serveur Web (express)

// Création d'un middleware (appelé sur l'authentification des routes en PUT, POST et DELETE)
function authBasic(req, res, next){
    const client = auth(req);
    if(client && client.name == "biero" && client.pass == "biero"){
        next(); // Fonction qui appel le prochain middleware
    }
    else{
        res.status(401).send("401");    
    }
}

let chaine = "";

app.put("*", authBasic);    // Attache authBasic sur toutes les routes en put/post/delete
app.post("*", authBasic);
app.delete("*", authBasic);


app.get("/", function(req, res){
    chaine += "<h1> le monde (page accueil)</h1>";
    res.send(chaine);
})

// Route /toto
app.get("/toto", function(req, res){
    chaine += " toto ";
    res.send(chaine);
})

// démarrage du serveur.
app.listen("8080", function(){
    console.log("démarré");
})
