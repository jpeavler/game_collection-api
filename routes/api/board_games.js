var express = require('express');
var router = express.Router();
const {
    getBoardGames,
    getBoardGame,
    addBoardGame,
    deleteBoardGame
} = require('../../data/board_games')

// GET Game Collection listing
router.get('/', async function(req, res, next) {
    try{
        const data = await getBoardGames();
        res.send(data);
    }catch(err){
        console.log(err);
        res.send(500, 'Internal Server Issue, check logs');
    }
});
// GET a single Game by ID
router.get('/:id', async function(req, res, next) {
    try{
        const data = await getBoardGame(req.params.id);
        res.send(data);
    }catch(err){
        console.log(err);
        res.send(500, 'Internal Server Issue, check logs');
    }
})
// POST board game creation
router.post('/', async function(req, res, next) {
    try{
        const data = await addBoardGame(req.body);
        res.send(data);
    }catch(err){
        if(err.error){
            res.status(400).send(err);
        }else{
                console.log(err);
                res.status(500).send('Internal Server Issue, check logs');
            }
    }
});

router.delete('/:id', async function(req,res) {
    try{
        const data = await deleteBoardGame(req.params.id);
        res.send(data);
    }catch(err){
        if(err.error){
            res.status(400).send(err);
        }else{
            console.log(err);
            res.status(500).send('Internal Server Issue, check log');
        }
    }
});
module.exports = router;
