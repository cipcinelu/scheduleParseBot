const anegdots = require('../../dataForMessage/anegdots.js')

const getAnegdot = () => {
    let zeroDay = new Date('03.23.2022')
    let indexAnegdot = Math.ceil((Date.now() - zeroDay.getTime()) / (1000 * 3600 * 24))
    
    console.log('indexAnegdot ' + indexAnegdot)

    return anegdot = anegdots[indexAnegdot];
}

module.exports = getAnegdot;