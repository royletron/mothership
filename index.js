var server = require('./src/server');

var port = process.env.PORT || 3000;

server.listen(port);

console.log('Running on port:'+port.toString())
