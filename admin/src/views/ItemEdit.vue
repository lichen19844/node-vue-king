<template>
  <div class="about">
    <h1>{{id? '编辑': '新建'}}物品</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <!-- <el-form-item label="上级分类" >
        <el-select placeholder="请选择" v-model="model.parent" style="width: 100%">
          <el-option
            v-for="item of parents"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="名称" >
        <!-- input随写随存入model -->
        <el-input placeholder="请输入内容" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="图标" >
        <!-- input随写随存入model -->
        <!-- <el-input placeholder="请输入内容" v-model="model.icon"></el-input> -->
        <el-upload
          class="avatar-uploader"
          :action="mixUploadUrl"
          :headers ="mixGetAuthHeaders()"
          :show-file-list="false"
          :on-success="afterUpload">
          <img v-if="model.icon" :src="model.icon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" round>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data () {
    return {
      model: {},
      // parents: []
    }
  },
  methods: {
    afterUpload (res) {
      this.$set(this.model, 'icon', res.url)
      // this.model.icon = res.url
    },
    async save() {
      let res
      if (this.id) {
        res = await this.$http.put(`rest/items/${this.id}`, this.model)
        res
      } else {
        res = await this.$http.post('rest/items', this.model)
        res
      }
      this.$router.push('/items/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async fetch () {
      const res = await this.$http.get(`rest/items/${this.id}`)
      this.model = res.data
    }
  },
  created () {
    // this.fetchParents()
    this.id && this.fetch()
    console.log('$route in item edit page is ', this.$route)
  }
}
</script>

<style>

</style>