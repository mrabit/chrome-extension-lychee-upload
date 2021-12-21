<template>
  <div class="login">
    <el-form
      v-loading="loading"
      ref="loginForm"
      label-position="left"
      label-width="auto"
      :model="formData"
      :rules="rules"
      :show-message="false"
    >
      <el-form-item label="domain:" size="mini" prop="domain">
        <el-input v-model="formData.domain"></el-input>
      </el-form-item>
      <el-form-item label="username:" size="mini" prop="username">
        <el-input v-model="formData.username"></el-input>
      </el-form-item>
      <el-form-item label="password:" size="mini" prop="password">
        <el-input type="password" v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item size="mini" class="login-btn">
        <el-button @click="handleClickReset">重置</el-button>
        <el-button type="primary" @click="handleClickLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { reactive, ref } from 'vue-demi'
import { useRouter } from 'vue-router'
import {
  getDomain,
  getUserName,
  getPassword,
  setDoamin,
  setUserName,
  setPassword,
  init,
  login
} from '../../services/api'
import { ElMessage, ElLoadingDirective } from 'element-plus'
export default {
  directives: { loading: ElLoadingDirective },
  setup() {
    let router = useRouter()

    let loginForm = ref(null)

    let loading = ref(false)

    let formData = reactive({
      domain: getDomain(),
      username: getUserName(),
      password: getPassword()
    })

    let rules = reactive({
      domain: {
        required: true,
        trigger: 'blur'
      },
      username: {
        required: true,
        trigger: 'blur'
      },
      password: {
        required: true,
        trigger: 'blur'
      }
    })

    function handleClickReset() {
      formData.domain = ''
      formData.username = ''
      formData.password = ''
    }

    async function handleClickLogin() {
      await (() => {
        return new Promise((resolve, reject) => {
          loginForm.value.validate((valid, obj) => {
            if (valid) {
              resolve()
            } else {
              let message = Object.keys(obj).join('、') + ' is required'
              ElMessage({
                message,
                type: 'error'
              })
              reject(message)
            }
          })
        })
      })()
      loading.value = true
      try {
        await init(formData.domain)
        setDoamin(formData.domain)
        if (await login(formData.username, formData.password)) {
          setUserName(formData.username)
          setPassword(formData.password)
          router.push('/about')
        } else {
          ElMessage({
            message: '登录失败.',
            type: 'error'
          })
        }
      } catch (e) {
        ElMessage({ message: e.message, type: 'error' })
        // do something
      }
      loading.value = false
    }

    return {
      loginForm,
      rules,
      formData,
      loading,
      handleClickReset,
      handleClickLogin
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  :deep(.el-form-item--mini.el-form-item) {
    margin-bottom: 10px;
  }
  .login-btn {
    :deep(.el-form-item__content) {
      text-align: right;
    }
  }
}
</style>
