const express = require('express');
const app = express();
const db = require('./database');
const userRouter = require('./user');
const permissionRouter = require('./permission');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const modelRouter = require('./model');
const partmodelRouter = require('./partmodel');
const profileRouter = require('./profile');
const roleRouter = require('./role');


app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, *');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


const store = new pgSession({
  pgPromise: db
});
app.use(session({
  store: store,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 3600000} //1 hour
}));


app.all('*', function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
    return;
  }
  //no security level:
  if (
    req.url === '/logout' ||
    req.url === '/authenticate' ||
    req.url === '/login_status'
  ) {
    next();
    return;
  }
  //any session required:
  if (req.session.user) {
    if (
      req.url === '/model/all' ||
      req.url === '/model/close' ||
      req.url === '/model/upsert' ||
      req.url === '/model/changes' ||
      req.url.startsWith('/model/getModel')
    ) {
      next();
      return;
    }
    //permission bit field 1 required:
    if (parseInt(req.session.user.permission) === 1) {
      if (
        req.url.startsWith('/user') ||
        req.url.startsWith('/profile') ||
        req.url.startsWith('/model') ||
        req.url.startsWith('/permission') ||
        req.url.startsWith('/role')
      ) {
        next();
        return;
      }
    }
  } else {
    res.status(401).send({message: 'you have no session'});
    return;
  }
  res.status(401).send({message: 'not enoth permissions you permissions are: ' + req.session.user});
});


app.use('/user', userRouter);
app.use('/permission', permissionRouter);
app.use('/model', modelRouter);
app.use('/partmodel', partmodelRouter);
app.use('/profile', profileRouter);
app.use('/role', roleRouter);
app.use('/permission', permissionRouter);


/*
* URL:              /authenticate
* Method:           post
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       username: [string], password: [string], captcha: [string]
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      Checks if post parameters username, password and captcha are set,
*                   validates captcha,
*                   checks if username is in database,
*                   checks if user already has a session,
*                   checks if the password matches with the stored hash
*                   and finaly sets session.
* */

/**
 * @api                 {post} /authenticate authenticate
 * @apiDescription      authenticates a user and sets the Session
 * @apiName             authenticate
 * @apiGroup            session
 * @apiParam            {String} email Mandatory email of an user
 * @apiParam            {String} password Mandatory password of an user
 * @apiSuccess          {Array} data Array of Users.
 * @apiSuccess          {boolean} lastname  Lastname of the User.
 * @apiSuccessExample   Success-Resposne:
 *                      HTTP/1.1 200 OK
 *                      {message: 'Some nice Statustext', success: true, data: data, email: 'maxmuster@gmail.com'}
 * @apiError            Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      'Something happend'
 *                      HTTP/1.1 401 Failure
 *                      'User and password do not match'
 *                      HTTP/1.1 404 Failure
 *                      'User not found in the database'
 */
app.post('/authenticate', function (req, res) {
  try {
    var response = {};
    console.log(req);
    if (req.body.email) var email = req.body.email;
    else throw({status: 400, data: {message: 'missing email', success: false}});
    if (req.body.password) var password = req.body.password;
    else throw({status: 400, data: {message: 'missing password', success: false}});
    db.one('' +
      'SELECT uid, email, password, firstname, lastname, profile, permission ' +
      'FROM users ' +
      'LEFT JOIN userprofile On users.upid = userprofile.upid ' +
      'WHERE email = $1', email)
      .then(function (user) {
        if (!user) throw ({status: 400, data: {message: 'user not found', success: false}});
        bcrypt.compare(password, user.password, function (err, match) {
          if (err) throw (err);
          if (match) {
            // session.Store.destroy(sessions[index].sid);
            db.query('SELECT sess, sid FROM session')
              .then(function (sessions) {
                var users = [];
                for (var e in sessions) {
                  if (sessions[e].sess.user) users.push(sessions[e].sess.user.email);
                }
                if ((index = users.indexOf(user.email)) >= 0) {
                  store.destroy(sessions[index].sid, function (error) {
                    if (error) {
                      console.log(error);
                    }
                    response.message = 'success';
                    response.success = true;
                    response.email = user.email;
                    req.session.user = {
                      id: user.uid,
                      email: user.email,
                      firstname: user.firstname,
                      lastname: user.lastname,
                      profile: user.profile,
                      permission: user.permission
                    };
                    req.session.save(function (error) {
                      if (error) {
                        console.log(error);
                      }
                    });
                    res.send(response);
                  });
                }
                else {
                  response.message = 'success';
                  response.success = true;
                  response.email = user.email;
                  req.session.user = {
                    id: user.uid,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profile: user.profile,
                    permission: user.permission
                  };
                  req.session.save(function (error) {
                    if (error) {
                      console.log(error);
                    }
                  });
                  res.send(response);
                }
              })
              .catch(function (error) {
                console.log(error, 'something happend');
                res.status(400).send(error);
              });
          }
          else {
            res.status(401).send('User and password do not match');
          }
        });
      })
      .catch(function (error) {
        console.log(error);
        response.message = 'User not found in the database';
        res.status(404).send(response.message);
      });
  }
  catch (error) {
    console.log(error);
    res.status(error.status).send(error.data);
  }
});

/*
* URL:              /logout
* Method:           get
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      Checks if a session is already there and destroys it
* */
/**
 * @api                 {get} /logout logout
 * @apiDescription      logout
 * @apiName             logout
 * @apiGroup            session
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
app.get('/logout', function (req, res) {
  try {
    if (req.session.user) {
      req.session.destroy();
      res.status(200).clearCookie('connect.sid').send({message: 'logging out', success: true});
    }
    else throw({status: 200, data: {message: 'not logged in', success: false}});
  }
  catch (error) {
    console.log(error);
    res.status(error.status).send(error.data);
  }
});
/*
* URL:              /login_status
* Method:           get
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      Checks if a session is already there and destroys it
* */
/**
 * @api                 {get} /login_status login_status
 * @apiDescription      Checks if a session is already there and destroys it
 * @apiName             login_status
 * @apiGroup            session
 * @apiParam            {type} Mandatory thisIsRequired
 * @apiParam            {type} thisIsOptional
 * @apiParam            (login) {Session} user must be set(for routes that require a session or even permissions)
 * @apiSuccess          {Array} data Array of Users.
 * @apiSuccess          {boolean} lastname  Lastname of the User.
 * @apiSuccessExample   Success-Resposne:
 *                      HTTP/1.1 200 OK
 *                      {message: 'not logged in', success: true, loggedIn: false}
 */
app.get('/login_status', function (req, res) {
  try {
    if (req.session.user) {
      res.status(200).send({
        message: 'logged in as ' + req.session.user.profile,
        email: req.session.user.email,
        profile: req.session.user.profile,
        permission: req.session.user.permission,
        success: true,
        loggedIn: true
      });
    }
    else res.status(200).send({status: 200, data: {message: 'not logged in', success: true, loggedIn: false}});
  }
  catch (error) {
    console.log(error);
    res.status(error.status).send(error.data);
  }
});


app.listen(3000);

console.log('ExpressJS is up and running');