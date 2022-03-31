process.env["NTBA_FIX_319"] = 1
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const tBot = require('./scripts/tBot')
const cats = require('./dataForMessage/catsPack')

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
const chatIdJson = require('./dataForMessage/chatIdJson.json');

tBot(bot)

const startMessage = `Бот захвачен хакерской группировкой CatEvil
Ближайшее время мы наведём здесь порядок`

Object.keys(chatIdJson).forEach((el) => {
    return bot.sendPhoto (el, 'http://s2.fotokto.ru/photo/full/93/934069.jpg', { caption: startMessage })
        .catch(() => {
            console.log(`${el} заблокировал бота`)
        })
})

const send = (cat) => {
    console.log('cat')
    Object.keys(chatIdJson).forEach((el) => {
        return bot.sendPhoto (el, cat)
            .catch(() => {
                console.log(`${el} заблокировал бота`)
            })
    })
}

for (let i = 0; i < cats.length; i++){
    setTimeout (send, 1200000*(i + 1), cats[i])
}
