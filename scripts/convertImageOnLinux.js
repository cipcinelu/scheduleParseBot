const fs      = require('fs');
const path    = require('path');
const pdf2img = require('pdf2img');

let convertImage = async (path, i) => {

pdf2img.setOptions({
  type: 'png',                                // png or jpg, default jpg
  size: 4096,                                 // default 1024
  density: 600,                               // default 600
  outputdir: './img',                         // output folder, default null (if null given, then it will create folder name same as file name)
  outputname: 'schedule',                     // output file name, dafault null (if null given, then it will create image name same as input name)
  page: i,                                 // convert selected page, default null (if null given, then it will convert all pages)
  quality: 100                                // jpg compression quality, default: 100
});

 await pdf2img.convert(path, function(err, info) {
  if (err) console.log(err)
  else console.log(info);
});
}

module.exports = convertImage;
