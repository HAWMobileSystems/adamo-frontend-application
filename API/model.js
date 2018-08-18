const express = require('express')
const router = express.Router()
const db = require('./database')
const bodyParser = require('body-parser')
const bigInt = require('big-integer')
const mqtt = require('mqtt').connect('mqtt://localhost:1883')
const openModels = {}

mqtt.subscribe('MODEL/#')
mqtt.on('message', function (topic, message) {
  console.error(topic)
  try {
    var split = topic.split('_')
    var mid = split[1]
    var version = split[2]
    if (mid && version) {
      openModels[mid] = {version: {}}
      openModels[mid][version] = JSON.parse(message)
      openModels[mid][version].modelxml = JSON.parse(message).XMLDoc
      openModels[mid][version].mid = mid
      openModels[mid][version].version = version
      openModels[mid][version].hasOwnProperty('numberOfCollaborators') ? openModels[mid].numberOfCollaborators = openModels[mid].numberOfCollaborators++ : openModels[mid].numberOfCollaborator = 1
      lastchange = null
      modelname = null
      version = null
    }
  }
  catch (error) {
    console.error(error)
  }
})


router.use(bodyParser.json()) // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})) // support encoded bodies


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
      res.send({data: data, success: true})
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'})
    })
})


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
    res.status(400).send({status: 'Model name may not be empty!'})
    return
  }
  const mid = req.body.mid


  if (req.body.version) {
    const version = req.body.version
    if (openModels.hasOwnProperty(mid)) {
      if (openModels[mid].hasOwnProperty(version)) {
        res.send({data: openModels[mid][version], success: true})
        return
      }
    }

    db.one('' +
      'SELECT modelxml, modelname, mid, version ' +
      'FROM model ' +
      'WHERE mid = $1 ' +
      'AND version = $2', [mid, version])
      .then(function (data) {
        console.log('DATA:', data)
        res.send({data: data, success: true})
      })
      .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({status: 'Database not available'})
      })

  } else {
    console.log(req.params)
    db.one('' +
      'SELECT modelxml, modelname, mid, version ' +
      'FROM model ' +
      'WHERE mid = $1 ' +
      'ORDER BY version DESC ' +
      'LIMIT 1', [mid])
      .then(function (data) {
        console.log('DATA:', data)
        res.send({data: data, success: true})
      })
      .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({status: 'Database not available'})
      })

  }
})


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
    res.status(400).send({status: 'Model name may not be empty!'})
    return
  }

  const modelname = req.body.modelname
  const modelxml = req.body.modelxml
  const version = req.body.version

  console.log(modelname + ' ' + modelxml + ' ' + version)

  db.oneOrNone('' +
    'SELECT modelname ' +
    'FROM model ' +
    'WHERE modelname = $1', [modelname])
    .then(function (data) {
      if (data) {
        res.status(400).send({status: 'Model name already exists'})
      } else {
        db.oneOrNone('' +
          'INSERT into model ' +
          '(modelname, modelxml, version) ' +
          'VERSION ($1, $2, $3)', [modelname, modelxml, version])
          .then(function (data) {
            res.send({status: 'Model created successfully', success: true})
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Database not available'})
          })
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'})
    })
})


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
    res.status(400).send({status: 'Model name may not be empty!'})
    return
  }

  const mid = req.body.mid
  const modelname = req.body.modelname
  const lastchange = req.body.lastchange
  const modelxml = req.body.modelxml
  const version = req.body.version

  console.log(mid + ' ' + modelname + ' ' + modelxml + ' ' + version)

  db.oneOrNone('select modelname from model where modelname = $1', [modelname])
    .then(function (data) {
      if (data && data.mid !== +mid) {
        res.status(400).send({status: 'Model name already exists'})
      } else {
        db.oneOrNone('update model set modelname = $1, modelxml = $2, version= $3 where mid = $4', [modelname, modelxml, version, mid])
          .then(function (data) {
            res.send({status: 'Model updated successfully', success: true})
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Database not available'})
          })
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'})
    })
})


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
    res.status(400).send({status: 'Mid may not be empty!'})
    return
  }
  const mid = req.body.mid
  if (!req.body.version) {
    res.status(400).send({status: 'Version may not be empty!'})
    return
  }
  const version = req.body.version


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
            console.log('Model deleted')
            res.send({status: 'Model deleted successfully', success: true})
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Model cannot be deleted as it is maintained as a partial model'})
          })
      } else {
        res.status(400).send({status: 'Model does not exist'})
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'})
    })
})


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
    'SELECT mid, modelname, version ' +
    'FROM model ' +
    'WHERE lastchange >= NOW() - interval \'7 days\' ' +
    'ORDER BY lastchange DESC')
    .then(function (data) {
      console.log('DATA:', data)
      res.send({data: data, success: true})
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'})
    })
})


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

router.post('/upsert', function (req, res) {

  if (!req.body.mid) {
    res.status(400).send({status: 'mid may not be empty!', success: false})
    return
  }
  if (!req.body.version) {
    res.status(400).send({status: 'version may not be empty!', success: false})
    return
  }
  if (!req.body.modelxml) {
    res.status(400).send({status: 'modelxml may not be empty!', success: false})
    return
  }
  if (!req.body.modelname) {
    res.status(400).send({status: 'modelname may not be empty!', success: false})
    return
  }

  const modelname = req.body.modelname
  const mid = req.body.mid
  const modelxml = req.body.modelxml
  const version = bigInt(req.body.version)
  const superversion = req.body.supeversion

  console.error(bigInt(version).add(bigInt('0001000000000000', '16')).toString(16))
  var level = [
    bigInt('0001000000000000', '16'),
    bigInt('0000000100000000', '16'),
    bigInt('0000000000010000', '16'),
    bigInt('0000000000000001', '16')
  ]
  var currentLevel
  if (!bigInt(version).and(bigInt('FFFF000000000000', '16')).isZero()) {
    currentLevel = 0
  }
  if (!bigInt(version).and(bigInt('0000FFFF00000000', '16')).isZero()) {
    currentLevel = 1
  }
  if (!bigInt(version).and(bigInt('00000000FFFF0000', '16')).isZero()) {
    currentLevel = 2
  }
  if (!bigInt(version).and(bigInt('000000000000FFFF', '16')).isZero()) {
    currentLevel = 3
  }
  console.log(currentLevel, level[currentLevel].toString(16))
  db.oneOrNone('' +
    'INSERT INTO model' +
    '(mid, modelname, modelxml, version) ' +
    'VALUES ' +
    '($1, $2, $3, $4)', [mid, modelname, modelxml, bigInt(version).add(level[currentLevel]).toString()])
    .then(function (data) {
      console.log('_1_', data)
      res.send({
        status: 'Model upserted successfully',
        mid: mid,
        modelname: modelname,
        version: bigInt(version).add(level[currentLevel]),
        success: true
      })
      mqtt.publish('modelupsert', JSON.stringify({
        mid: mid,
        version: version,
        newVersion: bigInt(version).add(level[currentLevel])
      }))
    })
    .catch(function (error) {
      if (error.code === '23505') {
        if (currentLevel < 3) {
          currentLevel++
          db.oneOrNone('' +
            'INSERT INTO model' +
            '(mid, modelname, modelxml, version) ' +
            'VALUES ' +
            '($1, $2, $3, $4)', [mid, modelname, modelxml, bigInt(version).add(level[currentLevel]).toString()])
            .then(function (data) {
              console.log('_2_', data)
              res.send({
                status: 'Model upserted successfully',
                mid: mid,
                modelname: modelname,
                version: bigInt(version).add(level[currentLevel]),
                success: true
              })
              mqtt.publish('modelupsert', JSON.stringify({
                mid: mid,
                version: bigInt(version).add(level[currentLevel])
              }))
            })
            .catch(function (error) {
              if (error.code === '23505') {
                res.send({status: 'Next Version already exists', success: false})
              } else {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({status: 'Database not available'})
              }
            })
        }
        else {
          res.status(400).send({status: 'Max Subversion number reached', success: false})
        }
      } else {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({status: 'Database not available', success: false})
      }
    })
})


module.exports = router