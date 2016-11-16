var express = require('express');
var app = express();

app.get('/add', function (req, res) {
  res.send(String(Number(req.query.a) + Number(req.query.b)));
});

app.listen(8080);
