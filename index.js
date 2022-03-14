process.env["NTBA_FIX_319"] = 1
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const parser = require('./scripts/parser.js')
const tBot = require('./scripts/tBot')

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

tBot(bot)
setInterval(parser, 900000, bot)
