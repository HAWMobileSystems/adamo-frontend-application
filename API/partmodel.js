const express = require('express');
const router = express.Router();
const db = require('./database');
const bodyParser = require('body-parser');

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({extended: true})); // support encoded bodies


/**
 * @api                 {get} /partmodel/all all
 * @apiDescription      Requests all partial models from the database.
 * @apiName             all
 * @apiGroup            partmodel
 * @apiSuccess          {Array} data Array of partial models
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5, ...]
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */
router.get('/all', function (req, res) {

    db.query('select pmid, mid, version from partialmodel')
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
 * @api                 {post} /partmodel/usage usage
 * @apiDescription      Shows which models and which versions are maintained as a partial model. 
 *                      The order of the models and the correspong version is 
 *                      ascending reagrding the model name and descending reagrding the versions.
 * @apiName             all
 * @apiGroup            partmodel
 * @apiSuccess          {Array} data Array of partial models
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      [1, 2, 3, 4, 5, ...]
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 *                      HTTP/1.1 404 Failure
 *                      {status: 'Model does not exist', success: false}
 */
router.post('/usage', function (req, res) {

    const pmid = req.body.pmid;

    db.query('select p.mid AS mid,p.version AS version, m.modelname AS modelname FROM partialmodel AS p JOIN model AS m ON p.mid=m.mid AND p.version=m.version WHERE p.pmid = $1 ORDER BY modelname ASC, version DESC', [pmid])
        .then(function (data) {
            if(data){
                console.log('data is ', data);
                res.send({data: data, success: true});
            } else {
                res.status(400).send({status: 'Model does not exist', success: false})
            }
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Something went wrong', success: false});
        })
});


/**
 * @api                 {post} /partmodel/create create
 * @apiDescription      Checks if post parameters modelid, partmodelid and version are set,
 *                      and creates a new partial model.
 * @apiName             create
 * @apiGroup            partmodel
 * @apiParam            {Int} modelid Mandatory modelid of a model
 * @apiParam            {Int} partmodelid Mandatory partmodelid of a partial model
 * @apiParam            {Int} version Mandatory version of a model
 * @apiSuccess          status Model created successfully as a partial model
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Model created successfully as a partial model', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 */    
router.post('/create', function (req, res) {
    
    if(!req.body.mid || !req.body.pmid || !req.body.version) {
        res.status(400).send({status: 'Models and Version may not be empty!'});
        return;
    }  
        
    const mid = req.body.mid;
    const pmid = req.body.pmid;
    const version = req.body.version;
        
    db.oneOrNone('insert into partialmodel (mid, version, pmid) values ($1,$2,$3)', [mid,version,pmid])
        .then(function (data) {
            res.send({status: 'Model created successfully as a partial model', success: true});
        })
        .catch(function (error) {
            console.log('ERROR POSTGRES:', error)
            res.status(400).send({status: 'Something went wrong', success: false});
        })
});


/**
 * @api                 {post} /partmodel/delete delete
 * @apiDescription      Checks if post parameters modelid and version are set,
 *                      and deletes the selected partial model from the database.
 * @apiName             delete
 * @apiGroup            partmodel
 * @apiParam            {Int} modelid Mandatory modelid of a model
 * @apiParam            {Int} version Mandatory version of a model
 * @apiSuccess          status Partial model  deleted successfully
 * @apiSuccessExample   Success-Response:
 *                      HTTP/1.1 200 OK
 *                      {status: 'Partial model deleted successfully', success: true}
 * @apiError            error Something went wrong
 * @apiErrorExample     Error-Response:
 *                      HTTP/1.1 400 Failure
 *                      {status: 'Something went wrong', success: false}
 *                      HTTP/1.1 404 Failure
 *                      {status: 'No partial models exist in this diagram version', success: true}
 */
router.post('/delete', function (req, res) {

    if(!req.body.mid) {
        res.status(400).send({status: 'Model may not be empty!'});
        return;
    }
    if(!req.body.version) {
        res.status(400).send({status: 'Version may not be empty!'});
        return;
    }
    const mid = req.body.mid;
    const version = req.body.version;

    db.oneOrNone('select  pmid, mid, version from partialmodel where mid = $1 and version = $2', [mid,version])
    .then(function (data) {
        if(data){
            db.oneOrNone('delete from partialmodel where mid = $1 and version = $2', [mid,version])
            console.log('data is ', data);
            res.status(200).send({status: 'Partial model deleted successfully', success: true});
        } else {
            res.status(404).send({status: 'No partial models exist in this diagram version', success: true});
        }
    })
    .catch(function (error) {
        console.log('ERROR POSTGRES:', error)
        res.status(400).send({status: 'Something went wrong', success: false});
    })
});


module.exports = router;