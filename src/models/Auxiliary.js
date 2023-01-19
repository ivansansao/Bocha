
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