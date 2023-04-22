<template>
  <!-- 新增博客组件 -->
  <div>
    <!-- 新增修改弹窗 -->
    <Window
      :show="windowConfig.show"
      :buttons="windowConfig.buttons"
      @close="closeWindow"
    >
      <el-form :model="formData" ref="formDateRef" :rules="rules">
        <el-form-item prop="title">
          <!-- 套一层重写input框样式 -->
          <div class="title-input">
            <el-input
              placeholder="请输入博客标题"
              v-model="formData.title"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="markdownContent">
          <!-- 必须套一层 -->
          <div :style="{ width: '100%' }">
            <EditorMarkdown
              :height="editorMDHeight"
              v-model="formData.markdownContent"
            ></EditorMarkdown>
          </div>
        </el-form-item>
      </el-form>
      <!-- <EditorHtml :height="editorHTMLHeight"></EditorHtml> -->
      <!-- 弹框 -->
      <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="800px"
      >
        <el-form
          :model="settingsformData"
          :rules="rules"
          ref="formDataRef"
          label-width="80px"
          class="blog-setting-form"
        >
          <!-- 分类 -->
          <el-form-item prop="categoryId" label="博客分类">
            <el-select
              v-model="settingsformData.categoryId"
              class="m-2"
              clearable
              placeholder="请选择分类"
              :style="{ width: '100%' }"
            >
              <el-option
                :label="item.categoryName"
                :value="item.categoryId"
                v-for="(item, index) in categoryList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 文件上传 -->
          <el-form-item prop="cover" label="封面">
            <CoverUpload v-model="settingsformData.cover"></CoverUpload>
          </el-form-item>
          <!-- 类型 -->
          <el-form-item prop="type" label="博客类型">
            <el-radio-group v-model="settingsformData.type">
              <el-radio :label="1">原创</el-radio>
              <el-radio :label="0">转载</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 地址 -->
          <el-form-item
            prop="type"
            label="原文地址"
            v-if="settingsformData.type == 0"
          >
            <el-input
              placeholder="请输入原文地址"
              v-model="settingsformData.reprintUrl"
              :autosize="{ minRows: 4, maxRows: 4 }"
            >
            </el-input>
          </el-form-item>
          <!-- 评论 -->
          <el-form-item
            prop="allowcomment"
            label="评论"
            v-model="settingsformData.type"
          >
            <div class="allow-comment">
              <el-radio-group v-model="settingsformData.allowcomment">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">不允许</el-radio>
              </el-radio-group>
              <span class="info"
                >请先在评论设置里设置好相应参数,评论才会生效</span
              >
            </div>
          </el-form-item>
          <!-- 简介 -->
          <el-form-item label="简介" prop="summary">
            <el-input
              placeholder="博客摘要"
              v-model="settingsformData.summary"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
            >
            </el-input>
          </el-form-item>
          <!-- 标签 -->
          <el-form-item label="简介" prop="categoryDesc">
            <div class="tag-input-panel">
              <div class="tag-list">
                <el-tag
                  v-for="(item, index) in settingsformData.tag"
                  :key="index"
                  @close="closeTag(index)"
                  class="tag-item"
                  closable
                  >{{ item }}</el-tag
                >
              </div>
              <span class="info" v-if="settingsformData.tag.length == 0"
                >添加标签更容易被搜索引擎收录</span
              >
              <span
                class="iconfont icon-add"
                @click="showTagInputHandler"
                v-if="!showTagInput"
              ></span>
              <el-input
                class="tag-input"
                v-if="showTagInput"
                v-model="tagInputValue"
                @blur="saveTagInput"
                @keyup.enter="saveTagInput"
              ></el-input>
            </div>
          </el-form-item>
        </el-form>
      </Dialog>
    </Window>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const editorMDHeight = window.innerHeight - 60 - 20 - 30 - 50 - 10 - 70;
const editorHTMLHeight = window.innerHeight - 60 - 20 - 30 - 50 - 100 - 70;
// 新增修改弹框
const windowConfig = reactive({
  show: true,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        showSettings();
      },
    },
  ],
});
const closeWindow = () => {
  windowConfig.show = false;
  //   loadDataList();
};
const showEdit = (type, data) => {
  windowConfig.show = true;
};

// markdown 表单
const formData = ref({});
const rules = {};

// 弹框 提交新增博客
const dialogConfig = reactive({
  show: true,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {},
    },
  ],
});
const showSettings = () => {
  dialogConfig.show = !dialogConfig.show;
  console.log(dialogConfig.show);
};
// 博客数据 默认有tag属性
const settingsformData = ref({ tag: [] });
const categoryList = ref([]); // 博客分类数据

// 标签关闭 并且删除form里的数据
const showTagInput = ref(false);
const closeTag = (index) => {
  settingsformData.value.tag.splice(index, 1);
  console.log(settingsformData.value.tag);
};
// 添加标签
const showTagInputHandler = () => {
  showTagInput.value = true;
};
// 标签输入框内容
const tagInputValue = ref(null);
// 失去焦点或者按下enter保存标签
const saveTagInput = () => {
  showTagInput.value = false; // input 框关闭
  if (tagInputValue.value) {
    if (settingsformData.value.tag.indexOf(tagInputValue.value) === -1) {
      settingsformData.value.tag.push(tagInputValue.value);
    } else {
      proxy.message.warning("重复");
    }
  }
  tagInputValue.value = undefined; // 清空input值
};
</script>

<style lang="scss">
.title-input {
  width: 100%;
  border-bottom: 1px solid #ddd;
  .el-input__wrapper {
    box-shadow: none;
  }
  input {
    font-size: 18px;
  }
}
// 评论
.blog-setting-form {
  .allow-comment {
    display: flex;
    .info {
      margin-left: 10px;
      color: rgb(175, 175, 175);
      font-size: 13px;
    }
  }
  //   标签
  .tag-input-panel {
    display: flex;
    align-items: center;
    // 标签排列
    .tag-list {
      display: flex;
      .tag-item {
        margin-right: 10px;
      }
    }
    .info {
      color: rgb(175, 175, 175);
      font-size: 13px;
      margin-right: 10px;
    }
    .icon-add {
      margin-right: 10px;
      color: red;
      cursor: pointer;
    }
    .tag-input {
      width: 100px;
    }
  }
}
</style>
