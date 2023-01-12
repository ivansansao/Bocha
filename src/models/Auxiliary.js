
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
