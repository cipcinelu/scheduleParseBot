require('dotenv').config();
const { writeFile } = require('fs')

const chatIdJson = require('../dataForMessage/chatIdJson.json')
const startMessage = require ('../dataForMessage/startMessage')
const linksTeams = require('../dataForMessage/linksTeams.js')
const scheduleBells = require('../dataForMessage/scheduleBells.js')
const parser = require('./parser.js');
const getNameSh = require('./parser/getNameSh');
const getAnegdot = require('./parser/getAnegdot');

const tBot = (bot) => {
    bot.setMyCommands([
        { command: '/start', description: 'Описание' },
        { command: '/sh', description: 'Посмотреть расписание' },
        { command: '/shbells', description: 'Расписание звонков и обеда' },
        { command: '/getanek', description: 'Хочу анегдот' },
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
        if (text == '/schedule' || text == '/sh')
            return (
                bot.sendMessage(chatId, "Loading..."),
                bot.sendDocument(chatId, `./pdf/${getNameSh('./pdf/')}` )
            )
        if (text == '/schedulebells' || text == '/shbells')
                return bot.sendMessage (chatId, scheduleBells)
        if (text == '/linksteams')
            return bot.sendMessage(chatId,
                linksTeams, {disable_web_page_preview: true})
        if (text == '/getanek')
            return bot.sendMessage(chatId, await getAnegdot())
        if (text == '/donate')
            return bot.sendMessage(chatId,
                `https://qiwi.com/n/STEVEYOBA`)
        if (text == '/test' && chatId === parseInt (process.env.ADMINID))
            return (parser(bot),
                bot.sendMessage(chatId, "Пошло поехало"))
        if (text == '/sendForce' && chatId === parseInt (process.env.ADMINID))
            return (parser(bot, sendForce = true),
                bot.sendMessage(chatId, "Пошло поехало (Принудительно)"))
        if (text.match('/message') && chatId === parseInt (process.env.ADMINID)) {
            Object.keys(chatIdJson).forEach((el) => {
                return bot.sendMessage(el, text.replace(/\/message/,''))
            })
        }
    })
    // bot.on('webhook_error', (error) => {
    //     console.log(error.code)
    // });
}

module.exports = tBot