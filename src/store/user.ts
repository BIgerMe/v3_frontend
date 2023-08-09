import { defineStore } from 'pinia'
import { login } from '../api/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    user_id:'',
    username: '',
    nickname: '',
    role: '',
    token:'',
  }),
  persist:true,
  actions:{
    async login(loginForm:object){
      const {data} = await login(loginForm)
      this.user_id = data.id
      this.username = data.username
      this.nickname = data.nickname
      this.token = data.token
    }
  }
})
