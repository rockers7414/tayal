'use strict';
const Database = require('../lib/database');

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
          collection.insertOne(this, (err, res) => {
            if (err) {
              reject(err);
            }

            if (!res.insertedCount) {
              resolve(null);
            }

            resolve(this);
          });
        });
      });
  }

  static getArtists() {
    return [];
  }

  static getArtist(id) {
    return id;
  }
}

module.exports = Artist;
