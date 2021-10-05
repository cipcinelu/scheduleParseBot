const fs = require("fs");
const path = require('path')

module.exports = async (srcFolder) => {
    await fs.readdir(srcFolder, (err, files) => {
        files.forEach((file, i) => {
            fs.rename(srcFolder + file, srcFolder + `schedule_${i}` + path.extname(file), err => {
                if (err) throw err;
            });
        });
        console.log("rename completed!");
    });
}