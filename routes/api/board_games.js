var express = require('express');
var router = express.Router();
const {
    getBoardGames
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
router.get('/:id', async function(req,res, next) {      //need to test still
    try{
        const data = await getBoardGames(req.params.id);
        res.send(data);
    }catch(err){
        console.log(err);
        res.send(500, 'Internal Server Issue, check logs');
    }
})

module.exports = router;
