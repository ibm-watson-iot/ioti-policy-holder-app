'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var Boom = require('boom');
var when = require('when');
var cloudant = require('cloudant');

class BaseStore {

  constructor(dbName, dbCredentials, logger) {
    this.logger = logger;
    this.dbName = dbName;
    var cloudantDB = cloudant(dbCredentials);
    this.db = cloudantDB.db.use(this.dbName);
    if (!this.db) {
      throw Error(dbName, "database not found.");
    }
  }

  get(documentId) {
    var self = this;
    var method = 'store.get';
    self.logger.info(method, 'Getting document with an id', documentId);

    return when.promise(function(resolve, reject) {
      self.db.get(documentId, function(err, doc) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(method,
            'document with an id', documentId, 'not found', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(method, 'Found', 'document in database with an id', documentId);
          resolve(doc);
        }
      });
    });
  }

  list() {
    var self = this;
    var method = 'store.list';
    self.logger.info(method, 'Listing', 'documents');

    return when.promise(function(resolve, reject) {

      var viewOptions = {
        include_docs: true
      };
      var includeDocs = true;

      self.db.list(viewOptions, function(err, docs) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(method, 'error while listing', 'document', error.statusCode, error.message);
          reject(error);
        } else {
          var results = docs.rows;
          var newResults = [];

          if (includeDocs) {
            results.forEach(function(result) {
              newResults.push(result.doc);
            });
          } else {
            newResults = results;
          }
          self.logger.info(method, newResults.length, self.documentType, 'documents are found.');
          resolve(newResults);
        }
      });
    });
  }

  create(newDocument) {
    var self = this;
    var method = 'store.create';
    self.logger.info(method, 'Creating new document');
    newDocument.createdAt = new Date();

    return when.promise(function(resolve, reject) {
      self.db.insert(newDocument, function(err, document) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(method, 'error while inserting document', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(method, 'Inserted document for', document.id);
          resolve(document);
        }
      });
    });
  }

  update(documentToUpdate) {
    var self = this;
    var method = 'store.update';
    self.logger.info(method, 'Updating document with an id', documentToUpdate._id);
    documentToUpdate.updatedAt = new Date();

    return when.promise(function(resolve, reject) {
      self.db.insert(documentToUpdate, documentToUpdate._id, function(err, document) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(method, 'error while updating', 'document', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(method, 'Updated document with id', document.id);
          resolve(document);
        }
      });
    });
  }

  delete(documentId, documentRev) {
    console.log(documentId,documentRev);
    var self = this;
    var method = 'store.delete';
    self.logger.info(method, 'Deleting document with id', documentId);

    return when.promise(function(resolve, reject) {
      self.db.destroy(documentId, documentRev, function(err, result) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(method, 'error while deleting', 'document', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(method, 'deleted document with id', documentId);
          resolve(result);
        }
      });
    });
  }

  selectByAttribute(attributeName, attributeValue) {
    var self = this;
    var method = 'store.selectByAttribute';
    self.logger.info(method, 'Select document with attributeName', attributeName, 'and attributeValue', attributeValue);

    var query = {
      "selector": {
        "_id": {
          "$gt": 0,
          "$regex": "^(?!_design/)"
        }
      }
    };
    query.selector[attributeName] = attributeValue;

    return when.promise(function(resolve, reject) {
      self.db.find(query, function(err, result) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(method, 'error while selecting', 'document', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(method, 'selected',
            'document with attributeName', attributeName, 'and attributeValue', attributeValue);
          resolve(result);
        }
      });
    });
  }
}

module.exports = BaseStore;

