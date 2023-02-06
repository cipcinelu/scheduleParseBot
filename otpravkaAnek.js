process.env["NTBA_FIX_319"] = 1
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const chatIdJson = require('./dataForMessage/chatIdJson.json')
const anegdots = require('./dataForMessage/anegdots.js')

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

let idAnek = Math.round (Math.random() * 733)

let text = anegdots [idAnek]

Object.keys(chatIdJson).forEach((el) => {
    return bot.sendMessage
        (el, text)
            .catch (() => {
                console.log (`${el} заблокировал бота`)
            })
})   