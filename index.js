const express     = require('express'),
      app         = express(),
      cors        = require('cors'),
      bodyParser  = require('body-parser'),
      http        = require('http'),
      gSheets     = require('./lib/sheets'),
      MongoClient = require('mongodb').MongoClient,
      apicache    = require('apicache');

// Connection url
const url = 'mongodb://carvio:__CArv10__@18.188.101.17:27017/carvio';
// Database Name
const dbName = 'carvio';
const cache = apicache.options({debug: true}).middleware;

app.set('port', process.env.PORT || 8080);
app.use(bodyParser.json());
app.use(cors());

app.get('/', function(req, res, next){
  res.status(200).send('ok');
  next();
});

app.post('/update', function(req, res, next) {
  let payload = req.query;
  let values = [];
  for(prop in payload) {
    values.push(payload[prop]);
  }
  gSheets.loadAuth(gSheets.onAuthorized, values);
  res.status(200).send(payload);
  next();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('app listening on port ' + app.get('port'));
});

app.get('/api/v1/makes', cache('3600 minutes'), function(req, res, next) {
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if(err) console.error(err);
    const makes = client.db(dbName).collection('makes');
    makes.find({}).toArray(function(err, items) {
      res.json(items);
      client.close();
    });
  });
});

app.get('/api/v1/models/:make', cache('3600 minutes'), function(req, res, next) {
  const params = req.params;
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if(err) console.error(err);
    const models = client.db(dbName).collection('models');
    const make = params.make;
    models.find({'make': make}).toArray(function(err, items) {
      res.json(items);
      client.close();
    });
  });
});

app.get('/api/v1/model/:model', cache('3600 minutes'), function(req, res, next) {
  const params = req.params;
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if(err) console.error(err);
    const models = client.db(dbName).collection('models');
    const model = params.model;
    models.find({'model': model}).toArray(function(err, items) {
      res.json(items);
      client.close();
    });
  });
});

app.get('/api/cache/index', function(req, res, next) {
  res.json(apicache.getIndex());
});