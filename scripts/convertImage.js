const pdfConverter = require('pdf-poppler')
const path = require('path')

let convertImage = async (pdfPath, i) => {

    let option = {
        format : 'png',
        out_dir : './img',
        out_prefix : path.basename("schedule", path.extname(pdfPath)),
        page : i,
        scale: 4096,
    }

    await pdfConverter.convert(pdfPath, option)
    .then(() => {
        console.log('file converted')
    })
    .catch(err => {
        console.log('an error has occurred in the pdf converter ' + err)
    })
}

module.exports = convertImage;
