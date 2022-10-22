let themeGreen = null
let themePink = null
let themeBlue = null

let textGreen = null
let textPink = null
let textBlue = null
function setTheme(text) {
    let root = document.documentElement
    //使用getComputedStyle能获取更高层级的值
    //root.style.getPropertyValue()只能获得内联样式的值
    let deepRoot = getComputedStyle(root)

    themeGreen = deepRoot.getPropertyValue('--theme-color-green')
    themePink = deepRoot.getPropertyValue('--theme-color-pink')
    themeBlue = deepRoot.getPropertyValue('--theme-color-blue')

    textGreen = deepRoot.getPropertyValue('--theme-text-green')
    textPink = deepRoot.getPropertyValue('--theme-text-pink')
    textBlue = deepRoot.getPropertyValue('--theme-text-blue')

    switch (text) {
        case '树叶绿':
            root.style.setProperty('--theme-color', themeGreen)
            root.style.setProperty('--theme-text', textGreen)
            localStorage.setItem('theme', JSON.stringify({ themeColor: themeGreen, themeText: textGreen }))
            break;
        case '樱色粉':
            root.style.setProperty('--theme-color', themePink)
            root.style.setProperty('--theme-text', textPink)
            localStorage.setItem('theme', JSON.stringify({ themeColor: themePink, themeText: textPink }))
            break;
        case '天苍蓝':
            root.style.setProperty('--theme-color', themeBlue)
            root.style.setProperty('--theme-text', textBlue)
            localStorage.setItem('theme', JSON.stringify({ themeColor: themeBlue, themeText: textBlue }))
            break;

    }
}


export default setTheme;