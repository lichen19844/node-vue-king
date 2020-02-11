<template>
  <div class="about">
    <h1>{{id? '编辑': '新建'}}文章</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="所属分类" >
        <el-select placeholder="请选择" v-model="model.categories" multiple filterable style="width: 100%">
          <el-option
            v-for="item of categories" :key="item._id"
            :label="item.name" :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" >
        <el-input placeholder="请输入内容" v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="详情" >
        <!-- <el-input type="textarea" placeholder="请输入内容" v-model="model.body"></el-input> -->
        <vue-editor v-model="model.body"
          useCustomImageHandler @image-added="handleImageAdded"
        ></vue-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit" round>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";
// import axios from "axios";

export default {
  components: {
    VueEditor
  },
  props: {
    id: {}
  },
  data () {
    return {
      model: {},
      categories: []
    }
  },
  methods: {
    async save() {
      // this.$http.post('categories', this.model).then()
      let res
      if (this.id) {
        res = await this.$http.put(`rest/articles/${this.id}`, this.model)
        res
      } else {
        // this.model被axios转化成req.body发出去了，后端的express会接收到并存入mongodb
        res = await this.$http.post('rest/articles', this.model)
        res
      }
      this.$router.push('/articles/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    // 进入编辑页面时能够让输入框内显示之前的值
    async fetch () {
      const res = await this.$http.get(`rest/articles/${this.id}`)
      this.model = res.data
    },
    // 拿到列表页面所有数据
    async fetchCategories () {
      const res = await this.$http.get(`rest/categories`)
      this.categories = res.data
    },
    async handleImageAdded (file, Editor, cursorLocation, resetUploader) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await this.$http.post('upload', formData)
      Editor.insertEmbed(cursorLocation, "image", res.data.url);
      resetUploader();
      // axios({
      //   url: "https://fakeapi.yoursite.com/images",
      //   method: "POST",
      //   data: formData
      // })
      //   .then(result => {
      //     let url = result.data.url; // Get url from response
      //     Editor.insertEmbed(cursorLocation, "image", url);
      //     resetUploader();
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }
  },
  created () {
    this.fetchCategories()
    // id是mongodb存数据时自动添加的
    this.id && this.fetch()
  }
}
</script>

<style>

</style>