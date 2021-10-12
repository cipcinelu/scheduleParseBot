require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const path = require('path')
const { writeFile } = require('fs')
const fs = require ('fs')

//const convertImage = require('./scripts/convertImage.js')
const convertImage = require('./scripts/convertImageOnLinux.js')
const rename = require('./scripts/rename.js')
const delFile = require('./scripts/delFile')
const chatIdJson = require('./chatIdJson.json')
const linksTeams = require('./linksTeams.js')

puppeteer.use(StealthPlugin())
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

let files = [
    { type: 'document', media: './img/schedule_0.png' },
    { type: 'document', media: './img/schedule_1.png' },
    //{ type: 'document', media: './img/schedule_2.png' },
]

let exelLink;
let chatId;
let prevExel;

(function () {
    bot.setMyCommands([
        { command: '/start', description: 'Описание' },
        { command: '/schedule', description: 'Посмотреть расписание' },
        { command: '/linksteams', description: 'Ссылки на teams' },
        { command: '/donate', description: 'Донат' },
    ])

    bot.on('message', async (msg) => {
        chatId = msg.chat.id;
        let text = msg.text
        let name = msg.chat.username

        if (text == '/start') {
            const chatIdObject = chatIdJson;
            if (!!name) chatIdObject[chatId] = name;
            else chatIdObject[chatId] = "withoutNick";

            writeFile('./chatIdJson.json',
                JSON.stringify(chatIdObject), (err) => {
                    if (err) return console.error(err)
                });
            return bot.sendMessage(chatId,
                `Я пришлю расписание, как только оно изменится
/schedule - пришлю расписание
/linksteams - скину ссылку на teams
/donate - донат`)
        }
        if (text == '/schedule')
            return (
                fs.readdir('./img', (err, files) => {
                    let filesObj = []
                    files.forEach((file, i) => {
                        if (i < 4) 
                            filesObj.push ({ type: 'document', media: `./img/${file}` })
                    })
                    return bot.sendMediaGroup(chatId, filesObj)
                }),
                bot.sendMessage(chatId, "Loading...")
            )
        if (text == '/linksteams')
            return bot.sendMessage(chatId,
                linksTeams, {disable_web_page_preview: true})
        if (text == '/donate')
            return bot.sendMessage(chatId,
                `https://www.tinkoff.ru/cf/9MdrKS2I2jN`, )
        if (text == '/test')
            return (main(),
                bot.sendMessage(chatId, "Пошло поехало"))
    })

    bot.on('webhook_error', (error) => {
        console.log(error.code);
    });
}());

async function main() {

    const browser = await puppeteer.launch({
        headless: true,
        //executablePath: '/usr/bin/chromium-browser'
    });

    const page = await browser.newPage();
    await page.goto('http://www.mgkit.ru/studentu/raspisanie-zanatij');
    let content = await page.content();

    let $ = cheerio.load(content);
    let exelLinks = $('span[style="line-height:19.9733px"]>a')
    let dataShedule = []

    for (i = 0; i < exelLinks.length; i++) {
        let exelLinkLocal = $(exelLinks[i]).text()
        if (exelLinkLocal.search(/(заняти.)/) != -1) {
            dataShedule.push(parseInt(exelLinkLocal.match(/\d+/)))
        }
    }

    let dataSheduleInt = Math.max.apply(null, dataShedule)
    for (i = 0; i < exelLinks.length; i++) {
        let exelLinkLocal = $(exelLinks[i]).text()
        if (exelLinkLocal.search(dataSheduleInt) != -1) {
            exelLink = $(exelLinks[i]).attr('href')
        }
    }
    console.log("exelLink " + exelLink)
    console.log("prevExel " + prevExel)

    if (exelLink != prevExel) {
        await page.goto(exelLink);
        content = await page.content();
        $ = cheerio.load(content);

        await page._client.send("Page.setDownloadBehavior", {
            behavior: "allow",
            downloadPath: path.resolve(__dirname, './pdf')
        })
        
        delFile(`./img/`)

        await page.click('div[aria-label="Download"]')
        await page.waitForTimeout(5000)

        await rename('./pdf/')
        await page.waitForTimeout(2000)

        for (let i = 1; i < 5; i++) {
            await convertImage('./pdf/schedule_0.pdf', i)
            await page.waitForTimeout(2000)
        }
        await page.waitForTimeout(20000)
        await delFile("./pdf/")
        await rename("./img/")
        await page.waitForTimeout(2000)
        if (!prevExel) {
            Object.keys(chatIdJson).forEach((el) => {
                fs.readdir('./img', (err, files) => {
                    let filesObj = []
                    files.forEach((file, i) => {
                        if (i < 3) 
                            filesObj.push ({ type: 'document', media: `./img/${file}` })
                    })
                    return bot.sendMediaGroup(el, filesObj)
                })
            })
        }
    } else {
        console.log('Расписание не изменилось')
    }
    prevExel = exelLink

    await browser.close().then(() => console.log('Браузер закрыт'))
}

const interval = setInterval(main, 900000)
