var app = require('express').createServer();

require.paths.unshift('vendor/mongoose');
var mongoose = require('mongoose').Mongoose;

mongoose.model('User', {
  properties: ['email', 'password'],
  indexes: ['email']
});

var db = mongoose.connect('mongodb://localhost/db')

app.get('/', function(req, res){
    res.send('hello world');
});

app.listen(3000);
