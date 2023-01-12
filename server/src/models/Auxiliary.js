function addZero(i) {
    if (i < 10) { i = "0" + i }
    return i;
}


function getDateTime() {
    const date = new Date();
    return addZero(date.getDate()) + '/' + addZero(date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + addZero(date.getHours()) + ':' + addZero(date.getMinutes());
}

function dateLog(data) {
    console.log(getDateTime() + ": " + data)
}

export { dateLog, getDateTime }