const assert = require('assert');
const should = require('should');
const request = require('supertest');

const app = require('../src/server.js')
const Track = require('../src/modules/Track')

const Database = require('../src/lib/database')

describe('Track Test', () => {

  var track = null;

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
    return new Track(null, "1", "Perfect Strangers", null).save().then(_track => {
      track = _track;
    });
  });

  afterEach(() => {
    return Track.deleteTrack(track._id);
  });

  describe('#getAllTracks()', () => {
    it('should respond with JSON array', (done) => {
      request(app)
        .get('/api/v1/tracks/')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.data.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('#getTracks(id)', () => {
    it('response with matching records', (done) => {
      request(app)
        .get('/api/v1/tracks/' + track._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          res.body.data.should.be.instanceof(Object);
          res.body.data._id.should.equal(track._id);
          res.body.data.trackNumber.should.equal(track.trackNumber);
          res.body.data.name.should.equal("Perfect Strangers");
          (res.body.data.lyric == null).should.be.ok();
          done();
        });
    });
  });


});