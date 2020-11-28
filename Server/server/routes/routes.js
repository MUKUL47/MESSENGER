const  express = require('express')(),
login = require('./login/loginController'),
register = require('./register/registerController');
express.use(login.routes);
express.use(register.routes);
express.use(require('./social/socialController').routes);
express.get('/*', (req, res) => res.send('RESTRICTED'))
exports.routes = express;