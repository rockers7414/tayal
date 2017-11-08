const router = require('express').Router();

const Response = require('../objects/response');
const Err = require('../objects/error');
const ObjectID = require('mongodb').ObjectID;

const Album = require('../modules/album');
const Artist = require('../modules/artist');
const Track = require('../modules/track');
const _ = require('lodash');

router.get('/', (req, res) => {
  const index = req.query.index ? parseInt(req.query.index) : 0;
  const offset = req.query.offset ? parseInt(req.query.offset) : 50;

  Album.getAlbums(index, offset).then(page => {
    res.status(200).send(new Response.Collection(page.data, page.index, page.offset, page.total));
  });
});

router.get('/:id(\\w{24})', (req, res) => {
  Album.getAlbum(req.params.id)
    .then(album => {
      res.status(200).send(new Response.Data(album));
    });
});

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

router.delete('/:id(\\w{24})', (req, res) => {
  /** check constraint */
  Album.getAlbum(req.params.id).then(album => {
    if (!album) {
      res.status(400)
        .send(new Response.Error(new Err.InvalidParam(['album not found'])));
    } else if (album.tracks && album.tracks.length > 0) {
      res.status(400)
        .send(new Response.Error((new Err.UnremovableError('has related tracks'))));
    } else {
      var promiseList = [];

      if (album.artist) {
        promiseList.push(
          Artist.getArtist(album.artist._id.toHexString()).then(artist => {
            if (artist.albums) {
              _.remove(artist.albums, (_album) => {
                return _album._id.equals(album._id);
              });
              return artist.save();
            }
          }).catch(err => {
            console.log(err);
          })
        );
      }

      promiseList.push(
        Album.deleteAlbum(req.params.id)
      );

      Promise.all(promiseList).then(result => {
        res.send(new Response.Data(result));
      }).catch(err => {
        if (err instanceof Err.UnremovableError) {
          res.status(400);
        }
        res.send(new Response.Error(err));
      });
    }
  });
});

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
        album.save().then(result => {
          res.send(new Response.Data(album));
        });
      }
    });
  }
});

router.post('/:id(\\w{24})/artist', (req, res) => {
  if (!req.body.artist || req.body.artist == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['artist is required'])));
  } else {
    Artist.getArtist(req.body.artist).then(artist => {
      if (!artist) {
        res.status(400)
          .send(new Response.Error(new Err.ResourceNotFound(['artist not found'])));
      } else {
        Album.getAlbum(req.params.id).then(album => {
          if (album.artist) {
            return res.status(400)
              .send(new Response.Error(new Err.IllegalOperationError(['artist already set'])));
          } else {
            artist.albums.push(album.toSimple());
            album.artist = artist.toSimple();
            Promise.all([artist.save(), album.save()]).then(result => {
              res.send(new Response.Data(album));
            });
          }
        });
      }
    });
  }
});

router.delete('/:id(\\w{24})/artist', (req, res) => {
  Album.getAlbum(req.params.id).then(album => {
    if (!album) {
      res.status(400)
        .send(new Response.Error(new Err.ResourceNotFound(['album not found'])));
    } else {
      Artist.getArtist(album.artist._id.toHexString()).then(artist => {
        _.remove(artist.albums, (_album) => {
          return _album._id.equals(album._id);
        });
        album.artist = null;
        Promise.all([artist.save(), album.save()]).then(result => {
          res.send(new Response.Data(album));
        });
      });
    }
  });
});

router.put('/:id(\\w{24})/artist', (req, res) => {
  if (!req.body.artist || req.body.artist == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['artist is required'])));
  } else {
    Album.getAlbum(req.params.id).then(album => {
      if (!album) {
        res.status(400)
          .send(new Response.Error(new Err.ResourceNotFound(['album not found'])));
      } else {
        var promiseList = [];
        /** Remove album from ori artist. */
        if (album.artist) {
          promiseList.push(Artist.getArtist(album.artist._id.toHexString()).then(artist => {
            _.remove(artist.albums, (_album) => {
              return _album._id.equals(album._id);
            });
            return artist.save();
          }));
        }

        /** Add album to new artist */
        promiseList.push(Artist.getArtist(req.body.artist).then(artist => {
          var _album = _.find(artist.albums, (o) => {
            return o._id.equals(album._id);
          });
          if (!_album)
            artist.albums.push(album.toSimple());
          album.artist = artist.toSimple();
          return artist.save();
        }));

        promiseList.push(album.save());
        Promise.all(promiseList).then(result => {
          res.send(new Response.Data(album));
        });
      }
    });
  }
});

router.post('/:id(\\w{24})/tracks', (req, res) => {
  Album.getAlbum(req.params.id).then(album => {
    if (!album) {
      res.status(400)
        .send(new Response.Error(new Err.ResourceNotFound(['album not found'])));
    } else {
      if (!req.body.tracks || !req.body.tracks.length > 0) {
        res.status(400)
          .send(new Response.Error(new Err.InvalidParam(['tracks is required'])));
      } else {

        /** check track duplicate */
        var isDuplicate = false;
        req.body.tracks.forEach(newTrack => {
          var _isDuplicate = _.find(album.tracks, (o) => {
            return o._id.equals(new ObjectID(newTrack.track));
          });
          if (_isDuplicate) {
            isDuplicate = true;
            return false;
          }
        });
        if (isDuplicate) {
          return res.status(400)
            .send(new Response.Error(new Err.IllegalOperationError(['track duplicate'])));
        }

        /** check track number duplicate */
        var isNumberDuplicate = false;

        req.body.tracks.forEach(newTrack => {
          var _isDuplicate = _.find(req.body.tracks, (o) => {
            return o.trackNumber == newTrack.trackNumber && o.track != newTrack.track;
          });
          if (_isDuplicate) {
            isNumberDuplicate = true;
            return false;
          }
        });
        if (isNumberDuplicate) {
          return res.status(400)
            .send(new Response.Error(new Err.IllegalOperationError(['track number duplicate'])));
        }

        /** check track number duplicate with existing data */
        var isNumberExisting = false;
        req.body.tracks.forEach(newTrack => {
          var _isDuplicate = _.find(album.tracks, (o) => {
            return o.trackNumber == newTrack.trackNumber;
          });
          if (_isDuplicate) {
            isNumberExisting = true;
            return false;
          }
        });
        if (isNumberExisting) {
          return res.status(400)
            .send(new Response.Error(new Err.IllegalOperationError(['track number exists'])));
        }

        /** check album was already set */
        var promiseList = [];
        req.body.tracks.forEach(newTrack => {
            
        });

        /** check track is exist */
        // TODO

        /** save tracks, album */
        // TODO

        // var promiseList = [];
        // req.body.tracks.forEach(newTrack => {
        //     console.log(newTrack);
        //   if (!newTrack.trackNumber || newTrack.trackNumber == '') {
        //     res.status(400)
        //       .send(new Response.Error(new Err.InvalidParam(['track number is required(' + newTrack._id + ')'])));
        //   } else {
        //     Track.getTrack(newTrack.track).then(track => {  
        //       if (!track) {
        //         return res.status(400)
        //           .send(new Response.Error(new Err.ResourceNotFound(['track not found'])));
        //       } else if (track.album) {
        //           console.log('222');
        //         return res.status(400)
        //           .send(new Response.Error(new Err.IllegalOperationError(['album already set'])));
        //       } else {
        //         var isSeqDuplicate = _.find(album.tracks, (o) => {
        //           return o.trackNumber == newTrack.trackNumber;
        //         });
        //         if (isSeqDuplicate) {
        //           return res.status(400)
        //             .send(new Response.Error(new Err.IllegalOperationError(['track number duplicate'])));
        //         } else {
        //           track.album = album.toSimple();
        //           var _track = _.find(album.tracks, (o) => {
        //             return o._id.equals(track._id);
        //           });

        //           if (!_track) {
        //             album.tracks.push(track.toSimple());
        //             promiseList.push(track.save());
        //           }
        //         }
        //       }
        //     });
        //   }
        // });

        // promiseList.push(album.save());
        // Promise.all(promiseList).then(result => {
        //   res.send(new Response.Data(album));
        // });



      }
    }
  });
});

router.post('/:id(\\w{24})/track', (req, res) => {
  Album.getAlbum(req.params.id).then(album => {
    if (!album) {
      res.status(400)
        .send(new Response.Error(new Err.ResourceNotFound(['album not found'])));
    } else {
      if (!req.body.track || req.body.track == '') {
        res.status(400)
          .send(new Response.Error(new Err.InvalidParam(['track is required'])));
      } else if (!req.body.trackNumber || req.body.trackNumber == '') {
        res.status(400)
          .send(new Response.Error(new Err.InvalidParam(['track number is required'])));
      } else {
        Track.getTrack(req.body.track).then(track => {
          if (!track) {
            res.status(400)
              .send(new Response.Error(new Err.ResourceNotFound(['track not found'])));
          } else if (track.album) {
            res.status(400)
              .send(new Response.Error(new Err.IllegalOperationError(['album already set'])));
          } else {
            var isSeqDuplicate = _.find(album.tracks, (o) => {
              return o.trackNumber == req.body.trackNumber;
            });
            if (isSeqDuplicate) {
              return res.status(400)
                .send(new Response.Error(new Err.IllegalOperationError(['track number duplicate'])));
            } else {
              track.album = album.toSimple();
              track.trackNumber = req.body.trackNumber;
              var _track = _.find(album.tracks, (o) => {
                return o._id.equals(track._id);
              });
              if (!_track) {
                album.tracks.push(track.toSimple());
              }

              Promise.all([track.save(), album.save()]).then(result => {
                res.send(new Response.Data(album));
              });
            }
          }
        });
      }
    }
  });
});

router.delete('/:albumId(\\w{24}/tracks/:trackId)', (req, res) => {
  Album.getAlbum(req.params.albumId).then(album => {
    if (!album) {
      res.status(400)
        .send(new Response.Error(new Err.ResourceNotFound(['album not found'])));
    } else {
      Track.getTrack(req.params.trackId).then(track => {
        if (track) {
          track.album = null;
        }

        _.remove(album.tracks, (o) => {
          return o._id.equals(track._id);
        });

        Promise.all([album.save(), track.save()]).then(result => {
          res.send(new Response.Data(album));
        });
      });
    }
  });
});

router.get('*', (req, res) => {
  res.status(404).send(new Response.Error(new Err.ResourceNotFound()));
});

module.exports = router;