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
var ClaimStore = require('../stores/ClaimStore');

class ClaimsEndpoint {

  constructor(config, logger, router) {
    this.basePath = '/claims';

    router.get(this.basePath, this.list.bind(this));
    router.get(this.basePath + '/:id', this.get.bind(this));
    router.get(this.basePath + '/user/:username', this.getClaimsByUsername.bind(this));
    router.post(this.basePath, this.create.bind(this));
    router.put(this.basePath , this.update.bind(this));
    router.delete(this.basePath, this.delete.bind(this));

    this.claimStore = new ClaimStore(config.claimsDbName, config.dbCredentials, logger);
  }

  get(req, res) {
    var method = 'ClaimsEndpoint.get';
    var path = 'GET ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    var claimId = req.params.id;
    if (!claimId) {
      res.status(400).json({error: "claim id not given"});
    } else {
      this.claimStore.get(claimId)
      .then(function(claim) {
        res.send(claim);
      }).catch(function(err) {
        res.status(502).json({error: err.message});
      });
    }
  }

  list(req, res) {
    var method = 'ClaimsEndpoint.list';
    var path = 'GET ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    this.claimStore.list()
    .then(function(claims) {
      res.send(claims);
    }).catch(function(err) {
      res.status(502).json({error: err.message});
    });
  }

  create(req, res) {
    var method = 'ClaimsEndpoint.create';
    var path = 'POST ' + this.basePath;
    console.info(method, 'Access to', path);

    var newClaim = req.body;
    if (!newClaim) {
      res.status(400).json({error: "claim not given"});
    } else {
      this.claimStore.create(newClaim)
      .then(function() {
        res.send({"message": "success"});
      }).catch(function(err) {
        res.status(502).json({error: err.message});
      });
    }
  }

  update(req, res) {
    var method = 'ClaimsEndpoint.update';
    var path = 'PUT ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    var newClaim = req.body;
    if (!newClaim) {
      res.status(400).json({error: "claim not given"});
    } else {
      this.claimStore.update(newClaim)
      .then(function() {
        res.send({"message": "success"});
      }).catch(function(err) {
        res.status(502).json({error: err.message});
      });
    }
  }

  delete(req, res) {
    var method = 'ClaimsEndpoint.delete';
    var path = 'DELETE ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    var claimId = req.body._id;
    var claimRev = req.body._rev;
    if (!claimId || !claimRev) {
      res.status(400).json({error: "claim id or rev not given"});
    } else {
      this.claimStore.delete(claimId, claimRev)
      .then(function() {
        res.send({"message": "success"});
      }).catch(function(err) {
        res.status(502).json({error: err.message});
      });
    }
  }

  getClaimsByUsername(req, res) {
    var method = 'ClaimsEndpoint.getClaimsByUsername';
    var path = 'GET ' + this.basePath + '/';
    console.info(method, 'Access to', path);

    var username = req.params.username;
    if (!username) {
      res.status(400).json({error: "username not given"});
    } else {
      this.claimStore.getClaimsByUsername(username)
      .then(function(docs) {
        res.send(docs);
      }).catch(function(err) {
        res.status(502).json({error: err.message});
      });
    }
  }
}

module.exports = ClaimsEndpoint;