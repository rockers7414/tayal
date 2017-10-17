const router = require('express').Router();

const Response = require('../objects/response');
const Err = require('../objects/error');

const Artist = require('../modules/artist');
const Album = require('../modules/album');

router.get('/', (req, res) => {
  const index = req.query.index ? parseInt(req.query.index) : 0;
  const offset = req.query.offset ? parseInt(req.query.offset) : 50;
  Artist.getArtists(index, offset).then(page => {
    res.status(200).send(new Response.Collection(page.data, page.index, page.offset, page.total));
  });
});

router.post('/', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  }
  new Artist(req.body.name).save().then(artist => {
    res.status(200).send(new Response.Data(artist));
  });
});

router.get('/:id(\\w{12})', (req, res) => {
  Artist.getArtist(req.params.id).then(artist => {
    res.status(200).send(new Response.Data(artist));
  });
});

router.put('/:id(\\w{12})', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  }
  Artist.getArtist(req.params.id)
    .then(artist => {
      artist.name = req.body.name;
      artist.albums = req.body.albums || [];
      return artist.save();
    }).then(artist => {
      res.status(200).send(new Response.Data(artist));
    });
});

router.delete('/:id(\\w{12})', (req, res) => {
  Artist.deleteArtist(req.params.id)
    .then(result => res.send(new Response.Data(result)))
    .catch(e => {
      if (e instanceof Err.UnremovableError) {
        res.status(400);
      }
      res.send(new Response.Error(e));
    });
});

router.post('/:id(\\w{24})/albums', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  }
  Artist.getArtist(req.params.id)
    .then(artist => {
      new Album(req.body.name, artist.toSimple()).save()
        .then(album => {
          artist.albums.push(album.toSimple());
          artist.save().then(artist => res.status(200).send(new Response.Data(artist)));
        });

    });
});

router.get('*', (req, res) => {
  res.status(404).send(new Response.Error(new Err.ResourceNotFound()));
});

module.exports = router;