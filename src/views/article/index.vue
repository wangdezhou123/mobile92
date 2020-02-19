<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>

    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | formatTime}}</p>
        </div>
        <!-- default:按钮没有颜色
        info:按钮是蓝色背景-->
        <van-button
          round
          size="small"
          @click="followMe()"
          :loading="followLoading"
          :type="article.is_followed?'default':'info'"
        >{{article.is_followed?'取消关注':'+ 关注'}}</van-button>
      </div>
      <div class="content">
        <p>{{article.content}}</p>
      </div>
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{active:article.attitude===1}"
          plain
          icon="like-o"
          style="margin-right:8px;"
        >点赞</van-button>
        <van-button
          round
          :class="{active:article.attitude===0}"
          size="small"
          plain
          icon="delete"
        >不喜欢</van-button>
      </div>
      <!-- 评论列表 -->
      <com-comment></com-comment>
    </div>
  </div>
</template>

<script>
// 引入评论组件
import ComComment from "./components/com-comment.vue";
// 关注相关api方法导入
import { apiUserFollow, apiUserUnFollow } from "@/api/user.js";
// 文章详情api
import { apiArticleDetail } from "@/api/article.js";
export default {
  name: "article-index",
  components: { ComComment },
  data() {
    return {
      followLoading: false, // 关注活动加载标志

      article: {} // 目标文章详情信息
    };
  },
  computed: {
    // 简化路由参数获取
    aid: function() {
      return this.$route.params.aid;
    }
  },
  created() {
    // 自动调用
    this.getArticleDetail();
  },
  methods: {
    //
    // 关注作者、取消关注作者
    async followMe() {
      this.followLoading = true; // 开启加载状态

      await this.$sleep(800); // 暂停0.8s

      // 判断当前的关注状态，并做不同的处理活动
      if (this.article.is_followed) {
        // 取消关注
        await apiUserUnFollow(this.article.aut_id);
        // 页面上要更新关注状态--> + 关注 提示
        this.article.is_followed = false;
      } else {
        // 关注(成功或失败)
        try {
          await apiUserFollow(this.article.aut_id);
          // 页面上要更新关注状态-->取消关注 提示
          this.article.is_followed = true;
        } catch (err) {
          this.$toast.fail("不能自己关注自己！");
        }
      }
      this.followLoading = false; // 恢复按钮状态
    },
    //
    // 获得文章详情
    async getArticleDetail() {
      // 调用api获得文章详情
      const result = await apiArticleDetail(this.aid);
      this.article = result;
    }
  }
};
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 0 20px 88px;
  margin-top: 92px;
  .title {
    font-size: 36px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 20px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 20px 0;
    display: flex;
    position: sticky;
    background-color: #fff;
    top: 92px;
    z-index: 2;
    .text {
      flex: 1;
      padding-left: 20px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 40px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    p {
      font-size: 28px;
    }
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>

