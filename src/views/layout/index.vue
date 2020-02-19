<template>
  <div class="container">
    <!-- 导航栏
          title:导航栏 中间信息
          right-text 右侧信息
          fixed：导航栏 固定在头部
          @click-right： 右侧文字单击事件
          v-if="showNavBar": 如果是个人中心，就不要显示
    -->
    <van-nav-bar
      fixed
      title="黑马头条"
      right-text="搜索"
      @click-right="$router.push('/search')"
      v-if="showNavBar"
    />
    <!-- noTop：设置padding-top为0，只有用户中心页面需要设置，其他子页码不要设置
          showNavBar:false===>个人中心====>额外增加noTop
          showNavBar:true===>其他===>没有noTop
    -->
    <div class="my-wrapper" :class="{noTop:!showNavBar}">
      <router-view></router-view>
    </div>
    <van-tabbar route>
      <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item :to="userGo" icon="user-o">{{$store.state.user.token?'我的':'未登录'}}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "layout-index",
  computed: {
    // 判断用户是否有登录系统，返回不同的路由执行地址
    userGo: function() {
      return this.$store.state.user.token ? "/user" : "/login";
    },
    // 判断是否正在访问个人中心，是就返回false，不是返回true
    // 对应的导航栏据此设置是否显示
    showNavBar() {
      // this  指向 组件实例
      // this.$route.path: 感知路由地址信息
      return this.$route.path !== "/user";
    }
  }
};
</script>

<style scoped lang='less'>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .my-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-top: 92px;
    padding-bottom: 100px;
    box-sizing: border-box;
    &.noTop {
      padding-top: 0;
    }
  }
}
</style>