const express = require('express');
const http = require('http');
const db = require('../db/index');
const bcrypt = require('bcrypt');
const bluebird = require('bluebird');
const bodyParser = require('body-parser')
// const redis = require('redis');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);
// const redisClient = redis.createClient(6379, 'localhost');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);

app.use(bodyParser.json())

passport.use(new LocalStrategy(
  (email, password, cb) => {
    db.query('SELECT id, username, password, type FROM users WHERE username=$1', [username], (err, result) => {
      if (err) { return done(err); }
      
      if (!user) {
        return done(null, false, { message: 'Could\'nt find this email in our records.' });
      }

      if (!user.validPassword(password)) {
        return done(null, false, { message: 'That\'s not the right password.' });
      }
      return done(null, user);
    })
  }
));

server.listen(3000);

app.use(express.static(__dirname + '/../dist'));

app.post('/login',passport.authenticate('local', { 
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true 
}));

app.post('/signup', function(req, res) {
  const userInfo = req.body
  bcrypt.hash(userInfo.password, 10, function(err, hash) {
    db.none('INSERT INTO users(firstname, email, password) VALUES(${name}, ${email}, ${password})', {
      name: userInfo.name,
      email: userInfo.email,
      password: hash
    })
    .then(response => console.log(response))
    // res.send(req.body);
  });
  
  // {
  //   name: 'Andrew',
  //   email: andrewpomo815@gmail.com,
  //   password: aFakePassword
  // }
  // using signup form data
  // encrypt password
  // add user to db.
});

// app.post('/userViews', function(req, res) {
//   // using signup form data
//   // hash user password
//   // add user to db.
// });

app.get('/newConvo', function(req, res) {
  // res.send();
  // find compatible users.
  // put them in a room.
});

// io.on('connection', function (socket) {
//   console.log('user connected');
//   socket.on('chat message', function (data) {
//     io.emit('chat message', data);
//   });
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });