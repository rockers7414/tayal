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

  describe('#AlbumUpdateArtist', () => {
    var tmpAlbum = null;
    var tmpArtist = null;

    before(() => {
      return new Artist('Abner', [], null).save().then(_artist => {
        tmpArtist = _artist;
        return new Album('Perfect Strangers II', null, [], null).save().then(_album => {
          tmpAlbum = _album;
        });
      });
    });

    after(() => {
      return Album.deleteAlbum(tmpAlbum._id).then(() => {
        return Artist.deleteArtist(tmpArtist._id);
      });
    });

    it('should respond album with artist which just post', (done) => {
      request(app)
        .post('/api/v1/albums/' + tmpAlbum._id + '/artist')
        .send({
          "artist": tmpArtist._id
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          res.body.data.name.should.equal(tmpAlbum.name);
          res.body.data.artist._id.should.equal(tmpArtist._id);
          return res;
        })
        .then(res => {
          return Album.getAlbum(res.body.data._id).then(album => {
            album.artist._id.toHexString().should.equal(tmpArtist._id);
            done();
          });
        })
        .catch(err => {
          console.log(err);
          done(err);
        });
    });
  });
});
