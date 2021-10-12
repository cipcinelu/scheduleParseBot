const fs = require('fs');
let filesObj = []
let filesObj2 = []

const filesForTg = (srcFolder) => {
    fs.readdir(srcFolder, (err, files) => {
        files.forEach((file, i) => {
            filesObj.push ({ type: 'document', media: `./img/${file}` })
        })
        //console.log(filesObj) //выводит
        return result(filesObj);
    })
}

let result = (filesObj) => {
    console.log (filesObj)
}
filesForTg('../img')

//console.log(filesObj)
//module.exports = filesForTg
