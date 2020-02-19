<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!--
      van-search搜索的组件标签
        v-model：获得、设置 表单域搜索的关键内容
        形式上：输入框+放大镜图标
    -->
    <van-search v-model.trim="searchText" placeholder="请输入搜索关键词" @search="onSearch(searchText)" />
    <!--
      van-cell搜索的组件标签
        title：单元格标题内容
        icon：单元格项目前边的图标
    -->
    <!-- 联想建议 -->
    <van-cell-group v-if="suggestionList.length>0">
      <van-cell icon="search" v-for="(item,k) in suggestionList" :key="k" @click="onSearch(item)">
        <!-- 同构slot="title"的命名插槽去覆盖渲染掉title属性
        v-html:针对html标签、css样式、字符串内容都可以表现
        {{}}：插值表达式只能表现字符串内容(高亮标签就不能表现效果了)
        -->
        <div slot="title" v-html="highlightCell(item,searchText)"></div>
      </van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <!-- 联想历史记录管理 -->
      <van-cell title="历史记录">
        <!-- 删除图标
      slot="right-icon" 命名插槽 给 cell单元格的右边显示内容(垃圾桶图标)
      name="delete" 垃圾桶图标
      style="line-height:inherit" 设置内容高度与父级一致
        -->
        <van-icon
          @click="isDeleteData=true"
          v-show="!isDeleteData"
          slot="right-icon"
          name="delete"
          style="line-height:inherit"
        ></van-icon>
        <div v-show="isDeleteData">
          <span style="margin-right:10px" @click="delAllSugguest()">全部删除</span>
          <span @click="isDeleteData=false">完成</span>
        </div>
      </van-cell>
      <!-- 历史联想项目数据展示 -->
      <!-- 历史联想展示 -->
      <van-cell :title="item" v-for="(item,k) in sugguestHistories" :key="k">
        <!-- 删除按钮 -->
        <van-icon
          v-show="isDeleteData"
          slot="right-icon"
          name="close"
          style="line-height:inherit"
          @click="delSugguest(k)"
        ></van-icon>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
//
import { apiSuggestionList } from "@/api/search";
//
// 设置关键字历史记录的localStorage的key的名称，方便后续使用
const SH = "sugguest-histories";
//
export default {
  name: "search-index",
  watch: {
    // 对关键字做监听，有变化就要获取联想数据
    searchText: function(newV) {
      // 关键字如果为空，就停止联想获取
      if (!newV) {
        clearTimeout(this.timer)
        this.suggestionList = []; // 清除联想数据
        return false;
      }

      // 针对this.timer做清除操作，防止定时器累加
      // 另外一个好处，用户频繁输入，中间的间隔时间没有超过1s，那么请求动作是没有的
      clearTimeout(this.timer);

      // 设置防抖，防止频繁发送请求
      // timer是组件data成员，就是临时的，不用在data中事先声明
      this.timer = setTimeout(async () => {
        const result = await apiSuggestionList({ q: newV });
        // data接收联想建议数据
        this.suggestionList = result.options;
      }, 1000);
    }
  },
  data() {
    return {
      // 联想历史记录
      sugguestHistories: JSON.parse(localStorage.getItem(SH)) || [],

      isDeleteData: false, // 历史记录开关

      suggestionList: [], // 联想建议数据

      searchText: "" // 搜索关键字
    };
  },
  methods: {
    // 删除“全部”联想建议历史记录
    delAllSugguest() {
      this.sugguestHistories = [];
      localStorage.removeItem(SH);
    },
    // 删除“单个”的联想建议历史记录
    delSugguest(index) {
      this.sugguestHistories.splice(index, 1);
      // 更新localStorage数据
      localStorage.setItem(SH, JSON.stringify(this.sugguestHistories));
    },

    // 跳转到搜索结果页面
    onSearch(keywords) {
      // 没有联想内容，停止后续处理
      if (!keywords) {
        return false;
      }

      const data = new Set(this.sugguestHistories); // 根据已有的历史记录创建Set对象
      data.add(keywords); // 存储访问的关键字
      // 把添加好的整体历史记录变为Array数组，赋予给data成员，使得页面及时显示(响应式)
      this.sugguestHistories = Array.from(data);

      // 把联想关键字数组存储给localStorage里边(名称为sugguest-histories)
      localStorage.setItem(SH, JSON.stringify(this.sugguestHistories));

      //
      // 路由跳转
      this.$router.push({ name: "result", params: { q: keywords } });
    },
    // 对联想数据的关键字做高亮设置
    // 搜索关键字高亮
    // item: Vue 1.0.28 源码解析
    // keywords: vue
    highlightCell(item, keywords) {
      // 创建正则对象有两种方式：
      // const reg = /^1[35789]\d{9}$/g
      // const reg = new RegExp('/^1[35789]\d{9}$/','g')
      // 当前情况非常适合通过第2种情况创建正则，因为我们要把keywords变量解析出来
      const reg = new RegExp(`${keywords}`, "i"); // 正则，忽略大小写

      // 获得到匹配的内容
      // 能匹配到：rst[0] ----> Vue
      // 不能匹配到：rst=null
      const rst = item.match(reg);
      // console.log(rst)
      // 对关键字进行高亮处理
      // 字符串.replace(被替换内容/正则, 替换内容)
      return item.replace(reg, `<span style="color:red">${rst[0]}</span>`);
    }
  }
};
</script>

<style scoped lang='less'></style>