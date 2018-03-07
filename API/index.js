var express = require('express');
var app = express();

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
// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// })



// Database Part

var pgp = require('pg-promise')(/*options*/)

var cn = {
    host: 'localhost',
    port: 5432,
    database: 'ipim',
    user: 'postgres',
    password: '12341234'
};

var db = pgp(cn);


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

var bcrypt = require('bcrypt');


var session = require('express-session');
var pgSession = require('connect-pg-simple')(session)
var store = new pgSession({
    pgPromise: db
});
app.use(session({
    store: store,
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 3600000} //1 hour
}));

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

        res.cookie('demoCookie', 123, { maxAge: 900000, httpOnly: true });
        var response = {};
        if (req.body.username) var username = req.body.username;
        else throw({status: 400, data: {message: 'missing username', success: false}});
        if (req.body.password) var password = req.body.password;
        else throw({status: 400, data: {message: 'missing password', success: false}});
        // if (req.body.captcha) var captcha = req.body.captcha;
        // else throw({status: 400, data: {message: 'missing captcha', success: false}});
        //TODO what to do when client is already logged in with different credentials?
        //TODO validate captcha could be the first thing to do
        db.one('select id, username, password, firstname, lastname, role from users where username = $1', username)
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
                                    if (sessions[e].sess.user) users.push(sessions[e].sess.user.username);
                                }
                                if ((index = users.indexOf(user.username)) >= 0) {
                                    store.destroy(sessions[index].sid, function (error) {
                                        if (error){
                                            console.log(error);
                                        }
                                        response.message = 'success';
                                        response.success = true;
                                        req.session.user = {
                                            id: user.id,
                                            username: user.username,
                                            firstname: user.firstname,
                                            lastname: user.lastname,
                                            role: user.role
                                        };
                                        req.session.save(function (error) {
                                            if (error){
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
                                        id: user.id,
                                        username: user.username,
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        role: user.role
                                    }
                                    req.session.save(function (error) {
                                        if (error){
                                            console.log(error);
                                        }
                                    });
                                    res.send(response);
                                };
                            })
                            .catch(function (error) {
                                console.log(error, 'something happend');
                                res.status(400).send(error);
                            });
                    }
                    else {
                        response.message = 'User and password do not match';
                        response.success = false;
                        res.status(401).send(response);
                    }
                });
            })
            .catch(function (error) {
                console.log(error);
                response.message = 'Database error';
                response.success = false;
                response.error = error,
                res.status(404).send(response);
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
                message: 'logged in as ' + req.session.user.role,
                success: true,
                loggedIn: true,
                data: req.session.user.role
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
* */

app.get('/getallmodels', function (req, res) {
    let x = '7411';
    res.send(x);
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
* */

app.post('/modelcreate', function (req, res) {

    const name = req.body.name;
    const lc = req.body.lastchange;
    const xml = req.body.modelxml;
    const version = req.body.version;

    console.log(name + ' ' + lc + ' ' + xml + ' ' + version);

    db.oneOrNone('insert into model (modelname, lastchange, modelxml, version) values ($1, $2, $3, $4)', [name, lc, xml, version])
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Model inserted successfully'});
            }            
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.post('/modelupdate', function (req, res) {

    const mid = req.query.modelid;
    const name = req.body.name;
    const lc = req.body.lastchange;
    const xml = req.body.modelxml;
    const version = req.body.version;

    console.log(mid + ' ' + name + ' ' + lc + ' ' + xml + ' ' + version);
    
    db.oneOrNone('update model set modelname' == name, 'and lastchange' == lc, ' and modelxml' == xml, 'and version' == version, 'where mid' == mid)
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Model updated successfully'});
            }       
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.delete('/modeldelete', function (req, res) {

    const mid = req.query.modelid;

    console.log(mid);

    db.oneOrNone('delete * from model where mid' == mid)
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Model deleted successfully'});
            }  
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.get('/getpartmodel', function (req, res) {

    const pmid = req.query.partmodelid;
    const mid = req.query.modelid;
    
    console.log(pmid + ' ' + mid);
    
    db.oneOrNone('update model set modelname' == name, 'and lastchange' == lc, ' and modelxml' == xml, 'and version' == version, 'where mid' == mid)
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Model updated successfully'});
            }       
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.post('/partmodelcreate', function (req, res) {

    const mid = req.body.modelid;

    console.log(mid);

    db.oneOrNone('insert into partialmodel (mid) values ($1)', [mid])
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Partialmodel inserted successfully'});
            }            
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.delete('/partmodeldelete', function (req, res) {

    const mid = req.query.modelid;

    console.log(mid);

    db.oneOrNone('delete * from model where mid' == mid)
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Model deleted successfully'});
            }  
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.get('/getallUsers', function (req, res) {
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
* */

app.post('/usercreate', function (req, res) {

    const name = req.body.name;
    const pw = req.body.password;
    const fname = req.body.firstname;
    const lname = req.body.lastname;

    console.log(name + ' ' + pw + ' ' + fname + ' ' + lname);

    db.oneOrNone('insert into users (username, password, firstname, lastname) values ($1, $2, $3, $4)', [name, pw, fname, lname])
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'User inserted successfully'});
            }            
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.post('/userupdate', function (req, res) {

    const uid = req.body.userid;
    const name = req.body.name;
    const pw = req.body.password;
    const fname = req.body.firstname;
    const lname = req.body.lastname;

    console.log(uid + ' ' + name + ' ' + pw + ' ' + fname + ' ' + lname);
    
    db.oneOrNone('update users set username = $1, password = $2, firstname = $3, lastname = $4 where id = $5', [name, pw, fname, lname, uid])
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'User updated successfully'});
            }       
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.delete('/userdelete', function (req, res) {

    const uid = req.body.userid;

    console.log(uid);

    db.oneOrNone('delete from users where id = $1', [uid])
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'User deleted successfully'});
            }  
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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

    const role = req.body.role;
    const read = req.body.read;
    const write = req.body.write;
    const admin = req.body.admin;

    console.log(role + ' ' + read + ' ' + write + ' ' + admin);
   
    db.oneOrNone('insert into role (role, read, write, admin) values ($1, $2, $3, $4)', [role, read, write, admin])
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Role inserted successfully'});
            }
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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

    const rid = req.query.roleid;
    const role = req.body.role;
    const read = req.body.read;
    const write = req.body.write;
    const admin = req.body.admin;

    console.log(rid + ' ' + role + ' ' + read + ' ' + write + ' ' + admin);
    
    db.oneOrNone('update role set role' == role, 'and read' == read, ' and write' == write, 'and admin' == admin, 'where rid' == rid)
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Role updated successfully'});
            }       
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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

    const rid = req.query.roleid;

    console.log(rid);

    db.oneOrNone('delete * from users where rid' == rid)
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Role deleted successfully'});
            }  
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.post('/permissioncreate', function (req, res) {

    const role = req.body.role;
    const read = req.body.read;
    const write = req.body.write;
    const admin = req.body.admin;

    console.log(role + ' ' + read + ' ' + write + ' ' + admin);
   
    db.oneOrNone('insert into role (role, read, write, admin) values ($1, $2, $3, $4)', [role, read, write, admin])
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Role inserted successfully'});
            }
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.post('/permissionupdate', function (req, res) {

    const rid = req.query.roleid;
    const role = req.body.role;
    const read = req.body.read;
    const write = req.body.write;
    const admin = req.body.admin;

    console.log(rid + ' ' + role + ' ' + read + ' ' + write + ' ' + admin);
    
    db.oneOrNone('update role set role' == role, 'and read' == read, ' and write' == write, 'and admin' == admin, 'where rid' == rid)
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Role updated successfully'});
            }       
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
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
* */

app.delete('/permissiondelete', function (req, res) {

    const rid = req.query.roleid;

    console.log(rid);

    db.oneOrNone('delete * from users where rid' == rid)
        .then(function (data) {
            if(data) {
                console.log('DATA:', data.value)
                res.send(data.value);
            } else {
                res.send({ status: 'Role deleted successfully'});
            }  
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.send("Database not available");
        })
    });



app.post('/', function (req, res) {
    res.send('Got a POST request')
});

app.listen(3000);


    /*try{
        console.log(req.body.username);

        db.one('SELECT password AS value from users where username =' + req.body.username)
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
        
        if (req.body.username) var username = req.body.username;
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





