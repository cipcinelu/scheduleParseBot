const { load } = require('cheerio');

const searchLastSchedule = async (exelLinks, page) => {
    let dataSheduleArray = []
    let dataAndLink = {}

    let content = await page.content()
    let $ = load(content)

    for (let i = 0; i < exelLinks.length; i++) {
        let link = $(exelLinks[i]).attr('href')
        await page.goto(link)
        content = await page.content()
        $ = load(content)
        let descriptionSchedule = $('body>div:contains("Группы - расписание на ")>div').attr('aria-label')
        dataAndLink[parseInt(descriptionSchedule.match(/\d+/))] = link
        dataSheduleArray.push(parseInt(descriptionSchedule.match(/\d+/)))
    }

    let dataShedule = Math.max.apply(null, dataSheduleArray)
    let exelLink = dataAndLink[dataShedule]
    
    return exelLink
}

module.exports = searchLastSchedule