<template>
  <div class="page-hero" v-if="this.model">
    <div class="topbar bg-black py-2 px-3 d-flex ai-center text-white">
      <img src="../assets/logo.png" alt height="30" />
      <div class="px-3 flex-1">
        <span>王者荣耀</span>
        <span class="px-3">攻略站</span>
      </div>
      <router-link to="/" tag="div" class="d-flex ai-center">
        <span class="fs-sm">更多英雄</span>
        <strong class="fs-xxxl px-2">&gt;</strong>
      </router-link>
    </div>
    <div class="top" :style="{'background-image': `url(${model.banner})`}">
      <div class="info text-white p-3 h-100 d-flex flex-column jc-end">
        <div class="fs-sm">{{model.title}}</div>
        <h2 class="my-2">{{model.name}}</h2>
        <div class="fs-sm">{{model.categories.map(v => v.name).join('/')}}</div>
        <!-- 等同于 <div>{{model.categories[0].name}}/{{model.categories[1].name}}</div> -->
        <div class="d-flex jc-between pt-2">
          <div class="scores d-flex ai-center" v-if="model.scores">
            <span>难度</span>
            <span class="badge bg-primary-1">{{model.scores.difficult}}</span>
            <span>技能</span>
            <span class="badge bg-blue-1">{{model.scores.skills}}</span>
            <span>攻击</span>
            <span class="badge bg-danger">{{model.scores.attack}}</span>
            <span>生存</span>
            <span class="badge bg-dark">{{model.scores.survive}}</span>
          </div>
          <router-link to="/" tag="span" class="text-gray fs-sm">皮肤: 2 &gt;</router-link>
        </div>
      </div>
    </div>
    <!-- end of top -->
    <div>
      <div class="bg-white px-3">
        <div class="nav d-flex jc-around pt-3 pb-2 border-bottom">
          <div class="nav-item active">
            <div class="nav-link">英雄初识</div>
          </div>

          <div class="nav-item">
            <div class="nav-link">进阶攻略</div>
          </div>
        </div>
      </div>
      <div>
        <swiper>
          <swiper-slide>
            <div>
              <div class="p-3 bg-white border-bottom">
                <div class="d-flex ai-center">
                  <router-link tag="button" to="/" class="btn btn-lg flex-1">
                    <i class="iconfont icon-video"></i>
                    英雄介绍视频
                  </router-link>
                  <router-link tag="button" to="/" class="btn btn-lg flex-1 ml-2">
                    <i class="iconfont icon-card-hero"></i>
                    一图识英雄
                  </router-link>
                </div>
                <!-- skills -->
                <div class="skills bg-white mt-4">
                  <div class="d-flex jc-around">
                    <img v-for="(item, i) of model.skills"
                      :key="item._id"
                      :src="item.icon"
                      width="65" height="65"
                      class="icon"
                      :class="{active: currentSkillIndex === i}"
                      @click="currentSkillIndex = i"
                    />
                  </div>
                  <div v-if="currentSkill">
                    <div class="d-flex ai-center">
                      <h3>{{currentSkill.name}}</h3>
                      <span class="text-gray-1 ml-4 fs-sm">
                        (冷却值:{{currentSkill.delay}}
                        消耗:{{currentSkill.cost}})
                      </span>
                    </div>
                    <p style="margin-top:0.5rem">{{currentSkill.description}}</p>
                    <div class="border-bottom"></div>
                    <p class="text-gray">小提示: {{currentSkill.tips}}</p>
                  </div>
                </div>
              </div>

              <m-card icon="say" title="出装推荐" class="hero-items">
                <div class="fs-xl">顺风出装</div>
                <div class="d-flex jc-around text-center mt-3">
                  <div v-for="item of model.items1"
                   :key="item._id"
                  >
                    <img :src="item.icon" class="icon" />
                    <div class="fs-xs">{{item.name}}</div>
                  </div>
                </div>
                <div class="border-bottom"></div>
                <div class="fs-xl mt-3">逆风出装</div>
                <div class="d-flex jc-around text-center mt-3">
                  <div v-for="item of model.items2"
                   :key="item._id"
                  >
                    <img :src="item.icon" class="icon" />
                    <div class="fs-xs">{{item.name}}</div>
                  </div>
                </div>
              </m-card>
              <m-card icon="say" title="使用技巧">
                <p class="m-0">{{model.usageTips}}</p>
              </m-card>
              <m-card icon="say" title="对抗技巧">
                <p class="m-0">{{model.battleTips}}</p>
              </m-card>
              <m-card icon="say" title="团战思路">
                <p class="m-0">{{model.teamTips}}</p>
              </m-card>
              <m-card icon="say" title="英雄关系">
                <div class="fs-xl">最佳搭档</div>
                <div class="d-flex ai-center pt-3"
                  v-for="item of model.partners"
                  :key="item.name">
                  <img :src="item.hero[0].avator" width="50" />
                  <p class="flex-1 ml-3">{{item.description}}</p>
                </div>
                <div class="border-bottom mt-3"></div>
              </m-card>
            </div>
          </swiper-slide>

          <swiper-slide></swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: { required: true }
  },
  data() {
    return {
      model: null,
      currentSkillIndex: 0
    };
  },
  computed: {
    currentSkill () {
      return this.model.skills[this.currentSkillIndex]
    }
  },
  methods: {
    async fetchHero() {
      const res = await this.$http.get(`/heros/${this.id}`);
      this.model = res.data;
    }
  },
  created() {
    this.fetchHero();
  }
};
</script>

<style lang="scss">
.page-hero {
  .top {
    height: 50vw;
    background: #fff no-repeat top center;
    background-size: auto 100%;
    .info {
      background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
      .scores {
        .badge {
          margin: 0 0.5rem;
          display: inline-block;
          width: 1rem;
          height: 1rem;
          line-height: 0.9rem;
          text-align: center;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.6rem;
        }
      }
    }
  }
  .hero-items {
    img.icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  
}
</style>