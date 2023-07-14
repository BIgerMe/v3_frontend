import axios from 'axios'
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus'

const message = (type: any,message: any)=>{
    ElMessage({
      showClose: true,
      message,
      type
    })
  }

/**
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code: any, msg: any) => {
    switch (code) {
      case 402://登录失效
        // router.push('/login')
        break
      case 401://无权限
        message('error',msg || `没有权限访问`)
        break
      default:
        message('error',msg || `后端接口${code}异常`)
        break
    }
}
const instance = axios.create({
    baseURL:import.meta.env.VITE_API_BASE_URL,
    timeout:5000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
})


// 添加请求拦截器
instance.interceptors.request.use( 
    (config)=>{
        // 在发送请求之前做些什么
        const userStore = useUserStore()
        config.headers['token'] = userStore.token
        return config;
    },
    (error)=>{
        // 对请求错误做些什么
        return Promise.reject(error);
    }
  );

// 添加响应拦截器
instance.interceptors.response.use(
     (response)=>{
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        const { data, config } = response
        const { code, msg } = data
        // 操作正常Code数组
        const codeVerificationArray = [200,0]
        if (codeVerificationArray.includes(code)) {
            return data
        } else {
            handleCode(code, msg)
            return Promise.reject(
                '请求异常:' +
                JSON.stringify({ url: config.url, code, msg }) || 'Error'
            )
        }
    }, 
    (error)=>{
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        const msg = error.message
        if (error.response && error.response.data) {
          const { status, data } = error.response
          handleCode(status, data.msg || msg)
          return Promise.reject(error)
        } else {
          return Promise.reject(error)
        }
    }
  );

  export default instance