<template>
  <!-- <el-container style="height: 500px; border: 1px solid #eee"> -->
  <el-container style="height: 100vh">
    <el-aside width="220px" style="background-color: rgb(238, 241, 246)">
      <el-menu
        :router=true
        :default-openeds="openeds"
        :unique-opened="uniqueOpened" 
        :default-active="$route.path"
        active-text-color="#ffd04b"
        text-color="#fff"
        background-color="#545c64"
      >
        <el-submenu
          v-for="(item, index) in menu.items"
          :index="`${index} + 1`"
          :key="`menu-item-${index}`"
        >
          <template slot="title">{{ item.title }}</template>
          <el-menu-item
            v-for="(subItem, subIndex) in item.items"
            :index="subItem.path"
            :key="`menu-item-${index}-${subIndex}`"
          >
            {{ subItem.title }}
          </el-menu-item>
        </el-submenu>

        <!-- <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>内容管理
          </template>
          <el-menu-item-group>
            <template slot="title">物品</template>
            <el-menu-item index="/items/create">新建物品</el-menu-item>
            <el-menu-item index="/items/list">物品列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">英雄</template>
            <el-menu-item index="/heros/create">新建英雄</el-menu-item>
            <el-menu-item index="/heros/list">英雄列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">文章</template>
            <el-menu-item index="/articles/create">新建文章</el-menu-item>
            <el-menu-item index="/articles/list">文章列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-message"></i>运营管理
          </template>
          <el-menu-item-group>
            <template slot="title">广告位</template>
            <el-menu-item index="/ads/create">新建广告位</el-menu-item>
            <el-menu-item index="/ads/list">广告位列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-message"></i>系统设置
          </template>
          <el-menu-item-group>
            <template slot="title">分类</template>
            <el-menu-item index="/categories/create">新建分类</el-menu-item>
            <el-menu-item index="/categories/list">分类列表</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">管理员</template>
            <el-menu-item index="/admin_users/create">新建管理员</el-menu-item>
            <el-menu-item index="/admin_users/list">管理员列表</el-menu-item>
          </el-menu-item-group>
        </el-submenu> -->
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span @click="logout">退出登录</span>
            </el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>{{ username }}</span>
      </el-header>

      <el-main id="scrTop">
        <h1 v-show="handleShow">欢迎进入管理后台</h1>
        <router-view :key="$route.path"></router-view>
        <!-- <el-table :data="tableData">
          <el-table-column prop="date" label="日期" width="140">
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
          </el-table-column>
          <el-table-column prop="address" label="地址">
          </el-table-column>
        </el-table>-->
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄",
    };
    return {
      username: "",
      tableData: Array(20).fill(item),
      openeds: ['2'],
      uniqueOpened: true,
      // handleShow: false
      menu: {
        items: [
          {
            title: "内容管理",
            items: [
              { title: "首页", path: "/" },
              { title: "分类列表", path: "/categories/list" },
              { title: "新建分类", path: "/categories/create" },
              { title: "物品列表", path: "/items/list" },
              { title: "新建物品", path: "/items/create" },
              { title: "英雄列表", path: "/heros/list" },
              { title: "新建英雄", path: "/heros/create" },
              { title: "文章列表", path: "/articles/list" },
              { title: "新建文章", path: "/articles/create" },
            ],
          },
          {
            title: "运营管理",
            items: [
              { title: "广告位列表", path: "/ads/list" },
              { title: "新建广告位", path: "/ads/create" },
            ],
          },
          {
            title: "系统管理",
            items: [
              { title: "管理员列表", path: "/admin_users/list" },
              { title: "新建管理员", path: "/admin_users/create" },
            ],
          },
        ],
      },
    };
  },
  computed: {
    handleShow: function() {
      if (this.$route.path === "/") {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    // this.username = sessionStorage.username;
    this.username = localStorage.username;
  },
  updated() {
    let scrTop = document.getElementById("scrTop");
    scrTop.scrollTop = 0;
  },
  methods: {
    async logout() {
      localStorage.clear();
      sessionStorage.clear();
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
/* .el-menu-item {
    border-right: 1px solid #fff;
  } */
</style>
