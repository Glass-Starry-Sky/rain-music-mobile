const changeWholeTimeFormat = (duration) => {
    let minute = '00'
    let second = '00'
    if (duration < 3600) {

        minute = Math.floor(duration / 60).toFixed(0)
        if (minute < 10) { minute = '0' + minute }
        second = Math.floor(duration % 60).toFixed(0)
        if (second < 10) { second = '0' + second }
    }
    let wholeTimeFormat = null
    return wholeTimeFormat = minute + ":" + second
}

const changeCurrentTimeToMinute = (time) => {
    //目前只处理3600秒以下的歌曲
    let minute = '00'
    let second = '00'
    if (time < 3600) {
        // console.log('time',time);
        minute = Math.floor(time / 60).toFixed(0)

        if (minute < 10) { minute = '0' + minute }
        second = Math.floor(time % 60).toFixed(0)
        if (second < 10) { second = '0' + second }
    }
    let currentTimeFormat = null
    return currentTimeFormat = minute + ":" + second

}
export { changeWholeTimeFormat, changeCurrentTimeToMinute }