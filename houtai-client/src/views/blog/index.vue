<template>
  <div>
    <el-table v-loading="loading" :data="blogList" stripe>
      <el-table-column type="index" width="50" />
      <el-table-column prop="content" label="内容" />
      <el-table-column prop="nickName" label="发布人" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
      <span>确定删除该博客吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, del } from '@/api/blog'
import scroll from '@/utils/scroll'

export default {
  data() {
    return {
      loading: false,
      delDialogVisible: false,
      blogList: [],
      count: 50,
      blog: {}
    }
  },
  created() {
    this._getBlogList()
  },
  mounted() {
    scroll.start(this.getList)
  },
  methods: {
    /**
     * 获取博客列表数据
     */
    _getBlogList() {
      fetchList({
        start: this.blogList.length,
        count: this.count
      }).then(res => {
        this.loading = false
        const data = res.data
        const _blogList = []
        data.forEach(item => {
          _blogList.push(JSON.parse(item))
        })
        this.blogList = this.blogList.concat(_blogList)
        if (_blogList.length < this.count) {
          scroll.end()
        }
      })
    },
    // 删除
    onDel(row) {
      this.blog = row
      this.delDialogVisible = true
    },
    // 确定删除
    doDel() {
      this.delDialogVisible = false
      this.loading = true
      del(this.blog).then(res => {
        this.loading = false
        if (res.data.delBlogRes.deleted > 0) { // 删除博客条数大于0
          this.blogList = []
          this._getBlogList()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
