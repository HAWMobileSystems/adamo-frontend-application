const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');
const bigInt = require('big-integer');
const mqtt = require('mqtt').connect('mqtt://localhost:1883', { clientId: 'Express' });
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
      //console.log('modelupsert all models',openModels);
      // openModels[event.mid] = {};
      // openModels[event.mid][event.newVersion] = openModels[event.mid][event.version];
      if (openModels.hasOwnProperty(event.mid)) {
        if (openModels[event.mid].hasOwnProperty(event.version)) {
          console.log('modelupsert event',event);
          let newVersion = event.newVersion;
           openModels[event.mid][newVersion] = openModels[event.mid][event.version];
          openModels[event.mid][newVersion].changed = false;
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
        openModels[mid][version].collaborators.splice(openModels[mid][version].collaborators.indexOf(collaborator), 1);
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
        }, 300);
      }
    }
  }
}


router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


/**
 * @api                 {get} /model/all all
 * @apiDescription      Requests all models from the database.
 *                      The order of the models and the correspong version is 
 *                      ascending reagrding the model name and descending reagrding the versions.
 * @apiName             all
 * @apiGroup            model
 * @apiSuccess          {Array} data Array of models
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5, ...]
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.get('/all', function (req, res) {

  db.query('' +
    'SELECT m.mid AS mid, m.modelname AS modelname, m.lastchange AS lastchange, m.modelxml AS modelxml, m.version AS version, r.read AS read, r.write as write ' +
    'FROM model m ' +
    'LEFT JOIN permission p ON p.mid = m.mid ' +
    'LEFT JOIN role r ON r.rid = p.rid ' +
    'WHERE uid = $1 ' +
    'ORDER BY modelname ASC, version DESC', [req.session.user.id])

    .then(function (data) {
      res.send({ data: data, success: true });
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({ status: 'Something went wrong', success: false });
    });
});


/**
 * @api                 {post} /model/close close
 * @apiDescription      Removes users from open models.
 * @apiName             close
 * @apiGroup            model
 * @apiParam            {Int} modelid Mandatory modelid of a model
 * @apiParam            {Int} version Mandatory version of a model
 * @apiSuccess          message collaborator removed
 * @apiSuccessExample   Success-Response:
 *                      {message: 'collaborator removed'}
 */
router.post('/close', function (req, res) {
  if (!req.body.mid) {
    res.status(400).send({ status: 'Model name may not be empty!' });
    return;
  }
  if (!req.body.version) {
    res.status(400).send({ status: 'Version name may not be empty!' });
    return;
  }
  // removeFromOpenModels(req.body.mid, req.body.version, req.session.user.email);
  res.send({ message: 'collaborator removed' });
});


/**
 * @api                 {post} /model/getModel getModel
 * @apiDescription      Shows one model from the database.
 * @apiName             getModel
 * @apiGroup            model
 * @apiParam            {Int} modelid Mandatory modelid of a model
 * @apiSuccess          {Array} data Array of models
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5, ...]
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/getModel', function (req, res) {
  if (!req.body.mid) {
    res.status(400).send({ status: 'Model name may not be empty!' });
    return;
  }
  const mid = req.body.mid;

  db.oneOrNone('' +
    'SELECT read ' +
    'FROM permission ' +
    'LEFT JOIN role ON role.rid = permission.rid ' +
    'WHERE mid = $1 ' +
    'AND uid = $2', [mid, req.session.user.id]
  ).then((function (data) {

    if (data) {
      //permission defined!

      if (data.read) {
        if (req.body.version) {
          const version = req.body.version;
          if (openModels.hasOwnProperty(mid)) {
            if (openModels[mid].hasOwnProperty(version)) {
              res.send({ data: openModels[mid][version], success: true });
              return;
            }
          }

          db.one('' +
            'SELECT modelxml, modelname, mid, version ' +
            'FROM model ' +
            'WHERE mid = $1 ' +
            'AND version = $2', [mid, version])
            .then(function (data) {
              res.send({ data: data, success: true });
              addToOpenModels(data.mid, data.version, data.modelxml, req.session.user.email);
            })
            .catch(function (error) {
              console.log('ERROR POSTGRES:', error);
              res.status(400).send({ status: 'Something went wrong', success: false });
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
              res.send({ data: data, success: true });
            })
            .catch(function (error) {
              console.log('ERROR POSTGRES:', error);
              res.status(400).send({ status: 'Something went wrong', success: false });
            });
        }
      }
      //If no Permision
      else {
        console.log('no permission to read!');
        res.status(400).send({ status: 'no permission to read!', success: false });
      }
    } else {
      //no permission defined!
      console.log('no permission defined');
      res.status(400).send({ status: 'no permission defined', success: false });
    }


  }))
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({ status: 'Something went wrong', success: false, error: error });
    });

});


/**
 * @api                 {post} /model/create create
 * @apiDescription      Checks if post parameters modelname and modelxml are set,
 *                      checks if this model exists already in database,
 *                      and if not, creates a new model.
 * @apiName             create
 * @apiGroup            model
 * @apiParam            {String} modelname Mandatory name of a model
 * @apiParam            {String} modelxml Mandatory xml of a model
 * @apiSuccess          status Model created successfully
 * @apiSuccessExample   Success-Response:
 *                      {status: 'Model created successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/create', function (req, res) {

  if (!req.body.modelname) {
    res.status(400).send({ status: 'Model name may not be empty!' });
    return;
  }

  if (!req.body.modelxml) {
    res.status(400).send({ status: 'Modelxml name may not be empty!' });
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
        res.status(400).send({ status: 'Model name already exists' });
      } else {
        db.oneOrNone('' +
          'INSERT into model ' +
          '(modelname, modelxml, version) ' +
          'VALUES ($1, $2, $3) ' +
          'RETURNING mid', [modelname, modelxml, bigInt('0001000000000000', 16).toString()])
          .then(function (data) {
            var _mid = data.mid;

            db.query('' +
              'SELECT DISTINCT(uid) as uid ' +
              'FROM users')
              .then(function (rows) {
                rows.forEach(function (row) {
                  db.oneOrNone('' +
                    'INSERT INTO permission (mid, uid, rid)\n' +
                    'SELECT $1, $2, $3', [_mid, row.uid, 6,])
                });
              })

            res.send({ status: 'Model created successfully', success: true });
            mqtt.publish('administration/model', JSON.stringify({}));
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error);
            res.status(400).send({ status: 'Something went wrong', success: false, error: error });
          });
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({ status: 'Something went wrong', success: false });
    });
});


/**
 * @api                 {post} /model/update update
 * @apiDescription      Checks if post parameter modelname is set,
 *                      checks if this model exists already in database,
 *                      and if not, updates the selected model.
 * @apiName             update
 * @apiGroup            model
 * @apiParam            {String} modelname Mandatory name of a model
 * @apiSuccess          status Model updated successfully
 * @apiSuccessExample   Success-Response:
 *                      {status: 'Model updated successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/update', function (req, res) {

  if (!req.body.modelname) {
    res.status(400).send({ status: 'Model name may not be empty!' });
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
        res.status(400).send({ status: 'Model name already exists' });
      } else {
        db.oneOrNone('update model set modelname = $1, modelxml = $2, version= $3 where mid = $4', [modelname, modelxml, version, mid])
          .then(function (data) {
            res.send({ status: 'Model updated successfully', success: true });
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error);
            res.status(400).send({ status: 'Something went wrong', success: false });
          });
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({ status: 'Something went wrong', success: false });
    });
});


/**
 * @api                 {post} /model/delete delete
 * @apiDescription      Checks if post parameter modelid is set,
 *                      checks if it is used by a user, 
 *                      if not, checks if it still maintained as a partial model
 *                      and if not, deletes the selected model.
 * @apiName             delete
 * @apiGroup            model
 * @apiParam            {Int} modelid Mandatory modelid of a model
 * @apiSuccess          status Model deleted successfully
 * @apiSuccessExample   Success-Response:
 *                      {status: 'Model deleted successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Model could not be deleted', success: false}
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Model cannot be deleted while someone is modelling it', success: false}
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Model cannot be deleted as it is maintained as a partial model', success: false}
 *                      HTTP/1.1 404 Failure
 *                      {status: 'Model does not exist in the database', success: true}
 */
router.post('/delete', function (req, res) {

  if (!req.body.mid) {
    res.status(400).send({ status: 'Mid may not be empty!' });
    return;
  }
  const mid = req.body.mid;
  const version = req.body.version;

  if (openModels.hasOwnProperty(mid)) {
    if (!version) {
      res.status(400).send({ status: 'Model cannot be deleted while someone is modelling it', success: false });
      return
    } else if (openModels[mid].hasOwnProperty(version)) {
      res.status(400).send({ status: 'Model version cannot be deleted while someone is modelling it', success: false });
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
            'DELETE FROM partialmodel ' +
            'WHERE mid = $1; ' +
            'DELETE FROM permission ' +
            'WHERE mid = $1; ' +
            'DELETE FROM model ' +
            'WHERE mid = $1', [mid])
            .then(function (data) {
              console.log('Model deleted');
              res.send({ status: 'Model deleted successfully', success: true });
            })
            .catch(function (error) {
              console.log('ERROR POSTGRES:', error);
              res.status(400).send({ status: 'Model cannot be deleted as it has still permissions', success: false });
            });
        } else {
          res.status(404).send({ status: 'Model does not exist in the database', success: true });
        }
      })
      .catch(function (error) {
        console.log('ERROR POSTGRES:', error);
        res.status(400).send({ status: 'Something went wrong', success: false });
      });
  } else {
    db.oneOrNone('' +
      'SELECT mid ' +
      'FROM model ' +
      'WHERE mid = $1 ' +
      'AND version = $2', [mid, version])
      .then(function (data) {
        if (data) {
          db.query('' +
            'DELETE FROM partialmodel ' +
            'WHERE mid = $1' +
            'AND version = $2; ' +
            'DELETE FROM model ' +
            'WHERE mid = $1' +
            'AND version = $2', [mid, version])
            .then(function (data) {

              console.log('Model deleted');
              res.send({ status: 'Model deleted successfully', success: true });

              db.oneOrNone('' +
                'SELECT mid ' +
                'FROM model ' +
                'WHERE mid = $1 ', [mid])
                .then(function (data) {

                  if (!data) {
                    db.query('' +
                      'DELETE FROM permission ' +
                      'WHERE mid = $1;', [mid])

                  }

                })
                .catch(function (error) {
                  console.log('ERROR POSTGRES:', error);
                  res.status(400).send({ status: 'Model deleted but permission problem', success: false, error: error });
                });

            })
            .catch(function (error) {
              console.log('ERROR POSTGRES:', error);
              res.status(400).send({ status: 'Model could not be deleted', success: false, error: error });
            });
        } else {
          res.status(404).send({ status: 'Model does not exist in the database', success: true });
        }
      })
      .catch(function (error) {
        console.log('ERROR POSTGRES:', error);
        res.status(400).send({ status: 'Something went wrong', success: false });
      });
  }
});


/**
 * @api                 {get} /model/changes changes
 * @apiDescription      Requests all models that were changed the last 7 days.
 *                      The order of the models will be shown desecnding regarding the last 7 days. 
 * @apiName             changes
 * @apiGroup            model
 * @apiSuccess          {Array} data Array of models
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5, ...]
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.get('/changes', function (req, res) {

  db.query('' +
    'SELECT mid, modelname, version, lastchange ' +
    'FROM model ' +
    'WHERE lastchange >= NOW() - interval \'7 days\' ' +
    'ORDER BY lastchange DESC')
    .then(function (data) {
      console.log('DATA:', data);
      res.send({ data: data, success: true });
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({ status: 'Something went wrong', success: false });
    });
});


/**
 * @api                 {post} /model/upsert upsert
 * @apiDescription      Checks if post parameters modelid, version, modelxml and modelname are set,
 *                      checks if the selected model has some changes to save,
 *                      and if so, saves the selected model with a new version one level deeper. 
 *                      A model with version 1 is then saved with version 1.1, this one is then saved with 1.1.1 and so on. 
 *                      The current version level is defined at 3, this means a version can at least be 1.1.1.1 and no level deeper.  
 * @apiName             upsert
 * @apiGroup            model
 * @apiParam            {Int} modelid Mandatory modelid of a model
 * @apiParam            {Int} version Mandatory version of a model
 * @apiParam            {String} modelxml Mandatory xml of a model
 * @apiParam            {String} modelname Mandatory name of a model
 * @apiSuccess          status Model upserted successfully
 * @apiSuccessExample   Success-Response:
 *                      {status: 'Model upserted successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Max Subversion number reached', success: false}
 */
router.post('/upsert', function (req, res) {

  if (!req.body.mid) {
    res.status(400).send({ status: 'mid may not be empty!', success: false });
    return;
  }
  if (!req.body.version) {
    res.status(400).send({ status: 'version may not be empty!', success: false });
    return;
  }
  if (!req.body.modelxml) {
    res.status(400).send({ status: 'modelxml may not be empty!', success: false });
    return;
  }
  if (!req.body.modelname) {
    res.status(400).send({ status: 'modelname may not be empty!', success: false });
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

  db.oneOrNone('' +
    'SELECT write ' +
    'FROM permission ' +
    'LEFT JOIN role ON role.rid = permission.rid ' +
    'WHERE mid = $1 ' +
    'AND uid = $2', [mid, req.session.user.id]
  ).then((function (data) {

    if (data) {
      //permission defined!

      if (data.write) {

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
                      res.send({ status: 'Next Version already exists', success: false });
                    } else {
                      console.log('ERROR POSTGRES:', error);
                      res.status(400).send({ status: 'Something went wrong', success: false });
                    }
                  });
              }
              else {
                res.status(400).send({ status: 'Max Subversion number reached', success: false });
              }
            } else {
              console.log('ERROR POSTGRES:', error);
              res.status(400).send({ status: 'Something went wrong', success: false });
            }
          });


      }
      //If no Permision
      else {
        console.log('no permission to write!');
        res.status(400).send({ status: 'no permission to write!', success: false });
      }
    } else {
      //no permission defined!
      console.log('no permission defined');
      res.status(400).send({ status: 'no permission defined', success: false });
    }
  }))




});


module.exports = router;