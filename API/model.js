const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');
const bigInt = require('big-integer');
const mqtt = require('mqtt').connect('mqtt://localhost:1883', {clientId: 'Express'});
const openModels = {};

mqtt.subscribe('MODEL/#');
mqtt.subscribe('mqtt/subscribed/#');
mqtt.subscribe('mqtt/unsubscribed/#');
mqtt.subscribe('modelupsert');
// mqtt.subscribe('mqtt/disconnect');
mqtt.on('message', function (topic, message) {
  try {
    var event;
    var split;
    var mid;
    var version;
    if (topic === 'modelupsert') {
      event = JSON.parse(message);
      // openModels[event.mid] = {};
      // openModels[event.mid][event.newVersion] = openModels[event.mid][event.version];
      if (openModels.hasOwnProperty(event.mid)) {
        if (openModels[event.mid].hasOwnProperty(event.version)) {
          openModels[event.mid][event.newVersion] = openModels[event.mid][event.version];
          delete openModels[event.mid][event.version];
        }
      }
    } else if (topic.startsWith('MODEL/')) {
      split = topic.split('_');
      mid = split[1];
      version = split[2];
      var modelxml = JSON.parse(message).XMLDoc;
      changeOpenModel(mid, version, modelxml);
    } else if (topic === 'administration/model/delete') {
      event = JSON.parse(message);
      removeFromOpenModels(event.mid, event.version);
    } else if (topic === 'mqtt/disconnect') {
      var collaborator = JSON.parse(message);
      for (var _mid in openModels) {
        if (!openModels.hasOwnProperty(_mid)) continue;
        for (var _version in openModels[_mid]) {
          if (!openModels[_mid].hasOwnProperty(_version)) continue;
          removeFromOpenModels(_mid, _version, collaborator);
        }
      }
    } else if (topic.startsWith('mqtt/subscribe')) {
      event = JSON.parse(message);
      split = topic.split('/');
      mid = split[2];
      version = split[3];
      addCollaborator(mid, version, event)
    } else if (topic.startsWith('mqtt/unsubscribe')) {
      event = JSON.parse(message);
      split = topic.split('/');
      mid = split[2];
      version = split[3];
      removeFromOpenModels(mid, version, event);
    } else {
      console.log(topic);
    }
  }
  catch (error) {
    console.error(error);
  }
});

function addToOpenModels(mid, version, modelxml) {
  if (!openModels.hasOwnProperty(mid)) {
    openModels[mid] = {};
  }
  if (!openModels[mid].hasOwnProperty(version)) {
    openModels[mid][version] = {}
  }
  openModels[mid][version].modelxml = modelxml;
  openModels[mid][version].mid = mid;
  openModels[mid][version].version = version;
  openModels[mid][version].collaborators = [];
  openModels[mid][version].changed = false;
}

function removeFromOpenModels(mid, version, collaborator) {
  if (openModels.hasOwnProperty(mid)) {
    if (openModels[mid].hasOwnProperty(version)) {
      if (openModels[mid][version].hasOwnProperty('collaborators')) {
        openModels[mid][version].collaborators.splice(openModels[mid][version].collaborators.indexOf(collaborator),1);
        // openModels[mid][version].collaborators.push(collaborator);
        mqtt.publish('collaborator/update/' + mid + '/' + version, JSON.stringify(openModels[mid][version].collaborators));
        if (openModels[mid][version].collaborators.length === 0) {
          delete openModels[mid][version];
        }
        if (openModels[mid].length === 0) {
          delete openModels[mid];
        }
      }
    }
  }
}

function changeOpenModel(mid, version, modelxml) {
  openModels[mid][version].modelxml = modelxml;
  openModels[mid][version].changed = true;
}

function addCollaborator(mid, version, collaborator) {
  if (openModels.hasOwnProperty(mid)) {
    if (openModels[mid].hasOwnProperty(version)) {
      if (openModels[mid][version].collaborators.indexOf(collaborator) === -1) {
        openModels[mid][version].collaborators.push(collaborator);
        setTimeout(function () {
          mqtt.publish('collaborator/update/' + mid + '/' + version, JSON.stringify(openModels[mid][version].collaborators));
        },300);
      }
    }
  }
}


router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies



/*
* URL:              /all
* Method:           get
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      
* */

router.get('/all', function (req, res) {

  db.query('' +
    'SELECT mid, modelname, lastchange, modelxml, version ' +
    'FROM model ' +
    'ORDER BY modelname ASC, version DESC')
    .then(function (data) {
      res.send({data: data, success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available'});
    });
});


router.post('/close', function (req, res) {
  if (!req.body.mid) {
    res.status(400).send({status: 'Model name may not be empty!'});
    return;
  }
  if (!req.body.version) {
    res.status(400).send({status: 'Version name may not be empty!'});
    return;
  }

  // removeFromOpenModels(req.body.mid, req.body.version, req.session.user.email);
  res.send({message: 'collaborator removed'});
});

/*
* URL:              /getModel
* Method:           get
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:
* */

router.post('/getModel', function (req, res) {
  if (!req.body.mid) {
    res.status(400).send({status: 'Model name may not be empty!'});
    return;
  }
  const mid = req.body.mid;

  if (req.body.version) {
    const version = req.body.version;
    if (openModels.hasOwnProperty(mid)) {
      if (openModels[mid].hasOwnProperty(version)) {
        res.send({data: openModels[mid][version], success: true});
        // addCollaborator(mid, version, req.session.user.email);
        return;
      }
    }

    db.one('' +
      'SELECT modelxml, modelname, mid, version ' +
      'FROM model ' +
      'WHERE mid = $1 ' +
      'AND version = $2', [mid, version])
      .then(function (data) {
        res.send({data: data, success: true});
        addToOpenModels(data.mid, data.version, data.modelxml, req.session.user.email);
      })
      .catch(function (error) {
        console.log('ERROR POSTGRES:', error);
        res.status(400).send({status: 'Database not available'});
      });

  } else {
    console.log(req.params);
    db.one('' +
      'SELECT modelxml, modelname, mid, version ' +
      'FROM model ' +
      'WHERE mid = $1 ' +
      'ORDER BY version DESC ' +
      'LIMIT 1', [mid])
      .then(function (data) {
        res.send({data: data, success: true});
      })
      .catch(function (error) {
        console.log('ERROR POSTGRES:', error);
        res.status(400).send({status: 'Database not available'});
      });
  }
});


/*
* URL:              /create
* Method:           post
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      
* */

router.post('/create', function (req, res) {

  if (!req.body.modelname) {
    res.status(400).send({status: 'Model name may not be empty!'});
    return;
  }

  if (!req.body.modelxml) {
    res.status(400).send({status: 'Modelxml name may not be empty!'});
    return;
  }

  const modelname = req.body.modelname;
  const modelxml = req.body.modelxml;

  console.log(modelname + ' ' + modelxml);

  db.oneOrNone('' +
    'SELECT modelname ' +
    'FROM model ' +
    'WHERE modelname = $1', [modelname])
    .then(function (data) {
      if (data) {
        res.status(400).send({status: 'Model name already exists'});
      } else {
        db.oneOrNone('' +
          'INSERT into model ' +
          '(modelname, modelxml, version) ' +
          'VALUES ($1, $2, $3)', [modelname, modelxml, bigInt('0001000000000000', 16).toString()])
          .then(function (data) {
            res.send({status: 'Model created successfully', success: true});
            mqtt.publish('administration/model', JSON.stringify({}));
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error);
            res.status(400).send({status: 'Database not available'});
          });
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available'});
    });
});


/*
* URL:              /update
* Method:           post
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      
* */

router.post('/update', function (req, res) {

  if (!req.body.modelname) {
    res.status(400).send({status: 'Model name may not be empty!'});
    return;
  }

  const mid = req.body.mid;
  const modelname = req.body.modelname;
  const lastchange = req.body.lastchange;
  const modelxml = req.body.modelxml;
  const version = req.body.version;

  console.log(mid + ' ' + modelname + ' ' + modelxml + ' ' + version);

  db.oneOrNone('select modelname from model where modelname = $1', [modelname])
    .then(function (data) {
      if (data && data.mid !== +mid) {
        res.status(400).send({status: 'Model name already exists'});
      } else {
        db.oneOrNone('update model set modelname = $1, modelxml = $2, version= $3 where mid = $4', [modelname, modelxml, version, mid])
          .then(function (data) {
            res.send({status: 'Model updated successfully', success: true});
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error);
            res.status(400).send({status: 'Database not available'});
          });
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available'});
    });
});


/*
* URL:              /delete
* Method:           post
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      
* */

router.post('/delete', function (req, res) {

  if (!req.body.mid) {
    res.status(400).send({status: 'Mid may not be empty!'});
    return;
  }
  const mid = req.body.mid;
  const version = req.body.version;

  if (openModels.hasOwnProperty(mid)) {
    if (!version) {
      res.status(400).send({status: 'Model cant be deleted while someone is modelling it', success: false});
      return
    } else if (openModels[mid].hasOwnProperty(version)) {
      res.status(400).send({status: 'Model version cant be deleted while someone is modelling it', success: false});
      return
    }
  }

  if (!version) {
  db.query('' +
    'SELECT mid ' +
    'FROM model ' +
    'WHERE mid = $1 ', [mid])
    .then(function (data) {
      if (data) {
        db.query('' +
          'DELETE FROM permission ' +
          'WHERE mid = $1; ' +
          'DELETE FROM model ' +
          'WHERE mid = $1', [mid])
          .then(function (data) {
            console.log('Model deleted');
            res.send({status: 'Model deleted successfully', success: true});
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error);
            res.status(400).send({status: 'Model cannot be deleted as it is maintained as a partial model'});
          });
      } else {
        res.status(400).send({status: 'Model does not exist'});
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available'});
    });
  } else {
    db.oneOrNone('' +
      'SELECT mid ' +
      'FROM model ' +
      'WHERE mid = $1 ' +
      'AND version = $2', [mid, version])
      .then(function (data) {
        if (data) {
          db.oneOrNone('' +
            'DELETE FROM permission ' +
            'WHERE mid = $1' +
            'AND version = $2; ' +
            'DELETE FROM model ' +
            'WHERE mid = $1' +
            'AND version = $2', [mid, version])
            .then(function (data) {
              console.log('Model deleted');
              res.send({status: 'Model deleted successfully', success: true});
            })
            .catch(function (error) {
              console.log('ERROR POSTGRES:', error);
              res.status(400).send({status: 'Model cannot be deleted as it is maintained as a partial model'});
            });
        } else {
          res.status(400).send({status: 'Model does not exist'});
        }
      })
      .catch(function (error) {
        console.log('ERROR POSTGRES:', error);
        res.status(400).send({status: 'Database not available'});
      });
  }
});


/*
* URL:              /changes
* Method:           get
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      
* */

router.get('/changes', function (req, res) {

  db.query('' +
    'SELECT mid, modelname, version, lastchange ' +
    'FROM model ' +
    'WHERE lastchange >= NOW() - interval \'7 days\' ' +
    'ORDER BY lastchange DESC')
    .then(function (data) {
      console.log('DATA:', data);
      res.send({data: data, success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available'});
    });
});


/*
* URL:              /upsert
* Method:           post
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:
* */

router.post('/upsert', function (req, res) {

  if (!req.body.mid) {
    res.status(400).send({status: 'mid may not be empty!', success: false});
    return;
  }
  if (!req.body.version) {
    res.status(400).send({status: 'version may not be empty!', success: false});
    return;
  }
  if (!req.body.modelxml) {
    res.status(400).send({status: 'modelxml may not be empty!', success: false});
    return;
  }
  if (!req.body.modelname) {
    res.status(400).send({status: 'modelname may not be empty!', success: false});
    return;
  }

  const modelname = req.body.modelname;
  const mid = req.body.mid;
  const modelxml = req.body.modelxml;
  const version = req.body.version;
  const superversion = req.body.supeversion;

  if (openModels.hasOwnProperty(mid)) {
    if (openModels[mid].hasOwnProperty(version)) {
      if (!openModels[mid][version].changed) {
        res.send({
          status: 'Model has no changes to save',
          success: true
        });
        return;
      }
    }
  }

  var level = [
    bigInt('0001000000000000', '16'),
    bigInt('0000000100000000', '16'),
    bigInt('0000000000010000', '16'),
    bigInt('0000000000000001', '16')
  ];
  var currentLevel;
  if (!bigInt(version).and(bigInt('FFFF000000000000', '16')).isZero()) {
    currentLevel = 0;
  }
  if (!bigInt(version).and(bigInt('0000FFFF00000000', '16')).isZero()) {
    currentLevel = 1;
  }
  if (!bigInt(version).and(bigInt('00000000FFFF0000', '16')).isZero()) {
    currentLevel = 2;
  }
  if (!bigInt(version).and(bigInt('000000000000FFFF', '16')).isZero()) {
    currentLevel = 3;
  }
  db.oneOrNone('' +
    'INSERT INTO model' +
    '(mid, modelname, modelxml, version) ' +
    'VALUES ' +
    '($1, $2, $3, $4)', [mid, modelname, modelxml, bigInt(version).add(level[currentLevel]).toString()])
    .then(function (data) {
      res.send({
        status: 'Model upserted successfully',
        mid: mid,
        modelname: modelname,
        version: bigInt(version).add(level[currentLevel]),
        success: true
      });
      mqtt.publish('administration/model', JSON.stringify({}));
      mqtt.publish('modelupsert', JSON.stringify({
        mid: mid,
        version: version,
        newVersion: bigInt(version).add(level[currentLevel])
      }));
    })
    .catch(function (error) {
      if (error.code === '23505') {
        if (currentLevel < 3) {
          currentLevel++;
          db.oneOrNone('' +
            'INSERT INTO model' +
            '(mid, modelname, modelxml, version) ' +
            'VALUES ' +
            '($1, $2, $3, $4)', [mid, modelname, modelxml, bigInt(version).add(level[currentLevel]).toString()])
            .then(function (data) {
              res.send({
                status: 'Model upserted successfully',
                mid: mid,
                modelname: modelname,
                version: bigInt(version).add(level[currentLevel]),
                success: true
              });
              mqtt.publish('administration/model', JSON.stringify({}));
              mqtt.publish('modelupsert', JSON.stringify({
                mid: mid,
                version: version,
                newVersion: bigInt(version).add(level[currentLevel])
              }));
            })
            .catch(function (error) {
              if (error.code === '23505') {
                res.send({status: 'Next Version already exists', success: false});
              } else {
                console.log('ERROR POSTGRES:', error);
                res.status(400).send({status: 'Database not available'});
              }
            });
        }
        else {
          res.status(400).send({status: 'Max Subversion number reached', success: false});
        }
      } else {
        console.log('ERROR POSTGRES:', error);
        res.status(400).send({status: 'Database not available', success: false});
      }
    });
});


module.exports = router;