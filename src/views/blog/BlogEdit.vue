<template>
  <!-- 新增博客组件 -->
  <div>
    <!-- 新增修改弹窗 -->
    <Window
      :show="windowConfig.show"
      :buttons="windowConfig.buttons"
      @close="closeWindow"
    >
      <el-form :model="blogFormData" ref="blogFormRef" :rules="rules">
        <el-form-item prop="title">
          <!-- 套一层重写input框样式 -->
          <div class="title-input">
            <el-input
              placeholder="请输入博客标题"
              v-model="blogFormData.title"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="markdownContent">
          <!-- 必须套一层 -->
          <div :style="{ width: '100%' }">
            <EditorMarkdown
              :height="editorMDHeight"
              v-model="blogFormData.markdownContent"
              @htmlContent="setHtmlContent"
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
          ref="settingsFormRef"
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
            prop="reprintUrl"
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
import { ref, reactive, nextTick, getCurrentInstance, onMounted } from "vue";
const { proxy } = getCurrentInstance();
const editorMDHeight = window.innerHeight - 60 - 20 - 30 - 50 - 10 - 70;
const editorHTMLHeight = window.innerHeight - 60 - 20 - 30 - 50 - 100 - 70;

const api = {
  loadDataList: "/category/loadAllCategory4Blog",
  saveBlog: "/blog/saveBlog",
};
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

// 1.markdown 博客正文
const blogFormRef = ref();
const blogFormData = ref({}); // 博客数据
// markdown编辑器设置html内容
const setHtmlContent = (htmlContent) => {
  blogFormData.value.content = htmlContent;
};
// 展示配置弹框
const showSettings = () => {
  blogFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    dialogConfig.show = !dialogConfig.show;
  });
  // console.log(dialogConfig.show);
};
const rules = {
  title: [{ required: true, message: "请选择文章标题" }],
  markdownContent: [{ required: true, message: "请选择文章内容" }],
  categoryId: [{ required: true, message: "请选择博客分类" }],
  cover: [{ required: true, message: "请选择博客类型" }],
  reprintUrl: [{ required: true, message: "请输入原文地址" }],
  allowcomment: [{ required: true, message: "请选择是否允许评论" }],
};

// 2.配置弹框 提交新增博客
const dialogConfig = reactive({
  show: true,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        // 提交表单
        submitBlog();
      },
    },
  ],
});

// 博客数据 默认有tag属性
const settingsformData = ref({ tag: [] });
const categoryList = ref([]); // 博客分类数据

const loadCategoryList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  categoryList.value = result.data;
};

onMounted(() => {
  loadCategoryList();
});
// 标签关闭 并且删除form里的数据
const showTagInput = ref(false);
const closeTag = (index) => {
  settingsformData.value.tag.splice(index, 1);
  // console.log(settingsformData.value.tag);
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

// 提交表单
const settingsFormRef = ref();
const submitBlog = () => {
  settingsFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    // let params = {
    //   blogId: blogFormData.blogId,
    //   title: blogFormData.title,
    //   markdownContent: blogFormData.markdownContent,
    //   content: blogFormData.content,
    //   editorType: 1,
    // };
    let params = {};
    Object.assign(params, blogFormData.value);
    Object.assign(params, settingsformData.value);
    let result = await proxy.Request({
      url: api.saveBlog,
      params,
    });
    if (!result) {
      return;
    }
    // dialogConfig.show = false;
    proxy.message.success("博客保存成功");
    // loadDataList();
  });
};
</script>

<style lang="scss">
.el-form-item.is-error .el-input__wrapper {
  box-shadow: none;
}
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
