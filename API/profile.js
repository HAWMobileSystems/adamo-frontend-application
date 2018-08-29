const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


/**
 * @api                 {get} /profile/all all
 * @apiDescription      Requests all user profiles from the database.
 * @apiName             all
 * @apiGroup            profile
 * @apiSuccess          {Array} data Array of profiles
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5, ...]
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.get('/all', function (req, res) {
    
    db.query('select upid, profile, permission from userprofile')
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
 * @api                 {post} /profile/create create
 * @apiDescription      Checks if post parameter profile is set,
 *                      checks if the user profile exists already in database,
 *                      and if not, creates a new profile.
 * @apiName             create
 * @apiGroup            profile
 * @apiParam            {String} profile Mandatory name of a profile
 * @apiSuccess          status User profile created successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'User profile created successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.post('/create', function (req, res) {

    if(!req.body.profile) {
        res.status(400).send({status: 'Profile name may not be empty!'});
        return;
    }   

    const profile = req.body.profile;
    const permission = req.body.permission;

    console.log(profile + ' ' + permission);
   
    db.oneOrNone('select profile from userprofile where profile = $1', [profile])
        .then(function (data) {
            if(data){
                res.status(400).send({status: 'User profile already exists'})
            } else {
                  db.oneOrNone('insert into userprofile (profile, permission) values ($1, $2)', [profile, permission])
                  .then(function (data) {
                    res.send({status: 'User profile created successfully', success: true}); 
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
 * @api                 {post} /profile/update update
 * @apiDescription      Checks if post parameters profile and profileid are set,
 *                      checks if the user profile exists already in database,
 *                      and updates the selected profile.
 * @apiName             update
 * @apiGroup            profile
 * @apiParam            {Int} profileid Mandatory profileid of a profile
 * @apiParam            {String} profile Mandatory name of a profile
 * @apiSuccess          status User profile updated successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'User profile updated successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */ 
router.post('/update', function (req, res) {
    
    if(!req.body.profile) {
        res.status(400).send({status: 'Profile name may not be empty!'});
        return;
    }  
    if(!req.body.profileid) {
        res.status(400).send({status: 'User profile may not be empty!'});
        return;
    }  

    const profileid = req.body.profileid;
    const profile = req.body.profile;
    const permission = req.body.permission;

    console.log(profileid + ' ' + profile + ' ' + permission);

    
    db.oneOrNone('select profile from userprofile where profile = $1', [profile])
    .then(function (data) {
        if(data && data.profileid !== +profileid){
            console.log(data && data.profileid !== +profileid);
            res.status(400).send({status: 'User profile already exists'})
        } else {
             db.oneOrNone('update userprofile set profile = $1, permission = $2 where upid = $3', [profile, permission, profileid])
             .then(function (data) {
                res.send({status: 'User profile updated successfully', success: true}); 
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
 * @api                 {post} /profile/delete delete
 * @apiDescription      Checks if post parameter profileid is set,
 *                      checks if the selected profile is still used by other users, 
 *                      and if not, finally deletes the selected profile from the database.
 * @apiName             delete
 * @apiGroup            profile
 * @apiParam            {Int} profileid Mandatory profileid of a profile
 * @apiSuccess          status User profile deleted successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'User profile deleted successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 *                      HTTP/1.1 401 Failure
 *                      {status: 'User profile cannot be deleted as it is used by other users', success: false}
 *                      HTTP/1.1 404 Failure
 *                      {status: 'User profile does not exist', success: false}
 */
router.post('/delete', function (req, res) {

    if(!req.body.profileid) {
        res.status(400).send({status: 'User profile may not be empty!'});
        return;
    }
    const profileid = req.body.profileid;

    console.log(profileid);

    db.oneOrNone('select upid from userprofile where upid = $1', [profileid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from userprofile where upid =$1', [profileid])
            .then(function (data) {
                res.send({status: 'User profile deleted successfully', success: true});
            })
            .catch(function (error) {
              console.log('ERROR POSTGRES:', error)
                res.status(401).send({status: 'User profile cannot be deleted as it is used by other users', success: false});
            })
    } else {
        res.status(404).send({status: 'User profile does not exist', success: false})
     }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({status: 'Something went wrong', success: false});
    })
});


module.exports = router;