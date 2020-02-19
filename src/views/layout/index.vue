<template>
  <div class="container">
    <van-nav-bar fixed title="黑马头条" right-text="搜索" @click-right="$router.push('/search')" />
    <div class="my-wrapper">
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