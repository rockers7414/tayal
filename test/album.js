const assert = require('assert');
const should = require('should');
const request = require('supertest');

const app = require('../src/server.js')
const Album = require('../src/modules/album')

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
    return new Album('Perfect Strangers', null, [], null).save().then(_album => {
      album = _album;
    });
  });

  afterEach(() => {
    return Album.deleteAlbum(album._id);
  });

  describe('#find(id)', () => {
    it('response with matching records', () => {
      return Album.getAlbum(album._id).then(_album => {
        assert.equal(_album._id, album._id);
      });
    });
  });

  describe('#queryAlbum()', () => {
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

});