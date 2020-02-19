<template>
  <div>
    <!--
        弹出框组件
        v-model="show"  // 控制是否显示对话框 true展示  false隐藏
        :show-confirm-button="false"  // 不显示 “确定” 按钮
        close-on-click-overlay // 点击旁处  关闭对话框

        @input:当前组件的value值发生变化，要传递给
        父组件的v-model里边去的,使得弹出框可以不断完成关闭、显示动作

        注意：
          $emit('input',$event)就这样配置，van-dialog内部已经把$event.target.value都集成好了

          如果当前标签是普通的input框标签，那么$emit('input',$event.target.value)两个参数就都需要设置全乎

    -->
    <van-dialog
      :value="value"
      @input="$emit('input',$event)"
      :show-confirm-button="false"
      close-on-click-overlay
      @close="isOneLevel=true"
    >
      <!--
        van-cell单元格组件
        icon:图标
        title：标题内容
        is-link : 右侧箭头图标
        @click ：单击事件
      -->
      <van-cell-group v-if="isOneLevel">
        <van-cell icon="location-o" title="不感兴趣" @click="articleDislike()" />
        <van-cell icon="location-o" title="反馈垃圾内容" is-link @click="isOneLevel=false" />
        <van-cell icon="location-o" title="拉黑作者" />
      </van-cell-group>
      <!--
        van-cell单元格组件
          icon="arrow-left"  左侧箭头图标
          @click ：单击事件
      -->
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isOneLevel=true" />
        <van-cell
          v-for="item in reportsList"
          :key="item.value"
          :title="item.title"
          icon="location-o"
          @click="articleReport(item.value)"
        />
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
// 导入api模块函数
import { apiArticleDislike, apiArticleReport } from "@/api/article";
export default {
  name: "com-moreaction",
  data() {
    return {
      // 举报类型：
      reportsList: [
        { title: "其他问题", value: 0 },
        { title: "标题夸张", value: 1 },
        { title: "低俗色情", value: 2 },
        { title: "错别字多", value: 3 },
        { title: "旧闻重复", value: 4 },
        { title: "广告软文", value: 5 },
        { title: "内容不实", value: 6 },
        { title: "涉嫌违法犯罪", value: 7 },
        { title: "侵权", value: 8 }
      ],
      isOneLevel: true // 判断展示一级 或 二级 反垃圾内容 true:一级  false:二级
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 接收不喜欢文章id

    articleID: {
      type: String,
      required: true
    }
  },
  methods: {
    // 文章举报
    // type:举报类型
    async articleReport(type) {
      // type:是对象成员简易赋值type:type
      // 文章举报要么成功、要么失败(文章被重复举报)，所以try/catch要介入
      try {
        // 只要apiapiArticleReport 函数发生致命名错，其他语句都没有问题
        const obj = { articleID: this.articleID, type };
        await apiArticleReport(obj);
      } catch (err) {
        // return:停止catch以外的代码执行
        if (err.response.status === 409) {
          return this.$toast.fail("文章已经被举报过了");
        } else {
          return this.$toast.fail("文章举报失败");
        }
      }

      // 成功提示
      this.$toast.success("举报成功！");
      // 弹出框消失
      this.$emit("input", false);
    },
    /**
     * 对不感兴趣文章做处理
     */
    async articleDislike() {
      const result = await apiArticleDislike(this.articleID);
      // console.log(result);
      // 成功提示
      this.$toast.success("处理成功！");
      // 弹出框消失
      this.$emit("input", false);
      // 调用自己的 dislikeSuccess 事件，完成页面文章删除功能
      this.$emit("dislikeSuccess");
    }
  }
};
</script>

<style lang="less" scoped>
</style>
