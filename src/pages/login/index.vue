<script setup lang="ts">
  import {ref} from 'vue'
  import {useRouter} from 'vue-router'
  import bk from '/src/assets/img/bk.png'
  import logo from '/src/assets/img/by.png'
  import { useUserStore } from '@/store/user'

  const router = useRouter()
  const user = useUserStore()
  const loginForm = ref({
    username: '',
    password: ''
  })

   const handleLogin = async()=>{
    await user.login(loginForm.value)
    await router.push("/index")
  }
</script>

<template>
  <div class="body">
    <el-row>
      <!-- <el-col :lg="12" style="height:100vh;background: white;"></el-col> -->
      <el-col :lg="24" :style="{height:'100vh','background-image': 'url('+bk+')','background-size':'cover'}"></el-col>
    </el-row>
    <div class="login">
        <div class="login-left">
          <div style="text-align: center;margin: 50px">
            <el-image style="width: 100px;" :src="logo" />
          </div>
          <el-form :model="loginForm" style="margin: 0 50px">
            <el-form-item>
              <el-input
                  v-model="loginForm.username"
                  type="text"
                  size="large"
                  autocomplete="off"
              >
                <template #prepend>
                  <el-button><el-icon><User /></el-icon></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                  v-model="loginForm.password"
                  size="large"
                  type="password"
                  autocomplete="off"
                  show-password
              >
                <template #prepend>
                  <el-button><el-icon><Lock /></el-icon></el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" size="large" style="width: 100%" @click="handleLogin">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
  </div>
</template>
<style type="text/css">
  html, body{
    margin: 0!important;
    padding:0!important;
  }
  .body{
    height: 100vh;
    width: 100vw;
  }
  .login{
    position: absolute;
    top: 20%;
    left: 12%;
    width:50%;
    height:60%
  }
  .login-left{
    display: inline-block;
    width: 46%;
  }
  .login-right{
    display: inline-block;
    width: 46%;
  }
  .login-left > .el-card{
    height: 60vh;
    border-right: 0!important;
    border-radius: 0!important;
  }
  .login-font{
    font-size: 16px;
    font-weight: 600;
    /*color: #0000ff;*/
  }
</style>
