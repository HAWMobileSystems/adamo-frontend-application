const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

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

router.get('/partmodel', function (req, res) {

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
* URL:              /partmodelcreate
* Method:           post
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
    
router.post('/partmodelcreate', function (req, res) {
    
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
* */

router.delete('/partmodeldelete', function (req, res) {

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


module.exports = router;