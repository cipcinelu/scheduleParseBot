const fs = require("fs");

module.exports = async (srcFolder) => {
    await fs.readdir(srcFolder, (err, files) => {
        files.forEach((file, i) => {
            fs.rename(srcFolder + file, srcFolder + "schedule.pdf", err => {
                if (err) throw err;
                console.log("rename completed!");
            });
        });
    });
}