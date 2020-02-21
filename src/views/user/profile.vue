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
      <van-cell is-link title="头像" center @click="showPhoto=true">
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
          :src="userProfile.photo"
        />
      </van-cell>
      <van-cell is-link title="名称" :value="userProfile.name" @click="showName=true" />
      <van-cell
        is-link
        title="性别"
        :value="userProfile.gender === 0 ? '男' : '女'"
        @click="showSex=true"
      />
      <van-cell is-link title="生日" :value="userProfile.birthday" @click="showBirthday = true" />
    </van-cell-group>

    <!-- 弹头像 -->
    <van-popup v-model="showPhoto" position="bottom">
      <!-- 内容 -->
      <!-- 1 本地相册选择图片 -->
      <!-- 2 拍照 -->
      <van-cell is-link title="本地相册选择图片" @click="$refs.mypic.click()"></van-cell>
      <van-cell is-link title="拍照"></van-cell>
    </van-popup>

    <!-- 弹昵称 -->
    <van-popup v-model="showName" position="bottom">
      <!-- 编辑用户昵称  双向绑定用户的昵称-->
      <van-field v-model.trim="userProfile.name" type="textarea" rows="3"></van-field>
    </van-popup>

    <!-- 弹性别，
          van-action-sheet"菜单"弹出层组件
          与普通弹出层的区别就是，只可以设置"菜单"项目，
          而普通弹出层可以自定义展示内容

          v-model：是否显示
          @select：选取项目的回调处理(内部可以设置弹层关闭、还可以设置选中项目信息等)
          :actions：可选取项目菜单信息设定 [{ name: '男' }, { name: '女' }]
          cancel-text="取消" 展示取消按钮
    -->
    <van-action-sheet v-model="showSex" @select="onSelect" :actions="actions" cancel-text="取消"></van-action-sheet>

    <!-- 弹生日 -->
    <van-popup v-model="showBirthday" position="bottom">
      <!-- 时间选择器
            v-model：默认激活显示时间
            type 时间类型，年月日
            :min-date="minDate" 允许选取的最小时间
            @cancel 单击取消按钮回调事件
            @confirm 确认选取时间回调
      -->
      <van-datetime-picker
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        @cancel="showBirthday=false"
        @confirm="confirmDate"
      ></van-datetime-picker>
    </van-popup>

    <!-- 选择文件控件 -->
    <input ref="mypic" @change="startUpload()" type="file" style="display:none" />
  </div>
</template>

<script>
// 获取用户资料的api、上传用户头像的
import dayjs from "dayjs";
// 获取用户资料的api
import { apiUserProfile, apiUserPhoto } from "@/api/user.js";
export default {
  name: "user-profile",
  data() {
    return {
      nowDate: new Date(), // 当前时间
      minDate: new Date("1900-01-01"), // 允许选取的最小时间
      showBirthday: false, // 是否显示生日弹层
      actions: [{ name: "男" }, { name: "女" }], // 弹出菜单项目定义
      showSex: false, // 是否显示选择头像弹层
      showName: false, // 是否显示编辑昵称的弹层

      showPhoto: false, // 是否显示选择头像弹层

      // 用户资料表单对象
      userProfile: {
        photo: "",
        name: "我是华仔",
        gender: 0, // 0 男 1 女
        birthday: "1993-09-01"
      }
    };
  },
  created() {
    this.getUserProfile(); // 调用获取用户资料的方法
  },
  methods: {
    // 实现图片上传
    async startUpload() {
      // console.log(3333)

      // 获得上传好的图片对象信息
      // console.dir(this.$refs.mypic) // 上传文件域的dom对象(从中感知上传文件信息)
      // 通过观察得知： this.$refs.mypic.files[0] 就是上传的文件的对象数据

      const fd = new FormData(); // 创建FormData对象
      fd.append("photo", this.$refs.mypic.files[0]); // 往FormData对象中添加参数
      const result = await apiUserPhoto(fd);
      // 应该 把地址 同步设置给 当前页面的数据
      this.userProfile.photo = result.photo; // 将上传成功的头像设置给当前头像
      this.showPhoto = false; // 关闭弹层
    },
    // 时间选择器 被单击“确定”按钮后的回调处理
    // val:固定代表选择好的时间信息
    confirmDate(val) {
      // console.log(val) // Thu May 21 2020 00:00:00 GMT+0800 (中国标准时间)
      // console.log(typeof val) // object

      // console.log(dayjs(val)) // dayjs时间对象，可以调用format等方法

      // 要把获得到的对象时间变为“年-月-日”格式的时间

      // 转化时间
      this.userProfile.birthday = dayjs(val).format("YYYY-MM-DD");
      // 关闭弹出层
      this.showBirthday = false;
    },

    // 性别被选中回调处理
    // val:被选中项目的菜单单元信息  {name:xx}
    onSelect(val) {
      // console.log(val); // {name:'男'}
      // 组件实例成员接收选中的数据
      this.userProfile.gender = val.name === "男" ? 0 : 1;
      // 关弹层
      this.showSex = false;
    },
    // 获取用户资料的方法
    async getUserProfile() {
      this.userProfile = await apiUserProfile();
      // 把获得好的用户生日信息变为对象格式，赋予给时间选取器的nowDate
      this.nowDate = new Date(this.userProfile.birthday);
    },

    save() {
      this.$toast.success("保存成功");
    }
  }
};
</script>


<style scoped lang='less'></style>
