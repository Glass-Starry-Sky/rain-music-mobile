import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Axios from 'axios'




const app = createApp(App)

/* 挂载全局对象 start */

//手机端不存在跨域问题,打包后代理配置会失效,需要主动设置 （发布时使用）
Axios.defaults.baseURL = 'https://autumnfish.cn'

//（开发时使用）
// Axios.defaults.baseURL = '/api/'


//定义全局变量的方法
app.config.globalProperties.$http = Axios

/* 挂载自定义指令 --- lazy */
app.directive('lazy', {
    //vue3中要用mounted (相比vue2改成了生命周期的形式),el表示绑定该指令的对象，binging.value表示上面绑定的值
    mounted(el, binging) {
        // console.log('el', el)
        if (IntersectionObserver) {
            let lazyLoadObser = new IntersectionObserver((entries, obser) => {
                entries.forEach((entry, index) => {
                    //el和 entry.target基本等价，但前提是el是单个对象，因为entry是entries的forEach后的结果
                    let lazyImage = entry.target

                    // console.log('lazyImage', lazyImage)
                    //能够看见的百分比
                    // console.log('entry.intersectionRatio', entry.intersectionRatio);
                    if (entry.intersectionRatio > 0.01) {
                        lazyImage.src = binging.value
                        lazyLoadObser.unobserve(lazyImage)
                    }
                })
            })
            //要绑定的元素 ,实际上定义了lazyLoadObser后，先执行该步骤  ,new IntersectionObserver是往内部传入了一个函数，执行时间还不清楚     
            lazyLoadObser.observe(el)

        }
    }
})

app.use(store)
app.use(router)
// app.use(Toast);


app.mount('#app')