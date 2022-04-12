const fs = require("fs");

fs.readdir('./pdf', (err, files) => console.log( files[0]))