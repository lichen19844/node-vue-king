<template>
  <div class="about">
    <h1>{{id? '编辑': '新建'}}英雄</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-tabs value="basic" type="border-card">

        <el-tab-pane label="基础信息" name="basic">
          <el-form-item label="名称" >
            <el-input placeholder="请输入内容" v-model="model.name"></el-input>
          </el-form-item>
          <el-form-item label="称号" >
            <el-input placeholder="请输入内容" v-model="model.title"></el-input>
          </el-form-item>
          <el-form-item label="头像" >
            <!-- input随写随存入model -->
            <!-- <el-input placeholder="请输入内容" v-model="model.icon"></el-input> -->
            <el-upload
              class="avatar-uploader"
              :action="mixUploadUrl"
              :headers ="mixGetAuthHeaders()"
              :show-file-list="false"
              :on-success="res => $set(model, 'avator', res.url)">
              <img v-if="model.avator" :src="model.avator" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="Banner" >
            <!-- input随写随存入model -->
            <!-- <el-input placeholder="请输入内容" v-model="model.icon"></el-input> -->
            <el-upload
              class="avatar-uploader"
              :action="mixUploadUrl"
              :headers ="mixGetAuthHeaders()"
              :show-file-list="false"
              :on-success="res => $set(model, 'banner', res.url)">
              <img v-if="model.banner" :src="model.banner" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="类型" >
            <el-select placeholder="请选择" v-model="model.categories" multiple style="width: 100%">
              <el-option
                v-for="item of categories" :key="item._id"
                :label="item.name" :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="难度" >
            <el-rate style="margin-top:0.6rem" :max=9 allow-half show-score v-model="model.scores.difficult"></el-rate>
          </el-form-item>
          <el-form-item label="技能" >
            <el-rate style="margin-top:0.6rem" :max=9 allow-half show-score v-model="model.scores.skills"></el-rate>
          </el-form-item>
          <el-form-item label="攻击" >
            <el-rate style="margin-top:0.6rem" :max=9 allow-half show-score v-model="model.scores.attack"></el-rate>
          </el-form-item>
          <el-form-item label="生存" >
            <el-rate style="margin-top:0.6rem" :max=9 allow-half show-score v-model="model.scores.survive"></el-rate>
          </el-form-item>
          <el-form-item label="顺风出装" >
            <el-select placeholder="请选择" v-model="model.items1" multiple style="width: 100%">
              <el-option
                v-for="item of items" :key="item._id"
                :label="item.name" :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="逆风出装" >
            <el-select placeholder="请选择" v-model="model.items2" multiple style="width: 100%">
              <el-option
                v-for="item of items" :key="item._id"
                :label="item.name" :value="item._id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用技巧">
            <el-input type="textarea" v-model="model.usageTips"></el-input>
          </el-form-item>
          <el-form-item label="对抗技巧">
            <el-input type="textarea" v-model="model.battleTips"></el-input>
          </el-form-item>
          <el-form-item label="团战思路">
            <el-input type="textarea" v-model="model.teamTips"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="技能" name="skills">
          <el-button size="small" @click="model.skills.push({})">
            <i class="el-icon-plus"></i>添加技能
          </el-button>
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col :md="12" v-for="(item, i) of model.skills" :key="i">
              <el-form-item label="名称">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
              <el-form-item label="图标">
               <el-upload
                class="avatar-uploader"
                :action="mixUploadUrl"
                :headers ="mixGetAuthHeaders()"
                :show-file-list="false"
                :on-success="res => $set(item, 'icon', res.url)">
                <img v-if="item.icon" :src="item.icon" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              </el-form-item>
              <el-form-item label="冷却值">
                <el-input v-model="item.delay"></el-input>
              </el-form-item>
              <el-form-item label="消耗">
                <el-input v-model="item.cost"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>
              <el-form-item label="小提示">
                <el-input v-model="item.tips"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" size="small" 
                  @click="model.skills.splice(i, 1)">
                  删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>

        <el-tab-pane label="最佳搭档" name="partners">
          <el-button size="small" @click="model.partners.push({})">
            <i class="el-icon-plus"></i>添加英雄
          </el-button>
          <el-row type="flex" style="flex-wrap: wrap">
            <el-col :md="12" v-for="(item, i) of model.partners" :key="i">
              <el-form-item label="英雄">
                <el-select placeholder="请选择" v-model="item.hero" filterable multiple style="width: 100%">
                  <el-option
                    v-for="hero of heros" :key="hero._id"
                    :label="`${hero.categories.map(v => v.name).join('')}: ${hero.name}`" :value="hero._id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述">
               <el-input type="textarea" v-model="item.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="danger" size="small" 
                  @click="model.partners.splice(i, 1)">
                  删除
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>

      <el-form-item style="margin-top:1rem">
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
      heros: [],
      items: [],
      model: {
        name: '',
        avator: '',
        partners: [],
        categories: [],
        scores: {
          difficult: 0
        },
        skills: []
      },
    }
  },
  methods: {
    // afterUpload (res) {
    //   console.log(res)
    //   // 通过后端拿到的url给前端
    //   // this.$set(this.model, 'avator', res.url)
    //   this.model.avator = res.url
    // },
    async save() {
      let res
      if (this.id) {
        res = await this.$http.put(`rest/heros/${this.id}`, this.model)
        res
      } else {
        res = await this.$http.post('rest/heros', this.model)
        res
      }
      // this.$router.push('/heros/list')
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async fetch () {
      const res = await this.$http.get(`rest/heros/${this.id}`)
      // this.model = res.data
      this.model = Object.assign({}, this.model, res.data)
    },
    async fetchCategories () {
      const res = await this.$http.get(`rest/categories`)
      this.categories = res.data
    },
    async fetchItems () {
      const res = await this.$http.get(`rest/items`)
      this.items = res.data
    },
    async fetchHeros () {
      const res = await this.$http.get(`rest/heros`)
      this.heros = res.data
      console.log('heros is ', this.heros)
    }
  },
  created () {
    this.id && this.fetch()
    this.fetchCategories()
    this.fetchItems()
    this.fetchHeros()
  }
}
</script>

<style>

</style>