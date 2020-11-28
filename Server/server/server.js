exports.start = () => (function () {
       const express = require('express')();
       const bodyParser = require('body-parser')
       routes = require('./routes/routes.js').routes,
              redis = require("redis"),
              io = require('socket.io').listen(express.listen(process.env.RUNNING_PORT)),
              // express.use(require('cors')());
              require('./sockets/socket').io(io, redis.createClient(6379));

       express.use(bodyParser.urlencoded({ extended: false }));
       express.use(routes);
}())

