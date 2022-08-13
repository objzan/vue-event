<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addCateFn">添加分类</el-button>
      </div>
      <!-- 表格区域 -->
      <el-table :data="articleCateList" style="width: 100%" border stripe>
        <el-table-column label="序号" width="100" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cate_name"></el-table-column>
        <el-table-column label="分类别名" prop="cate_alias"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="updateArticleCate(scope.row)"
              >修改</el-button
            >
            <el-button type="danger" size="mini" @click="deleteCate(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加文章分类" :visible.sync="addVisible" width="35%" @closed="closeDialogFn">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelFn">取 消</el-button>
        <el-button size="mini" type="primary" @click="addFn">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArticleCateAPI,
  addArticleCate,
  updateArticleCateAPI,
  deleteArticleCateAPI
} from '@/api'
export default {
  name: 'ArtCate',
  created() {
    this.getArticleCate()
  },
  data() {
    return {
      articleCateList: [], // 分类数据
      addVisible: false, // 添加分类对话框状态
      addForm: {
        // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: {
        // 添加表单的验证规则对象
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,15}$/,
            message: '分类别名必须是1-15位的字母数字',
            trigger: 'blur'
          }
        ]
      },
      isEdit: false, // 编辑状态 ture为编辑 false为添加
      editId: ''
    }
  },
  methods: {
    // 获取分类数据
    async getArticleCate() {
      const { data: res } = await getArticleCateAPI()
      console.log(res)
      if (res.code !== 0) return this.$message.error(res.message)
      this.articleCateList = res.data
    },
    // 显示添加对话框
    addCateFn() {
      this.addVisible = true
      this.isEdit = false
      this.editId = ''
    },
    // 关闭添加对话框
    cancelFn() {
      this.addVisible = false
    },
    // 关闭对话框清除表单数据
    closeDialogFn() {
      this.$refs.addRef.resetFields()
    },
    // 点击添加发起网络请求
    addFn() {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return
        if (this.isEdit) {
          // 修改
          this.addForm.id = this.editId
          const { data: res } = await updateArticleCateAPI(this.addForm)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
        } else {
          // 添加
          const { data: res } = await addArticleCate(this.addForm)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
        }
        this.addVisible = false
        this.getArticleCate()
      })
    },
    // 修改分类信息
    updateArticleCate(row) {
      this.addVisible = true
      this.isEdit = true
      this.editId = row.id
      this.$nextTick(() => {
        this.addForm.cate_name = row.cate_name
        this.addForm.cate_alias = row.cate_alias
      })
    },
    // 删除分类
    async deleteCate(id) {
      // 弹窗提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 取消删除
      if (confirmResult !== 'confirm') return
      // 确定删除
      const { data: res } = await deleteArticleCateAPI(id)
      console.log(res)
      // 重新获取文章数据
      this.getArticleCate()
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
