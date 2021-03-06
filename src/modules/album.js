'use strict';
const Database = require('../lib/database');
const ObjectID = require('mongodb').ObjectID;
const Page = require('../objects/page');
const Error = require('../objects/error');
const Artist = require('./artist');
const _ = require('lodash');

class Album {
  static getAlbums(index = 0, offset = 50) {
    return Database.getCollection('albums')
      .then(collection => {
        return new Promise((resolve, reject) => {
          collection.count().then(total => {
            collection.find().skip(index).limit(offset).toArray((err, data) => {
              if (err) {
                reject(err);
              }

              const albums = data.map(data => {
                const album = new Album(data.name, data.artist, data.tracks, data.images);
                album._id = data._id;
                return album;
              });

              resolve(new Page(index, offset, albums, total));
            });
          });
        });
      });
  }

  /**
   * Using keyword to search on the content of the field with a "text index", so we must create index first, otherwise not work.
   */
  static getAlbumsByKeyword(keyword) {
    return Database.getCollection('albums')
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
            const album = new Album(data.name, data.artist, data.tracks, data.images);
            album._id = data._id;
            result.push(album);
          });
          return result;
        });
      });
  }

  static getAlbum(id) {
    return Database.getCollection('albums')
      .then(collection => {
        return collection.findOne({ _id: new ObjectID(id) });
      }).then(data => {
        if (data) {
          const album = new Album(data.name, data.artist, data.tracks, data.images);
          album._id = data._id;
          return album;
        }
        return null;
      });
  }

  static deleteAlbum(id) {
    return Album.getAlbum(id).then(album => {
      if (album && album.tracks.lengh > 0) {
        throw new Error.UnremoveableError('has related tracks');
      }
      return album;
    }).then(album => {
      if (album && album.artist) {
        return Artist.getArtist(album.artist._id).then(artist => {
          _.remove(artist.albums, (o) => {
            return o._id == id;
          });
          return artist.save().then(() => {
            return album;
          });
        });
      }
      return album;
    }).then(() => {
      return Database.getCollection('albums')
        .then(collection => {
          return collection.deleteOne({ _id: new ObjectID(id) });
        }).then(result => {
          return result.deletedCount == 1;
        });
    });
  }

  constructor(name, artist, tracks = [], images = []) {
    this.name = name;
    this.artist = artist;
    this.tracks = tracks;
    this.images = images;
  }

  save() {
    return Database.getCollection('albums')
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
      name: this.name
    };
  }
}

module.exports = Album;
