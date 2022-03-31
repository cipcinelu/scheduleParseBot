require('dotenv').config();
const { writeFile } = require('fs')

const chatIdJson = require('../dataForMessage/chatIdJson.json')
const startMessage = require ('../dataForMessage/startMessage')
const scheduleBells = require('../dataForMessage/scheduleBells.js')

const tBot = (bot) => {
    bot.setMyCommands([
        { command: '/start', description: 'Описание котиков' },
        { command: '/sh', description: 'Посмотреть расписание котиков' },
        { command: '/shbells', description: 'Расписание питания котов' },
        { command: '/linksteams', description: 'Ссылки на OnlyFans котов' },
        { command: '/donate', description: 'Главный кот' },
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
            return bot.sendPhoto(chatId, "https://cs6.pikabu.ru/post_img/big/2015/06/17/8/1434544476_2137371006.jpg")  
        if (text == '/schedulebells' || text == '/shbells')
                return bot.sendMessage (chatId, scheduleBells)
        if (text == '/linksteams')
            return bot.sendMessage(chatId,
                `Ты совсем кукухой поехал?
                С головой дружишь?`)
        if (text == '/donate')
            return bot.sendMessage(chatId,
                `https://www.tinkoff.ru/cf/9MdrKS2I2jN`)
    })
    // bot.on('webhook_error', (error) => {
    //     console.log(error.code)
    // });
}

module.exports = tBot