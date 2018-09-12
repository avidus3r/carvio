const express   = require('express'),
      app       = express(),
      http      = require('http'),
      gSheets   = require('./lib/sheets');

app.set('port', process.env.PORT || 8080);

app.get('/', function(req, res, next){
  res.status(200).send('ok');
  next();
});

app.get('/update', function(req, res, next) {
  gSheets.loadAuth(gSheets.onAuthorized);
  res.status(200).send('ok');
  next();
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('app listening on port ' + app.get('port'));
});
