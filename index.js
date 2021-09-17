const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const path = require('path')
const {writeFile} = require('fs')

const convertImage = require('./scripts/convertImage.js')
const rename = require('./scripts/rename.js')
const delFile = require('./scripts/delFile')
const config = require('./config.json')
const chatIdJson = require('./chatIdJson.json')

puppeteer.use(StealthPlugin())
const token = config.telegramToken;
const bot = new TelegramBot(token, { polling: true });
let files = [
    { type: 'document', media: './img/schedule-1.png' },
    { type: 'document', media: './img/schedule-2.png' },
    { type: 'document', media: './img/schedule-3.png' },
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
    let exelLinks = $('td.sites-layout-tile.sites-tile-name-content-1>div>p>b>span>span>a')

    prevExel = exelLink
    exelLink = $(exelLinks[exelLinks.length - 1]).attr('href')

    if (exelLink != prevExel) {
        await page.goto(exelLink);
        content = await page.content();
        $ = cheerio.load(content);

        await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: path.resolve(__dirname, './pdf')
        })

        await page.click('div[aria-label="Download"]')
        await page.waitForTimeout(5000)

        await rename('./pdf/').then(() => {
            convertImage(`./pdf/schedule.pdf`).then(() => {
                delFile(`./pdf/schedule.pdf`)
                Object.keys(chatIdJson).forEach ((el) => {
                    bot.sendMediaGroup(el, files)
                })
            })
        })
        await browser.close().then(() => console.log('Браузер закрыт'))
    }
}

const interval = setInterval(main, 900000)
