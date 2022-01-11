const puppeteer = require('puppeteer-extra');
const {load} = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
process.env["NTBA_FIX_319"] = 1
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const parser = require('./scripts/parser.js')
const tBot = require('./scripts/tBot')
const chatIdJson = require('./dataForMessage/chatIdJson.json')

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });
puppeteer.use(StealthPlugin())
let exelText =  'Изменения в расписании учебных занятий на 30.12.2021'
Object.keys(chatIdJson).forEach((el) => {
    return bot.sendDocument
        (el, './pdf/schedule_0.pdf', 
            {caption: exelText},
            {contentType: 'application/x-pdf'} )
            .catch (() => {
                console.log (`${el} заблокировал бота`)
            })
})   