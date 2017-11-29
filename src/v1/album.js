const router = require('express').Router();

const Response = require('../objects/response');
const Err = require('../objects/error');
const Album = require('../modules/album');
const Artist = require('../modules/artist');
const Track = require('../modules/track');
const _ = require('lodash');

/**
 * @api {get} /albums Get page of albums.
 * @apiName GetAlbums
 * @apiGroup Albums
 *
 * @apiParam {Number} [index=0] index Index of pagment.
 * @apiParam {Number} [offset=50] offset Size of pagment.
 *
 * @apiSuccess {Object} data Collection Page of albums.
 * @apiSuccess {String} type Collection.
 * @apiSuccess {Integer} index Index of Page.
 * @apiSuccess {Integer} offset Offset.
 * @apiSuccess {Integer} total Row count of data.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums
 */
router.get('/', (req, res) => {
  const index = req.query.index ? parseInt(req.query.index) : 0;
  const offset = req.query.offset ? parseInt(req.query.offset) : 50;

  Album.getAlbums(index, offset).then(page => {
    res.status(200).send(new Response.Collection(page.data, page.index, page.offset, page.total));
  });
});

/**
 * @api {get} /albums/:id Get album matching by given id.
 * @apiName GetAlbum
 * @apiGroup Albums
 *
 * @apiParam {String} :id Album's id
 *
 * @apiSuccess {Object} data Collection Page of album.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums/:id
 */
router.get('/:id(\\w{24})', (req, res) => {
  Album.getAlbum(req.params.id)
    .then(album => {
      res.status(200).send(new Response.Data(album));
    });
});

/**
 * @api {post} /albums Create new album.
 * @apiName PostAlbum
 * @apiGroup Albums
 *
 * @apiParam {String} name Album's name.
 *
 * @apiSuccess {Object} data Collection of album.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums
 */
router.post('/', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  } else {
    new Album(req.body.name).save().then(album => {
      res.status(200).send(new Response.Data(album));
    });
  }
});

/**
 * @api {delete} /albums/:id Delete specific album.
 * @apiName DeleteAlbum
 * @apiGroup Albums
 *
 * @apiParam {String} :id Album's id.
 *
 * @apiSuccess {Boolean} data Result of album delete.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums/:id
 */
router.delete('/:id(\\w{24})', (req, res) => {
  Album.getAlbum(req.params.id).then(album => {
    if (!album) {
      throw { 'code': 200, 'response': new Response.Data(true) };
    }
    return album;
  }).then(() => {
    Album.deleteAlbum(req.params.id).then(result => {
      res.send(new Response.Data(result));
    }).catch(err => {
      throw { 'code': 400, 'response': Response.Error(err) };
    });
  }).catch(ex => {
    res.status(ex.code)
      .send(ex.response);
  });
});

/**
 * @api {put} /albums/:id Update specific album info.
 * @apiName UpdateAlbum
 * @apiGroup Albums
 *
 * @apiParam {String} :id Album's id.
 * @apiParam {String} [name] Album's name.
 * @apiParam {String} [images] Album's images.
 *
 * @apiSuccess {Object} data Collection of album.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums/:id
 */
router.put('/:id(\\w{24})', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  } else {
    Album.getAlbum(req.params.id).then(album => {
      if (!album) {
        return res.status(400)
          .send(new Response.Error(new Err.ResourceNotFound(['album not found'])));
      } else {
        album.name = req.body.name;
        album.images = req.body.images;
        album.save().then(() => {
          res.send(new Response.Data(album));
        });
      }
    });
  }
});

/**
 * @api {post} /albums/:id/artist Create relationship between specific album and artist.
 * @apiName AlbumSetArtist
 * @apiGroup Albums
 *
 * @apiParam {String} :id Album's id.
 * @apiParam {String} artist Artist's id.
 *
 * @apiSuccess {Object} data Collection of album.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums/:id/artist
 */
router.post('/:id(\\w{24})/artist', (req, res) => {
  var artist = null;
  if (!req.body.artist || req.body.artist == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['artist is required'])));
  } else {
    Artist.getArtist(req.body.artist).then(_artist => {
      if (!_artist) {
        throw {
          'code': 400,
          'response': new Response.Error(new Err.ResourceNotFound(['artist not found']))
        };
      }
      artist = _artist;
    }).then(() => {
      return Album.getAlbum(req.params.id).then(album => {
        if (!album) {
          throw {
            'code': 400,
            'response': new Response.Error(new Err.ResourceNotFound(['album not found']))
          };
        }
        return album;
      });
    }).then(album => {
      if (album.artist) {
        throw {
          'code': 400,
          'response': new Response.Error(new Err.IllegalOperationError(['artist already set']))
        };
      }
      return album;
    }).then(album => {
      artist.albums.push(album.toSimple());
      album.artist = artist.toSimple();
      return artist.save().then(() => {
        return album;
      });
    }).then(album => {
      album.save().then(album => {
        res.send(new Response.Data(album));
      });
    }).catch(ex => {
      res.status(ex.code)
        .send(ex.response);
    });
  }
});

/**
 * @api {delete} /albums/:id/artist Remove relationship between specific album and artist.
 * @apiName AlbumRemoveArtist
 * @apiGroup Albums
 *
 * @apiParam {String} :id Album's id.
 *
 * @apiSuccess {Object} data Collection of album.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums/:id/artist
 */
router.delete('/:id(\\w{24})/artist', (req, res) => {
  Album.getAlbum(req.params.id).then(album => {
    if (!album) {
      throw {
        'code': 400,
        'response': new Response.Error(new Err.ResourceNotFound(['album not found']))
      };
    }
    return album;
  }).then(album => {
    if (album.artist) {
      return Artist.getArtist(album.artist._id).then(artist => {
        _.remove(artist.albums, (_album) => {
          return _album._id == album._id;
        });
        return artist.save().then(() => {
          return album;
        });
      });
    }
    return album;
  }).then(album => {
    album.artist = null;
    album.save().then(album => {
      res.send(new Response.Data(album));
    });
  }).catch(ex => {
    res.status(ex.code)
      .send(ex.response);
  });
});

/**
 * @api {put} /albums/:id/artist Update relationship between specific album and artist.
 * @apiName AlbumUpdateArtist
 * @apiGroup Albums
 *
 * @apiParam {String} :id Album's id.
 * @apiParam {String} artist Artist's id.
 *
 * @apiSuccess {Object} data Collection of album.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums/:id/artist
 */
router.put('/:id(\\w{24})/artist', (req, res) => {
  if (!req.body.artist || req.body.artist == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['artist is required'])));
  } else {
    Album.getAlbum(req.params.id).then(album => {
      if (!album) {
        throw {
          'code': 400,
          'response': new Response.Error(new Err.ResourceNotFound(['album not found']))
        };
      }
      return album;
    }).then(album => {
      return Artist.getArtist(req.body.artist).then(artist => {
        if (!artist) {
          throw {
            'code': 400,
            'response': new Response.Error(new Err.ResourceNotFound(['artist not found']))
          };
        }
        return artist;
      }).then(artist => {
        if (album.artist) {
          Artist.getArtist(album.artist._id).then(oriArtist => {
            _.remove(oriArtist.albums, (_album) => {
              return _album._id == album._id;
            });
            return oriArtist.save().then(() => {
              return artist;
            });
          });
        }
        return artist;
      }).then(artist => {
        album.artist = artist.toSimple();
        artist.albums.push(album.toSimple());
        return artist.save().then(() => {
          return album;
        });
      });
    }).then(album => {
      album.save().then(album => {
        res.send(new Response.Data(album));
      });
    }).catch(ex => {
      res.status(ex.code)
        .send(ex.response);
    });
  }
});

/**
 * @api {delete} /albums/:albumId/tracks/:trackId Remove relationship between specific album and track.
 * @apiName AlbumSetTrack
 * @apiGroup Albums
 *
 * @apiParam {String} :albumId Album's id.
 * @apiParam {String} :trackId Track's id.
 *
 * @apiSuccess {Object} data Collection of album.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums/:albumId/tracks/:trackId
 */
router.delete('/:albumId(\\w{24})/tracks/:trackId(\\w{24})', (req, res) => {
  Album.getAlbum(req.params.albumId).then(album => {
    if (!album) {
      throw {
        'code': 400,
        'response': new Response.Error(new Err.ResourceNotFound(['album not found']))
      };
    }
    return album;
  }).then(album => {
    return Track.getTrack(req.params.trackId).then(track => {
      if (!track) {
        throw {
          'code': 400,
          'response': new Response.Error(new Err.ResourceNotFound(['track not found']))
        };
      }

      track.album = null;
      _.remove(album.tracks, o => {
        return o._id == track._id.toHexString();
      });
      return track.save().then(() => {
        return album;
      });
    });
  }).then(album => {
    album.save().then((album) => {
      res.send(new Response.Data(album));
    });
  }).catch(ex => {
    res.status(ex.code)
      .send(ex.response);
  });
});

/**
 * @api {post} /albums/:id/tracks Create relationship between specific album and multiple tracks.
 * @apiName AlbumSetTracks
 * @apiGroup Albums
 *
 * @apiParam {String} :id Album's id.
 * @apiParam {Array} tracks Array of track's id.
 *
 * @apiSuccess {Object} data Collection of album.
 *
 * @apiSampleRequest http://localhost:3000/api/v1/albums/:id/tracks
 */
router.post('/:id(\\w{24})/tracks', (req, res) => {
  if (!req.body.tracks || !req.body.tracks.length > 0) {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['tracks is required'])));
  } else {
    Album.getAlbum(req.params.id).then(album => {
      if (!album) {
        throw {
          'code': 400,
          'response': new Response.Error(new Err.ResourceNotFound(['album not found']))
        };
      }
      return album;
    }).then(album => {
      return Track.getTracksByIds(req.body.tracks).then(tracks => {
        tracks.forEach(_track => {
          album.tracks.push(_track.toSimple());
          _track.album = album.toSimple();
          return _track.save();
        });
        return album;
      });
    }).then(album => {
      album.save().then(() => {
        res.send(new Response.Data(album));
      });
    }).catch(ex => {
      res.status(ex.code)
        .send(ex.response);
    });
  }
});

router.get('*', (req, res) => {
  res.status(404).send(new Response.Error(new Err.ResourceNotFound()));
});

module.exports = router;
