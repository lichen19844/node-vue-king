<template>
  <div class="about">
    <h1>{{id? '编辑': '新建'}}广告位</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="广告位名称" >
        <el-input placeholder="请输入内容" v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="广告">
        <el-button size="small" @click="model.items.push({})">
          <i class="el-icon-plus"></i>添加广告
        </el-button>
        <el-row type="flex" style="flex-wrap: wrap">
          <el-col :md="24" v-for="(item, i) of model.items" :key="i">
            <el-form-item label="跳转链接URL">
              <el-input v-model="item.url"></el-input>
            </el-form-item>
            <el-form-item label="图片" style="margin-top: 0.5rem">
              <el-upload
              class="avatar-uploader"
              :action="mixUploadUrl"
              :headers ="mixGetAuthHeaders()"
              :show-file-list="false"
              :on-success="res => $set(item, 'image', res.url)">
              <img v-if="item.image" :src="item.image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" size="small" 
                @click="model.items.splice(i, 1)">
                删除
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
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
      model: {
        items: []
      },
    }
  },
  methods: {
    async save() {
      // this.$http.post('ads', this.model).then()
      let res
      if (this.id) {
        console.log('this.id and $route.params.id ', this.id, this.$route.params.id)
        res = await this.$http.put(`rest/ads/${this.id}`, this.model)
        res
      } else {
        // this.model被axios转化成req.body发出去了，后端的express会接收到并存入mongodb
        res = await this.$http.post('rest/ads', this.model)
        res
      }
      this.$router.push('/ads/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    // 进入编辑页面时能够让输入框内显示之前的值
    async fetch () {
      // 数据库对应方法没有使用populate方法时，所以只能拿到模型第一层的字段_id，name和字段值为id的parent，而不是完整的parent对象
      const res = await this.$http.get(`rest/ads/${this.id}`)
      // this.model = res.data
      this.model = Object.assign({}, this.model, res.data)
    }
  },
  created () {
    // id是mongodb存数据时自动添加的
    this.id && this.fetch()
  }
}
</script>

<style>

</style>