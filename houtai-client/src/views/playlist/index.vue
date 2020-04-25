<template>
  <div>
    <el-table v-loading="loading" :data="playlist" stripe>
      <el-table-column type="index" width="50" />

      <el-table-column label="封面" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt height="50">
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" />
      <el-table-column prop="copywriter" label="描述" />
      <el-table-column prop="createTime" label="创建时间" />

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList } from '@/api/playlist'
import scroll from '@/utils/scroll' // 滚动条到底部执行回调方法

export default {
  data() {
    return {
      playlist: [],
      count: 50,
      loading: false
    }
  },
  created() {
    this._getList()
  },
  mounted() {
    scroll.start(this._getList) // 滚动到底部获取数据
  },
  methods: {
    _getList() {
      this.loading = true

      fetchList({
        start: this.playlist.length,
        count: this.count
      }).then(res => {
        this.playlist = [...this.playlist, ...res.data]
        if (res.data.length < this.count) {
          scroll.end()
        }
        this.loading = false
      }).catch(error => {
        console.log(error)
      })
    }
  }
}
</script>

<style>

</style>
