'use strict';
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/tayal';
let connection = null;

class Database {
  static getCollection(collection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        resolve(connection);
      }

      MongoClient.connect(url, (err, db) => {
        if (err) {
          reject(err);
        }

        connection = db;
        resolve(connection);
      });
    }).then(connection => {
      return connection.collection(collection);
    });
  }
}

module.exports = Database;
