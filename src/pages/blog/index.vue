<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue';
import * as echarts from 'echarts';
import 'echarts-wordcloud';
import {category, blogList} from "../../api/blog";

const wordCloud = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLElement | null>(null)
const contentRef = ref(null)
const typeRef = ref(null)

const categoryData = ref([])
const query = reactive({
  type:'公开',
  total:0,
  search: '',
  page:1,
})
const blogListData = ref([])

//动画，传入ref，type属于动画效果来源于https://www.minimamente.com/project/magic/
function animation(ref: any, type: string = 'boingInUp') {
  const selector = eval(ref).value.$el
  selector.classList.add('magictime', type)
  setTimeout(() => {
    selector.classList.remove('magictime', type)
  }, 1200);
}

//变更公开、私人属性
function changeType(){
  animation('typeRef','boingInUp')
  getCategory()
  search()
}

//获取分类
async function getCategory() {
  const {data} = await category(query)
  categoryData.value = data;
  wordCloudInit()
}
//查询
function search(category:any=''){
  if(category){
    query.search = category
  }
  animation('searchRef')
  query.page = 1
  getBlogList()
}
//获取列表
async function getBlogList(append:boolean=false) {
  const {data} = await blogList(query)
  if(append){
    blogListData.value = [...blogListData.value,...data.data]
  }else{
    query.total = data.total
    blogListData.value = data.data
  }
}
//跳转编辑
function edit(id){
  window.open('/blog/edit/'+id,'_blank')
}

/**词云*/
function wordCloudInit() {
  if (wordCloud.value) {
    // 初始化 ECharts 实例
    const myChart: echarts.EChartsType = echarts.init(wordCloud.value);
    // 配置词云图的参数
    const option = {
      series: [{
        type: 'wordCloud',
        shape: 'circle',
        // maskImage: maskImage,
        maskImage: '',
        left: 'center',
        top: 'center',
        width: '100%',
        height: '100%',
        right: null,
        bottom: null,
        sizeRange: [15, 100],
        textPadding: 0,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            return (
                'rgb(' +
                [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                ].join(',') +
                ')'
            )
          },
        },
        data: categoryData.value
      }]
    };

    // 使用配置项显示词云图,增加词云点击事件
    myChart.setOption(option);
    myChart.on('click', (params)=> {
      search(params.data.name)
    })
  }
}
//滚动加载
function scroll() {
  window.onscroll = () => {
    //变量scrollTop是滚动条滚动时，距离顶部的距离
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    //变量windowHeight是可视区的高度
    let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    //变量scrollHeight是滚动条的总高度
    let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    //滚动条到底部的条件
    // console.log('距顶部+可视区高度' + (scrollTop + windowHeight) + '滚动条总高度' + scrollHeight)
    // console.log('距顶部' + scrollTop + '可视区高度' + windowHeight + '滚动条总高度' + scrollHeight)\
    if (scrollHeight - (scrollTop + windowHeight) < 1 && query.total > blogListData.value.length) {
      //写后台加载数据的函数
      query.page++
      getBlogList(true)
    }
  }
}
onMounted(() => {
  getCategory()
  getBlogList()
  scroll()
});
</script>

<template>
  <div ref="contentRef">
    <el-row>
      <el-col>
        <div ref="wordCloud" style="height: 200px;margin: 20px

"></div>
        <div style="text-align: center">
          <el-input class="query-search" ref="searchRef" @change="search" v-model="query.search"
                    placeholder="输入分类、标题、内容进行搜索" style="width: 400px"

          >
          </el-input>
          <el-select ref="typeRef" style="margin:0 20px;width: 100px;" class="query-type" @change="changeType" v-model="query.type">
            <el-option v-for="item in ['公开','私有']" :value="item" :label="item"></el-option>
          </el-select>

          <el-button v-if="query.type === '私有'" @click="edit(0)" plain circle style="height: 40px;width: 40px;"><el-icon><Plus /></el-icon></el-button>
        </div>
      </el-col>
      <el-col :lg="16" :offset="4" style="margin-top: 30px">
        <div v-for="item in blogListData">
          <el-card class="blog-info">
            <div>
              <a :href="'/blog/detail/'+item.id" target="_blank">{{ item.title }}</a> <span class="publish" v-if="item.publish === '私有'">{{item.publish}}</span>
              <span v-if="query.type === '私有'">
                <el-button size="small" plain circle @click="edit(item.id)"><el-icon><Edit /></el-icon></el-button>
              </span>
            </div>
            <div class="blog-category">
              <el-button v-for="c in item.category" @click="search(c)">{{ c }}</el-button>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.el-row {
  overflow-x: hidden;
}

::v-deep .query-search {
  -webkit-box-shadow: 0px 10px 23px 6px #d1edff;
  box-shadow: 0px 10px 23px 6px #d1edff;

  .el-input__wrapper {
    box-shadow: none !important;
    height: 40px;
    .el-input__inner {
      font-family: "Lucida Handwriting", serif;
      font-size: 16px;
    }
  }
}
::v-deep .query-type{
  -webkit-box-shadow: 0px 10px 23px 6px #d1edff;
  box-shadow: 0px 10px 23px 6px #d1edff;
  .el-input__wrapper {
    box-shadow: none !important;
    height: 40px;
    .el-input__inner {
      font-family: "Lucida Handwriting", serif;
      font-size: 16px;
      text-align: center;
    }
  }
}

.el-card {
  border: 0 !important;
}

::v-deep .blog-info {
  width: 100%;
  --gradient: rgba(231, 28, 28, 0.99) 10%, rgba(223, 149, 64, 0.62) 25%, rgba(211, 217, 72, 0.55) 50%, rgba(0, 203, 27, 0.75) 75%, rgba(0, 156, 203, 0.75) 90%;
  --gradient-angle: 20deg;
  border-image: linear-gradient(var(--gradient-angle, to bottom), var(--gradient)) 1 !important;
  border-top-width: 3px !important;
  border-top-style: solid !important;
  margin: 15px;
  font-family: "Lucida Handwriting";
  a{
    text-decoration:none!important;
  }
  a:hover{
    text-decoration-line: underline!important;
    text-decoration-color: rgba(231, 28, 28, 0.99) !important;
  }
  .blog-category {
    padding-top: 5px;
  }
  .publish{
    font-size: 12px;
  }
}

</style>
