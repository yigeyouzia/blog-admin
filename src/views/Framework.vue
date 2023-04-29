<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <img src="../assets/logo.png" class="logo" />
        <div class="user-info">
          <span>欢迎回来, </span>
          <el-dropdown trigger="click">
            <span>
              <span class="nick-name">
                {{ userInfo.nickName }}
                <span class="iconfont icon-close"></span>
              </span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar">
            <!-- <img src="../assets/avatar.png" /> -->
            <img :src="userInfo.avatar" />
          </div>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside width="200px" class="left-aside">
          <div>
            <el-button class="post-btn">发布</el-button>
          </div>
          <div class="memu-panel">
            <ul>
              <li v-for="(menu, idx) in menuList" :key="idx">
                <span class="menu-title-p" @click="openClose(idx)">
                  <span :class="['iconfont', menu.icon]"></span>
                  <span class="menu-title">{{ menu.title }}</span>
                  <span
                    :class="[
                      'iconfont',
                      'open-close',
                      menu.open ? 'icon-open' : 'icon-close',
                    ]"
                  ></span>
                </span>
                <ul class="sub-menu" v-if="menu.open">
                  <li v-for="(subMenu, idx1) in menu.children" :key="idx1">
                    <router-link
                      :to="subMenu.path"
                      :class="[
                        'sub-menu-item',
                        activePath == subMenu.path ? 'active' : '',
                      ]"
                      >{{ subMenu.title }}</router-link
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-aside>
        <!-- 右边 -->
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref, watch } from "vue";
import VueCookies from "vue-cookies";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
const menuList = ref([
  {
    title: "博客",
    icon: "icon-blog",
    open: true,
    children: [
      {
        title: "博客管理",
        path: "/blog/list",
      },
      {
        title: "分类管理",
        path: "/blog/category",
      },
    ],
  },
  {
    title: "专题",
    icon: "icon-zhuanti",
    open: true,
    children: [
      {
        title: "专题管理",
        path: "/special/list",
      },
    ],
  },
  {
    title: "设置",
    icon: "icon-settings",
    open: true,
    children: [
      {
        title: "个人信息设置",
        path: "/settings/my",
      },
      {
        title: "博客成员",
        path: "/settings/user",
      },
      {
        title: "系统设置",
        path: "/settings/sysInfo",
        roleType: 1,
      },
    ],
  },
  {
    title: "回收站",
    icon: "icon-delete",
    open: true,
    children: [
      {
        title: "回收站",
        path: "/recovery/list",
      },
    ],
  },
]);

const openClose = (index) => {
  const open = menuList.value[index].open;
  menuList.value[index].open = !open;
};

const userInfo = ref({});

const init = () => {
  userInfo.value = VueCookies.get("userInfo");
  userInfo.value.avatar = proxy.globalInfo.imageUrl + userInfo.value.avatar;
  // console.log(userInfo);
  // console.log(userInfo.value.avatar);
};
init();

// 检测路径变化
const activePath = ref(null);

watch(
  route,
  (newVal, oldVal) => {
    activePath.value = newVal.path;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.layout {
  .header {
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      width: 100px;
      height: 50px;
    }
    .user-info {
      display: flex;
      align-items: center;
      .nick-name {
        color: rgb(107, 107, 218);
        margin-left: 7px;
        cursor: pointer;
        .icon-close {
          font-size: 14px;
        }
      }
      // 头像
      .avatar {
        margin-left: 10px;
        width: 55px;
        img {
          width: 100%;
          border-radius: 50%;
        }
      }
    }
  }
  .container {
    padding-top: 10px;
    background: #f5f6f7;
    height: calc(100vh - 60px);
    // 左边
    .left-aside {
      padding: 0px 15px;
      width: 280px;
      .post-btn {
        background-image: linear-gradient(
          to right bottom,
          #df2929,
          #518c85,
          #494293
        );
        color: #fff;
        height: 40px;
        width: 100%;
      }
      .memu-panel {
        margin-top: 5px;
        // 大标签
        .menu-title-p {
          box-shadow: 2px 2px 10px #ddd;
          line-height: 45px;
          display: block;
          display: flex;
          cursor: pointer;
          padding: 0px 5px;
          border-radius: 10px;
          .iconfont {
            font-size: 18px;
            color: #91949a;
          }
          .menu-title {
            flex: 1;
            margin-left: 10px;
            color: #3f5042;
            font-weight: 800;
            font-size: 16px;
          }
          .open-close {
            width: 20px;
            font-size: 16px;
          }
        }
        // 小标签
        .sub-menu {
          padding-left: 22px;
          font-size: 14px;
          .sub-menu-item {
            line-height: 40px;
            display: block;
            border-radius: 5px;
            box-shadow: 1px 1px 5px #ddd;
            padding: 0 10px;
            font-weight: 500;
            text-decoration: none;
            color: #383a3d;
          }
          .active {
            background: #ecf5ff;
            color: rgb(223, 170, 35);
          }
        }
        // 动画
        .menu-title-p:hover {
          background: #ecf5ff;
          .menu-title {
            color: #409eff;
          }
        }
        .sub-menu-item:hover {
          color: #409eff;
          background: #ecf5ff;
          box-shadow: 2px 2px 10px #ddd;
        }
      }
    }
    .right-main {
      position: relative;
      background: #fff;
      padding: 20px 10px 10px 10px;
    }
  }
}
</style>
