<template>
  <!--  -->
  <!--  -->
  <div class="scroll-wrapper">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="downSuccessText"
      :success-duration="1000"
    >
      <!-- 瀑布流加载效果(动作-上拉)
        v-model="loading" 加载动画效果(加载中...)
        :finished="finished" 是否停止加载，false可以继续加载,true停止加载
        finished-text="没有更多了" 停止加载后的文字提示
        @load="onLoad" 加载数据的回调事件，页面初次载入会自动触发
        或者是 滚轮 滚动到系统设置的页面底部，也会自动触发
      -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!--
          单元格组件
          内容独占一行进行显示，使用其他div也可以
          title：设置单元格标题
        -->
        <!--
                单元格组件
                内容独占一行进行显示，使用其他div也可以
                title：设置单元格标题
                注意：模板中使用超大整型的数字，需要执行转变为字符串，调用toString()方法即可
        -->
        <!-- <van-cell v-for="item in articleList" :key="item.art_id.toString()" :title="item.title" /> -->
        <!--  -->
        <!--
cell单元格组件
title：单元格标题
<template slot="label">通过作用域插槽体现单元格的“label描述信息”
slot="label/title/"
        -->
        <van-cell
          v-for="item in articleList"
          :key="item.art_id.toString()"
          :title="item.title"
          @click="$router.push({name:'article',params:{aid:item.art_id.toString()}})"
        >
          <!--命名插槽：体现label的描述信息-->
          <template slot="label">
            <!-- grid宫格组件，一行中通过“列”的方式设置许多单元格
    van-grid
    border:设置宫格是否有边框
    :column-num：宫格列的数目
    van-grid-item：宫格单元
    内容区域，设置具体显示内容
    van-image：显示图片的组件
    width:宽度
    height高度
    src图片路径名地址
            -->
            <!-- 数据部分
    通过cover.type  cover.images进行封面图片展示
    v-if:宫格是否有机会体现 type>0
    column-num:type  1列  3列
            -->
            <van-grid :border="false" v-if="item.cover.type>0" :column-num="item.cover.type">
              <van-grid-item v-for="(item2,k2) in item.cover.images" :key="k2">
                <van-image width="90" height="90" :src="item2" lazy-load />
              </van-grid-item>
            </van-grid>
            <p>
              <!--给 van-cell  的右侧设置叉号按钮
                van-icon:图标组件
                name：图标样式
              -->
              <van-icon
                name="close"
                style="float:right;"
                @click.stop="displayDialog(item.art_id.toString())"
              />
              <span>作者:{{item.aut_name}}</span>
              &nbsp;
              <span>评论 :{{item.comm_count}}</span>
              &nbsp;
              <span>时间:{{item.pubdate | formatTime}}</span>
              &nbsp;
            </p>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
    <!--  -->
    <!-- 更多操作组件位置(举报、不感兴趣弹出框) -->
    <more-action
      v-model="showDialog"
      :articleID="nowArticleID"
      @dislikeSuccess="handleDislikeSuccess"
    ></more-action>
    <!-- <more-action></more-action> -->
  </div>
</template>

<script>
//
// 对com-moreaction.vue弹出框组件做 导入、注册、使用
import MoreAction from "./com-moreaction.vue";
// 导入获得文章的api函数
import { apiArticleList } from "@/api/article.js";
export default {
  name: "com-article",
  components: {
    MoreAction
  },
  props: {
    // 接收父给子传递的频道id
    channelID: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      // 下拉动作完成的文字提示
      downSuccessText: "", // 文章更新成功 / 文章已经是最新的

      nowArticleID: "", // 不感兴趣文章id

      showDialog: false, // 控制子组件弹出框是否显示

      // 文章列表
      articleList: [],
      ts: Date.now(), // 时间戳参数，用于分页获取文章信息
      // 下拉刷新相关
      isLoading: false, // 下拉动画是否显示开关
      // 瀑布流相关成员
      list: [], // 接收加载好的数据
      loading: false, // “加载中...”动画是否显示(加载的时候才设置为true，加载完毕再设置为false)，每次onLoad执行就设置为true，执行完毕就设置为false
      finished: false // 加载是否停止的标志，false可以继续加载，true瀑布流停止加载，如果后端没有数据可以提供了，就设置该项目为true即可
    };
  },
  created() {
    // 文章
    this.getArticleList();
  },
  methods: {
    // 文章不感兴趣后续处理
    handleDislikeSuccess() {
      // 从 articleList 文章列表中把目标的文章给删除
      // [客户端级]删除
      // 目标文章id：nowArticleID

      // 1. 根据 nowArticleID 把其在 articleList 数组中的下标给获得到，
      // findIndex：获得指定数组元素下标
      const index = this.articleList.findIndex(
        item => item.art_id.toString() === this.nowArticleID
      );
      // 2. 根据下标 从 articleList 中做删除操作
      //    数组.splice(下标,长度) 删除数组的指定元素
      this.articleList.splice(index, 1);
    },
    // 展示更多操作的弹层
    displayDialog(artID) {
      this.showDialog = true;
      this.nowArticleID = artID;
    },
    // 获得文章列表
    async getArticleList() {
      const result = await apiArticleList({
        channel_id: this.channelID,
        timestamp: this.ts
      });
      // console.log(result);
      // data接收文章数据
      // this.articleList = result.results
      return result;
    },
    // 下拉刷新
    // 下拉刷新
    async onRefresh() {
      await this.$sleep(800);

      // 获得文章列表数据
      const articles = await this.getArticleList();

      // 判断是否有获得到最新的文章
      if (articles.results.length > 0) {
        // 有获得到 unshift 数组前置追加元素
        this.articleList.unshift(...articles.results);
        // 更新时间戳
        this.ts = articles.pre_timestamp; // 使得继续请求，可以获得下页数据
        this.downSuccessText = "文章更新成功";
      } else {
        // 没有最新的文章了，页面要给与提示
        this.downSuccessText = "文章已经是最新的";
      }
      this.isLoading = false; // 下拉动画消失[加载完成了]
    },
    // 瀑布流加载执行的方法
    // 瀑布流加载执行的方法
    async onLoad() {
      //
      //
      // 应用延迟器，使得执行速度减慢
      // await设置上，作用就是当前的延迟器没有执行完毕，后续代码都等着
      //              即 异步调用变为同步执行
      await this.$sleep(800); // 该延迟器要执行0.8秒
      //
      // 1. 获得文章列表数据
      //    注意：设置await，使得当前的axios异步进程变为同步的，先执行完，再执行后续代码
      const articles = await this.getArticleList();

      if (articles.results.length > 0) {
        // 2. 把获得到的文章数据push追加给articleList成员
        //    articles.results: 文章的数组对象集 [{art_id,title,aut_id,pubdate},{……},{……}]
        //    ...articles.results：扩展运算  {art_id,title,aut_id,pubdate},{……},{……}
        this.articleList.push(...articles.results);
        // 更新时间戳
        this.ts = articles.pre_timestamp; // 使得继续请求，可以获得下页数据
      } else {
        // 4. 数据已经耗尽，就要停止瀑布了
        this.finished = true; // 停止瀑布流加载
      }

      // 3. 清除上拉动画效果
      this.loading = false; // '加载中。。'动画清除
    }
  }
};
</script>

<style lang="less" scoped>
// 给上拉列表设置样式
.scroll-wrapper {
  height: 100%;
  // 内容过多，有垂直滚动条
  overflow-y: auto;
}
</style>
