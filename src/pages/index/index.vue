<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue';
import {roomAdd, roomAddTo, roomList} from "../../api/room";
import { useUserStore } from '@/store/user'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import QrcodeVue from "qrcode.vue";

const user = useUserStore()
const visible = ref(false)
const emoji = ref(false)
const content = ref(null)
const scroll = ref(false) //如果为true则事件不触发滚动置底
const qrUrl = ref("weixin://wxpay/bizpayurl?pr=vfY48pPzz")

const room = reactive({
  add: '',
  join: '',
  list: {
    1: {
      id: 1,
      room_id:1,
      title: '12',
      content: [],
      new: 0
    }
  },
  currentRoom: '',
  type:'0',//0正常，1markdown
  content: '', //正常发送内容
  markdownContent:''//markdown发送内容
})


import io from 'socket.io-client';

// 创建 Socket.IO 客户端实例
const socket = io('http://localhost:9090',{query:{token:user.token}}); // 指定服务器的地址和端口

//初始化获取房间列表
async function getRoomList() {
  const {data} = await roomList({});
  room.list = data
  for(let index in data){
    joinRoom(data[index].room_id)
  }
}
//加入房间
function joinRoom(roomId: any) {
  socket.emit("joinRoom", roomId, (res: any) => {
    closeVisible()
  })
}
//新增房间
function addRoom() {
  roomAdd({title: room.add}).then(() => {
    getRoomList()
    closeVisible()
  });
}
//加入房间
function addToRoom(){
  roomAddTo({room:room.join}).then(()=>{
    getRoomList()
  })
}
function sendMsg() {
  const content = room.type == '0' ? room.content : room.markdownContent
  if(!content){
    return false
  }
  const type = room.type
  socket.emit('chat', {room: room.currentRoom, content,type},()=>{
    room.content = ''
  });
}



//切换选择聊天室
function selectCurrentRoom(room_id:any){
  room.currentRoom = room_id
  scrollToBottom()
}
// 监听连接成功事件
socket.on('connect', () => {
  console.log('Connected to server')
});
// 监听连接断开事件
socket.on('disconnect', () => console.log('Disconnected from server'));
//聊天事件处理
socket.on('chat', (data) => {
  // 处理收到的房间1中的消息
  // 这里假设 data 是一个包含房间1中消息内容的对象
  if(data!= 'success'){
    room.list[data.room].content.push(data)
    scrollToBottom()
  }
});
//校验是否显示时间，间隔10分钟未有回复则显示
function timeShow(index:any){
  if(index == 0){
    return true;
  }else{
    const startDate = new Date(room.list[room.currentRoom].content[index-1].createAt);
    const endDate = new Date(room.list[room.currentRoom].content[index].createAt);
    // 获取时间戳（以毫秒为单位）
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    // 计算时间差（以毫秒为单位）
    return Math.abs(endTimestamp - startTimestamp) > 600000;
  }
}
//聊天窗口置底
function scrollToBottom(){
  if(!scroll.value){
    setTimeout(() => {
      content.value.wrapRef.scrollTop = content.value.wrapRef.scrollHeight
    },10)
  }
}
//关闭弹窗
function closeVisible(){
  visible.value = false
}
//将链接附加超链接
function convertToLink(text: any){
  const linkPattern = /https?:\/\/[^\s]+/g;
  const matches = text.match(linkPattern);
  if (!matches) {
    return text;
  }
  return text.replace(linkPattern, (match: any) => {
    return `<a href="${match}" target="_blank">${match}</a>`;
  });
}
function onSelectEmoji(emoji: any) {
  console.log(emoji)
  if(room.type === '0'){
    room.content = room.content + emoji.i
  }else{
    room.markdownContent = room.markdownContent + emoji.i
  }
  /* // result { i: "😚", n: ["kissing face"], r: "1f61a", // with skin tone t: "neutral", // skin tone u: "1f61a" // without tone } */
}

onMounted(() => {
  getRoomList()
})


</script>
<template>
  <el-dialog
      v-model="visible"
      width="30%"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="新增房间">
        <el-input v-model="room.add">
          <template #append>
            <el-button @click="addRoom">新增房间</el-button>
          </template>
        </el-input>
      </el-tab-pane>
      <el-tab-pane label="加入房间">
        <el-input v-model="room.join">
          <template #append>
            <el-button @click="addToRoom">加入房间</el-button>
          </template>
        </el-input>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <el-row>
    <el-col :span="6">
      <div>
        <el-button plain @click="visible=true"><el-icon><Plus /></el-icon></el-button>
      </div>
      <p style="margin: 0 10px 0 0;padding:10px 15px;" v-for="item in room.list" @click="selectCurrentRoom(item.room_id)">
        {{ item.title }}
      </p>
      <div>
          <qrcode-vue :value="qrUrl" size="200" level="H"></qrcode-vue>
      </div>
    </el-col>
    <el-col :span="18">
      <h3 style="text-align: center" v-if="room.currentRoom">{{room.list[room.currentRoom].title}}<span style="font-size: 14px">&nbsp;&nbsp;#id:{{room.currentRoom}}</span></h3>
      <el-scrollbar ref="content" style="height: 70vh;padding-right: 25px;margin-bottom: 35px">
        <div v-if="room.currentRoom != ''" v-for="(item,index) in room.list[room.currentRoom].content">
          <div style="padding-top: 5px;clear:both;">
            <div v-if="timeShow(index)" style="text-align: center;font-size: 14px;color:rgba(145,143,143,0.56) ">&nbsp;&nbsp;{{item.createAt}}</div>
            <div v-if="timeShow(index) || index==0 || item.nickname != room.list[room.currentRoom].content[index-1].nickname" :style="{'font-size': '14px','float':item.userId != user.user_id?'left':'right','clear':'both'}">{{item.nickname}}</div>
            <div :style="{'font-size': '18px','float':item.userId != user.user_id?'left':'right','clear':'both'}">
              <div v-if="item.type == '0'" style="white-space: pre-wrap">
                <p style="margin:5px 0" v-html="convertToLink(item.content)"></p>
              </div>
              <mavon-editor
                  v-else
                  :subfield="false"
                  :default-open="'preview'"
                  :toolbars-flag="false"
                  :editable="false"
                  :scroll-style="true"
                  :ishljs="true"
                  v-model="item.content"></mavon-editor>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div v-if="room.currentRoom" class="content-body">
        <div class="content-menu">
          <el-button color="#626aef" plain size="default" @click="room.type = (room.type === '0' ? '1' : '0' )">
            {{room.type == '0' ? '正常模式' : 'MD模式'}}
          </el-button>
          <el-button color="#626aef" plain size="default" @click="emoji=!emoji">😀</el-button>
          <EmojiPicker v-if="emoji" :native="true" @select="onSelectEmoji" style="position: absolute; top: -330px; left: 0;z-index: 999999" />
        </div>
        <div class="content-data">
          <el-input autosize="autosize"  v-if="room.type == '0'" type="textarea" class="content" placeholder="内容" v-model="room.content"></el-input>&nbsp;
          <mavon-editor v-else v-model="room.markdownContent"></mavon-editor>
          <el-button class="send-button" size="default" type="primary" plain @click="sendMsg">发送消息<el-icon><Promotion /></el-icon></el-button>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
  ::v-deep .content-body{
    position: relative;
    margin-bottom: 20px;
    .content-menu{
      margin-bottom: 3px;
    }
    .content-data{
      .content {
        -webkit-box-shadow: 0px 10px 23px 6px #d1edff;
        box-shadow: 0px 10px 23px 6px #d1edff;
        width: 100%;
        .el-input__wrapper {
          box-shadow: none !important;
          .el-input__inner {
            font-family: "Lucida Handwriting", serif;
            font-size: 16px;
          }
        }
        .el-textarea__inner{
          min-height: 50px!important;
          resize:none;
          box-shadow: none!important;
        }
      }
      .send-button{
        position: absolute;
        right:10px;
        bottom:-10px;
        z-index: 99999;
      }
    }
  }

  ::v-deep.v-note-wrapper{
    min-height: auto!important;
    box-shadow: none!important;

    pre{
      padding: 10px!important;
      .hljs{
        background: #f6f8fa;
      }
    }
    .scroll-style{
      background-color: rgba(255, 255, 255, 0.99)  !important;
    }


  }

</style>
