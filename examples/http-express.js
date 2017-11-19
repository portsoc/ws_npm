const express = require('express');
const app = express();

app.get('/hello', function (req, res) {
  res.send('Hello ' + (req.query.name || 'anonymous') + '!');
});

app.listen(8080);
