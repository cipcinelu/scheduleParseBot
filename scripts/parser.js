const puppeteer = require('puppeteer-extra');
const { load } = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const searchLastSchedule = require('./parser/searchLastSchedule.js');
const sendSchedule = require('./parser/sendSchedule.js');

puppeteer.use(StealthPlugin())

let exelLink;
let prevExelLink

let parser = async (bot) => {

    const browser = await puppeteer.launch({
        headless: false,
       // executablePath: '/usr/bin/chromium-browser'
    });

    const page = await browser.newPage();
    await page.goto('http://www.mgkit.ru/studentu/raspisanie-zanatij', { waitUntil: 'load', timeout: 0 });
    //await page.goto('file://C:/Users/YobaBook/Desktop/для бота/unikit.htm');

    let content = await page.content();
    let $ = load(content)
    let exelLinks = $('h2>span>a:contains("группы")')

    exelLink = await searchLastSchedule(exelLinks, page)
    
    console.log("exelLink " + exelLink)
    console.log("prevExelLink " + prevExelLink)

    if (exelLink != prevExelLink) {
        await sendSchedule(page, bot, exelLink, prevExelLink)
    } else 
        console.log('Расписание не изменилось')

    prevExelLink = exelLink
    await browser.close().then(() => console.log('Браузер закрыт'))
}

module.exports = parser;