<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="account">
          <el-input
            v-model="formData.account"
            placeholder="请输入账号"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="formData.password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              v-model="formData.checkCode"
              placeholder="请输入验证码"
              class="input-panel"
              size="large"
            />
            <img
              :src="checkCodeUrl"
              class="check-code"
              @click="changeCheckCode"
            />
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="formData.rememberMe" :label="true"
            >记住我</el-checkbox
          >
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :style="{ width: '100%' }" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import md5 from "js-md5";
import { getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();
import { Lock } from "@element-plus/icons-vue";

const api = {
  checkCode: "api/checkCode",
  login: "/login",
};

const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
};

// 表单相关
const formDataRef = ref(null);
const formData = reactive({});

const rules = {
  account: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
};

const login = () => {
  console.log(formData);
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.login,
      params: {
        account: formData.account,
        password: md5(formData.password),
        chekCode: formData.chekCode,
      },
      errorCallback: () => {
        changeCheckCode();
      },
    });
    console.log(result);
    if (!result) {
      return;
    }
  });
};
</script>

<style lang="scss">
.login-body {
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url(../assets/login-bg2.jpg);
  opacity: 0.88; // 透明度
  .login-panel {
    float: right;
    margin-right: 100px;
    margin-top: 100px;
    padding: 20px;
    width: 350px;
    background: rgb(255, 255, 255, 0.9); // 透明度
    // 渐变色
    // background-image: linear-gradient(t o left right, #f23, #fefefe, #222);
    // background-image: linear-gradient(
    //   to right bottom,
    //   #df2929,
    //   #518c85,
    //   #879342
    // );
    border-radius: 5px;
    box-shadow: 2px 2px 10px #ddd;
    .login-title {
      font-size: 20px;
      text-align: center;
      margin-bottom: 10px;
    }
    .check-code-panel {
      width: 100%;
      display: flex;
      align-items: center;
      .input-panel {
        flex: 1;
        margin-right: 5px;
      }
      .check-code {
        cursor: pointer;
      }
    }
  }
}
</style>