const router = require('express').Router();
const Response = require('../objects/response');
const Err = require('../objects/error');
const Track = require('../modules/track');

/**
 * @api {get} /tracks Get page of tracks.
 * @apiName GetTracks
 * @apiGroup Tracks
 *
 * @apiParam {Number} [index=0] index Index of pagment.
 * @apiParam {Number} [offset=50] offset Size of pagment.
 *
 * @apiSuccess {Object} data Collection Page of tracks.
 * @apiSuccess {String} type Collection.
 * @apiSuccess {Integer} index Index of Page.
 * @apiSuccess {Integer} offset Offset.
 * @apiSuccess {Integer} total Row count of data.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/tracks
 */
router.get('/', (req, res) => {
  const index = req.query.index ? parseInt(req.query.index) : 0;
  const offset = req.query.offset ? parseInt(req.query.offset) : 50;

  Track.getTracks(index, offset).then(page => {
    res.status(200).send(new Response.Collection(page.data, page.index, page.offset, page.total));
  });
});

/**
 * @api {get} /tracks/:id Get track matching by given id.
 * @apiName GetTrack
 * @apiGroup Tracks
 *
 * @apiParam {String} :id Track's id
 *
 * @apiSuccess {Object} data Collection of track.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/track/:id
 */
router.get('/:id(\\w{24})', (req, res) => {
  Track.getTrack(req.params.id).then(track => {
    res.status(200).send(new Response.Data(track));
  });
});

/**
 * @api {post} /tracks Create new track.
 * @apiName PostTrack
 * @apiGroup Tracks
 *
 * @apiParam {String} name Track's name.
 *
 * @apiSuccess {Object} data Collection of track.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/tracks
 */
router.post('/', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  } else {
    new Track(null, req.body.trackNumber, req.body.name, req.body.lyric).save().then(track => {
      res.status(200).send(new Response.Data(track));
    });
  }
});

/**
 * @api {put} /tracks/:id Update specific track info.
 * @apiName UpdateTrack
 * @apiGroup Tracks
 *
 * @apiParam {String} :id Album's id.
 * @apiParam {String} [name] Track's name.
 * @apiParam {String} [trackNumber] Sequence number of album.
 * @apiParam {String} [lyric] Track's lyric.
 *
 * @apiSuccess {Object} data Collection of track.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/tracks/:id
 */
router.put('/:id(\\w{24})', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  } else {
    Track.getTrack(req.params.id).then(track => {
      if (!track) {
        throw {
          'code': 400,
          'response': new Response.Error(new Err.ResourceNotFound(['track not found']))
        };
      }

      track.name = req.body.name;
      track.lyric = req.body.lyric;
      track.trackNumber = req.body.trackNumber;
      return track.save();
    }).then(track => {
      res.send(new Response.Data(track));
    }).catch(ex => {
      res.status(ex.code)
        .send(ex.response);
    });
  }
});

/**
 * @api {delete} /tracks/:id Delete specific track.
 * @apiName DeleteTrack
 * @apiGroup Tracks
 *
 * @apiParam {String} :id Track's id.
 *
 * @apiSuccess {Boolean} data Result of track delete.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/tracks/:id
 */
router.delete('/:id(\\w{24})', (req, res) => {
  Track.getTrack(req.params.id).then(track => {
    if (!track) {
      res.status(400)
        .send(new Response.Error(new Err.InvalidParam(['track not found'])));
    } else {
      Track.deleteTrack(req.params.id).then(result => {
        res.send(new Response.Data(result));
      });
    }
  });
});


router.get('*', (req, res) => {
  res.status(404).send(new Response.Error(new Err.ResourceNotFound()));
});

module.exports = router;
