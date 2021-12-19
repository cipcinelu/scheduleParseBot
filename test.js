let dataShedule = `20`
console.log(dataShedule)

let exelLinkLocal = "Изменения в расписании учебных занятий на 18.12.2021"
const regexp = new RegExp(dataShedule + '\\.');

if (exelLinkLocal.search(regexp) != -1) {
    console.log("NICE")
} else {
    console.log("ANTINICE")
}