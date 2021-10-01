require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const path = require('path')
const {writeFile} = require('fs')
const pdf2img = require('pdf2img');

//const convertImage = require('./scripts/convertImage.js')
const convertImage = require('./scripts/convertImageOnLinux.js')
const rename = require('./scripts/rename.js')
const delFile = require('./scripts/delFile')
const chatIdJson = require('./chatIdJson.json')

puppeteer.use(StealthPlugin())
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

let files = [
    { type: 'document', media: './img/schedule_1.png' },
    { type: 'document', media: './img/schedule_2.png' },
    { type: 'document', media: './img/schedule_3.png' },
]
  
let exelLink;
let chatId;

(function () {
    bot.setMyCommands([
        { command: '/start', description: 'Описание' },
        { command: '/schedule', description: 'Посмотреть расписание' },
    ])

    bot.on('message', async (msg) => {
        chatId = msg.chat.id;
        let text = msg.text
        let name = msg.chat.username

        if (text == '/start') {
            const chatIdObject = chatIdJson;
            chatIdObject[chatId] = name;

            writeFile('./chatIdJson.json', 
                    JSON.stringify(chatIdObject), (err) => {
                if (err) return console.error(err)
            });
            return bot.sendMessage(chatId,
                'Я пришлю расписание, как только оно изменится')
        }
        if (text == '/schedule')
            return (bot.sendMediaGroup(chatId, files),
                bot.sendMessage(chatId, "Loading..."))
        if (text == '/test')
            return (main(),
                bot.sendMessage(chatId, "Пошло поехало"))
    })

    bot.on('webhook_error', (error) => {
        console.log(error.code);  // => 'EPARSE'
    });
}());

async function main() {
    let prevExel;

    const browser = await puppeteer.launch({
        headless: true
    });

    const page = await browser.newPage();
    await page.goto('http://www.mgkit.ru/studentu/raspisanie-zanatij');
    let content = await page.content();

    let $ = cheerio.load(content);
    let exelLinks = $('span[style="line-height:19.9733px"]>a')
    let dataShedule = []

    for (i = 0; i < exelLinks.length; i++){
        let exelLinkLocal = $(exelLinks[i]).text()
        if (exelLinkLocal.search(/(заняти.)/)!= -1) {
            dataShedule.push (parseInt(exelLinkLocal.match(/\d+/)))
        }
    }

    let dataSheduleInt = Math.max.apply(null, dataShedule)

    for (i = 0; i < exelLinks.length; i++){
        let exelLinkLocal = $(exelLinks[i]).text()
        if (exelLinkLocal.search(dataSheduleInt)!= -1) {
            exelLink = $(exelLinks[i]).attr('href')
        }
    }
    console.log (exelLink)

    //exelLink = $(exelLinks[exelLinks.length - 1]).attr('href')
    if (exelLink != prevExel) {
    //if (false) {
        await page.goto(exelLink);
        content = await page.content();
        $ = cheerio.load(content);

        await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: path.resolve(__dirname, './pdf')
        })

        await page.click('div[aria-label="Download"]')
        await page.waitForTimeout(5000)

        await rename('./pdf/')
        await convertImage(`./pdf/schedule.pdf`)
        //delFile(`./pdf/schedule.pdf`)
        await page.waitForTimeout(15000).then (()=>{
        Object.keys(chatIdJson).forEach ((el) => {
            bot.sendMediaGroup(el, files)
        })})
    } else {
        console.log('Расписание не изменилось')
    }
    await browser.close().then(() => console.log('Браузер закрыт'))
}

const interval = setInterval(main, 900000)