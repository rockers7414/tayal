const assert = require('assert');
const should = require('should');
const request = require('supertest');

const app = require('../src/server.js')
const Album = require('../src/modules/album')
const Artist = require('../src/modules/artist')

const Database = require('../src/lib/database')


describe('Album Test', () => {

  var album = null;

  before(() => {
    return Database.getConnection().then(conn => {
      console.log('establish database connection success.');
    });
  });

  after(function() {
    app.close(() => {
      Database.close();
    });
  });

  beforeEach(() => {
    return new Artist('Abner', [], null).save().then(artist => {
      return new Album('Perfect Strangers', artist.toSimple(), [], null).save().then(_album => {
        album = _album;
        return Artist.getArtist(artist._id).then(artist => {
          artist.albums.push(_album.toSimple());
          return artist.save();
        });
      });
    });
  });

  afterEach(() => {
    var artistId = album.artist._id;
    return Album.deleteAlbum(album._id).then(() => {
      return Artist.deleteArtist(artistId);
    });
  });

  describe('#find(id)', () => {
    it('response with matching records', () => {
      return Album.getAlbum(album._id).then(_album => {
        assert.equal(_album._id, album._id);
      });
    });
  });

  describe('#queryAlbum', () => {
    it('should respond with JSON array', (done) => {
      request(app)
        .get('/api/v1/albums/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          }

          res.body.data.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('#deleteAlbum', () => {
    it('should respond true while delete album', (done) => {
      request(app)
        .delete('/api/v1/albums/' + album._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            console.log(err);
            return done(err);
          }

          res.body.data.should.equal(true);
          done();
        });
    });
  });

  // describe('#AlbumUpdateArtist', () => {
      //   it('should respond the collection of album with artist\'s toSimple()', (done) => {

      //     // new Artist('Abner', [], null).save()

      //     request(app)
      //       .post('/api/v1/albums/' + album._id + '/artist')
      //       .send({
      //         "artist": "XXXX"
      //       })
      //       .expect(200)
      //       .expect('Content-Type', /json/)
      //       .end((err, res) => {
      //         res.body.


      //         done();
      //       });
      //   });
      // });

});
