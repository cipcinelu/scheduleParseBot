const puppeteer = require('puppeteer-extra');
const {load} = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const {resolve} = require('path')

const rename = require('./rename.js')
const delFile = require('./delFile')
const chatIdJson = require('../dataForMessage/chatIdJson.json')

puppeteer.use(StealthPlugin())

let dataShedule;
let prevDataShedule

let parser = async (bot) => {
    let exelLink;
    let exelText;
    const browser = await puppeteer.launch({
        headless: true,
        //executablePath: '/usr/bin/google-chrome'
    });

    const page = await browser.newPage();
    await page.goto('http://www.mgkit.ru/studentu/raspisanie-zanatij');
    let content = await page.content();

    let $ = load(content);
    let exelLinks = $('a')
    let dataSheduleArray = []
    let allDataSheduleArray = []

//находим ссылки с текстом "занятия" и вытаскиваем числа
    for (i = 0; i < exelLinks.length; i++) {
        let exelLinkLocal = $(exelLinks[i]).text()
        if (exelLinkLocal.search(/(кабинетов.)/) != -1) {
            dataSheduleArray.push(parseInt(exelLinkLocal.match(/\d+/)))
        }
        allDataSheduleArray.push($(exelLinks[i]))
    }

    dataShedule = Math.max.apply(null, dataSheduleArray)

//находим ссылку с нужным числом
    const regexp = new RegExp(dataShedule + '\\.');
    
    for (let i = 0; i < allDataSheduleArray.length; i++) {
        let allText = allDataSheduleArray[i].text()
        if (allText.search(/(кабинетов.)/) != -1
                                && allText.search(regexp) != -1) {
            let schedule = allDataSheduleArray[i-1]
            exelLink = schedule.attr('href')
            exelText = allText.replace('Расписание кабинетов', 
                                        'Изменения в расписании учебных занятий')
        }
    }

    console.log("dataShedule " + dataShedule)
    console.log("prevData " + prevDataShedule)

    if (dataShedule != prevDataShedule) {
        delFile('./pdf/')
        await page.goto(exelLink)
        content = await page.content()
        $ = load(content)

        await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: resolve(__dirname, '../pdf')
        })
        
        await page.click('div[aria-label="Скачать"]')

        await page.waitForTimeout(5000)

        await rename('./pdf/')
        .then (() => {
        if (!!prevDataShedule) {
            Object.keys(chatIdJson).forEach((el) => {
                return bot.sendDocument
                    (el, './pdf/schedule_0.pdf', 
                        {caption: exelText},
                        {contentType: 'application/x-pdf'} )
                        .catch (() => {
                            console.log (`${el} заблокировал бота`)
                        })
            })                  
        }})
    } else console.log('Расписание не изменилось')

    prevDataShedule = dataShedule
    await browser.close().then(() => console.log('Браузер закрыт'))
}

module.exports = parser;