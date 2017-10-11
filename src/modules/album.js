'use strict';
const Database = require('../lib/database');
const ObjectID = require('mongodb').ObjectID;

class Album {
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
          collection.updateOne({_id: new ObjectID(this._id)},
            this,
            {upsert:true},
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
