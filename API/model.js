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
* URL:              /delete
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

router.post('/delete', function (req, res) {

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
* URL:              /changes
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

router.get('/changes', function (req, res) {

    const lastchange = req.body.lastchange;
    
    db.query('select * from model where lastchange = $1', [lastchange] + 
    '>= NOW() - interval 7 days order by lastchange desc')
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

router.post('/getpartmodel', function (req, res) {

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