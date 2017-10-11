'use strict';
const Database = require('../lib/database');
const ObjectID = require('mongodb').ObjectID;
const Page = require('../objects/page');

class Artist {
  constructor(name, albums = [], images = []) {
    this.name = name;
    this.albums = albums;
    this.images = images;
  }

  save() {
    return Database.getCollection('artists')
      .then(collection => {
        return new Promise((resolve, reject) => {
          collection.updateOne({_id: new ObjectID(this._id)},
            this,
            {upsert: true},
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

  static getArtists(index = 0, offset = 50) {
    return Database.getCollection('artists')
      .then(collection => {
        return new Promise((resolve, reject) => {
          collection.find().skip(index).limit(offset).toArray((err, data) => {
            if (err) {
              reject(err);
            }

            const artists = data.map(data => {
              const artist = new Artist(data.name, data.albums, data.images);
              artist._id = data._id;
              return artist;
            });

            resolve(new Page(index, offset, artists, data.length));
          });
        });
      });
  }

  static getArtist(id) {
    return Database.getCollection('artists')
      .then(collection => collection.findOne({_id: new ObjectID(id)}))
      .then(data => {
        const artist = new Artist(data.name, data.albums, data.images);
        artist._id = data._id;
        return artist;
      });
  }

  static deleteArtist(id) {
    return Database.getCollection('artists')
      .then(collection => collection.deleteOne({_id: new ObjectID(id)}))
      .then(result => result.deletedCount == 1);
  }
}

module.exports = Artist;
