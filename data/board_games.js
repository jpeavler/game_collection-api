const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

//Connection URL and Database Settings
const url = process.env.ATLAS_CONNECTION;
const settings = { useUnifiedTopology: true};

//Database and Collection name
const dbName = 'game_collection';
const colName = 'board_games';

//Read all BoardGames
const getBoardGames = () => {
    const myPromise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client) {
            if(err){
                reject(err);
            } else{
                console.log("Connected successfully to server to GET Board Games");
                const db = client.db(dbName);
                const collection = db.collection(colName);
                collection.find({}).toArray(function(err, docs) {
                    if(err){
                        reject(err);
                    } else{
                        console.log("Found the following Board Games");
                        console.log(docs);
                        resolve(docs);
                        client.close();
                    }
                });
            }
        });
    });
    return myPromise;
}
//Read one board game by id
const getBoardGame = (id) =>{
    const myPromise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, async function(err, client) {
            if(err){
                reject(err);
            } else{
                console.log(`Connected successfully to server to Get Board Game with ID: ${id}`);
                const db = client.db(dbName);
                const collection = db.collection(colName);
                try{
                    const _id = new ObjectID(id);
                    const result = await collection.findOne({_id});
                    resolve(result);
                    console.log(result);
                    client.close();
                }catch(err){
                    reject(err);
                }            
            }
        }
    )})
    return myPromise;
}

module.exports = {
    getBoardGames,
    getBoardGame
}