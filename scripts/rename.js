const fs = require("fs");
const path = require('path')

let rename = (srcFolder) => {
    return new Promise (resolve => {
        fs.readdir(srcFolder, (err, files) => {
            files.forEach((file, i) => {
                fs.rename(srcFolder + file, srcFolder + `schedule_${i}` + path.extname(file), err => {
                    if (err) throw err;
                    resolve()
                });
            });
            console.log("rename completed!");
        });
    })
}
module.exports = rename