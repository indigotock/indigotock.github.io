let routes = [
    // [12, 23, 15, 2, 8, 20, 21, 3, 23, 3, 27, 20, 0],
    // [21, 14, 8, 20, 10, 0, 23, 3, 24, 23, 0, 19, 14, 12, 10, 9, 12, 12, 11, 6, 27, 5],
    // [8, 18, 27, 10, 11, 22, 29, 23, 14],
    // [13, 7, 14, 1, 9, 14, 16, 12, 0, 10, 13, 19, 16, 17],
    // [24, 25, 21, 4, 6, 19, 1, 3, 26, 11, 22, 28, 14, 14, 27, 7, 20, 8, 7, 4, 1, 8, 10, 18, 21],
    // [13, 20, 26, 22, 6, 5, 6, 23, 26, 2, 21, 16, 26, 24],
    // [6, 7, 17, 2, 22, 23, 21],
    // [23, 14, 22, 28, 10, 23, 7, 21, 3, 20, 24, 23, 8, 8, 21, 13, 15, 6, 9, 17, 27, 17, 13, 14],
    // [23, 13, 1, 15, 5, 16, 7, 26, 22, 29, 17, 3, 14, 16, 16, 18, 6, 10, 3, 14, 10, 17, 27, 25],
    // [25, 28, 5, 21, 8, 10, 27, 21, 23, 28, 7, 20, 6, 6, 9, 29, 27, 26, 24, 3, 12, 10, 21, 10, 12, 17],
    // [26, 22, 26, 13, 10, 19, 3, 15, 2, 3, 25, 29, 25, 19, 19, 24, 1, 26, 22, 10, 17, 19, 28, 11, 22, 2, 13],
    // [8, 4, 25, 15, 20, 9, 11, 3, 19],
    // [24, 29, 4, 17, 2, 0, 8, 19, 11, 28, 13, 4, 16, 5, 15, 25, 16, 5, 6, 1, 0, 19, 7, 4, 6],
    // [16, 25, 15, 17, 20, 27, 1, 11, 1, 18, 14, 23, 27, 25, 26, 17, 1]
    // // [3, 1, 2, 3],
    // // [3, 2, 3, 1],
    // // [4, 2, 3, 4, 5]

    // [2, 1, 2],
    // [5, 2, 8]
]


// 1,2,3,4,5,1,2,3,4,5,1,2,3,4,5
// 2,3,4,2,3,4,2,3,4,2,3,4
function shareGossip(wardena, wardenb) {
    let ag = learnedGossips[wardena]
    let bg = learnedGossips[wardenb]

    ag.forEach(e => {
        bg.add(e)
    })
}

function getStopAtIndex(warden, ind) {
    return routes[warden][ind % routes[warden].length]
}
let gossipCount = []
let maxGossips = routes.length
let learnedGossips = []
for (let i = 0; i < maxGossips; i++) {
    learnedGossips.push(new Set([i]))
}


let allWardensDone = function () {
    let done = true
    learnedGossips.forEach(function (w) {
        if (w.size < maxGossips)
            done = false
    }, this);
    return done
}
let counter = 0
while (!allWardensDone()) {
    for (var i = 0; i < maxGossips; i++) {
        for (var j = 0; j < maxGossips; j++) {
            if (i === j) {
                continue;
            }

            if (getStopAtIndex(i, counter) === getStopAtIndex(j, counter)) {
                shareGossip(i, j)
                shareGossip(j, i)
            }
        }
    }
    counter++
    if (counter > 500) {
        console.log('Hit the limit of 500')
        break
    }
}
if (allWardensDone())
    console.log('It took', counter, 'turns')