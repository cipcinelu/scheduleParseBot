const fs = require('fs')

fs.readdir('./img', (err, files) => {
    files.forEach((file, i) => {
        fs.stat(`./img/${file}`, (err, stats) => {
            if (err) {
                console.log(err) 
                return
            }
            console.log(stats.size)
        })
        console.log(file)
    })
})