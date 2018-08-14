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
    
    db.query('select upid, profile, permission from userprofile')
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

    if(!req.body.profile) {
        res.status(400).send({ status: 'Profile name may not be empty!'});
        return;
    }   

    const profile = req.body.profile;
    const permission = req.body.permission;

    console.log(profile + ' ' + permission);
   
    db.oneOrNone('select profile from userprofile where profile = $1', [profile])
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
    
    if(!req.body.profile) {
        res.status(400).send({ status: 'Profile name may not be empty!'});
        return;
    }  
    if(!req.body.profileid) {
        res.status(400).send({ status: 'User profile may not be empty!'});
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
            res.status(400).send({ status: 'User profile already exists'})
        } else {
             db.oneOrNone('update userprofile set profile = $1, permission = $2 where upid = $3', [profile, permission, profileid])
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

    if(!req.body.profileid) {
        res.status(400).send({ status: 'User profile may not be empty!'});
        return;
    }
    const profileid = req.body.profileid;

    console.log(profileid);

    db.oneOrNone('select upid from userprofile where upid = $1', [profileid])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from userprofile where upid =$1', [profileid])
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


module.exports = router;