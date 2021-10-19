const pdfConverter = require('pdf-poppler')
const path = require('path')

let convertImage = (pdfPath, i) => {
    return new Promise(resolve => {
        let option = {
            format: 'png',
            out_dir: './img',
            out_prefix: path.basename("schedule", path.extname(pdfPath)),
            page: i,
            scale: 4096,
        }
        pdfConverter.convert(pdfPath, option)
            .then(() => {
                console.log('file converted')
                resolve()
            })
            .catch(err => {
                console.log('an error has occurred in the pdf converter ' + err)
                resolve()
            })
    })
}
module.exports = convertImage;
