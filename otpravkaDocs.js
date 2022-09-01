process.env["NTBA_FIX_319"] = 1
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const chatIdJson = require('./dataForMessage/chatIdJson.json')

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

let exelText =  'Изменения в расписании учебных занятий на 01.02.2022'
Object.keys(chatIdJson).forEach((el) => {
    return bot.sendDocument
        (el, './pdf/schedule_0.pdf', 
            {caption: exelText},
            {contentType: 'application/x-pdf'} )
            .catch (() => {
                console.log (`${el} заблокировал бота`)
            })
})   