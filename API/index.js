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
  console.error(req.session.user);
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
    console.error('1');
    return;
  }
  //any session required:
  if (req.session.user) {
    if (
      req.url === '/model/all' ||
      req.url.startsWith('/model/getModel')
    ) {
      next();
      console.error('2');
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
        console.error('3');
        return;
      }
    }
  } else {
    res.status(401).send('you have no session');
    console.error('4');
    return;
  }
  res.status(401).send('not enoth permissions you permissions are: ', req.session.user);
  console.error('5');
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
app.post('/authenticate', function (req, res) {
  try {
    res.cookie('demoCookie', 123, {maxAge: 900000, httpOnly: true});
    var response = {};
    console.log(req);
    if (req.body.email) var email = req.body.email;
    else throw({status: 400, data: {message: 'missing email', success: false}});
    if (req.body.password) var password = req.body.password;
    else throw({status: 400, data: {message: 'missing password', success: false}});
    // if (req.body.captcha) var captcha = req.body.captcha;
    // else throw({status: 400, data: {message: 'missing captcha', success: false}});
    //TODO what to do when client is already logged in with different credentials?
    //TODO validate captcha could be the first thing to do
    db.one('' +
      'SELECT uid, email, password, firstname, lastname, profile, permission ' +
      'FROM users ' +
      'LEFT JOIN userprofile On users.upid = userprofile.upid ' +
      'WHERE email = $1', email)
      .then(function (user) {
        if (!user) throw ({status: 400, data: {message: 'user not found', success: false}});

        //for debugging: '12341234' matches '$2a$10$vs1hHVA3BZw2Gma3pOIzcOZ1LgROzaUjL3EcVWG6QgbPK/ZFtGCJi'
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
                  req.session.user = {
                    id: user.uid,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    profile: user.profile,
                    permission: user.permission
                  }
                  req.session.save(function (error) {
                    if (error) {
                      console.log(error);
                    }
                  });
                  res.send(response);
                }
                ;
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
app.get('/login_status', function (req, res) {
  try {
    if (req.session.user) {
      res.status(200).send({
        message: 'logged in as ' + req.session.user.profile,
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

/*
* URL:              /user
* Method:           get
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      Checks if there is a session (user is logged in or not) and sends user credentials
* */
app.get('/user', function (req, res) {
  try {
    if (req.session.user) {
      res.status(200).send({message: 'success', success: true, data: req.session.user});
    }
    else throw({status: 400, data: {message: 'not logged in', success: false}});
  }
  catch (error) {
    console.log(error);
    res.status(error.status).send(error.data);
  }
});


/*
* URL:              /users
* Method:           get
* URL Params:
*   Required:       none
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      Checks if there is a session (user is logged in or not)
*                   and sends user credentials of all sessions (all logged inusers)
* */
app.get('/users', function (req, res) {
  try {
    if (req.session.user) {
      db.query('SELECT sess FROM session')
        .then(function (sessions) {
          var users = [];
          for (var e in sessions) {
            if (sessions[e].sess.user) users.push(sessions[e].sess.user);
          }
          res.status(200).send({message: 'success', success: true, data: users});
        })
        .catch(function (error) {
          res.status(400).send({message: 'db error', success: false, error: error});
        });
    }
    else throw({status: 400, data: {message: 'not logged in', success: false}});
  }
  catch (error) {
    console.log(error);
    res.status(error.status).send(error.data);
  }
});

/*TODO
* URL:              /register
* Method:           post
* URL Params:
*   Required:       username: [string], password: [string], captcha: [string], firstname: [string], lastname: [string]
*   Optional:       none
* Data Params:
*   Required:       none
*   Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:
* */
app.post('/register', function (req, res) {
  try {

  }
  catch (error) {
    console.log(error);
    res.status(error.status).send(error.data);
  }
});

app.get('/', function (req, res) {
  res.send("IPIM Server is Running");
});

app.listen(3000);

console.log('ExpressJS is up and running');


/*
* URL:              /getallroles
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

app.get('/getallroles', function (req, res) {

  db.query('select * from role')
    .then(function (data) {
      console.log('DATA:', data)
      res.send({data: data, success: true});
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'});
    })
});


/*
* URL:              /rolecreate
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

app.post('/rolecreate', function (req, res) {

  if (!req.body.role) {
    res.status(400).send({status: 'Role name may not be empty!'});
    return;
  }

  const role = req.body.role;
  const read = req.body.read;
  const write = req.body.write;
  const admin = req.body.admin;

  console.log(role + ' ' + read + ' ' + write + ' ' + admin);

  db.oneOrNone('select from role where role = $1', [role])
    .then(function (data) {
      if (data) {
        res.status(400).send({status: 'Role name already exists'})
      } else {
        db.oneOrNone('insert into role (role, read, write, admin) values ($1, $2, $3, $4)', [role, read, write, admin])
          .then(function (data) {
            res.send({status: 'Role created successfully'});
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Database not available'});
          })
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'});
    })
});

/*
* URL:              /roleupdate
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

app.post('/roleupdate', function (req, res) {

  if (!req.body.role) {
    res.status(400).send({status: 'Role name may not be empty!'});
    return;
  }

  const rid = req.body.rid;
  const role = req.body.role;
  const read = req.body.read;
  const write = req.body.write;
  const admin = req.body.admin;

  console.log(rid + ' ' + role + ' ' + read + ' ' + write + ' ' + admin);

  db.oneOrNone('select from role where role = $1', [role])
    .then(function (data) {
      if (data) {
        res.status(400).send({status: 'Role name already exists'})
      } else {
        db.oneOrNone('update role set role = $1, read = $2, write = $3, admin = $4 where rid = $5', [role, read, write, admin, rid])
          .then(function (data) {
            res.send({status: 'Role updated successfully', success: true});
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Database not available'});
          })
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'});
    })
});


/*
* URL:              /roledelete
* Method:           delete
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

app.delete('/roledelete', function (req, res) {

  const rid = req.body.rid;

  console.log(rid);

  db.oneOrNone('select from role where rid =$1', [rid])
    .then(function (data) {
      if (data) {
        db.oneOrNone('delete from role where rid =$1', [rid])
          .then(function (data) {
            console.log('Role deleted ');
            res.send({status: 'Role deleted successfully', success: true});
          })
          .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Role cannot be deleted as there are still permissions maintained'});
          })
      } else {
        res.status(400).send({status: 'Role does not exist'})
      }
    })
    .catch(function (error) {
      console.log('ERROR POSTGRES:', error)
      res.status(400).send({status: 'Database not available'});
    })
});