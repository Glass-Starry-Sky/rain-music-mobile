/**-------------------------------------------------------------
*   初始化主题
--------------------------------------------------------------*/
function getTheme() {
    if (localStorage.getItem('theme') != null) {
        let root = document.documentElement
        //使用getComputedStyle能获取更高层级的值
        //root.style.getPropertyValue()只能获得内联样式的值

        let themeObj = JSON.parse(localStorage.getItem('theme'))
        console.log(themeObj);
        // let deepRoot = getComputedStyle(root)

        root.style.setProperty('--theme-color', themeObj.themeColor)
        root.style.setProperty('--theme-text', themeObj.themeText)
    }

}


export default getTheme;