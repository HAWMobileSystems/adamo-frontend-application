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

    db.query('select * from partialmodel')
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
* URL:              /partmodel
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

router.post('/partmodel', function (req, res) {

    const mid = req.body.mid;

    db.query('select * from partialmodel where mid = $1', [mid])
        .then(function (data) {
            if(data){
                console.log('data is ', data);
                res.send({ data: data, success: true});
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
* URL:            /create
* Method:         post
* URL Params:
* Required:       none
* Optional:       none
* Data Params:
* Required:       none
* Optional:       none
* Success Response: Code 200, Content: {message: [string], success: [bool], data: [object]}
* Error Response:   Code 400, Content: {message: [string], success: [bool]}
* Description:      
* */
    
router.post('/create', function (req, res) {
    
    if(!req.body.mid || !req.body.pid) {
        res.status(400).send({ status: 'Models may not be empty!'});
        return;
    }  
        
    const mid = req.body.mid;
    const pid = req.body.pid;
        
    db.oneOrNone('select * from partialmodel where mid = $1', [mid])
        .then(function (data) {
            db.oneOrNone('insert into partialmodel (mid) values ($1)', [mid])
                .then(function (data) {
                    res.send({ status: 'Model created successfully as a partial model', success: true});
                    })
                .catch(function (error) {
                    console.log('ERROR POSTGRES:', error)
                    res.status(400).send({ status: 'Database not available'});
                    })
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

    if(!req.body.pmid) {
        res.status(400).send({ status: 'Partial model may not be empty!'});
        return;
    }
    const pmid = req.body.pmid;

    console.log(pmid);

    db.oneOrNone('select * from partialmodel where pmid = $1', [pmid])
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


module.exports = router;