<script setup lang="ts">
  import { useRouter,useRoute } from 'vue-router'
  import { useUserStore } from '@/store/user'

  const router = useRouter()
  const user = useUserStore()

  const key = () => {
    return useRoute().path
  };
  const handleSelect = async (key: any) => {
    switch (key) {
      case 'manage':
      case 'user':
        break;
      case '/logout':
        // await user.logout()
        await router.push('/login')
        break;
      default:
        await router.push(key)
        break;
    }
  }

</script>
<template>

  <el-row>
    <el-col :lg="24">
      <el-menu
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
          style="background: linear-gradient(to bottom, #057aff, #2e5b89);"
          text-color="#fff"
          active-text-color="#ffd04b"
      >
        <el-menu-item index="/index">首页</el-menu-item>
        <el-menu-item index="/blog">b</el-menu-item>
        <div style="flex-grow: 1;" />
        <el-sub-menu index="user" v-if="user.nickname">
          <template #title>{{user.nickname}}</template>
          <el-menu-item index="/logout">登出</el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else index="/login">去登录</el-menu-item>
      </el-menu>
    </el-col>
    <el-col :lg="24">
      <router-view :key="key" class="app-body"/>
    </el-col>
  </el-row>

</template>
<style lang="scss" scoped>
  .el-menu--horizontal{
    border-bottom:0;
  }
  ::v-deep .el-sub-menu__title:hover {
    background: linear-gradient(to bottom, #057aff, #2e5b89)!important;
  }
  .el-menu--horizontal>.el-menu-item{
    border: 0!important;
  }
  .el-menu-item{
    background: linear-gradient(to bottom, #057aff, #2e5b89)!important;
  }
</style>
