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
  res.status(401).send({message: 'not enoth permissions you permissions are: '+ req.session.user});
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
//TODO reCaptcha
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
            /* response.message = 'User and password do not match';
             response.success = false;*/
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
app.get('/models/:id/:name', function (req, res) {

    const name = req.params.name;
    const id = req.params.id;
    console.log("Params: " + req.params.id + " " + req.params.name);
    db.one('SELECT $1 AS value', req.params.id)
        .then(function (data) {
            console.log('DATA:', data.value)
            res.send(data.value);
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
        })


});

app.get('/models', function (req, res) {
    const name = req.query.name;
    const id = req.query.id;
    db.one('SELECT $1 AS value', 123)
        .then(function (data) {
            console.log('DATA:', data.value)
            res.send(data.value);
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available ID:" + id + " Name:" + name);
        })


});

app.get('/model', function (req, res) {
    const id = req.query.id;
    db.one('SELECT $1 AS value', 123)
        .then(function (data) {
            console.log('DATA:', data.value)
            res.send(data.value);
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available ID:" + id + " Name:" + name);
        })


});

/*
* URL:              /getmodel/:mid
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
*
app.get('/getmodel/:mid', function (req, res) {

    const mid = req.params.mid;
    console.log(req.params)
    db.one('select * from model where mid = $1', [mid])
        .then(function (data) {
            console.log('DATA:', data)
            res.send({ data: data, success: true});
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error);
            res.status(400).send({ status: 'Database not available'});
        })
});


/*
* URL:              /getallmodels
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
* 
app.get('/getallmodels', function (req, res) {

    db.query('select * from model')
    .then(function (data) {
        console.log('DATA:', data)
        res.send({ data: data, success: true});
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({ status: 'Database not available'});
        })
    });


/*
* URL:              /modelcreate
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
* 

app.post('/modelcreate', function (req, res) {

    if(!req.body.modelname) {
        res.status(400).send({ status: 'Model name may not be empty!'});
         return;
     }   
 
     const modelname = req.body.modelname;
     const modelxml = req.body.modelxml;
     const version = req.body.version;
 
     console.log(modelname + ' ' + modelxml + ' ' + version);
 
     db.oneOrNone('select from model where modelname = $1', [modelname])
         .then(function (data) {
             if(data){
                res.status(400).send({ status: 'Model name already exists'})
             } else {
                 db.oneOrNone('insert into model (modelname, modelxml, version) values ($1, $2, $3)', [modelname, modelxml, version])
               .then(function (data) {
                     res.send({ status: 'Model created successfully', success: true});
                 })
                 .catch(function (error) {
                     console.log('ERROR POSTGRES:', error)
                     res.status(400).send({ status: 'Database not available'});
                 })
             }
         })
         .catch(function (error) {
             console.log('ERROR POSTGRES:', error)
             res.status(400).send({ status: 'Database not available'});
         })
     });


/*
* URL:              /modelupdate
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
* 

app.post('/modelupdate', function (req, res) {

    if(!req.body.modelname) {
        res.status(400).send({ status: 'Model name may not be empty!'});
         return;
     }   
 
     const mid = req.body.mid;
     const modelname = req.body.modelname;
     const lastchange = req.body.lastchange;
     const modelxml = req.body.modelxml;
     const version = req.body.version;
 
     console.log(mid + ' ' + modelname + ' ' + modelxml + ' ' + version);
     
         db.oneOrNone('select * from model where modelname = $1', [modelname])
         .then(function (data) {
             if(data && data.mid !== +mid){
                res.status(400).send({ status: 'Model name already exists'})
             } else {
                 db.oneOrNone('update model set modelname = $1, modelxml = $2, version= $3 where mid = $4', [modelname, modelxml, version, mid])
                 .then(function (data) {
                     res.send({ status: 'Model updated successfully', success: true});
             })
             .catch(function (error) {
                 console.log('ERROR POSTGRES:', error)
                 res.status(400).send({ status: 'Database not available'});
             })
         }
     })
     .catch(function (error) {
         console.log('ERROR POSTGRES:', error)
         res.status(400).send({ status: 'Database not available'});
     })
 });


/*
* URL:              /modeldelete
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
* 

app.delete('/modeldelete', function (req, res) {

    if(!req.body.mid) {
        res.status(400).send({ status: 'Model may not be empty!'});
        return;
    }
    const mid = req.body.mid;

    console.log(mid);

    db.oneOrNone('select from model where mid = $1', [mid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from permission where mid = $1; delete from model where mid = $1', [mid])
            .then(function (data) {
                console.log('Model deleted ');
                res.send({ status: 'Model deleted successfully', success: true});
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({ status: 'Model cannot be deleted as it is maintained as a partial model'});
            })
    } else {
        res.status(400).send({ status: 'Model does not exist'})
     }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});


/*
* URL:              /getpartmodel
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
*

app.post('/getpartmodel', function (req, res) {

    const pmid = req.body.pmid

    db.query('select * from partialmodel where pmid = $1', [pmid])
    .then(function (data) {
        console.log('DATA:', data)
        res.send({ data: data, success: true});
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({ status: 'Database not available'});
        })
    });

    /*
    * URL:              /partmodelcreate
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
    * 
    
    app.post('/partmodelcreate', function (req, res) {
    
        if(!req.body.mid) {
            res.status(400).send({ status: 'Model may not be empty!'});
            return;
        }  
        
        const mid = req.body.mid;
    
        console.log(mid);
    
        db.oneOrNone('select from partialmodel where mid = $1', [mid])
        .then(function (data) {
            if(data){
                res.status(400).send({ status: 'Partial model already exists'})
            } else {
                db.oneOrNone('insert into partialmodel (mid) values ($1)', [mid])
                .then(function (data) {
                         res.send({ status: 'Model created successfully as a partial model', success: true});
                        })
                        .catch(function (error) {
                            console.log('ERROR POSTGRES:', error)
                            res.status(400).send({ status: 'Database not available'});
                        })
                    }
                })
                .catch(function (error) {
                    console.log('ERROR POSTGRES:', error)
                    res.status(400).send({ status: 'Database not available'});
        })
    });

/*
* URL:              /partmodeldelete
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
* 

app.delete('/partmodeldelete', function (req, res) {

    if(!req.body.pmid) {
        res.status(400).send({ status: 'Part model may not be empty!'});
        return;
    }
    const pmid = req.body.pmid;

    console.log(pmid);

    db.oneOrNone('select from partialmodel where pmid = $1', [pmid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from partialmodel where pmid = $1', [pmid])
            console.log('data is ', data);
            res.send({ status: 'Partial model deleted successfully', success: true});
        } else {
            res.status(400).send({ status: 'Partial model does not exist'})
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});


/*
* URL:              /getallusers
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
* 

app.get('/getallusers', function (req, res) {
    
    db.query('' +
      'SELECT * ' +
      'FROM users ' +
      'LEFT JOIN userprofile ON users.upid = userprofile.upid')
    .then(function (data) {
        console.log('DATA:', data)
        res.send({ data: data, success: true});
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({ status: 'Database not available', error: 'Database not available', success: false});
        })
    });


/*
* URL:              /usercreate
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
* 

app.post('/usercreate', function (req, res) {

    if(!req.body.firstname) {
        res.status(400).send({ status: 'First name may not be empty!'});
        return;
    }   
    if(!req.body.lastname) {
        res.status(400).send({ status: 'Last name may not be empty!'});
        return;
    }
    if(!req.body.email) {
        res.status(400).send({ status: 'E-Mail may not be empty!'});
        return;
    }
    if(!req.body.password) {
        res.status(400).send({ status: 'Password may not be empty!'});
        return;
    }    
    if(!req.body.upid) {
        res.status(400).send({ status: 'User profile may not be empty!'});
        return;
    }   

    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = bcrypt.hash(req.body.password, 72);
    const upid = req.body.upid;


    console.log(firstname + ' ' + lastname + ' ' + email + ' ' + password);

    db.oneOrNone('select from users where email = $1', [email])
        .then(function (data) {
            if(data){
                res.status(400).send({ status: 'User already exists'})
            } else {
                db.oneOrNone('insert into users (firstname, lastname, email, password, upid) values ($1, $2, $3, $4, $5)', [firstname, lastname, email, password, upid])
                .then(function () {
                    res.send({ status: 'User created successfully', success: true});
                })
                .catch(function (error) {
                    console.log('ERROR POSTGRES:', error);
                    res.status(400).send({ status: 'Database not available'});
                })
            }
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error);
            res.status(400).send({ status: 'Database not available'});
        })
    });

    
/*
* URL:              /userupdate
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
* 

app.post('/userupdate', function (req, res) {

    if(!req.body.uid) {
        res.status(400).send({ status: 'User may not be empty!'});
        return;
    }
    if(!req.body.firstname) {
        res.status(400).send({ status: 'First name may not be empty!'});
        return;
    }   
    if(!req.body.lastname) {
        res.status(400).send({ status: 'Last name may not be empty!'});
        return;
    }
    if(!req.body.email) {
        res.status(400).send({ status: 'E-Mail may not be empty!'});
        return;
    }
    if(!req.body.password) {
        res.status(400).send({ status: 'Password may not be empty!'});
        return;
    }    
    if(!req.body.upid) {
        res.status(400).send({ status: 'User profile may not be empty!'});
        return;
    }  

    const uid = req.body.uid;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const upid = req.body.upid;

    console.log(uid + ' ' + firstname + ' ' + lastname + ' ' + email + ' ' + password + ' ' + upid );
    
    db.oneOrNone('select from users where email = $1', [email])
    .then(function (data) {
        if(data){
            res.status(400).send({ status: 'User already exists'})
        } else {
             db.oneOrNone('update users set firstname = $1, lastname = $2, email = $3, password = $4, upid = $5 where uid = $6', [firstname, lastname, email, password, upid, uid])
             .then(function (data) {
                 console.log('data is ', data);
                res.send({ status: 'User updated successfully', success: true});
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({ status: 'Database not available'});
            })
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});


/*
* URL:              /userdelete
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
* 

app.delete('/userdelete', function (req, res) {

    if(!req.body.uid) {
        res.status(400).send({ status: 'User may not be empty!'});
        return;
    }

    const uid = req.body.uid;

    console.log(uid); 

    db.oneOrNone('select from users where uid = $1', [uid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from permission where uid = $1; delete from users where uid = $1', [uid])
            .then(function (data) {
                console.log('User deleted ');
                res.send({ status: 'User deleted successfully', success: true});
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({ status: 'Error while deleting user'});
            })
        } else {
            res.status(400).send({ status: 'User does not exist'})
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});



/*
* URL:              /getallprofiles
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
* 

app.get('/getallprofiles', function (req, res) {
    
    db.query('select * from userprofile')
    .then(function (data) {
        console.log('DATA:', data)
        res.send({ data: data, success: true});
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({ status: 'Database not available'});
        })
    });


/*
* URL:              /profilecreate
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
* 

app.post('/profilecreate', function (req, res) {

    if(!req.body.profile) {
        res.status(400).send({ status: 'Profile name may not be empty!'});
        return;
    }   

    const profile = req.body.profile;
    const permission = req.body.permission;

    console.log(profile + ' ' + permission);
   
    db.oneOrNone('select from userprofile where profile = $1', [profile])
        .then(function (data) {
            if(data){
                res.status(400).send({ status: 'User profile already exists'})
            } else {
                  db.oneOrNone('insert into userprofile (profile, permission) values ($1, $2)', [profile, permission])
                  .then(function (data) {
                    res.send({ status: 'User profile created successfully'}); 
                })
                .catch(function (error) {
                    console.log('ERROR POSTGRES:', error)
                    res.status(400).send({ status: 'Database not available'});
                })
            }
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({ status: 'Database not available'});
        })
    });
    

    /*
* URL:              /profileupdate
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
* 

app.post('/profileupdate', function (req, res) {
    
    if(!req.body.profile) {
        res.status(400).send({ status: 'Profile name may not be empty!'});
        return;
    }  
    if(!req.body.upid) {
        res.status(400).send({ status: 'User profile may not be empty!'});
        return;
    }  

    const upid = req.body.upid;
    const profile = req.body.profile;
    const permission = req.body.permission;

    console.log(upid + ' ' + profile + ' ' + permission);

    
    db.oneOrNone('select from userprofile where profile = $1', [profile])
    .then(function (data) {
        if(data){
            res.status(400).send({ status: 'User profile already exists'})
        } else {
             db.oneOrNone('update userprofile set profile = $1, permission = $2 where upid = $3', [profile, permission, upid])
             .then(function (data) {
                res.send({ status: 'User profile updated successfully'}); 
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({ status: 'Database not available'});
            })
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});


/*
* URL:              /profiledelete
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
* 

app.delete('/profiledelete', function (req, res) {

    if(!req.body.upid) {
        res.status(400).send({ status: 'User profile may not be empty!'});
        return;
    }
    const upid = req.body.upid;

    console.log(upid);

    db.oneOrNone('select from userprofile where upid = $1', [upid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from userprofile where upid =$1', [upid])
            .then(function (data) {
                res.send({ status: 'User profile deleted successfully', success: true});
            })
            .catch(function (error) {
              console.log('ERROR POSTGRES:', error)
                res.status(400).send({ status: 'User profile cannot be deleted as it is used by other users'});
            })
    } else {
        res.status(400).send({ status: 'User profile does not exist'})
     }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});


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


/*
* URL:              /permissioncreate
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
* 

app.post('/permissioncreate', function (req, res) {

    if(!req.body.mid) {
        res.status(400).send({ status: 'Model may not be empty!'});
        return;
    }  
    if(!req.body.uid) {
        res.status(400).send({ status: 'User may not be empty!'});
        return;
    }  
    if(!req.body.rid) {
        res.status(400).send({ status: 'Role may not be empty!'});
        return;
    }  

    const mid = req.body.mid;
    const uid = req.body.uid;
    const rid = req.body.rid;

    console.log(mid + ' ' + uid + ' ' + rid);
   
    db.oneOrNone('select from permission where mid = $1 and uid = $2 and rid = $3', [mid, uid, rid])
    .then(function (data) {
        if(data){
            res.status(400).send({ status: 'Permission already exists'})
        } else {
            db.oneOrNone('insert into permission (mid, uid, rid) values ($1, $2, $3)', [mid, uid, rid])
                .then(function (data) {
                     res.send({ status: 'Permission created successfully', success: true});
                    })
                    .catch(function (error) {
                        console.log('ERROR POSTGRES:', error)
                        res.status(400).send({ status: 'Database not available'});
                    })
                }
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({ status: 'Database not available'});
            })
        });


    /*
* URL:              /permissionupdate
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
* 

app.post('/permissionupdate', function (req, res) {

    if(!req.body.mid) {
        res.status(400).send({ status: 'Model may not be empty!'});
        return;
    }  
    if(!req.body.uid) {
        res.status(400).send({ status: 'User may not be empty!'});
        return;
    }  
    if(!req.body.rid) {
        res.status(400).send({ status: 'Role may not be empty!'});
        return;
    }  

    const pid = req.body.pid;
    const mid = req.body.mid;
    const uid = req.body.uid;
    const rid = req.body.rid;

    console.log(pid + ' ' + mid + ' ' + uid + ' ' + rid);
   
    db.oneOrNone('select from permission where mid = $1 and uid = $2 and rid = $3', [mid, uid, rid])
    .then(function (data) {
        if(data){
            res.status(400).send({ status: 'Permission already exists'})
        } else {
            db.oneOrNone('update permission set mid = $1, uid = $2, rid = $3 where pid = $4', [mid, uid, rid, pid])
                .then(function (data) {
                     res.send({ status: 'Permission updated successfully', success: true});
                    })
                    .catch(function (error) {
                        console.log('ERROR POSTGRES:', error)
                        res.status(400).send({ status: 'Database not available'});
                    })
                }
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({ status: 'Database not available'});
            })
        });


/*
* URL:              /permissiondelete
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
* 

app.delete('/permissiondelete', function (req, res) {

    const pid = req.body.pid;

    console.log(pid);

    db.oneOrNone('select from permission where pid = $1', [pid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from permission where pid = $1', [pid])
            console.log('data is ', data);
            res.send({ status: 'Permission deleted successfully', success: true});
        } else {
            res.status(400).send({ status: 'Permission does not exist'})
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});


app.post('/', function (req, res) {
    res.send('Got a POST request')
});


    /*try{
        console.log(req.body.email);

        db.one('SELECT password AS value from users where username =' + req.body.email)
        .then(function (data) {
            console.log('DATA:', data.value)
            res.send(data.value);
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
        })*/

/*res.cookie('demoCookie', 123, { maxAge: 900000, httpOnly: true });
var response = {};

if (req.body.email) var username = req.body.email;
else throw({status: 400, data: {message: 'missing username', success: false}});
if (req.body.email) var email = req.body.email;
else throw({status: 400, data: {message: 'missing email', success: false}});
if (req.body.password) var password = req.body.password;
else throw({status: 400, data: {message: 'missing password', success: false}});

db.one('insert into users (uid, username, email, password)', username)
    .then(function (user) {
        if (!user) throw ({status: 400, data: {message: 'user not found', success: false}});
    }
    )}*/





