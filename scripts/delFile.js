const fs = require('fs');

let delFile = (srcFolder) => {
    return new Promise (resolve => {
        fs.readdir(srcFolder, (err, files) => {
            console.log('список файлов до удаления: ' + files)
            if (!!files) {
                files.forEach((file, i) => {
                    fs.unlink(srcFolder + file, err => {
                        if (err) throw err;
                    });
                })
            }
            resolve ()
        })
    })
}

module.exports = delFile;