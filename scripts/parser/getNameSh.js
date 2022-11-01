const {readdirSync} = require('fs');

const getNameSh = (dir) => {
    return readdirSync(dir, (err, files) => {
        files.forEach(file => {
          return file
        });
    })[0]
} 

module.exports = getNameSh