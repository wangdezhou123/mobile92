<template>
  <div class="container">
    <!--给导航栏设置fixed，使得固定定位-->
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <!-- 瀑布流加载 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in searchList" :key="item.art_id.toString()" :title="item.title" />
    </van-list>
  </div>
</template>

<script>
// 引入api接口
import { apiSearchList } from "@/api/search";

export default {
  name: "search-result",
  computed: {
    // 获得路由参数q，使得组件内部可以通过 this.q 的简便方式获得路由参数
    q() {
      return this.$route.params.q;
    }
  },
  data() {
    return {
      // 瀑布相关
      list: [],
      loading: false,
      finished: false,

      page: 1, // 页码
      per_page: 10, // 条数
      searchList: [] // 搜索结果
    };
  },
  // created() {
  //   // 调用搜索方法
  //   this.getSearchList();
  // },
  methods: {
    //
    // 瀑布加载
    async onLoad() {
      await this.$sleep(1000); // 暂停1s，不要太着急加载

      let result = await apiSearchList({
        q: this.q,
        page: this.page,
        per_page: this.per_page
      });
      // 加载状态结束
      this.loading = false;

      if (!result.results.length) {
        // 数据全部加载完成
        this.finished = true;
        return false;
      }
      // 追加数据
      this.searchList.push(...result.results);
      // 页码累加
      this.page++;
    }
    //
    // // 获得搜索结果
    // async getSearchList() {
    //   let result = await apiSearchList({ q: this.q });
    //   // console.log(result);

    //   this.searchList = result.results;
    // }
  }
};
</script>


<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-sizing: border-box;
  .van-list {
    flex: 1;
    margin-top: 92px;
  }
}
</style>
