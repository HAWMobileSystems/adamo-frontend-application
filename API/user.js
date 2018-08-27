const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies




/**
 * @api                 {get} /user/all all
 * @apiDescription      Request User ID from all users
 * @apiName             all
 * @apiGroup            user
 * @apiParam            (login) {Session} user must be set
 * @apiSuccess          {Array} data Array of Users.
 * @apiSuccess          {Boolean} lastname  Lastname of the User.
 * @apiSuccessExample   Success-Resposne:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5]
 * @apiError            Postgress error
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Database not available', error: 'Database not available', success: false}
 */
router.get('/all', function (req, res) {

  db.query('' +
    'SELECT * ' +
    'FROM users ' +
    'LEFT JOIN userprofile ON users.upid = userprofile.upid')
    .then(function (data) {
      console.log('DATA:', data);
      res.send({data: data, success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available', error: 'Database not available', success: false});
    });
});




/**
 * @api                 {requestType} /here/coems/the/CopyPaste CopyPaste
 * @apiDescription      this is for copy paste during development
 * @apiName             CopyPaste
 * @apiGroup            CopyPaste
 * @apiParam            {type} Mandatory thisIsRequired
 * @apiParam            {type} thisIsOptional
 * @apiParam            (login) {Session} user must be set(for routes that require a session or even permissions)
 * @apiSuccess          {Array} data Array of Users.
 * @apiSuccess          {boolean} lastname  Lastname of the User.
 * @apiSuccessExample   Success-Resposne:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Some nice Statustext', success: true, data: data}
 * @apiError            Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/create', function (req, res) {
  if (!req.body.email) {
    res.status(400).send({status: 'E-Mail may not be empty!'});
    return;
  }
  const emailValid = function (email) {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  };
  if (!emailValid(req.body.email)) {
    res.status(400).send({status: 'E-Mail is not valid!'});
    return;
  }
  if (!req.body.firstname) {
    res.status(400).send({status: 'First name may not be empty!'});
    return;
  }
  if (!req.body.lastname) {
    res.status(400).send({status: 'Last name may not be empty!'});
    return;
  }
  if (!req.body.password) {
    res.status(400).send({status: 'Password may not be empty!'});
    return;
  }
  if (!req.body.profile) {
    res.status(400).send({status: 'User profile may not be empty!'});
    return;
  }

  db.oneOrNone('select email from users where email = $1', [req.body.email])
    .then(function (data) {
      if (data) {
        res.status(400).send({status: 'User already exists'});
      } else {
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
          db.oneOrNone('' +
            'INSERT INTO users (firstname, lastname, email, password, upid)\n' +
            'SELECT $1, $2, $3, $4, upid \n' +
            'FROM userprofile\n' +
            'WHERE profile = $5',
            [req.body.firstname, req.body.lastname, req.body.email, hash, req.body.profile])
            .then(function () {
              res.send({status: 'User created successfully', success: true});
            })
            .catch(function (error) {
              console.log('ERROR POSTGRES:', error);
              res.status(400).send({status: 'Database not available'});
            });
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


/**
 * @api                 {requestType} /here/coems/the/CopyPaste CopyPaste
 * @apiDescription      this is for copy paste during development
 * @apiName             CopyPaste
 * @apiGroup            CopyPaste
 * @apiParam            {type} Mandatory thisIsRequired
 * @apiParam            {type} thisIsOptional
 * @apiParam            (login) {Session} user must be set(for routes that require a session or even permissions)
 * @apiSuccess          {Array} data Array of Users.
 * @apiSuccess          {boolean} lastname  Lastname of the User.
 * @apiSuccessExample   Success-Resposne:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Some nice Statustext', success: true, data: data}
 * @apiError            Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/update', function (req, res) {

  if (!req.body.uid) {
    res.status(400).send({status: 'Uid may not be empty!'});
    return;
  }
  if (!req.body.firstname) {
    res.status(400).send({status: 'Firstname may not be empty!'});
    return;
  }
  if (!req.body.lastname) {
    res.status(400).send({status: 'Lastname may not be empty!'});
    return;
  }
  if (!req.body.email) {
    res.status(400).send({status: 'E-Mail may not be empty!'});
    return;
  }
  const emailValid = function (email) {
    const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    return emailRegex.test(email);
  };
  if (!emailValid(req.body.email)) {
    res.status(400).send({status: 'E-Mail is not valid!'});
    return;
  }
  if (!req.body.profile) {
    res.status(400).send({status: 'Profile may not be empty!'});
    return;
  }

  const uid = req.body.uid;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;
  const profile = req.body.profile;

  db.oneOrNone('' +
    'UPDATE users\n' +
    '          SET firstname = $1, \n' +
    '            lastname = $2, \n' +
    '            email = $3,  \n' +
    '            upid = (SELECT upid\n' +
    '                      FROM userprofile\n' +
    '                      WHERE profile = $4)\n' +
    '          where uid = $5',
    [firstname, lastname, email, profile, uid])
    .then(function (data) {
      console.log('data is ', data);
      res.send({status: 'User updated successfully', success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available'});
    });
});



/**
 * @api                 {requestType} /here/coems/the/CopyPaste CopyPaste
 * @apiDescription      this is for copy paste during development
 * @apiName             CopyPaste
 * @apiGroup            CopyPaste
 * @apiParam            {type} Mandatory thisIsRequired
 * @apiParam            {type} thisIsOptional
 * @apiParam            (login) {Session} user must be set(for routes that require a session or even permissions)
 * @apiSuccess          {Array} data Array of Users.
 * @apiSuccess          {boolean} lastname  Lastname of the User.
 * @apiSuccessExample   Success-Resposne:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Some nice Statustext', success: true, data: data}
 * @apiError            Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/password', function (req, res) {
  if (!req.body.uid) {
    res.status(400).send({status: 'Uid may not be empty!'});
    return;
  }
  if (!req.body.password) {
    res.status(400).send({status: 'Password may not be empty!'});
    return;
  }
  const uid = req.body.uid;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    db.oneOrNone('' +
      'UPDATE users ' +
      'SET password = $1 ' +
      'WHERE uid = $2', [hash, uid])
      .then(function () {
        res.send({status: 'Password changed successfully', success: true});
      })
      .catch(function (error) {
        console.log('ERROR POSTGRES:', error);
        res.status(400).send({status: 'Database not available'});
      });
  });
});

/**
 * @api                 {requestType} /here/coems/the/CopyPaste CopyPaste
 * @apiDescription      this is for copy paste during development
 * @apiName             CopyPaste
 * @apiGroup            CopyPaste
 * @apiParam            {type} Mandatory thisIsRequired
 * @apiParam            {type} thisIsOptional
 * @apiParam            (login) {Session} user must be set(for routes that require a session or even permissions)
 * @apiSuccess          {Array} data Array of Users.
 * @apiSuccess          {boolean} lastname  Lastname of the User.
 * @apiSuccessExample   Success-Resposne:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Some nice Statustext', success: true, data: data}
 * @apiError            Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/delete', function (req, res) {

  if (!req.body.uid) {
    res.status(400).send({status: 'User may not be empty!'});
    return;
  }

  const uid = req.body.uid;
  console.log(uid);

  db.oneOrNone('select uid from users where uid = $1', [uid])
    .then(function (data) {
      if (data) {
        db.oneOrNone('delete from permission where uid = $1; delete from users where uid = $1', [uid])
          .then(function (data) {
            console.log('User deleted');
            res.send({status: 'User deleted successfully', success: true});
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error);
            res.status(400).send({status: 'Error while deleting user'});
          });
      } else {
        res.status(400).send({status: 'User does not exist'});
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Database not available'});
    });
});

module.exports = router;