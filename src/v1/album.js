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

    if (!req.body.artist || req.body.artist != '') {
        Artist.getArtist(req.body.artist)
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
        if (req.body.artist && req.body.artist != '') {
            Artist.getArtist(req.body.artist)
                .then(artist => {
                    if (artist)
                        album.artist = artist.toSimple();
                });
        }
        album.tracks = req.body.album || [];
        album.images = req.body.images;
        return album.save();
    }).then(album => {
        res.status(200).send(new Response.Data(album));
    });
});

router.delete('/:id(\\w{24})', (req, res) => {
    Album.deleteAlbum(req.params.id)
        .then(result => {
            result => res.send(new Response.Data(result));
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


module.exports = router;