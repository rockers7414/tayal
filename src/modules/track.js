'use strict';
const Database = require('../lib/database');
const ObjectID = require('mongodb').ObjectID;
const Page = require('../objects/page');
const Album = require('./album');
const _ = require('lodash');

class Track {

  static getTracks(index = 0, offset = 50) {
    return Database.getCollection('tracks')
      .then(collection => {
        return new Promise((resolve, reject) => {
          collection.count().then(total => {
            collection.find().skip(index).limit(offset).toArray((err, data) => {
              if (err) {
                reject(err);
              }

              const tracks = data.map(data => {
                const track = new Track(data.album, data.trackNumber, data.name, data.lyric, data.link);
                track._id = data._id;
                return track;
              });

              resolve(new Page(index, offset, tracks, total));
            });
          });
        });
      });
  }

  static getTrack(id) {
    return Database.getCollection('tracks')
      .then(collection => {
        return collection.findOne({ _id: new ObjectID(id) });
      }).then(data => {
        if (!data)
          return null;
        const track = new Track(data.album, data.trackNumber, data.name, data.lyric, data.link);
        track._id = data._id;
        return track;
      });
  }

  /**
   * Using keyword to search on the content of the field with a "text index", so we must create index first, otherwise not work.
   */
  static getTracksByKeyword(keyword) {
    return Database.getCollection('tracks')
      .then(collection => {
        return collection.find({
          name: {
            $regex: new RegExp(keyword),
            $options: 'is'
          }
        }).limit(10);
      }).then(cursor => {
        return cursor.toArray().then(dataArray => {
          var result = [];
          dataArray.forEach(data => {
            var track = new Track(data.album, data.trackNumber, data.name, data.lyric, data.link);
            track._id = data._id;
            result.push(track);
          });
          return result;
        });
      });
  }

  static getTracksByIds(idArray) {
    return Database.getCollection('tracks')
      .then(collection => {
        /** refactor idArray */
        var objIds = [];
        idArray.forEach(id => {
          objIds.push(new ObjectID(id));
        });
        return collection.find({ '_id': { $in: objIds } });
      }).then(cursor => {
        return cursor.toArray().then(dataArray => {
          var result = [];
          dataArray.forEach(data => {
            var track = new Track(data.album, data.trackNumber, data.name, data.lyric, data.link);
            track._id = data._id;
            result.push(track);
          });
          return result;
        });
      });
  }

  static deleteTrack(id) {
    return Track.getTrack(id).then(track => {
      if (track.album) {
        Album.getAlbum(track.album._id).then(album => {
          _.remove(album.tracks, o => {
            return o._id == track._id.toHexString();
          });
          return album.save();
        });
      }
    }).then(() => {
      return Database.getCollection('tracks')
        .then(collection => {
          return collection.deleteOne({ _id: new ObjectID(id) });
        }).then(result => {
          return result.deletedCount == 1;
        });
    });
  }

  constructor(album, trackNumber, name, lyric, link) {
    this.album = album;
    this.trackNumber = trackNumber;
    this.name = name;
    this.lyric = lyric;
    this.link = link;
  }

  save() {
    return Database.getCollection('tracks')
      .then(collection => {
        return new Promise((resolve, reject) => {
          collection.updateOne({ _id: new ObjectID(this._id) },
            this, { upsert: true },
            (err, res) => {
              if (err) {
                reject(err);
              }

              if (!res.matchedCount && !res.upsertedCount) {
                resolve(null);
              }

              if (!this._id) {
                this._id = res.result.upserted[0]._id.toString();
              }

              resolve(this);
            });
        });
      });
  }

  toSimple() {
    return {
      _id: this._id,
      trackNumber: this.trackNumber,
      name: this.name
    };
  }
}

module.exports = Track;
