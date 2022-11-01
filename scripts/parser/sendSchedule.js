const { resolve } = require('path')

const delFile = require("../delFile")

const chatIdJson = require('../../dataForMessage/chatIdJson.json');
const getAnegdot = require('./getAnegdot.js');
const getNameSh = require('./getNameSh');

const sendSchedule = async (page, bot, exelLink, prevExelLink) => {
    await bot.stopPolling()
    delFile('./pdf/')
    await page.goto(exelLink, { waitUntil: 'load', timeout: 0 })

    await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: resolve(__dirname, '../../pdf')
    })

    //await page.click('div[aria-label="下載"]')
    await page.click('div[aria-label="Скачать"]')
        .then(async () => {
            let anegdot = await getAnegdot()
            await page.waitForTimeout(5000)

                .then(() => {
                    let fileName = getNameSh('./pdf/')
                    bot.startPolling()
                    if (!!prevExelLink) {
                        Object.keys(chatIdJson).forEach((el) => {
                            return bot.sendDocument
                                (el, `./pdf/${fileName}`,
                                    { caption: `${fileName.replace('- группы.pdf', '')}
                                    ${anegdot}` })
                                .catch((err) => {
                                    console.log(`${err}`)
                                })
                        })
                    }
                })
            })
            .catch((err) => {
                return console.log(err)
            })


}

module.exports = sendSchedule