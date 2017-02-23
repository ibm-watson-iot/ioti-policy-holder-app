'use strict';

/*******************************************************************************
 * Licensed Materials - Property of IBM
 * © Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

var when = require('when');
var BaseStore = require('./BaseStore');

class ClaimStore extends BaseStore {

  constructor(dbName, dbCredentials, logger) {
    super(dbName, dbCredentials, logger);
    this.logger = logger;
  }

  get(claimId) {
    return super.get(claimId);
  }

  list() {
    return super.list();
  }

  create(newClaim) {
    return super.create(newClaim);
  }

  update(claim) {
    return super.update(claim);
  }

  delete(claimId, claimRev) {
    return super.delete(claimId, claimRev);
  }

  getClaimsByUsername(username) {
    var self = this;
    return when.promise(function(resolve, reject) {
      self.selectByAttribute("policyHolderName", username)
      .then(function(result) {
        if (result && result.docs && (result.docs.length > 0)) {
          resolve(result.docs);
        } else if (result && result.docs && (result.docs.length === 0)) {
          resolve([]);
        } else {
          reject(new Error('There is not any claims with username ' + username));
        }
      })
      .catch(function(err) {
        reject(err);
      });
    });
  }

  getClaimsByHazardId(hazardId) {
    var self = this;
    return when.promise(function(resolve, reject) {
      self.selectByAttribute("hazardId", hazardId)
      .then(function(result) {
        if (result && result.docs && (result.docs.length > 0)) {
          resolve(result.docs);
        } else if (result && result.docs && (result.docs.length === 0)) {
          resolve([]);
        } else {
          reject(new Error('There is not any claims with hazardId ' + hazardId));
        }
      })
      .catch(function(err) {
        reject(err);
      });
    });
  }
}

module.exports = ClaimStore;
