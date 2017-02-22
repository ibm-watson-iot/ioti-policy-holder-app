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

var BaseStore = require('./BaseStore');

class UserStore extends BaseStore {

  constructor(dbName, dbCredentials, logger, documentType) {
    super(dbName, dbCredentials, logger, documentType);
  }

  get(tid, userId) {
    return super.get(tid, userId);
  }

  list(tid) {
    return super.list(tid);
  }

  create(tid, newUser) {
    return super.create(tid, newUser);
  }

  update(tid, user) {
    return super.update(tid, user);
  }

  delete(tid, userId, user) {
    return super.delete(tid, userId, user);
  }

  getUserByUsername(tid, username) {
    var self = this;
    return when.promise(function(resolve, reject) {
      self.selectByAttribute(tid, "username", username)
      .then(function(result) {
        if (result && result.docs && (result.docs.length > 0)) {
          resolve(result.docs[0]);
        } else {
          reject(Boom.create(404, self.documentType + ' document for' + username + 'not found'));
        }
      })
      .catch(function(err) {
        reject(err);
      });
    });
  }

}

module.exports = UserStore;
