'use strict';
const Database = require('../lib/database');
const ObjectID = require('mongodb').ObjectID;
const Page = require('../objects/page');
const Error = require('../objects/error');

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
      if (album.tracks.lengh > 0) {
        throw new Error.UnremoveableError('has related tracks');
      }

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