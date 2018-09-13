const express     = require('express'),
      app         = express(),
      cors        = require('cors'),
      bodyParser  = require('body-parser'),
      http        = require('http'),
      gSheets     = require('./lib/sheets');

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
