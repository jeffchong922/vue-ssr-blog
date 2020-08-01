<template>
  <v-card class="elevation-12">
    <v-card-title>Welcome</v-card-title>
    <v-card-text>
      <auth-form :username.sync="username" :password.sync="password"/>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary"
        :loading="loginBtnLoading"
        @click="handleLogin"
      >Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import AuthForm from './AuthForm'
import { tryCatchFuncMix } from '@/utils/mixins'
import { signIn } from '@/models/AuthModel'
import { setToken } from '@/utils/token'
export default {
  name: 'AuthContent',
  mixins: [
    tryCatchFuncMix
  ],
  components: { AuthForm },
  data () {
    return {
      username: '',
      password: '',
      loginBtnLoading: false
    }
  },
  methods: {
    setLoginBtnStatus (status) {
      this.loginBtnLoading = status
    },
    handleLogin () {
      if (!this.username || !this.password) {
        return this.showSnackbar('info', 'Please check your data value', 5000)
      }
      this.signIn({
        username: this.username,
        password: this.password
      })
    },
    /* 登录请求 */
    async signIn (data) {
      this.setLoginBtnStatus(true)
      const result = await this.tryCatchFunc(signIn, data)
      this.setLoginBtnStatus(false)
      result && this.successLogin(result.data)
      this.clearInfo()
    },
    successLogin (data) {
      this.showSnackbar('success', 'Welcom to use our system')
      const { data: infos } = data
      setToken(infos.accessToken)
      this.$router.push('/')
    },
    clearInfo () {
      this.username = ''
      this.password = ''
    }
  }
}
</script>