require('dotenv').config()
require('./database/database').initMysql();
require('./database/messages/messageModel').initalizeMessageModel()
require('./server/server').start();


