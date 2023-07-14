<script setup lang="ts">
  import { ref,onMounted} from 'vue';
  import { detail } from '../../api/blog';
  import { useRoute } from 'vue-router'
  
  const blogDetail = ref({})
  async function getDetail(){
    const router = useRoute()
    const {data} = await detail(router.params)
    blogDetail.value = data
  }

  onMounted(()=>{
    getDetail()
  })
  
</script>
<template>
  <el-row>
    <el-col :span="24" style="text-align: center;">
      <h2>{{blogDetail.title}}</h2>
      <div>
        <mavon-editor
            :subfield="false"
            :default-open="'preview'"
            :toolbars-flag="false"
            :editable="false"
            :scroll-style="true"
            :ishljs="true"
            v-model="blogDetail.content"></mavon-editor>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
</style>

