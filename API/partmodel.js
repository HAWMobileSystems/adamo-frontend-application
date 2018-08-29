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

router.post('/usage', function (req, res) {

    const pmid = req.body.pmid;

    db.query('select p.mid AS mid,p.version AS version, m.modelname AS modelname FROM partialmodel AS p JOIN model AS m ON p.mid=m.mid AND p.version=m.version WHERE p.pmid = $1 ORDER BY modelname ASC, version DESC', [pmid])
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
    
    if(!req.body.mid || !req.body.pmid || !req.body.version) {
        res.status(400).send({ status: 'Models and Version may not be empty!'});
        return;
    }  
        
    const mid = req.body.mid;
    const pmid = req.body.pmid;
    const version = req.body.version;
        
    db.oneOrNone('insert into partialmodel (mid, version, pmid) values ($1,$2,$3)', [mid,version,pmid])
        .then(function (data) {
            res.send({ status: 'Model created successfully as a partial model', success: true});
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({ status: 'Database not available', error: error});
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

    if(!req.body.mid) {
        res.status(400).send({ status: 'Model may not be empty!'});
        return;
    }
    if(!req.body.version) {
        res.status(400).send({ status: 'Version may not be empty!'});
        return;
    }
    const mid = req.body.mid;
    const version = req.body.version;

    db.oneOrNone('select * from partialmodel where mid = $1 and version = $2', [mid,version])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from partialmodel where mid = $1 and version = $2', [mid,version])
            console.log('data is ', data);
            res.send({ status: 'Partial model deleted successfully', success: true});
        } else {
            res.send({ status: 'No Partmodels existed in this diagram version', success: true});
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({ status: 'Database not available'});
    })
});


module.exports = router;