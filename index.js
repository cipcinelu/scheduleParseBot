require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { writeFile } = require('fs')

const chatIdJson = require('./dataForMessage/chatIdJson.json')
const linksTeams = require('./dataForMessage/linksTeams.js')
const scheduleBells = require('./dataForMessage/scheduleBells.js')
const parser = require('./parser.js')

puppeteer.use(StealthPlugin())
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

let chatId;

(function () {
    bot.setMyCommands([
        { command: '/start', description: 'Описание' },
        { command: '/schedule', description: 'Посмотреть расписание' },
        { command: '/schedulebells', description: 'Расписание звонков и обеда' },
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

            writeFile('./dataForMessage/chatIdJson.json',
                JSON.stringify(chatIdObject), (err) => {
                    if (err) return console.error(err)
                });
            return bot.sendMessage(chatId,
                `Я пришлю расписание, как только оно изменится
/schedule - пришлю расписание
/linksteams - скину ссылку на teams
/schedulebells - расписание звонков и обеда
/donate - донат`)
        }
        if (text == '/schedule')
            return (
                bot.sendMessage(chatId, "Loading..."),
                bot.sendDocument(chatId, './pdf/schedule_0.pdf' )
            )
        if (text == '/schedulebells')
                return bot.sendMessage (chatId, scheduleBells)
        if (text == '/linksteams')
            return bot.sendMessage(chatId,
                linksTeams, {disable_web_page_preview: true})
        if (text == '/donate')
            return bot.sendMessage(chatId,
                `https://www.tinkoff.ru/cf/9MdrKS2I2jN`)
        if (text == '/test')
            return (parser(bot),
                bot.sendMessage(chatId, "Пошло поехало"))
    })
    bot.on('webhook_error', (error) => {
        console.log(error.code)
    });
}());

setInterval(parser, 100000, bot)
