<template>
  <div>
    <h1>管理员列表</h1>
    <!-- items的子项是item，每个item有_id, parent, name -->
    <el-table :data="items"
    border
      stripe
      :header-cell-style="rowClass"
      :cell-style="cellStyle">
      <el-table-column prop="_id" label="ID" width="230px"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        
        <template v-slot="scope">
          <!-- {{scope.row}} -->
          <el-button type="text" size="small" @click="$router.push(`/admin_users/edit/${scope.row._id}`)">编辑</el-button>
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
      const res = await this.$http.get('rest/admin_users')
      this.items = res.data
      console.log('this.items is ', this.items)
    },
    async remove (row) {
      // $confirm 是element提供的
      this.$confirm(`是否确定要删除管理员用户？"${row.username}"`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$http.delete(`rest/admin_users/${row._id}`)
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
    },
    rowClass() {
      return "background: #cccccc; text-align: center; color: #000000; font-weight: 600;";
    },
    cellStyle() {
      return "background: #ffffff; text-align: center;";
    }
  },
  created () {
    this.fetch()
  }
}
</script>
