const router = require('express').Router();

const Response = require('../objects/response');
const Artist = require('../modules/artist');

router.get('/', (req, res) => {
  Artist.getArtists().then(artists => {
    res.send(new Response.Collection(artists, 0, artists.length, artists.length));
  });
});

router.post('/', (req, res) => {
  new Artist(req.body.name).save().then(artist => {
    res.send(new Response.Data(artist));
  });
});

router.get('/:id', (req, res) => {
  Artist.getArtist(req.params.id).then(artist => {
    res.send(new Response.Data(artist));
  });
});

module.exports = router;
