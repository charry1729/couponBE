const app = require("./app");
const http = require("http");
var url = require('url');

const port = process.env.PORT || 3000;

const server = http.createServer(app).listen(port);



//console.log(app);