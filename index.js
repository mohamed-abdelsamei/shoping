const app =require('./app');
const http = require('http');
const config = require('./src/config');
const server = http.createServer(app);
server.listen(config.port, ()=>{
  console.log('server started');
});
