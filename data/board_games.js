const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

//Connection URL and Database Settings
const url = process.env.ATLAS_CONNECTION;
const settings = { useUnifiedTopology: true};

//Database and Collection name
const dbName = 'game_collection';
const colName = 'board_games';

// Board Game Validator Function (Name, Number of players min, and Number of players max required)
const invalidBoardGame = (boardGame) => {
    let result;
    if(!boardGame.name){
        result = 'Board Game requires a Name';
    }else if(!boardGame.num_players_max){
        result = 'Board Game requires a Max amount of players'  //TODO: add check for number values for Max and Min
    }else if(!boardGame.num_players_min){
        result = 'Board Game requires a Min amount of players'
    }
    return result;  //Note: if the board game is valid, result will return undefined
}

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

const addBoardGame = (boardGames) =>{
    const myPromise = new Promise ((resolve, reject) => {
        if(!Array.isArray(boardGames)){
            reject({error: 'Need to send an Array of Board Games'});
        } else {
            const invalidBoardGames = boardGames.filter((boardGame) => {
                const check = invalidBoardGame(boardGame);  //Check will be undefined if the board game is valid
                if(check){
                    boardGame.invalid = check;
                }
                return boardGame.invalid;
            });
            if(invalidBoardGames.length > 0){
                reject({
                    error: 'Some Board Games were invalid',
                    data: invalidBoardGames
                })
            }else {
                MongoClient.connect(url, settings, async function(err, client){
                    if(err){
                        reject(err);
                    }else{
                        console.log('Connected successfully to server to POST a Board Game.');
                        const db = client.db(dbName);
                        const collection = db.collection(colName);
                        boardGames.forEach((boardGame) =>{
                            boardGame.dateAdded = new Date(Date.now()).toUTCString();
                        });
                        const results = await collection.insertMany(boardGames);
                        resolve(results.ops);
                    }
                });
            }
        }
    });
    return myPromise;
}

const deleteBoardGame = (id) => {
    const Promise = new Promise((resolve, reject) =>{
        MongoClient.connect(url, settings, async function(err, client) {
            if(err){
                reject(err);
            }else{
                console.log('Connected to server to Delete a Board Game');
                const db = client.db(dbName);
                const collection = db.collection(colName);
                try{
                    const _id = new ObjectID(id);
                    collection.findOneAndDelete({_id}, function (err, data) {
                        if(err){
                            reject(err);
                        }else{
                            if(data.lastErrorObject.n > 0){
                                resolve(data.value);
                            }else{
                                resolve({error: 'ID does not exist in database'});
                            }
                        }
                    })
                }catch(err){
                    reject({ error: "ID has to be in ObjectID format"})
                }
            }
        })
    })
}

module.exports = {
    getBoardGames,
    getBoardGame,
    addBoardGame,
    deleteBoardGame
}