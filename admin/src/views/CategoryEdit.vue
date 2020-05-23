<template>
  <div class="about">
    <h1>{{ id ? "编辑" : "新建" }}分类</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <el-form-item label="上级分类">
        <!-- model 有 _id, parent, name-->
        <el-select
          placeholder="请选择"
          v-model="model.parent"
          filterable
          style="width: 100%"
        >
          <!-- parents的子项是item，每个item有_id和字段parent, name，这里目前只显示字段name -->
          <el-option
            v-for="item of parents"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <!-- input随写随存入model -->
        <el-input placeholder="请输入内容" v-model="model.name"></el-input>
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
    id: {},
  },
  data() {
    return {
      model: {},
      parents: [],
    };
  },
  methods: {
    async save() {
      // this.$http.post('categories', this.model).then()
      let res;
      if (this.id) {
        console.log(
          "this.id and $route.params.id ",
          this.id,
          this.$route.params.id
        );
        res = await this.$http.put(`rest/categories/${this.id}`, this.model);
        res;
      } else {
        // this.model被axios转化成req.body发出去了，后端的express会接收到并存入mongodb
        res = await this.$http.post("rest/categories", this.model);
        res;
      }
      this.$router.push("/categories/list");
      this.$message({
        type: "success",
        message: "保存成功",
      });
      // 新方法
      // const url = this.id ? `rest/categories/${this.id}` : "rest/categories";
      // const method = this.id ? "put" : "post";
      // await this.$http[method](url, this.model);
      // this.model = {};
      // // this.$router.go(-1)
      // this.$router.push("/categories/list");
      // this.$message.success("保存成功");
    },
    // 进入编辑页面时能够让输入框内显示之前的值
    async fetch() {
      // 数据库对应方法没有使用populate方法时，所以只能拿到模型第一层的字段_id，name和字段值为id的parent，而不是完整的parent对象
      const res = await this.$http.get(`rest/categories/${this.id}`);
      console.log("res is ", res);
      this.model = res.data;
      console.log("this.model is ", this.model);
    },
    // 拿到列表页面所有数据
    async fetchParents() {
      const res = await this.$http.get(`rest/categories`);
      // this.parents = res.data
      // 上级分类不会出现子分类的方法，即没有设置上级分类的分类即为上级分类
      for (var i = 0; i < res.data.length; i++) {
        if (!res.data[i].parent) {
          this.parents.push(res.data[i]);
        }
      }
      console.log("this.parents is ", this.parents);
    },
  },
  created() {
    this.fetchParents();
    // id是mongodb存数据时自动添加的
    this.id && this.fetch();
  },
};
</script>

<style></style>
