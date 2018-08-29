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
 * @apiDescription      Requests all users from the database.
 * @apiName             all
 * @apiGroup            user
 * @apiSuccess          {Array} data Array of users
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
    'SELECT * ' +
    'FROM users ' +
    'LEFT JOIN userprofile ON users.upid = userprofile.upid')
    .then(function (data) {
      console.log('DATA:', data);
      res.send({data: data, success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Something went wrong', success: false});
    });
});


/**
 * @api                 {post} /user/create create
 * @apiDescription      Checks if post parameters email, firstname, lastname, password and profile are set,
 *                      validates email regarding its correctness,
 *                      checks if email exists already in database,
 *                      and if not, creates a new user.
 * @apiName             create
 * @apiGroup            user
 * @apiParam            {String} email Mandatory email of a user
 * @apiParam            {String} firstname Mandatory firstname of a user
 * @apiParam            {String} lastname Mandatory lastname of a user
 * @apiParam            {String} password Mandatory password of a user
 * @apiParam            {String} profile Mandatory profile of a user
 * @apiSuccess          status User created successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'User created successfully', success: true}
 * @apiError            error Something went wrong
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
              res.status(400).send({status: 'Something went wrong', success: false});
            });
        });
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Something went wrong', success: false});
    });
});


/**
 * @api                 {post} /user/update update
 * @apiDescription      Checks if post parameters userid, email, firstname, lastname, and profile are set,
 *                      validates email regarding its correctness,
 *                      checks if email exists already in database,
 *                      and updates the selected user.
 * @apiName             update
 * @apiGroup            user
 * @apiParam            {Int} userid Mandatory userid of a user
 * @apiParam            {String} email Mandatory email of a user
 * @apiParam            {String} firstname Mandatory firstname of a user
 * @apiParam            {String} lastname Mandatory lastname of a user
 * @apiParam            {String} profile Mandatory profile of a user
 * @apiSuccess          status User updated successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'User updated successfully', success: true}
 * @apiError            error Something went wrong
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
      res.status(400).send({status: 'Something went wrong', success: false});
    });
});


/**
 * @api                 {post} /user/password password
 * @apiDescription      Checks if post parameters userid and password are set,
 *                      and changes the password of the user in the database.
 * @apiName             password
 * @apiGroup            user
 * @apiParam            {Int} userid Mandatory userid of a user
 * @apiParam            {String} password Mandatory password of a user
 * @apiSuccess          status Password changed successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Password changed successfully', success: true}
 * @apiError            error Something went wrong
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
        res.status(400).send({status: 'Something went wrong', success: false});
      });
  });
});


/**
 * @api                 {post} /user/delete delete
 * @apiDescription      Checks if post parameter userid is set,
 *                      deletes all permissions of the selected user, 
 *                      and finally deletes the selected user from the database.
 * @apiName             delete
 * @apiGroup            user
 * @apiParam            {Int} userid Mandatory userid of a user
 * @apiSuccess          status User deleted successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'User deleted successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 *                      HTTP/1.1 401 Failure
 *                      {status: 'Error while deleting user', success: false}
 *                      HTTP/1.1 404 Failure
 *                      {status: 'User does not exist in the database', success: true}
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
            res.status(401).send({status: 'Error while deleting user', success: false});
          });
      } else {
        res.status(404).send({status: 'User does not exist in the database', success: true});
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error);
      res.status(400).send({status: 'Something went wrong', success: false});
    });
});

module.exports = router;