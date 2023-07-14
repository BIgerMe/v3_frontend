<script setup lang="ts">
  import { ref,onMounted} from 'vue';
  import io from 'socket.io-client';

  // 创建 Socket.IO 客户端实例
  const socket = io('http://localhost:9090'); // 指定服务器的地址和端口

  // 监听连接成功事件
  socket.on('connect', () => {
    console.log('Connected to server');
  });

  // 监听连接断开事件
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  socket.on('chat',(data)=>{
    console.log(data)
  })
  function sendMsg(){
    socket.emit('chat', { data: 'Hello, server!' },(res: any)=>{
      console.log(res)
    });
  }

</script>
<template>
  <el-row>
    <el-button @click="sendMsg">发送消息</el-button>
  </el-row>

</template>
<style lang="scss" scoped>
</style>
