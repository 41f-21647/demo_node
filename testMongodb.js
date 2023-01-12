//@see https://expressjs.com/
const express = require("express"); // Importation de la librairie express
const auth = require("basic-auth");
const mongo = require("mongodb");
const mongoClient = mongo.MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
//console.log(mongo);
const app = express();  // Instanciation du serveur Web (express)

app.use(cors());
app.use(bodyParser.json());

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


app.get("/biere", function(req, res){
    //https://www.mongodb.com/docs/drivers/node/current/
    mongoClient.connect("mongodb://127.0.0.1:27017", (err, db)=>{
        if(err){
            res.send("Erreur de connection");
            throw err;
        }
        let database = db.db("biero");
        let collection = database.collection("produit");
        collection.find().toArray((err, resultat)=>{
            res.json(resultat);
        })
    })

})


app.get("/biere/:id_biere", function(req, res){
    //https://www.mongodb.com/docs/drivers/node/current/
    mongoClient.connect("mongodb://127.0.0.1:27017", (err, db)=>{
        if(err){
            res.send("Erreur de connection");
            throw err;
        }
        let database = db.db("biero");
        let collection = database.collection("produit");
        let id_biere = req.params.id_biere;
        
        
        
        collection.findOne({_id : new mongo.ObjectId(id_biere)}, (err, resultat)=>{
            res.json(resultat);
        });
    })

})


app.put("/biere", function(req, res){
    //https://www.mongodb.com/docs/drivers/node/current/
    mongoClient.connect("mongodb://127.0.0.1:27017", (err, db)=>{
        if(err){
            res.send("Erreur de connection");
            throw err;
        }
        let database = db.db("biero");
        let collection = database.collection("produit");
        let unProduit = req.body;
        unProduit.date_ajout = new Date();
        unProduit.commentaires = [];

        collection.insertOne(unProduit, (err, db)=>{
            res.json({ok : true});
        })

    })

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
