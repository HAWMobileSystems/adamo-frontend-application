const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


/**
 * @api                 {get} /role/all all
 * @apiDescription      Requests all roles from the database.
 * @apiName             all
 * @apiGroup            role
 * @apiSuccess          {Array} data Array of roles
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5, ...]
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.get('/all', function (req, res) {
    
    db.query('select rid, role, read, write, admin from role')
    .then(function (data) {
        console.log('DATA:', data)
        res.send({data: data, success: true});
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Something went wrong', success: false});
        })
    });


/**
 * @api                 {post} /role/create create
 * @apiDescription      Checks if post parameter role is set,
 *                      checks if the role exists already in database,
 *                      and if not, creates a new role.
 * @apiName             create
 * @apiGroup            role
 * @apiParam            {String} role Mandatory name of a role
 * @apiSuccess          status Role created successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Role created successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/create', function (req, res) {

    if(!req.body.role) {
        res.status(400).send({status: 'Role name may not be empty!'});
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
                res.status(400).send({status: 'Role name already exists'})
            } else {
                const tmpRead = (read == true); 
                const tmpWrite = (write == true);
                const tmpAdmin = (admin == true);
                const tmpQuery = 'insert into role (role, read, write, admin) values ($1, ' + tmpRead + ', ' + tmpWrite + ', ' + tmpAdmin + ')'
                console.log('querylog:', tmpQuery)
                db.oneOrNone(tmpQuery, [role])
                  .then(function (data) {
                    res.send({status: 'Role created successfully', success: true});
                })
                .catch(function (error) {
                    console.log('ERROR POSTGRES:', error)
                    res.status(400).send({status: 'Something went wrong', success: false});
                })
            }
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Something went wrong', success: false});
        })
    });
    

/**
 * @api                 {post} /role/update update
 * @apiDescription      Checks if post parameter role is set,
 *                      checks if the role exists already in database,
 *                      and updates the selected role.
 * @apiName             update
 * @apiGroup            role
 * @apiParam            {String} role Mandatory name of a role
 * @apiSuccess          status Role updated successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Role updated successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/update', function (req, res) {
    
    if(!req.body.role) {
        res.status(400).send({status: 'Role name may not be empty!'});
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
            res.status(400).send({status: 'Role name already exists'})
        } else {
            const tmpRead = (read == true); 
            const tmpWrite = (write == true);
            const tmpAdmin = (admin == true);
            const tmpQuery = 'update role set role = $1, read = ' + tmpRead + ', write = ' + tmpWrite + ', admin = ' + tmpAdmin + ' where rid = $2'
            console.log('querylog:', tmpQuery)
            db.oneOrNone(tmpQuery, [role, roleid])
             .then(function (data) {
                res.send({status: 'Role updated successfully', success: true});
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(400).send({status: 'Something went wrong', success: false});
            })
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({status: 'Something went wrong', success: false});
    })
});


/**
 * @api                 {post} /role/delete delete
 * @apiDescription      Checks if post parameter roleid is set,
 *                      checks if there are still permissions maintained to the selected role, 
 *                      and if not, finally deletes the selected role from the database.
 * @apiName             delete
 * @apiGroup            role
 * @apiParam            {Int} roleid Mandatory roleid of a role
 * @apiSuccess          status Role deleted successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Role deleted successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 *                      HTTP/1.1 401 Failure
 *                      {status: 'Role cannot be deleted as there are still permissions maintained', success: false}
 *                      HTTP/1.1 404 Failure
 *                      {status: 'Role does not exist', success: false}
 */
router.post('/delete', function (req, res) {

    const roleid = req.body.roleid;

    console.log(roleid);

    db.oneOrNone('select rid from role where rid =$1', [roleid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from role where rid =$1', [roleid])
            .then(function (data) {
                console.log('Role deleted ');
                res.send({status: 'Role deleted successfully', success: true});
            })
            .catch(function (error) {
                console.log('ERROR POSTGRES:', error)
                res.status(401).send({status: 'Role cannot be deleted as there are still permissions maintained', success: false});
            })
        } else {
            res.status(404).send({status: 'Role does not exist', success: false})
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({status: 'Something went wrong', success: false});
    })
});


module.exports = router;