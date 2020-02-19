<template>
  <div class="page-user-profile">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="save()"
    ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" center>
        <!--
        slot="default" 自定义单元格右侧内容
        fit="cover"  图片填充模式 保持宽高缩放图片，使图片的短边能完全显示出来，裁剪长边
        -->
        <van-image
          slot="default"
          width="56"
          height="56"
          fit="cover"
          round
          src="https://img.yzcdn.cn/vant/cat.jpeg"
        />
      </van-cell>
      <!-- value=xxx 设置单元格右侧内容部分 -->
      <van-cell is-link title="名称" value="用户名称" />
      <van-cell is-link title="性别" value="男" />
      <van-cell is-link title="生日" value="2019-08-08" />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: "user-profile",
  methods: {
    save() {
      this.$toast.success("保存成功");
    }
  }
};
</script>

<style scoped lang='less'></style>
