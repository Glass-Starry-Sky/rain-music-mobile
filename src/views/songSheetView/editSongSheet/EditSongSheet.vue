<template>
    <div class="edit-container">
        <div class="header">
            <div class="head-left">
                <div @click="goback" class="iconfont icon-zuojiantou"></div>
                <div >已选择{{checkedCount}}项</div>
            </div>       
            <div @click="allCheck" v-if="isAllCheck">全选</div>
            <div @click="allNotCheck" v-else>取消全选</div>
        </div>
        <div v-if="getSongSheetList.length>0">
            <div v-for="item,index in getSongSheetList" :key="item.label" class="edit-item"
            ref="editItemList" >
                <EditItem :songSheetItem="item"    @itemDrag="itemDrag"    
                :data-label="item.label" :data-picurl="item.picUrl" :checked="checkedList[index]"
                :index="index" @saveCheckedList="saveCheckedList">
                    <span class="count">{{item.count}}</span>
                </EditItem>
            </div>
        </div>
        <div v-else>
            <div>暂无歌单->创建一个</div>
        </div> 
        
        <van-button type="default" class="delete" @click="Delete">删除</van-button>
        <div class="bottom-null"></div>
    </div>
    
</template>
<script>
import { reactive,ref,computed } from '@vue/reactivity';
    import { useRoute,useRouter } from 'vue-router';
import EditItem from './editItem/EditItem';
import { onBeforeMount, onMounted, onUpdated } from '@vue/runtime-core';
import { useStore } from 'vuex';
import { Dialog } from 'vant';

export default {
    components:{
        EditItem
    },
    setup() {
        const store=useStore();
        const $route = useRoute();
        const $router=useRouter()
       
    
        /**-------------------------------------------------------------
        *   得到需要的歌单
        --------------------------------------------------------------*/
        const choose = $route.query.choose
        let getSongSheetList=[]
        switch(choose){
            case 'myedit':
                getSongSheetList=computed(()=>store.state.forSongSheet.mySongSheetList)
                break;
            case 'collectedit':
                getSongSheetList=computed(()=>store.state.forSongSheet.collectSongSheetList)
                break;    
        }
        /**-------------------------------------------------------------
        *   返回
        --------------------------------------------------------------*/
        const goback=()=>{
            console.log('goback');
            $router.back()
        }

        /**-------------------------------------------------------------
        *   响应子组件的saveCheckedList事件
        --------------------------------------------------------------*/
        let checkedList=reactive([])
        let checkedCount=ref(0)

        const calcCheckedCount=()=>{
            checkedCount.value=0
            checkedList.map((item,index)=>{
                if(item==true){
                    console.log('true');
                    checkedCount.value++
                }
            })
        }
        const saveCheckedList=(index,checked)=>{
            checkedList[index]=checked
            // console.log(checkedList);
            calcCheckedCount()
            
        }

        /**-------------------------------------------------------------
        *   全选
        --------------------------------------------------------------*/
        let isAllCheck=ref(true)
        const allCheck=()=>{
            //切换按钮
            isAllCheck.value=false
            checkedList.map((item,index)=>{
                checkedList[index]=true
            })
            calcCheckedCount()

        }
        const allNotCheck=()=>{
            //切换按钮
            isAllCheck.value=true
            checkedList.map((item,index)=>{
                checkedList[index]=false
            })
            calcCheckedCount()
        }

        /**-------------------------------------------------------------
        *   删除
        --------------------------------------------------------------*/
       const Delete=()=>{
            // console.log('delete');
            //获取已勾选的项
            let labelList=[]
            checkedList.map((item,index)=>{
                
                if(item==true){
                    let label= getSongSheetList.value[index].label                  
                    labelList.push(label)
                }             
            })
            //有要删除的项
            if(labelList.length>0){

                Dialog.confirm({
                    title: '删除歌单',
                    message:
                        `确认要删除吗`
                    })
                    .then(() => {
                        console.log(labelList)
                        store.commit('multipleDeleteOneOfSongSheetList',{labelList,choose})
                        //删除结束，取消勾选
                        checkedList.map((item,index)=>{
                            checkedList[index]=false
                        })
                        //数量清零
                        checkedCount.value=0
                        
                    })
                    .catch(() => {
                        // on cancel
                    });


               
            }
               
           
       }


        /**-------------------------------------------------------------
        *   拖拽
        --------------------------------------------------------------*/
        let oneItemHeight=0
        let editItemBox=null
        let curSelectIndex=-1
        const itemDrag=(e)=>{
           // console.log('e',e.path[2].offsetTop);
            console.log('dragclick');
            for(let index in itemOffsetHeightList){
                if(itemOffsetHeightList[index]==e.path[2].offsetTop){
                    curSelectIndex=Number(index)
                    console.log('first-curIndex',curSelectIndex);
                }
                     
            }
            //第三步,移动时，两个元素都要相对移动
            let prevPageY=0
  
            function moving(e){
                // console.log('dragObj.style.top',dragObj.value.style.top);
                
                
                let pageY=e.changedTouches[0].pageY
                //第一次处理时
                if(prevPageY==0){
                    prevPageY=pageY
                }
                // let selfY=e.path[4].offsetTop
                editItemBox=e.path[2]
                oneItemHeight=editItemBox.clientHeight

                //先将所有item的position设置成定位
                // editItemList.value.map((item)=>{
                //     item.children[0].children[0].style.position='absolute'
                // })
                

    
                //如果向下滑动,pageY会变大   对应的另一个元素要向下
                if(pageY>prevPageY&&curSelectIndex!=editItemList.value.length-1){
                    for(let i=curSelectIndex;i<editItemList.value.length-1;i++){
                       let move=pageY-itemOffsetHeightList[curSelectIndex]

                        //1.修改定位
                        editItemList.value[Number(curSelectIndex)].children[0].children[0].style.position='absolute'
                        editItemList.value[Number(curSelectIndex)+1].children[0].children[0].style.position='absolute'
                        //2.移动下一个元素
                       editItemList.value[Number(curSelectIndex)+1].children[0].children[0].style.top
                       =(itemOffsetHeightList[Number(curSelectIndex)+1]-move)+'px'
                        
                       //3.超过底下元素的原本位置了,准备修改位置(交换)                     
                       if(pageY>itemOffsetHeightList[curSelectIndex+1] &&curSelectIndex!=editItemList.value.length-1){
                            console.log('超过了!');
                            let obj={whichSongSheet:choose,index:curSelectIndex,index2:curSelectIndex+1}
    
                            editItemList.value[curSelectIndex+1].children[0].children[0].style.position='unset'
                            store.commit('exchangeSongSheetList',obj)
                            //交换原有的元素
                            let temp=null
                            temp=editItemList.value[curSelectIndex]
                            editItemList.value[curSelectIndex]=editItemList.value[curSelectIndex+1]
                            editItemList.value[curSelectIndex+1]=temp
                            //修改当前选定位置
                            curSelectIndex=curSelectIndex+1                                           
                       }
                    }
                }
                //向上滑动,对应的另一个元素要向下
                else if(pageY<prevPageY&&curSelectIndex!=0){
                    for(let i=curSelectIndex;i>0;i--){
                        let move=itemOffsetHeightList[curSelectIndex]-pageY
                        //1.修改定位
                        editItemList.value[curSelectIndex].children[0].children[0].style.position='absolute'
                            editItemList.value[curSelectIndex-1].children[0].children[0].style.position='absolute'
                        //2.移动下一个元素
                        editItemList.value[curSelectIndex-1].children[0].children[0].style.top
                        =(itemOffsetHeightList[curSelectIndex-1]+move)+'px'
                        //3.比上面元素的原本位置小了,准备修改位置(交换)                     
                        if(pageY<itemOffsetHeightList[curSelectIndex-1] ){
                                console.log('小于了!');
                                let obj={whichSongSheet:choose,index:curSelectIndex,index2:curSelectIndex-1}
        
                                editItemList.value[curSelectIndex-1].children[0].children[0].style.position='unset'
                                store.commit('exchangeSongSheetList',obj)
                                //交换原有的元素
                                let temp=null
                                temp=editItemList.value[curSelectIndex]
                                editItemList.value[curSelectIndex]=editItemList.value[curSelectIndex-1]
                                editItemList.value[curSelectIndex-1]=temp
                                //修改当前选定位置
                                curSelectIndex=curSelectIndex-1                                          
                        }
                    }
                }
                
                //修改当前选中元素的位置
                editItemBox.style.top=(pageY)+'px'
                //prevPageY等于前一个位置
                prevPageY=pageY
                }


                document.addEventListener(('touchmove'),moving,false)         
                //第四步,释放时取消定位   
                document.addEventListener(('touchend'),(e)=>{
                    document.removeEventListener('touchmove',moving)
                    let pageY=e.changedTouches[0].pageY
                    let intCount=Math.floor(pageY/oneItemHeight)
                    let aimY=intCount*oneItemHeight
                    //最后的位置设置
                    editItemList.value.map((item)=>{
                        item.children[0].children[0].style.position='unset'
                    })
             
                    // editItemBox.style.top=(aimY)+'px'
                    //  editItemBox.style.position='unset'
                    
                },false)
            }



        let editItemList=ref(null)
        // onUpdated(()=>{
          
        // })
        let itemOffsetHeightList=[]
        onMounted(()=>{
            //初始化checkedList
            for(let index in editItemList.value){
                checkedList[index]=false
                console.log( checkedList)
            }

            //第一步,获取每个item的offsetHeight
          
            editItemList.value.map((item)=>{
                itemOffsetHeightList.push(item.offsetTop)
            })
            console.log('editItemList!!!!!!!!!!',itemOffsetHeightList);
            //第二步,监听拖拽事件
            //itemDrag
     
        })

        return {
            getSongSheetList,
            editItemList,
            itemDrag,
            checkedList,
            Delete,saveCheckedList,
            isAllCheck,allCheck,allNotCheck,checkedCount,
            goback
        };
    },
    components: { EditItem }
}
</script>
<style scoped lang='less'>
    .edit-container{
        // box-sizing: border-box;
        // padding:0 15px;
        width: 100%;
        height: 100%;
        padding-top: 20px;
        box-sizing: border-box;
        .header{
         
             display: flex;
             justify-content: space-between;
             align-items: center;
             height: 40px;
             padding:0 15px;
             .head-left{     
                display: flex; 
                align-items: center;
                height: 100%;
                &>div:first-child{
                    margin-right:20px;
                }
             }
        }
    }
    @selfHeight:50px;
    @tabbarHeight:50px;
    @audioPlayHeight:45px;
    .delete{
        position: fixed;
        height: 50px;
        top:calc(100% - @tabbarHeight - @audioPlayHeight - @selfHeight);
        // top:calc(100% - 205px);
        left:0%;
        border-radius: 10px;
        width: 100%;
        margin-bottom: 20px;
        background-color: var(--theme-color);
        color:var(--theme-text);
    }
    .bottom-null{
        margin-bottom: calc( @tabbarHeight + @audioPlayHeight + @selfHeight);
    }
</style>
