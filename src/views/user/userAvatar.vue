<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img class="the_img" v-if="!avatar" src="../../assets/images/avatar.jpg" alt="" />
      <img class="the_img" v-else :src="avatar" alt="" />

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">选择图片</el-button>
        <el-button type="success" icon="el-icon-upload" :disabled="avatar === ''" @click="uploadFn"
          >上传头像</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateAvatarAPI } from '@/api'
export default {
  name: 'UserAvatar',
  data() {
    return {
      avatar: ''
    }
  },
  methods: {
    // 点击选择图片按钮触发
    chooseImg() {
      this.$refs.iptRef.click()
    },
    onFileChange(e) {
      console.log(e.target.files)
      const files = e.target.files
      if (files.length === 0) {
        this.avatar = ''
      } else {
        console.log(files[0])
        // this.avatar = URL.createObjectURL(files[0])
        // 把图片转成base64地址
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.onload = e => {
          this.avatar = e.target.result
        }
      }
    },
    // 点击上传按钮触发网络请求
    async uploadFn() {
      const { data: res } = await updateAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      // 更新vuex用户资料
      this.$store.dispatch('getUserInfoActions')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
