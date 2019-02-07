const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');
const saltRounds = 10;

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


/**
 * @api                 {get} /permission/:user/:model :model
 * @apiDescription      Requests all permissions from the database.
 * @apiName             all
 * @apiGroup            permission
 * @apiSuccess          {Array} data Array of permissions
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5, ...]
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
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
      res.status(400).send({status: 'Something went wrong', success: false});
    })
});


/**
 * @api                 {post} /permission/create create
 * @apiDescription      Checks if post parameters modelid, userid and role are set,
 *                      and creates a new permission.
 * @apiName             create
 * @apiGroup            permission
 * @apiParam            {Int} modelid Mandatory modelid of a model
 * @apiParam            {Int} userid Mandatory userid of a user
 * @apiParam            {String} role Mandatory name of a role
 * @apiSuccess          status Permission created successfully 
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Permission created successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
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
      res.send({status: 'Permission created successfully', success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Something went wrong', success: false});
    })
});


/**
 * @api                 {post} /permission/update update
 * @apiDescription      Checks if post parameters permissionid and role are set,
 *                      and updates the selected permission.
 * @apiName             update
 * @apiGroup            permission
 * @apiParam            {Int} permissionid Mandatory permissionid of a permission
 * @apiParam            {String} role Mandatory name of a role
 * @apiSuccess          status Permission updated successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Permission updated successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
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
      res.send({status: 'Permission updated successfully', success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Something went wrong', success: false});
    })
});


/**
 * @api                 {post} /permission/delete delete
 * @apiDescription      Checks if post parameter permissionid is set,
 *                      and deletes the selected permission from the database.
 * @apiName             delete
 * @apiGroup            permission
 * @apiParam            {Int} permissionid Mandatory permissionid of a permission
 * @apiSuccess          status Permission deleted successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Permission deleted successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 *                      HTTP/1.1 404 Failure
 *                      {status: 'Permission does not exist', success: true}
 */
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
        res.status(404).send({status: 'Permission does not exist', success: true})
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Something went wrong', success: false});
    })
});


module.exports = router;