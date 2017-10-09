const router = require('express').Router();

const Response = require('../objects/response');
const Artist = require('../modules/artist');

router.get('/', (req, res) => {
  const index = req.query.index ? parseInt(req.query.index) : 0;
  const offset = req.query.offset ? parseInt(req.query.offset) : 50;
  Artist.getArtists(index, offset).then(page => {
    res.send(new Response.Collection(page.data, page.index, page.offset, page.total));
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

router.put('/:id', (req, res) => {
  Artist.getArtist(req.params.id)
    .then(artist => {
      artist.name = req.body.name;
      return artist.save();
    }).then(artist => {
      res.send(new Response.Data(artist));
    });
});

module.exports = router;
