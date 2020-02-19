<template>
  <div class="container">
    <!--
      van-tabs/van-tab:标签页组件
      v-model：通过下标设置激活项目，下标从0开始计数
      title: 标签名称
    -->
    <van-tabs v-model="activeChannelIndex">
      <!-- 给标签页设置图标，用法是命名插槽
      slot="nav-left/right" 图标放置的位置
      class="channel-more"  下述设置css样式
      -->
      <div slot="nav-right" class="channel-more" @click="showChannel=true">
        <!-- 图标  name="wap-nav" 3杠图标 -->
        <van-icon name="wap-nav" />
      </div>
      <!-- <van-tab title="标签名称">当前标签对应的内容</van-tab> -->
      <van-tab :title="item.name" v-for="item in channelList" :key="item.id">
        <com-article :channelID="item.id"></com-article>
      </van-tab>
    </van-tabs>
    <!-- 频道操作 -->
    <com-channel
      v-model="showChannel"
      :channelList="channelList"
      :activeChannelIndex.sync="activeChannelIndex"
    ></com-channel>
  </div>
</template>

<script>
//
// 导入组件模块
import ComChannel from "./components/com-channel";
//
// 导入api函数
import { apiChannelList } from "@/api/channel.js";
// 对com-article.vue 做导入、注册、使用
import ComArticle from "./components/com-article.vue";
export default {
  name: "home-index",
  components: {
    ComArticle,
    ComChannel
  },
  data() {
    return {
      // data:
      showChannel: false, // 频道操作弹出层组件显示标志
      // 用户频道列表
      channelList: [],
      // 激活频道下标标志
      activeChannelIndex: 0
    };
  },
  created() {
    // 频道
    this.getChannelList();
  },
  methods: {
    // 频道
    async getChannelList() {
      const result = await apiChannelList();
      // console.log(result);
      // data接收频道列表
      this.channelList = result.channels;
    }
  }
};
</script>

<style scoped lang='less'>
//
/*给 更多 频道设置样式*/
.channel-more {
  position: fixed;
  right: 0;
  background-color: white;
  line-height: 88px;
  height: 88px;
  width: 90px;
  text-align: center;
  font-size: 40px;
}
/*频道列表*/
.van-tabs {
  /deep/ .van-tabs__wrap {
    width: 90%; /*设置频道列表最大宽度，可以避免最后一个频道被按钮覆盖住*/
  }
}
//
.van-tabs {
  // 弹性布局
  display: flex;
  // 灵活的项目将垂直显示，正如一个列一样
  flex-direction: column;
  height: 100%;
  /deep/ .van-tabs__content {
    // flex:1;的值是1 1 0%，【父控件有剩余空间占1份放大，父控件空间不足按1缩小，自身的空间大小是0%】
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    // 给上拉列表设置样式
    //
    //
    //
    // .scroll-wrapper {
    //   height: 100%;
    //   overflow-y: auto;
    // }
  }
  // 给频道下边沿横向设置样式
  /deep/ .van-tabs__line {
    background-color: #1989fa;
  }
}
</style>