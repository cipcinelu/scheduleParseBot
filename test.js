const puppeteer = require('puppeteer-extra');
const { load } = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())


let parser = async () => {
    let exelLink;
    let exelText;
    const browser = await puppeteer.launch({
        headless: true,
        //executablePath: '/usr/bin/google-chrome'
    });

    const page = await browser.newPage();
    await page.goto('http://www.mgkit.ru/studentu/raspisanie-zanatij');
    let content = await page.content();

    let $ = load(content);
    let exelLinks = $('a')
    let dataSheduleArray = []
    let allDataSheduleArray = []

    for (i = 0; i < exelLinks.length; i++) {
        let exelLinkLocal = $(exelLinks[i]).text()
        if (exelLinkLocal.search(/(кабинетов.)/) != -1) {
            dataSheduleArray.push(parseInt(exelLinkLocal.match(/\d+/)))
        }
        allDataSheduleArray.push($(exelLinks[i]))
    }

    dataShedule = Math.max.apply(null, dataSheduleArray)

    //находим ссылку с нужным числом
    const regexp = new RegExp(dataShedule + '\\.');
    
    for (let i = 0; i < allDataSheduleArray.length; i++) {
        let link = allDataSheduleArray[i];
        if (allDataSheduleArray[i].text().search(/(кабинетов.)/) != -1) {
            let schedule = allDataSheduleArray[i-1]
            exelLink = schedule.attr('href')
        }
    }


    console.log("dataShedule " + dataShedule)
    console.log("exelLink " + exelLink)

    await browser.close().then(() => console.log('Браузер закрыт'))
}

parser()