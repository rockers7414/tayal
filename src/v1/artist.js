const router = require('express').Router();
const Response = require('../objects/response');
const Err = require('../objects/error');
const Artist = require('../modules/artist');
const _ = require('lodash');

/**
 * @api {get} /artists Get page of artists.
 * @apiName GetArtists
 * @apiGroup Artists
 *
 * @apiParam {Number} [index=0] index Index of pagment.
 * @apiParam {Number} [offset=50] offset Size of pagment.
 *
 * @apiSuccess {Object} data Page of artists.
 * @apiSuccess {String} type Collection.
 * @apiSuccess {Integer} index Index of Page.
 * @apiSuccess {Integer} offset Offset.
 * @apiSuccess {Integer} total Row count of data.
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
 * @apiHeader {String} Content-Type=application/json Content-Type
 *
 * @apiParam {String} name     Artist's name.
 * @apiParam {Object} [tag={}] The source of artist.
 *
 * @apiParamExample {json} Request-Example:
 *     {
 *       "name":"Ed Sheeran",
 *       "tag": {
 *         "spotify": "6eUKZXaKkcviH0Ku9w2n3V"
 *       }
 *     }
 *
 * @apiSuccess {Object} data The new artist's instance.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/artists
 */
router.post('/', async (req, res) => {
  const name = req.body.name || '';
  const tag = req.body.tag || {};

  if (name === '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
    return;
  }

  let artist = null;

  if (!_.isEmpty(tag)) {
    artist = await Artist.getArtistByNameTag(name, tag);
  }

  if (artist) {
    res.status(200).send(new Response.Data(artist));
  } else {
    artist = await new Artist(name, tag).save();
    res.status(200).send(new Response.Data(artist));
  }
});

/**
 * @api {get} /artists/:id Get artist matching by given id.
 * @apiName GetArtist
 * @apiGroup Artists
 *
 * @apiParam {String} :id Artist's id.
 *
 * @apiSuccess {Object} data Collection of artist.
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
 * @apiParam {String} :id Artist's id.
 * @apiParam {String} [name] Artist's name.
 * @apiParam {Array} [albums] Array of Album.toSimple().
 *
 * @apiSuccess {Object} data Collection of artist.
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
 * @apiParam {String} id Artist's id.
 *
 * @apiSuccess {Boolean} data Result of artist delete.
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
