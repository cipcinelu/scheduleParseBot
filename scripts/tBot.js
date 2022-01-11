require('dotenv').config();
const { writeFile } = require('fs')

const chatIdJson = require('../dataForMessage/chatIdJson.json')
const startMessage = require ('../dataForMessage/startMessage')
const linksTeams = require('../dataForMessage/linksTeams.js')
const scheduleBells = require('../dataForMessage/scheduleBells.js')
const parser = require('./parser.js')

const tBot = (bot) => {
    bot.setMyCommands([
        { command: '/start', description: 'Описание' },
        { command: '/schedule', description: 'Посмотреть расписание' },
        { command: '/schedulebells', description: 'Расписание звонков и обеда' },
        { command: '/linksteams', description: 'Ссылки на teams' },
        { command: '/donate', description: 'Донат' },
    ])

    bot.on('message', async (msg) => {
        let chatId = msg.chat.id;
        let text = msg.text

        if (text == '/start') {
            let name = msg.chat.username
            const chatIdObject = chatIdJson;
            if (!!name) chatIdObject[chatId] = name;
            else chatIdObject[chatId] = "withoutNick";

            writeFile('./dataForMessage/chatIdJson.json',
                JSON.stringify(chatIdObject), (err) => {
                    if (err) return console.error(err)
                });
            return bot.sendMessage(chatId, startMessage, 
                {parse_mode:'HTML', disable_web_page_preview: true})
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
    // bot.on('webhook_error', (error) => {
    //     console.log(error.code)
    // });
}

module.exports = tBot