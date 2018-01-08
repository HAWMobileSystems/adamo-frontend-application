var express = require('express');
var app = express();

// Database Part

var pgp = require('pg-promise')(/*options*/)
var db = pgp('postgres://username:password@host:port/database')


app.get('/', function(req, res){
    res.send("IPIM Server is Running");
 });

app.get('/models/:id/:name', function(req, res){

    const name = req.params.name;
    const id   = req.params.id;
    console.log("Params: "+req.params.id + " " +req.params.name);
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

app.get('/models', function(req, res){
    const name = req.query.name;
    const id   = req.query.id;
        db.one('SELECT $1 AS value', 123)
        .then(function (data) {
          console.log('DATA:', data.value)
          res.send(data.value);
        })
        .catch(function (error) {
          console.log('ERROR POSTGRES:', error)
          res.send("Database not available ID:"+id +" Name:"+name);
        })
    
        
    });

app.get('/getallModels', function(req, res){
    res.send("Here you will get all Modles from DB");
 });

 app.post('/', function (req, res) {
    res.send('Got a POST request')
  })

  app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
  })

  app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
  })

app.listen(3000);




