<script setup lang="ts">
  import { ref,onMounted} from 'vue';
  import { detail,edit} from '../../api/blog';
  import { useRoute } from 'vue-router'
  
  const blogDetail = ref({
    publish:'私有'
  })
  async function getDetail(){
    const router = useRoute()
    if(router.params.id !== '0'){
      const {data} = await detail(router.params)
      blogDetail.value = data
    }
  }

  function editBlog(){
    edit(blogDetail.value).then((res:any)=>{
      window.open('/blog/edit/'+res.data,'_self')
    })
  }
  onMounted(()=>{
    getDetail()
  })
  
</script>
<template>
  <el-row>
    <el-col :span="24">
      <el-card style="min-height:100vh;">
        <h3>编辑博客</h3>
        <el-form inline>
          <el-form-item label="标题">
            <el-input v-model="blogDetail.title" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-input v-model="blogDetail.category" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item >
            <el-radio-group v-model="blogDetail.publish">
              <el-radio-button label="私有" />
              <el-radio-button label="公开" />
            </el-radio-group>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="editBlog">保存</el-button>
          </el-form-item>
        </el-form>
        <mavon-editor v-model="blogDetail.content"></mavon-editor>
      </el-card>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
</style>

