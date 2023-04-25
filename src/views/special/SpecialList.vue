<template>
  <div>
    <el-button type="danger" @click="showEdict('add')">新增分类</el-button>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题</span>
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="true"
            :dataSource="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            @rowClick="rowClick"
          >
            <template #cover="{ row }">
              <!-- 图片 -->
              <Cover :cover="row.cover"></Cover>
            </template>
            <template #op="{ row }">
              <div class="op">
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdict('update', row)"
                  >修改</a
                >
                <el-divider direction="vertical" />
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                  >删除</a
                >
                <el-divider direction="vertical" />
                <!-- 如果是第一个 不能上移 not-allow -->
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题</span>
            </div>
          </template>
        </el-card>
        <div class="special-blog-tree">
          <el-tree
            class="tree-panel"
            ref="refTree"
            :data="blogList"
            defaultExpandAll
            node-key="blogId"
            :expand-on-click-node="false"
            :props="treeProps"
            :highlight-current="true"
            draggable
            @node-drop="blogDrag"
          >
            <template #default="{ data }">
              <span class="custom-node-style">
                <span class="node-title">
                  <span
                    v-if="data.status == 0"
                    :style="{ color: 'red', 'font-size': '13px' }"
                  >
                    {{ data.title }}</span
                  >
                  <span v-else :style="{ color: 'green', 'font-size': '13px' }">
                    {{ data.title }}</span
                  >
                </span>
                <span class="node-op">
                  <template v-if="data.blogId === '0'">
                    <a
                      class="a-link"
                      href="javascript:void(0)"
                      @click="editBlog('add', data)"
                      >新增文章</a
                    >
                  </template>
                  <template v-else>
                    <a
                      class="a-link"
                      href="javascript:void(0)"
                      @click="showDetail(data)"
                      >预览</a
                    >
                    <el-divider direction="vertical" />
                    <a
                      class="a-link"
                      href="javascript:void(0)"
                      @click="editBlog('edit', data)"
                      v-if="
                        userInfo.userId == data.userId || userInfo.roleType == 1
                      "
                      >修改</a
                    >
                    <span v-else>--</span>
                    <el-divider direction="vertical" />
                    <a
                      class="a-link"
                      href="javascript:void(0)"
                      @click="delBlog(data)"
                      v-if="
                        userInfo.userId == data.userId || userInfo.roleType == 1
                      "
                      >删除</a
                    >
                    <span v-else>--</span>
                    <el-divider direction="vertical" />
                    <a
                      class="a-link"
                      href="javascript:void(0)"
                      @click="editBlog('add', data)"
                      >新增下级文章</a
                    >
                  </template>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
    </el-row>
    <!-- form -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
      >
        <el-form-item prop="categoryName" label="名称">
          <el-input placeholder="请输入名称" v-model="formData.categoryName">
          </el-input>
        </el-form-item>
        <!-- 文件上传 -->
        <el-form-item prop="cover" label="封面">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="categoryDesc">
          <el-input
            placeholder="请输入简介"
            v-model="formData.categoryDesc"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
import VueCookies from "vue-cookies";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/category/loadCategory4Special",
  saveCategory: "/category/saveCategory4Special",
  delCategory: "category/delCategory4Special",
  getSpecialInfo: "blog/getSpecialInfo",
  delBlog: "/blog/recoveryBlog",
  updateSpecialBlogSort: "blog/updateSpecialBlogSort",
};
const userInfo = ref(VueCookies.get("userInfo") || {});

const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "名称",
    prop: "categoryName",
    width: 200,
  },
  {
    label: "简介",
    prop: "categoryDesc",
  },
  {
    label: "博客数量",
    prop: "blogCount",
    width: 90,
  },
  {
    label: "操作",
    prop: "op",
    width: 150,
    scopedSlots: "op",
  },
];

const tableData = reactive({});
const tableOptions = {
  exHeight: 130,
};
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  });
  if (!result) {
    return;
  }
  // console.log(result);
  Object.assign(tableData, result.data);
};

// 新增 修改
const dialogConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const rules = {
  categoryName: [{ required: true, message: "请输入分类名称" }],
};
const formDataRef = ref();

// 打开展示表单
const showEdict = (type, data) => {
  dialogConfig.show = !dialogConfig.show;
  // 等待窗口弹出再改数据
  nextTick(() => {
    if (type == "add") {
      dialogConfig.title = "新增分类";
      // formDataRef.value.resetFields(); // form组件 清空表单
      formData.value = {};
    } else if (type == "update") {
      // console.log(data);
      dialogConfig.title = "编辑分类";
      formData.value = data;
    }
  });
};
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
// 上传表单
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.saveCategory,
      params: params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    proxy.message.success("保存成功");
    loadDataList();
  });
};
// 删除
const del = (data) => {
  proxy.Confirm(`你确定要删除${data.categoryName}`, async () => {
    let result = await proxy.Request({
      url: api.delCategory,
      params: {
        categoryId: data.categoryId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
    proxy.message.success("删除成功");
  });
};
// 排序 上下移
const changeSort = async (index, dir) => {
  let categoryList = tableData.list;
  if (index == 0 && dir == "up") {
    return;
  }
  if (index == tableData.list.length - 1 && dir == "down") {
    return;
  }
  let temp = categoryList[index];
  let num = dir == "down" ? 1 : -1;
  categoryList.splice(index, 1); // 先删除 再添加
  categoryList.splice(index + num, 0, temp); // 临时值塞进
  console.log(JSON.stringify(categoryList));

  let result = await proxy.Request({
    url: api.changeSort,
    dataType: "json",
    params: categoryList,
  });
  if (!result) {
    return;
  }
  proxy.message.success("排列成功");
  loadDataList();
};
// 专题树
// 获取专题文章
const rowClick = (row) => {
  console.log(row);
  loadBlogList(row.categoryId);
};
const blogList = ref([]);
const loadBlogList = async (categoryId) => {
  let result = await proxy.Request({
    url: api.getSpecialInfo,
    params: {
      categoryId: categoryId,
      showType: "1",
    },
  });
  // console.log(result)
  blogList.value = result.data;
};

// 属性展示专题
const treeProps = {
  children: "children",
  label: "title",
  value: "blogId",
};
// 树拖拽排序
const blogDrag = () => {};
</script>

<style lang="scss" scoped>
</style>
