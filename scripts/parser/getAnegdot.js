const anegdots = require('../../dataForMessage/anegdots.js')

const getAnegdot = async () => {

    return new Promise (resolve => {
        // let zeroDay = new Date('03.23.2022')
        // let indexAnegdot = Math.ceil((Date.now() - zeroDay.getTime()) 
        //                                 / (1000 * 3600 * 24))
        let indexAnegdot = Math.round (Math.random() * 733)
        let anegdot = anegdots[indexAnegdot]

        if (anegdot.length > 2456) anegdot = 'Надел мужик шляпу, а она ему как раз'
        resolve(anegdot)
    })
}

module.exports = getAnegdot;