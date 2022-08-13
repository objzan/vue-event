<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类" size="small">
              <el-option
                :label="item.cate_name"
                :value="item.id"
                v-for="item in articleCateList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" @click="getArticleList">筛选</el-button>
            <el-button type="info" size="small" @click="resetListFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button type="primary" size="small" class="btn-pub" @click="showPubDialogFn"
          >发表文章</el-button
        >
      </div>

      <!-- 文章表格区域 -->
      <el-table :data="articleList" style="width: 100%" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template slot-scope="{ row }">
            <el-link type="primary" @click="showDetailFn(row.id)">{{ row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template slot-scope="{ row }">
            <span>{{ $formatDate(row.pub_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button type="danger" @click="deleteArticleFn(row.id)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 发表文章的 Dialog 对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @closed="dialogCloseFn"
    >
      <el-form :model="pubForm" :rules="pubFormRules" ref="pubFormRef" label-width="100px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width: 100%">
            <el-option
              v-for="item in articleCateList"
              :key="item.id"
              :label="item.cate_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <quill-editor v-model="pubForm.content" @blur="onEditorBlur"> </quill-editor>
        </el-form-item>
        <el-form-item label="文章封面">
          <img class="cover-img" src="@/assets/images/cover.jpg" alt="" ref="imgRef" />
          <input
            type="file"
            style="display: none"
            accept="image/*"
            ref="iptFileRef"
            @change="onCoverChangeFn"
          />
          <el-button type="text" @click="chooseImgFn">+选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ articleDetailList.title }}</h1>

      <div class="info">
        <span>作者：{{ articleDetailList.nickname || articleDetailList.username }}</span>
        <span>发布时间：{{ $formatDate(articleDetailList.pub_date) }}</span>
        <span>所属分类：{{ articleDetailList.cate_name }}</span>
        <span>状态：{{ articleDetailList.state }}</span>
      </div>

      <!-- 分割线 -->
      <el-divider></el-divider>

      <!-- 文章的封面 -->
      <img :src="baseURL + articleDetailList.cover_img" alt="" />

      <!-- 文章的详情 -->
      <div v-html="articleDetailList.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArticleCateAPI,
  pubArticleAPI,
  getArticleListAPI,
  getArticleDetailAPI,
  deleteArticleAPI
} from '@/api'
import defaultImg from '@/assets/images/cover.jpg'
import { baseURL } from '@/utils/request.js'
export default {
  name: 'ArtList',
  created() {
    this.getArticleCate()
    this.getArticleList()
  },
  data() {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false, // 控制发表文章对话框的显示与隐藏,
      pubForm: {
        // 表单的数据对象
        title: '',
        cate_id: '',
        content: '',
        cover_img: null,
        state: ''
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
        content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
      },
      articleCateList: [], // 文章分类数据
      articleList: [], // 文章列表数组
      total: 0, // 文章数量
      articleDetailList: {}, // 文章详情数据
      detailVisible: false, // 文章详细对话框显示状态
      baseURL // 基地址
    }
  },
  methods: {
    // 显示发表文章对话框
    showPubDialogFn() {
      this.pubDialogVisible = true
    },
    // 对话框关闭前回调函数
    async handleClose(done) {
      const confirmResult = await this.$confirm('此操作不保存文文章信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') return
      done()
    },
    // 获取文章分类数据
    async getArticleCate() {
      const { data: res } = await getArticleCateAPI()
      console.log(res)
      if (res.code !== 0) return
      this.articleCateList = res.data
    },
    // 选择图片触发input输入框
    chooseImgFn() {
      this.$refs.iptFileRef.click()
    },
    // 监听文件选择框的 change 事件
    onCoverChangeFn(e) {
      const files = e.target.files
      if (files.length === 0) {
        this.pubForm.cover_img = null
        this.$refs.imgRef.setAttribute('src', defaultImg)
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
    },
    // 校验富文本
    onEditorBlur() {
      this.$refs.pubFormRef.validateField('content')
    },
    // 发表文章处理函数
    pubArticleFn(state) {
      // 保存状态
      this.pubForm.state = state
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请完善文章信息')
        if (!this.pubForm.cover_img) return this.$message.error('请选择文章封面')

        const fd = new FormData()
        Object.keys(this.pubForm).forEach(key => {
          fd.append(key, this.pubForm[key])
        })

        const { data: res } = await pubArticleAPI(fd)
        console.log(res)
        if (res.code !== 0) return this.message.error(res.message)
        this.$message.success(res.message)
        this.pubDialogVisible = false
        this.resetListFn()
      })
    },
    // 关闭对话框清空表单内容
    dialogCloseFn() {
      this.$refs.pubFormRef.resetFields()
      this.pubForm.content = ''
      this.$refs.imgRef.setAttribute('src', defaultImg)
    },
    // 获取文章列表数据
    async getArticleList() {
      const { data: res } = await getArticleListAPI(this.q)
      console.log(res)
      if (res.code !== 0) return
      this.articleList = res.data
      this.total = res.total
    },
    // pageSize 发生了变化
    handleSizeChangeFn(newSize) {
      this.q.pagesize = newSize
      // 默认展示第一页数据
      this.q.pagenum = 1
      this.getArticleList()
    },
    // 页码值发生了变化
    handleCurrentChangeFn(newPage) {
      this.q.pagenum = newPage
      this.getArticleList()
    },
    // 重置筛选
    resetListFn() {
      // 重置查询参数对象
      this.q = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      }
      this.getArticleList()
    },
    // 显示文章详细
    async showDetailFn(id) {
      const { data: res } = await getArticleDetailAPI(id)
      console.log(res)
      if (res.code !== 0) return
      this.articleDetailList = res.data
      this.detailVisible = true
    },
    // 删除文章
    async deleteArticleFn(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') return
      const { data: res } = await deleteArticleAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.getArticleList()
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
.el-pagination {
  margin-top: 15px;
}
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}

.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}

// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
