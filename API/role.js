const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


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
    
    db.query('select rid, role, read, write, admin from role')
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

    if(!req.body.role) {
        res.status(400).send({ status: 'Role name may not be empty!'});
        return;
    }   

    const role = req.body.role;
    const read = req.body.read;
    const write = req.body.write;
    const admin = req.body.admin;

    console.log(role + ' ' + read + ' ' + write + ' ' + admin);
   
    db.oneOrNone('select role from role where role = $1', [role])
        .then(function (data) {
            if(data){
                res.status(400).send({ status: 'Role name already exists'})
            } else {
                const tmpRead = (read == true); 
                const tmpWrite = (write == true);
                const tmpAdmin = (admin == true);
                const tmpQuery = 'insert into role (role, read, write, admin) values ($1, ' + tmpRead + ', ' + tmpWrite + ', ' + tmpAdmin + ')'
                console.log('querylog:', tmpQuery)
                db.oneOrNone(tmpQuery, [role])
                  .then(function (data) {
                    res.send({ status: 'Role created successfully', success: true});
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
    
    if(!req.body.role) {
        res.status(400).send({ status: 'Role name may not be empty!'});
        return;
    }  

    const roleid = req.body.roleid;
    const role = req.body.role;
    const read = req.body.read;
    const write = req.body.write;
    const admin = req.body.admin;

    console.log(roleid + ' ' + role + ' ' + read + ' ' + write + ' ' + admin);
    
    db.oneOrNone('select role from role where role = $1', [role])
    .then(function (data) {
        if(data && data.rid !== +roleid){
            console.log('MeinLOG', data, data.roleid, role, +roleid)
            res.status(400).send({ status: 'Role name already exists'})
        } else {
            const tmpRead = (read == true); 
            const tmpWrite = (write == true);
            const tmpAdmin = (admin == true);
            const tmpQuery = 'update role set role = $1, read = ' + tmpRead + ', write = ' + tmpWrite + ', admin = ' + tmpAdmin + ' where rid = $2'
            console.log('querylog:', tmpQuery)
            db.oneOrNone(tmpQuery, [role, roleid])
             .then(function (data) {
                res.send({ status: 'Role updated successfully', success: true});
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

    const roleid = req.body.roleid;

    console.log(roleid);

    db.oneOrNone('select rid from role where rid =$1', [roleid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from role where rid =$1', [roleid])
            .then(function (data) {
                console.log('Role deleted ');
                res.send({ status: 'Role deleted successfully', success: true});
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({ status: 'Role cannot be deleted as there are still permissions maintained'});
            })
        } else {
            res.status(400).send({ status: 'Role does not exist'})
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});


module.exports = router;