
function addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
}

function getHourMin() {
    const date = new Date();
    return addZero(date.getHours()) + ':' + addZero(date.getMinutes());
}

function getDateTime() {
    const date = new Date();
    return addZero(date.getDate()) + '/' + addZero(date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes());
}

function validOrError(theValue, errorMsg) {

    if (theValue == undefined) {
        throw errorMsg || 'Does not accept undefined'
    } else if (isNaN(theValue)) {
        throw errorMsg || 'It is not a number'
    } else if (theValue == false && typeof theValue == 'boolean') {
        throw errorMsg || 'False value (not accepted)'
    }
}

function legend(msg, colr, x, y, expression) {
    textSize(10)
    noStroke()
    if (expression) {
        fill(colr)
        circle(x, y - 12, 5)
    }
    fill(100)
    text(msg, x, y)
}
function convertCoordToBox(x, y) {
    return ({ x: x - box.x, y: box.y1 - y })
}

function showCoordToBox() {
    const conv = convertCoordToBox(mouseX, mouseY)
    const reco = convertBoxToCoord(conv.x, conv.y)
    noStroke()
    fill(0)
    textSize(12)
    text(`(${mouseX},${mouseY})-(${conv.x}, ${conv.y}) ~ (${reco.x}.${reco.y})`, mouseX, mouseY - 10)
    stroke(0)
    noFill()
    circle(mouseX, mouseY, 8)
}
function convertBoxToCoord(x, y) {
    return ({ x: x + box.x, y: box.y1 - y })
}