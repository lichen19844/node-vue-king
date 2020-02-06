<template>
  <div class="about">
    <h1>{{id? '编辑': '新建'}}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="名称" >
        <el-input placeholder="请输入内容" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="称号" >
        <el-input placeholder="请输入内容" v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="类型" >
        <el-select placeholder="请选择" v-model="model.categories" multiple style="width: 100%">
          <el-option
            v-for="item of categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="头像" >
        <!-- input随写随存入model -->
        <!-- <el-input placeholder="请输入内容" v-model="model.icon"></el-input> -->
        <el-upload
          class="avatar-uploader"
          :action="this.$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload">
          <img v-if="model.avator" :src="model.avator" class="avatar">
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
      categories: [],
      model: {
        name: '',
        avator: ''
      },
    }
  },
  methods: {
    afterUpload (res) {
      console.log(res)
      // this.$set(this.model, 'avator', res.url)
      this.model.avator = res.url
    },
    async save() {
      let res
      if (this.id) {
        console.log('this.id and $route.params.id ', this.id, this.$route.params.id)
        res = await this.$http.put(`rest/heros/${this.id}`, this.model)
        res
      } else {
        res = await this.$http.post('rest/heros', this.model)
        res
      }
      this.$router.push('/heros/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async fetch () {
      const res = await this.$http.get(`rest/heros/${this.id}`)
      console.log('res is ', res)
      this.model = res.data
    },
    async fetchCategories () {
      const res = await this.$http.get(`rest/categories`)
      this.categories = res.data
    }
  },
  created () {
    this.id && this.fetch()
    this.fetchCategories()
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>