<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题的盒子 -->
      <div class="title-box"></div>
      <!-- 注册的表单区域 -->
      <el-form :model="registerForm" :rules="registerFormRules" ref="registerFormRef">
        <el-form-item prop="username">
          <el-input v-model="registerForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="registerForm.repassword"
            type="password"
            placeholder="请再次确认密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-reg" @click="registerFn">注册</el-button>
          <el-link type="info" @click="goLogin">去登录</el-link></el-form-item
        >
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerAPI } from '@/api'
export default {
  name: 'my-register',
  data() {
    // 检测两次输入密码是否一致自定义校验
    const samePsw = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 注册表单
      registerForm: {
        username: '',
        password: '',
        repassword: ''
      },
      // 注册表单校验规则
      registerFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        repassword: [
          { required: true, message: '请再次确定密码', trigger: 'blur' },
          { pattern: /^\S{6,15}$/, message: '长度在 6 到 15 个字符', trigger: 'blur' },
          { validator: samePsw, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 注册按钮
    registerFn() {
      this.$refs.registerFormRef.validate(async valid => {
        if (!valid) return false
        // 发起注册网络请求
        const { data: res } = await registerAPI(this.registerForm)
        console.log(res)
      })
    },
    // 跳转登录
    goLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
.reg-container {
  background: url('../../assets/images/login_bg.jpg') center;
  background-size: cover;
  height: 100%;

  .reg-box {
    width: 400px;
    height: 335px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 30px;
    box-sizing: border-box;

    .title-box {
      height: 60px;
      background: url('../../assets/images/login_title.png') center no-repeat;
    }

    .btn-reg {
      width: 100%;
    }
  }
}
</style>
