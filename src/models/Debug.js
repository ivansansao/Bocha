function showInfo() {

    if (!toShowInfo) {
        return
    }

    noStroke()
    textAlign(LEFT)
    textSize(14)
    textStyle(NORMAL)

    for (let i = 0; i < logs.length; i++) {
        const element = logs[i];
        // fill(255)
        // rect(10, 4, 200, (i + 1) * 20);
        fill(0)
        text(element, 10, 220 + (i + 1) * 20);
    }

}