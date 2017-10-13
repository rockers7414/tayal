'use strict';
const Database = require('../lib/database');
const ObjectID = require('mongodb').ObjectID;
const Page = require('../objects/page');
const Error = require('../objects/error');

class Album {
    static getAlbums(index = 0, offset = 50) {
        return Database.getCollections('albums')
            .then(collection => {
                return new Promise((resolve, reject) => {
                    collection.find().skip(index).limit(offset).toArray((err, data) => {
                        if (err) {
                            reject(err);
                        }

                        const albums = data.map(data => {
                            const album = new Album(data.name, data.artist, data.tracks, data.images);
                            album._id = data._id;
                            return album;
                        });

                        resolve(new Page(index, offset, albums, data.length));
                    })
                });
            });
    }

    static getAlbum(id) {
        return Database.getCollections('albums')
            .then(collection => {
                collection.findOne({ _id: new ObjectID(id) })
                    .then(data => {
                        const album = new Album(data.name, data.artist, data.tracks, data.images);
                        album._id = data._id;
                        return album;
                    });
            });
    }

    static deleteAlbum(id) {
        return Album.getAlbum(id).then(album => {
            if (album.tracks.lengh > 0) {
                throw new Error.UnremoveableError('has related tracks');
            }

            return Database.getCollection('albums')
                .then(collection => {
                    collection.deleteOne({ _id: new ObjectID(id) })
                        .then(result => {
                            result.deleteCount == 1;
                        });
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