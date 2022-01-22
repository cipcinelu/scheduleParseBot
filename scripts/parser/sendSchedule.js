const { resolve } = require('path')

const delFile = require("../delFile")
const rename = require("../rename")
const chatIdJson = require('../../dataForMessage/chatIdJson.json');

const sendSchedule = async (page, bot, exelLink, prevExelLink) => {
    delFile('./pdf/')
    await page.goto(exelLink)

    await page._client.send("Page.setDownloadBehavior", {
        behavior: "allow",
        downloadPath: resolve(__dirname, '../../pdf')
    })

    //await page.click('div[aria-label="下載"]')
    await page.click('div[aria-label="Скачать"]')

    await page.waitForTimeout(5000)

    await rename('./pdf/')
        .then(() => {
            if (!!prevExelLink) {
                Object.keys(chatIdJson).forEach((el) => {
                    return bot.sendDocument
                        (el, './pdf/schedule_0.pdf',
                            { contentType: 'application/x-pdf' })
                        .catch(() => {
                            console.log(`${el} заблокировал бота`)
                        })
                })
            }
        })
}

module.exports = sendSchedule