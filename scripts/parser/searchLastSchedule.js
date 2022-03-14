const { load } = require('cheerio');

const searchLastSchedule = async (exelLinks, page) => {
    let dataSheduleArray = []
    let dataAndLink = {}

    let content = await page.content()
    let $ = load(content)


    for (let i = 0; i < exelLinks.length; i++) {
        let link = $(exelLinks[i]).attr('href')
        
        await page.goto(link, { waitUntil: 'load', timeout: 0 })
        content = await page.content()
        $ = load(content)
        
        let descriptionSchedule = $('body>div:contains("Группы")>div').attr('aria-label')
        let dateRegExp = /(0[1-9]|[12][0-9]|3[01])[- \.](0[1-9]|1[012])[- \.](19|20)\d\d/
        let matchDate = descriptionSchedule.match(dateRegExp)
        let date = new Date (`${matchDate[2]}.${matchDate[1]}.2022`)
        
        dataAndLink[date] = link
        dataSheduleArray.push(date)
    }

    let dataShedule = Math.max.apply(null, dataSheduleArray)
    let exelLink = dataAndLink[new Date (dataShedule)]

    return exelLink
}

module.exports = searchLastSchedule