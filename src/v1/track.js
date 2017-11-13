const router = require('express').Router();

const Response = require('../objects/response');
const Err = require('../objects/error');

const Track = require('../modules/track');
const Album = require('../modules/album');

router.get('/', (req, res) => {
  const index = req.query.index ? parseInt(req.query.index) : 0;
  const offset = req.query.offset ? parseInt(req.query.offset) : 50;

  Track.getTracks(index, offset).then(page => {
    res.status(200).send(new Response.Collection(page.data, page.index, page.offset, page.total));
  });
});

router.get('/:id(\\w{24})', (req, res) => {
  Track.getTrack(req.params.id).then(track => {
    res.status(200).send(new Response.Data(track));
  });
});

router.post('/', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  } else {
    new Track(null, null, req.body.name, null).save().then(track => {
      res.status(200).send(new Response.Data(track));
    });
  }
});

router.put('/', (req, res) => {
  // TODO
});

router.delete('/:id(\\w{24})', (req, res) => {

  // TODO remove from album..


  Track.deleteTrack(req.params.id)
    .then(result => {
      res.send(new Response.Data(result));
    })
    .catch(err => {
      res.send(new Response.Error(err));
    });
});


router.get('*', (req, res) => {
  res.status(404).send(new Response.Error(new Err.ResourceNotFound()));
});

module.exports = router;