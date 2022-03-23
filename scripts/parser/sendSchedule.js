const { resolve } = require('path')

const delFile = require("../delFile")
const rename = require("../rename")

const chatIdJson = require('../../dataForMessage/chatIdJson.json');
const getAnegdot = require('./getAnegdot.js')

const sendSchedule = async (page, bot, exelLink, prevExelLink) => {
    delFile('./pdf/')
    await page.goto(exelLink)

    await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: resolve(__dirname, '../../pdf')
    })

    //await page.click('div[aria-label="下載"]')
    await page.click('div[aria-label="Скачать"]')
        .then(async () => {
            await page.waitForTimeout(5000)

            let anegdot = `Внимание анегдот: ${getAnegdot()}`
            await rename('./pdf/')
                .then(() => {
                    if (!!prevExelLink) {
                        Object.keys(chatIdJson).forEach((el) => {
                            return bot.sendDocument
                                (el, './pdf/schedule_0.pdf',
                                    { caption: anegdot })
                                .catch(() => {
                                    console.log(`${el} заблокировал бота`)
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