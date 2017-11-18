const router = require('express').Router();

const Response = require('../objects/response');
const Err = require('../objects/error');

const Artist = require('../modules/artist');
const Album = require('../modules/album');

/**
 * @api {get} /artists Get page of artists.
 * @apiName GetArtists
 * @apiGroup Artists
 *
 * @apiParam {Number} [index=0] index Index of pagment.
 * @apiParam {Number} [offset=50] offset Size of pagment.
 *
 * @apiSuccess {Object} collection Page of artists.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/artists
 */
router.get('/', (req, res) => {
  const index = req.query.index ? parseInt(req.query.index) : 0;
  const offset = req.query.offset ? parseInt(req.query.offset) : 50;
  Artist.getArtists(index, offset).then(page => {
    res.status(200).send(new Response.Collection(page.data, page.index, page.offset, page.total));
  });
});

/**
 * @api {post} /artists Create new artist.
 * @apiName PostArtist
 * @apiGroup Artists
 *
 * @apiParam {String} [name] artist's name.
 *
 * @apiSuccess {Object} collection of artist.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/artists
 */
router.post('/', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  }
  new Artist(req.body.name).save().then(artist => {
    res.status(200).send(new Response.Data(artist));
  });
});

/**
 * @api {post} /artists/:id Get artist matching by given id.
 * @apiName GetArtist
 * @apiGroup Artists
 *
 * @apiParam {String} [id] artist's id.
 *
 * @apiSuccess {Object} collection of artist.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/artists/:id
 */
router.get('/:id(\\w{24})', (req, res) => {
  Artist.getArtist(req.params.id).then(artist => {
    res.status(200).send(new Response.Data(artist));
  });
});

/**
 * @api {put} /artists/:id Update specify artist info.
 * @apiName UpdateArtist
 * @apiGroup Artists
 *
 * @apiParam {String} [id] artist's id.
 * @apiParam {String} [name] artist's name.
 *
 * @apiSuccess {Object} collection of artist.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/artists/:id
 */
router.put('/:id(\\w{24})', (req, res) => {
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

/**
 * @api {delete} /artists/:id Delete specify artist.
 * @apiName DeleteArtist
 * @apiGroup Artists
 *
 * @apiParam {String} [id] artist's id.
 *
 * @apiSuccess {Boolean} Result of artist delete.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/artists/:id
 */
router.delete('/:id(\\w{24})', (req, res) => {
  Artist.deleteArtist(req.params.id)
    .then(result => res.send(new Response.Data(result)))
    .catch(e => {
      if (e instanceof Err.UnremovableError) {
        res.status(400);
      }
      res.send(new Response.Error(e));
    });
});

router.get('*', (req, res) => {
  res.status(404).send(new Response.Error(new Err.ResourceNotFound()));
});

module.exports = router;