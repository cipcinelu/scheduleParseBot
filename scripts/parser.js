const puppeteer = require('puppeteer-extra');
const { load } = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const searchLastSchedule = require('./parser/searchLastSchedule.js');
const sendSchedule = require('./parser/sendSchedule.js');

puppeteer.use(StealthPlugin())

let exelLink;
let prevExelLink

let parser = async (bot, sendForce = false) => {

    if (sendForce == true) prevExelLink = "Рандомный текст"
    
    const browser = await puppeteer.launch({
        headless: true,
       // executablePath: '/usr/bin/google-chrome'
    });

    const page = await browser.newPage();
    await page.goto('http://www.mgkit.ru/studentu/raspisanie-zanatij', { waitUntil: 'load', timeout: 0 });
    //await page.goto('file://C:/Users/YobaBook/Desktop/УниКИТ - Расписание занятий.htm');

    let content = await page.content();
    let $ = load(content)
    let exelLinks = $('h2>a:contains("группы")')

    exelLink = await searchLastSchedule(exelLinks, page)
    
    console.log("exelLink " + exelLink)
    console.log("prevExelLink " + prevExelLink)

    if (exelLink != prevExelLink) {
        await sendSchedule(page, bot, exelLink, prevExelLink).then()
    } else 
        console.log('Расписание не изменилось')

    prevExelLink = exelLink
    await browser.close().then(() => console.log('Браузер закрыт'))
}

module.exports = parser;