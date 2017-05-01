var morgan = require('morgan');
var fs = require('fs');
var path = require('path');
var logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

var accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'));
morgan.format('default', ':remote-addr - [:date] ":method :url" :status ":referrer" ":user-agent"')

exports.use = function (app) {
    app.use(morgan('dev'));
    app.use(morgan('default', { stream: accessLogStream }));
}