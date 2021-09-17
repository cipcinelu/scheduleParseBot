const pdfConverter = require('pdf-poppler')
const path = require('path')

module.exports = async (pdfPath) => {

    let option = {
        format : 'png',
        out_dir : './img',
        out_prefix : path.basename(pdfPath, path.extname(pdfPath)),
        page : null,
        scale: 4096
    }

    await pdfConverter.convert(pdfPath, option)
    .then(() => {
        console.log('file converted')
    })
    .catch(err => {
        console.log('an error has occurred in the pdf converter ' + err)
    })
}