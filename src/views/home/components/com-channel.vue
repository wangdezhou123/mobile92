<template>
  <van-popup
    :value="value"
    @input="$emit('input',$event)"
    closeable
    round
    position="bottom"
    :style="{ height: '95%' }"
    close-icon-position="top-left"
    @close="isEdit=false"
  >
    <!--
    弹出层组件van-popup
    v-model="布尔变量"  设置弹出层是否显示
    现在 通过 :value 和 @input 把v-model给体现出来的，因为具体的控制开关
    @input="$emit('input',$event)" 当前popup允许这样操作，直接传递$event就可以了
    @input="$emit('input')" 当前popup允许这样操作，直接传递$event就可以了
    我们自己设计底层代码，那么 要这样设置 @input="$emit('input',$event.target.value)"

    是要放到父组件的v-model里边的
    现在这个弹出层是否显示的控制模式 与 之前的弹出框的操作完全一致

    closeable 有关闭图标
    round  圆角
    position="bottom" 弹出层是从底部弹出
    :style="{ height: '20%' }"  弹出层高度
    close-icon-position="top-left" 关闭按钮要在左上脚显示
    -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button
            type="danger"
            plain
            size="mini"
            round
            @click="isEdit=!isEdit"
          >{{isEdit?'完成':'编辑'}}</van-button>
        </div>
      </div>
      <!--van-grid 没有设置column-num属性，默认是4列-->
      <van-grid class="channel-content" :gutter="10" clickable>
        <!--  -->
        <!--  -->
        <!--  -->
        <van-grid-item
          v-for="(item,k) in channelList"
          :key="item.id"
          @click="clkChannel(item.id,k)"
        >
          <span class="text" :style="{color:k===activeChannelIndex?'red':''}">{{item.name}}</span>
          <!-- <van-icon class="close-icon" name="close" /> -->
          <van-icon
            v-show="isEdit && k>0"
            class="close-icon"
            name="close"
            @click="userToRest(item.id,k)"
          />
        </van-grid-item>
      </van-grid>
    </div>

    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item v-for="item in restChannel" :key="item.id" @click="restToUser(item)">
          <div class="info">
            <span class="text">{{item.name}}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
  </van-popup>
</template>

<script>
// 获得所有频道的api函数
import { apiChannelAll, apiChannelAdd, apiChannelDel } from "@/api/channel.js";
//
//
export default {
  name: "com-channel",
  data() {
    return {
      isEdit: false, // 是否进入编辑状态
      channelAll: [] // 全部频道
    };
  },
  computed: {
    // 把"剩余频道"给制作出来(全部频道 减去 我的频道)
    restChannel() {
      // 把“我的频道”的全部id获得到，以数组格式返回
      // 如下map方法对 channelList 做遍历，返回一个新数组，
      // 元素就是channelList数组各个元素的id值，数组长度 与 channelList 一致
      // [10,15,23,107,56……]
      const userChannelIds = this.channelList.map(item => {
        return item.id;
      });
      // 遍历全部频道，返回不在“我的频道”出现的频道
      // filter：对 channelAll 做过滤，把id值不在 userChannelIds 数组中出现的元素通过
      // 新数组给返回出来
      // [{id:33,name:xx},{id:34,name:xx},{id:45,name:xx}…………]
      const rest = this.channelAll.filter(item => {
        // Array.includes判断是否包含该元素
        return !userChannelIds.includes(item.id);
      });
      // 返回过滤好的 剩余的频道
      return rest;
    }
  },
  props: {
    // 接收父组件v-model的数据信息
    value: {
      type: Boolean,
      default: false
    },
    // 父传递过来的"我的频道"数据
    channelList: {
      type: Array,
      // 数组的默认值要通过如下箭头函数方式设置
      default: () => []
    },
    // 当前激活频道的下标
    activeChannelIndex: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.getChannelAll();
  },
  methods: {
    // 我的频道 单击后要激活显示该频道
    clkChannel(channelID, index) {
      // 判断有进入编辑状态，就执行删除逻辑，注意：“推荐”项目不要执行
      if (this.isEdit && index > 0) {
        this.userToRest(channelID, index);
        return false; // 停止后续代码执行
      }

      // 1. 频道弹出层消失
      this.$emit("input", false);
      // 2. home/index.vue页面要"激活"当前单击到的频道并展示
      // 修改 activeChannelIndex的值为 index 即可(就是子组件修改父组件传递的变量)
      this.$emit("update:activeChannelIndex", index);
    },
    // methods方法：
    // 删除频道(我的频道---->推荐频道)
    // channelID: 删除频道的id，用给localStorage删除的
    // index: 被删除频道在数组中的下标位置，用给页面级删除
    userToRest(channelID, index) {
      // 1. 页面级删除channelList 父组件给传递过来的，本身是一个对象，那么它们的传值模式是“引用”
      //    方式(父、子组件关于channelList共同操作，一方修改，另一方也可以感知到)
      this.channelList.splice(index, 1);

      // 2. localStorage删除
      apiChannelDel(channelID);

      // 如果被删除的频道是最后一个，那么请设置之前一个频道被激活使用
      // 算法： activeChannelIndex -= 1
      // activeChannelIndex 是父组件给传递过来的，即子组件要修改父组件传递过来的数据信息
      // 判断是删除最后一个项目，算法：项目删除后的长度 ====  删除下标
      if (this.channelList.length === index) {
        this.$emit("update:activeChannelIndex", index - 1);
      }
    },
    // methods方法:
    // 推荐频道 被添加到 我的频道 里边
    // channel被添加频道： {id:xx,name:xx}
    restToUser(channel) {
      // 1. 页面更新数据,channelList 父组件给传递过来的，本身是一个对象，那么它们的传值模式是“引用”
      //    方式(父、子组件关于channelList共同操作，一方修改，另一方也可以感知到)
      this.channelList.push(channel);
      // 2. localStorage持久更新
      apiChannelAdd(channel);
    },
    // 获取全部频道
    async getChannelAll() {
      let result = await apiChannelAll();
      this.channelAll = result.channels;
      // console.log(result);
    }
  }
};
</script>


<style lang="less" scoped>
.channel {
  margin-top: 70px;
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 16px;
      color: gray;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
