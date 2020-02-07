<template>
  <div>
    <h1>英雄列表</h1>
    <el-table :data="items">
      <el-table-column prop="_id" label="ID" width="230px"></el-table-column>
      <!-- <el-table-column prop="parent" label="上级分类"></el-table-column> -->
      <!-- <el-table-column prop="parent.name" label="上级分类"></el-table-column> -->
      <el-table-column prop="name" label="英雄名称"></el-table-column>
      <el-table-column prop="title" label="称号"></el-table-column>
      <el-table-column prop="avator" label="头像">
        <template v-slot="scope">
          <img :src="scope.row.avator" alt="" style="height: 3rem">
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        
        <template v-slot="scope">
          <!-- {{scope.row}} -->
          <el-button type="text" size="small" @click="$router.push(`/heros/edit/${scope.row._id}`)">编辑</el-button>
          <el-button type="text" size="small" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      items: []
    }
  },
  methods: {
    async fetch () {
      const res = await this.$http.get('rest/heros')
      this.items = res.data
      console.log('this.items is ', this.items)
    },
    async remove (row) {
      // $confirm 是element提供的
      this.$confirm(`是否确定要删除分类？"${row.name}"`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`rest/heros/${row._id}`)
        res
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
        this.fetch(); // 刷新页面
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  },
  created () {
    this.fetch()
  }
}
</script>
