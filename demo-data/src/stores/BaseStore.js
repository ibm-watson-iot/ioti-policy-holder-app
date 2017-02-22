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

  constructor(dbName, dbCredentials, logger, documentType) {
    this.logger = logger;
    this.dbName = dbName;
    this.documentType = documentType;
    var cloudantDB = cloudant(dbCredentials);
    this.db = cloudantDB.db.use(this.dbName);
    if (!this.db) {
      throw Error(dbName, "database not found.");
    }
  }

  get(tid, documentId) {
    var self = this;
    var method = 'BaseStore.get';
    self.logger.info(tid, method, 'Getting', self.documentType, 'document with an id', documentId);

    return when.promise(function(resolve, reject) {
      self.db.get(documentId, function(err, device) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(tid, method, self.documentType,
            'document with an id', documentId, 'not found', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(tid, method, 'Found', self.documentType, 'document in database with an id', documentId);
          resolve(device);
        }
      });
    });
  }

  list(tid) {
    var self = this;
    var method = 'BaseStore.list';
    self.logger.info(tid, method, 'Listing', self.documentType, 'documents');

    return when.promise(function(resolve, reject) {
      // TODO: this hack has to be fixed.
      var designName = 'iot4i';
      var viewName = self.documentType + 's';
      var viewOptions = {
        include_docs: true
      };
      var includeDocs = true;

      self.db.view(designName, viewName, viewOptions, function(err, docs) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(tid, method, 'error while listing',
            self.documentType, 'document', error.statusCode, error.message);
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
          self.logger.info(tid, method, newResults.length, self.documentType, 'documents are found.');
          resolve(newResults);
        }
      });
    });
  }

  create(tid, newDocument) {
    var self = this;
    var method = 'BaseStore.create';
    self.logger.info(tid, method, 'Creating new', self.documentType, 'document');
    newDocument.createdAt = new Date();
    newDocument.docType = self.documentType;

    return when.promise(function(resolve, reject) {
      self.db.insert(newDocument, function(err, document) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(tid, method, 'error while inserting',
            self.documentType, 'document', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(tid, method, 'Inserted', self.documentType, 'document for', document.id);
          resolve(document);
        }
      });
    });
  }

  update(tid, documentToUpdate) {
    var self = this;
    var method = 'BaseStore.update';
    self.logger.info(tid, method, 'Updating', self.documentType, 'document with an id', documentToUpdate._id);
    documentToUpdate.updatedAt = new Date();
    documentToUpdate.docType = self.documentType;

    return when.promise(function(resolve, reject) {
      self.db.insert(documentToUpdate, documentToUpdate._id, function(err, document) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(tid, method, 'error while updating',
            self.documentType, 'document', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(tid, method, 'Updated', self.documentType, 'document with id', document.id);
          resolve(document);
        }
      });
    });
  }

  delete(tid, documentId, document) {
    var self = this;
    var method = 'BaseStore.delete';
    self.logger.info(tid, method, 'Deleting', self.documentType, 'document with id', documentId._id);

    return when.promise(function(resolve, reject) {
      self.db.destroy(document._id, document._rev, function(err, result) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(tid, method, 'error while deleting',
            self.documentType, 'document', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(tid, method, 'deleted', self.documentType, 'document with id', document.id);
          resolve(result);
        }
      });
    });
  }

  selectByAttribute(tid, attributeName, attributeValue) {
    var self = this;
    var method = 'BaseStore.selectByAttribute';
    self.logger.info(tid, method, 'Select', self.documentType,
      'document with attributeName', attributeName, 'and attributeValue', attributeValue);

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
          self.logger.error(tid, method, 'error while selecting',
            self.documentType, 'document', error.statusCode, error.message);
          reject(error);
        } else {
          self.logger.info(tid, method, 'selected', self.documentType,
            'document with attributeName', attributeName, 'and attributeValue', attributeValue);
          resolve(result);
        }
      });
    });
  }

  selectViewByKey(tid, key, designName, viewName, includeDocs) {
    var self = this;
    var method = 'BaseStore.selectViewByKey';
    self.logger.info(tid, method, 'Select the design name', designName, 'with view name', viewName, 'and key', key);

    var viewOptions = {};

    if (key) {
      if (Array.isArray(key)) {
        viewOptions.keys = key;
      } else {
        viewOptions.keys = [key];
      }
    }

    viewOptions.include_docs = includeDocs;

    return when.promise(function(resolve, reject) {
      self.db.view(designName, viewName, viewOptions, function(err, result) {
        if (err) {
          var error = Boom.wrap(err, err.statusCode);
          self.logger.error(tid, method, 'error while selecting', self.documentType, 'document', error.statusCode, error.message);
          reject(error);
        } else {
          var results = result.rows;
          var newResults = [];

          if (includeDocs) {
            results.forEach(function(result) {
              newResults.push(result.doc);
            });
          } else {
            newResults = results;
          }

          self.logger.info(tid, method, 'selected', self.documentType, 'document with key', key, 'and view name', viewName);
          resolve(newResults);
        }
      });
    });
  }
}

module.exports = BaseStore;
