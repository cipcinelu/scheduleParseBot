const fs = require('fs');

module.exports = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
        console.log('Файл успешно удалён');
    });
}