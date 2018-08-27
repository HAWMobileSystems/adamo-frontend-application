const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');
const saltRounds = 10;

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


/*
* URL:              /:user/:model
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

router.get('/:user/:model', function (req, res) {
  const user = req.params.user;
  const model = req.params.model;

  db.query('' +
    'SELECT * ' +
    'FROM permission ' +
    'LEFT JOIN role ON permission.rid = role.rid ' +
    'WHERE mid = $1 AND uid = $2', [model, user])
    .then(function (data) {
      console.log('DATA:', data);
      res.send({data: data, success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available', error: 'Database not available', success: false});
    })
});

/*
* URL:              /create
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
router.post('/create', function (req, res) {

  if (!req.body.mid) {
    res.status(400).send({status: 'Mid may not be empty!'});
    return;
  }
  if (!req.body.uid) {
    res.status(400).send({status: 'Uid may not be empty!'});
    return;
  }
  if (!req.body.role) {
    res.status(400).send({status: 'Role may not be empty!'});
    return;
  }

  db.query('' +
    'INSERT INTO permission' +
    '(mid, uid, rid) ' +
    'SELECT $1, $2, rid ' +
    'FROM role ' +
    'WHERE role = $3', [req.body.mid, req.body.uid, req.body.role])
    .then(function (data) {
      console.log('DATA:', data);
      res.send({success: true, status: 'Permission successfully created'});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available', error: error, success: false});
    })
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

  if (!req.body.pid) {
    res.status(400).send({status: 'Pid may not be empty!'});
    return;
  }
  if (!req.body.role) {
    res.status(400).send({status: 'Role may not be empty!'});
    return;
  }

  db.query('' +
    'UPDATE permission ' +
    'SET rid = (SELECT rid FROM role WHERE role = $2) ' +
    'WHERE pid = $1', [req.body.pid, req.body.role])
    .then(function (data) {
      console.log('DATA:', data);
      res.send({success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available', error: error, success: false});
    })
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

  const pid = req.body.pid;

  console.log(pid);

  db.oneOrNone('select from permission where pid = $1', [pid])
    .then(function (data) {
      if (data) {
        db.oneOrNone('delete from permission where pid = $1', [pid])
        console.log('data is ', data);
        res.send({status: 'Permission deleted successfully', success: true});
      } else {
        res.status(400).send({status: 'Permission does not exist'})
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'});
    })
});


module.exports = router;