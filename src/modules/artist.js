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

  static getArtists(index = 0, offset = 50) {
    return Database.getCollection('artists')
      .then(collection => {
        return new Promise((resolve, reject) => {
          collection.find().skip(index).limit(offset).toArray((err, data) => {
            if (err) {
              reject(err);
            }
            resolve(new Page(index, offset, data, data.length));
          });
        });
      });
  }

  static getArtist(id) {
    return Database.getCollection('artists')
      .then(collection => collection.findOne({_id: new ObjectID(id)}));
  }
}

module.exports = Artist;
