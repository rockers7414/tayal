const router = require('express').Router();

const Response = require('../objects/response');
const Err = require('../objects/error');

const Album = require('../modules/album');
const Artist = require('../modules/artist');

router.get('/', (req, res) => {
  const index = req.query.index ? parseInt(req.query.index) : 0;
  const offset = req.query.offset ? parseInt(req.query.offset) : 50;

  Album.getAlbums(index, offset).then(page => {
    res.status(200).send(new Response.Collection(page.data, page.index, page.offset, page.total));
  });
});

router.post('/', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  }

  if (req.body.artist && req.body.artist._id != '') {
    Artist.getArtist(req.body.artist._id)
      .then(artist => {
        new Album(req.body.name, artist.toSimple()).save()
          .then(album => {
            artist.albums.push(album.toSimple());
            artist.save().then(artist => res.status(200).send(new Response.Data(artist)));
          });
      });
  } else {
    new Album(req.body.name).save().then(album => {
      res.status(200).send(new Response.Data(album));
    });
  }
});

router.get('/:id(\\w{24})', (req, res) => {
  Album.getAlbum(req.params.id)
    .then(album => {
      res.status(200).send(new Response.Data(album));
    });
});

router.put('/:id(\\w{24})', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  }

  Album.getAlbum(req.params.id).then(album => {
    album.name = req.body.name;
    album.tracks = req.body.tracks || [];
    album.images = req.body.images;

    if (req.body.artist && req.body.artist != '') {

      if (album.artist && album.artist._id != req.body.artist._id) {
        removeAlbumFromArtist(album.artist._id, album._id);
      }

      Artist.getArtist(req.body.artist._id)
        .then(artist => {
          var isExist = false;
          artist.albums.forEach(obj => {
            if (obj._id.toHexString() == album._id.toHexString()) {
              isExist = true;
              return false;
            }
          });

          if (!isExist) {
            artist.albums.push(album.toSimple());
            artist.save();
          }

          album.artist = artist.toSimple();
          _res(album);
        });
    } else {
      if (album.artist) {
        removeAlbumFromArtist(album.artist._id, album._id);
        album.artist = undefined;
      }
      _res(album);
    }

    function _res(album) {
      album.save().then(result => {
        res.status(200).send(new Response.Data(album));
      });
    }
  });
});

router.delete('/:id(\\w{24})', (req, res) => {
  Album.getAlbum(req.params.id).then(album => {
    if (album)
      removeAlbumFromArtist(album.artist._id, album._id);
  });

  Album.deleteAlbum(req.params.id)
    .then(result => {
      res.send(new Response.Data(result));
    })
    .catch(err => {
      if (err instanceof Err.UnremovableError) {
        res.status(400);
      }
      res.send(new Response.Error(err));
    });
});

router.get('*', (req, res) => {
  res.status(404).send(new Response.Error(new Err.ResourceNotFound()));
});

function removeAlbumFromArtist(artistId, albumId) {
  Artist.getArtist(artistId).then(artist => {
    for (var index = 0; index < artist.albums.length; index++) {
      if (albumId.toHexString() == artist.albums[index]._id.toHexString()) {
        artist.albums.splice(index, 1);
      }
    }
    artist.save();
  });
}

module.exports = router;