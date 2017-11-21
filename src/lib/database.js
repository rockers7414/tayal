'use strict';
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/tayal';
let connection = null;

class Database {

  static getConnection() {
    return new Promise((resolve, reject) => {
      if (connection) {
        resolve(connection);
      } else {
        MongoClient.connect(url, (err, db) => {
          if (err) {
            reject(err);
          }

          connection = db;
          resolve(connection);
        });
      }
    });
  }

  static close() {
    connection.close();
    connection = null;
  }

  static getCollection(collection) {
    return Database.getConnection().then(connection => {
      return connection.collection(collection);
    });
  }
}

module.exports = Database;