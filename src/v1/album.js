const router = require('express').Router();

const Response = require('../objects/response');
const Err = require('../objects/error');

const Album = require('../modules/album');
const Artist = require('../modules/artist');
// const JsonUtils = require('../lib/json-utils');
const _ = require('lodash');


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

router.put('/:id(\\w{24})/artist', (req, res) => {
  Album.getAlbum(req.params.id).then(album => {
    if (req.body.artist && req.body.artist != '') {

      let promiseList = [];

      if (!album.artist || (album.artist && !album.artist._id.equals(new ObjectID(req.body.artist)))) {
        promiseList.push(newOner(req.body.artist, album));
      }

      if (album.artist && !album.artist._id.equals(new ObjectID(req.body.artist))) {
        promiseList.push(removeAlbumFromArtist(req.body.artist, album));
      }

      Promise.all(promiseList).then(result => {
        _res(album);
      });
    } else {
      if (album.artist) {
        removeAlbumFromArtist(album.artist._id, album).then(artist => {
          _res(album);
        });
      }
    }
  });

  function newOner(artistId, album) {
    return new Promise((resolve, reject) => {
      Artist.getArtist(artistId).then(artist => {
        artist.albums.push(album.toSimple());
        artist.save().then(result => {
          album.artist = artist.toSimple();
          resolve(album);
        });
      });
    });
  }

  function _res(album) {
    album.save().then(result => {
      res.status(200).send(new Response.Data(album));
    });
  }
});

router.post('/:id(\\w{24}/tracks)' (req, res) => {
  // TODO
});

router.delete('/:albumId(\\w{24}/tracks/:trackId)', (req, res) => {
  // TODO
});

router.put('/:id(\\w{24})', (req, res) => {
  if (!req.body.name || req.body.name == '') {
    res.status(400)
      .send(new Response.Error(new Err.InvalidParam(['name is required'])));
  }

  Album.getAlbum(req.params.id).then(album => {
    album.name = req.body.name;
    album.images = req.body.images;
    album.save().then(result => {
      res.send(new Response.Data(album));
    });
  });
});

router.delete('/:id(\\w{24})', (req, res) => {
  Album.getAlbum(req.params.id).then(album => {
    if (album)
      removeAlbumFromArtist(album.artist._id, album);
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

function removeAlbumFromArtist(artistId, album) {
  return new Promise((resolve, reject) => {
    Artist.getArtist(artistId).then(artist => {
      _.remove(artist.albums, (_album) => {
        return _album._id.equals(album._id);
      });
      artist.save().then(result => {
        album.artist = undefined;
        resolve(artist);
      });
    });
  });
}

module.exports = router;


console.log('!!!');
var users = [
  { 'age': 36, 'active': true },
  { 'age': 40, 'active': false },
  { 'age': 1, 'active': true }
];

var result = _.findKey(users, (o) => { return o.age == 1; });
if (!result)
  console.log('!!dds!');
console.log(result);