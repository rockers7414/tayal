const router = require('express').Router();

const Response = require('../objects/response');
const Err = require('../objects/error');
const _ = require('lodash');

const Track = require('../modules/track');
const Album = require('../modules/album');

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
    new Track(null, null, req.body.name, null).save().then(track => {
      res.status(200).send(new Response.Data(track));
    });
  }
});

/**
 * @api {put} /tracks/:id Update specify track info.
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
        return res.status(400)
          .send(new Response.Error(new Err.ResourceNotFound(['track not found'])));
      }

      track.name = req.body.name;
      track.lyric = req.body.lyric;

      var promiseList = [];
      if (track.album) {
        if (!req.body.trackNumber || req.body.trackNumber == '') {
          return res.status(400)
            .send(new Response.Error(new Err.InvalidParam(['trackNumber is required'])));
        }

        promiseList.push(
          Album.getAlbum(track.album._id).then(album => {
            const targetTrackNumber = _.find(album.tracks, (o) => {
              return o.trackNumber == req.body.trackNumber;
            });

            if (targetTrackNumber) {
              return res.status(400)
                .send(new Response.Error(new Err.IllegalOperationError(['track number duplicate'])));
            } else {
              _.remove(album.tracks, (o) => {
                return o.track._id.toHexString() == req.params.id;
              });
              album.tracks.push(track.toSimple());
              return album.save();
            }
          })
        );
      }
      track.trackNumber = req.body.trackNumber;
      promiseList.push(track.save());

      Promise.all(promiseList).then(() => {
        res.status(200).send(new Response.Data(track));
      });
    });
  }
});

/**
 * @api {delete} /tracks/:id Delete specify track.
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
      var promiseList = [];

      if (track.album) {
        promiseList.push(
          Album.getAlbum(track.album._id).then(album => {
            _.remove(album.tracks, (o) => {
              return o._id.equals(track._id);
            });
            return album.save();
          })
        );
      }

      promiseList.push(
        Track.deleteTrack(req.params.id)
      );

      Promise.all(promiseList).then(() => {
        res.send(new Response.Data(true));
      }).catch(err => {
        if (err instanceof Err.UnremovableError) {
          res.status(400);
        }
        res.send(new Response.Error(err));
      });
    }
  });
});


router.get('*', (req, res) => {
  res.status(404).send(new Response.Error(new Err.ResourceNotFound()));
});

module.exports = router;
