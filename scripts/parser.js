const puppeteer = require('puppeteer-extra');
const {load} = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const {resolve} = require('path')

const rename = require('./rename.js')
const delFile = require('./delFile')
const chatIdJson = require('../dataForMessage/chatIdJson.json')

puppeteer.use(StealthPlugin())

let exelLink;
let prevExelLink

let parser = async (bot) => {
    const browser = await puppeteer.launch({
        headless: true,
        //executablePath: '/usr/bin/google-chrome'
    });

    const page = await browser.newPage();
    await page.goto('http://www.mgkit.ru/studentu/raspisanie-zanatij');
    let content = await page.content();

    let $ = load(content);
    let exelLinks = $('h2>span>a:contains("Изменения в расписании")')
    exelLink = $(exelLinks[exelLinks.length - 1]).attr('href')
    
    console.log("exelLink " + exelLink)
    console.log("prevExelLink " + prevExelLink)

    if (exelLink != prevExelLink) {
        delFile('./pdf/')
        await page.goto(exelLink)
        content = await page.content()
        $ = load(content)

        await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: resolve(__dirname, '../pdf')
        })
        
        await page.click('div[aria-label="下載"]')

        await page.waitForTimeout(5000)

        await rename('./pdf/')
        .then (() => {
        if (!!prevExelLink) {
            Object.keys(chatIdJson).forEach((el) => {
                return bot.sendDocument
                    (el, './pdf/schedule_0.pdf',
                        {contentType: 'application/x-pdf'} )
                        .catch (() => {
                            console.log (`${el} заблокировал бота`)
                        })
            })                  
        }})
    } else console.log('Расписание не изменилось')

    prevExelLink = exelLink
    await browser.close().then(() => console.log('Браузер закрыт'))
}

module.exports = parser;