<script setup lang="ts">
import {ref, onMounted, reactive} from 'vue';
import {roomAdd, roomAddTo, roomList} from "../../api/room";
import { useUserStore } from '@/store/user'
const user = useUserStore()

const room = reactive({
  add: '',
  join: '',
  list: {
    1: {
      id: 1,
      room_id:1,
      title: '12',
      content: [{nickname: '天南修士', content: '我是历飞雨', create_at: '2023-07-17 14:21'}],
      new: 0
    }
  },
  currentRoom: '',
  content: ''
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
    console.log(res)
  })
}
//新增房间
function addRoom() {
  roomAdd({title: room.add}).then(() => {
    getRoomList()
    // socket.emit("joinRoom", room.add)
  });
}
//加入房间
function addToRoom(){
  roomAddTo({room:room.join}).then(()=>{
    getRoomList()
  })
}
function sendMsg() {
  const content = room.content
  socket.emit('chat', {room: room.currentRoom, content});
}

//切换选择聊天室
function selectCurrentRoom(room_id:any){
  room.currentRoom = room_id
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
  }
});
onMounted(() => {
  getRoomList()
})
</script>
<template>
  <el-row>
    <el-col :span="5">
      <p style="margin: 0 10px 0 0;padding:10px 15px;" v-for="item in room.list" @click="selectCurrentRoom(item.room_id)">
        {{ item.title }}
      </p>
    </el-col>
    <el-col :span="15">
      <h3 v-if="room.currentRoom">{{room.list[room.currentRoom].title}}<span style="font-size: 14px">&nbsp;&nbsp;#id:{{room.currentRoom}}</span></h3>
      <div style="height: 78vh">
        <div v-if="room.currentRoom != ''" v-for="item in room.list[room.currentRoom].content">
          <div>
            <div style="font-size: 12px"><span>{{item.nickname}}</span><span>{{item.createAt}}</span></div>
            <div style="font-size: 16px">{{item.content}}</div>
          </div>
        </div>
      </div>
      <el-input v-model="room.content"></el-input>
      <el-button @click="sendMsg">发送消息</el-button>
    </el-col>
    <el-col :span="4">
      <el-input v-model="room.add">
        <template #append>
          <el-button @click="addRoom">新增房间</el-button>
        </template>
      </el-input>
      <el-input v-model="room.join">
        <template #append>
          <el-button @click="addToRoom">加入房间</el-button>
        </template>
      </el-input>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
</style>
