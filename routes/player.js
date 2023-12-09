// player.js

const express = require('express');
const router = express.Router();

router.get('/player', (req, res) => {
    const songParam = req.query.song;

    if (!songParam) {
        return res.status(400).send('Song information is missing.');
    }

    const song = JSON.parse(decodeURIComponent(songParam));
    
    res.render('player', { song: song });
});

module.exports = router;
