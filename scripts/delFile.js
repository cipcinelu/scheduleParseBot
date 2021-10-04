const fs = require('fs');

module.exports = async (srcFolder) => {
    console.log("srcFolder = " + srcFolder)
    await fs.readdir(srcFolder, (err, files) => {
        console.log("files " + files)
        files.forEach((file, i) => {
            fs.unlink(srcFolder + file, err => {
                if (err) throw err;
            });
        })
    })
    console.log('Файлы успешно удалён');
}