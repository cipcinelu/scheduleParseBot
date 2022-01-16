const puppeteer = require('puppeteer-extra');
const { load } = require('cheerio');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())


let parser = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        //executablePath: '/usr/bin/google-chrome'
    });

    const page = await browser.newPage();
    await page.goto('https://drive.google.com/file/d/1lExIrqkD_R_tq19-8GguC4_xL73mBY5N/view');
    let content = await page.content();

    let $ = load(content);
    let exelLinks = $('div')

    for (i = 0; i < exelLinks.length; i++) {
        let exelLinkLocal = $(exelLinks[i]).attr('aria-label')
        !!exelLinkLocal && console.log (exelLinkLocal) 
    }

    await browser.close().then(() => console.log('Браузер закрыт'))
}

parser()