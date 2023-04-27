<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="100px"
    >
      <el-row :gutter="10">
        <el-col :span="8">
          <!-- 文件上传 -->
          <el-form-item prop="avatar" label="头像">
            <CoverUpload v-model="formData.avatar"></CoverUpload>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input placeholder="请输入昵称" v-model="formData.nickName">
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input placeholder="请输入手机号" v-model="formData.phone">
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <a href="javascript:void(0)" class="a-link">修改密码</a>
          </el-form-item>
          <el-form-item label="默认编辑器" prop="editorType">
            <el-radio-group v-model="formData.editorType">
              <el-radio :label="0">富文本编辑器</el-radio>
              <el-radio :label="1">MarkDown编辑器</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="职业" prop="profession">
            <el-input placeholder="请输入职业" v-model="formData.profession">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="editorType">
            <el-button type="danger">保存</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="简介" prop="introduction"> </el-form-item>
          <EditorHtml v-model="formData.introduction"></EditorHtml>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  getUserInfo: "getUserInfo",
};
const rules = {};
const formData = ref({});
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  formData.value = result.data;
  console.log(formData.value);
};
getUserInfo();
</script>

<style lang="scss" scoped>
</style>

