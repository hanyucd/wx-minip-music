<template>
  <div>
    <div class="filter-container">
      <el-upload
        class="upload-demo"
        action="http://localhost:3000/swiper/upload"
        :before-upload="beforeAvatarUpload"
        :on-progress="uploadProgress"
        :on-success="uploadSuccess"
        :show-file-list="false"
      >
        <el-button size="small" type="primary" :loading="uploadLoading">{{ uploadBtnText }}</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif格式的图片，且不超过300KB（建议上传730*336px图片）</div>
      </el-upload>
    </div>

    <el-table v-loading="loading" :data="swiperList" stripe style="width: 100%">
      <el-table-column type="index" width="50" />
      <el-table-column label="图片" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="50">
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该图片吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del } from '@/api/swiper'

export default {
  data() {
    return {
      swiperList: [],
      loading: false,
      uploadLoading: false,
      uploadBtnText: '上传图片',
      delDialogVisible: false,
      swiper: {} // 删除图片用
    }
  },
  created() {
    this._getSwiperList()
  },
  methods: {
    /**
     * 获取轮播图数据
     */
    _getSwiperList() {
      this.loading = true
      fetchList().then(res => {
        this.loading = false
        this.swiperList = res.data
      })
    },
    // 上传成功的回调函数
    uploadSuccess(res) {
      if (res.id_list.length > 0) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this._getSwiperList()
      }
      this.uploadBtnText = '上传图片'
      this.uploadLoading = false
    },
    // 删除
    onDel(row) {
      this.delDialogVisible = true
      this.swiper = row
    },
    // 确定删除
    doDel() {
      this.loading = true
      this.delDialogVisible = false

      del(this.swiper).then(res => {
        this.loading = false
        this._getSwiperList()
        this.$message({
          message: '删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>

<style>
.upload-demo{margin-left: 10px;}
.el-upload__tip{display: inline-block;margin: 10px 0 0 8px}
</style>
