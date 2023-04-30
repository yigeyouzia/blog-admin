<template>
  <div class="body">
    <div class="top-panel">
      <el-form
        @submit.prevent
        :model="searchForm"
        class="search-form"
        labelAlign="left"
      >
        <el-row :gutter="5">
          <el-col :span="5">
            <el-form-item label="标题">
              <el-input
                v-model="searchForm.titleFuzzy"
                placeholder="支持模糊搜索"
                @keyup.enter="loadDataList"
                allowClear
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button type="danger" @click="loadDataList()">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <Table
      :columns="columns"
      :showPagination="true"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <!-- 图片封面 -->
      <template #cover="{ row }">
        <Cover :cover="row.cover"></Cover>
      </template>
      <!-- 文章信息 -->
      <template #blogInfo="{ row }">
        <div class="blogInfo">
          <div>标题：{{ row.title }}</div>
          <div>分类：{{ row.categoryName }}</div>
          <div>作者：{{ row.nickName }}</div>
        </div>
      </template>
      <!-- 文章类型 -->
      <template #typeName="{ row }">
        <div>
          类型：<span v-if="row.type == 0">原创</span>
          <span v-if="row.type == 1">转载</span>
        </div>
        <div v-if="row.type == 1">转载地址 ：{{ row.reprintUrl }}</div>
      </template>
      <!-- 文章类型 -->
      <template #statusName="{ row }">
        <span v-if="row.status == 1" :style="{ color: 'green' }">{{
          row.statusName
        }}</span>
        <span v-else :style="{ color: 'red' }">{{ row.statusName }}</span>
      </template>
      <!-- 文章类型 -->
      <template #time="{ row }">
        <div>创建时间：{{ row.createTime }}</div>
        <div>更新时间：{{ row.lastUpdateTime }}</div>
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
          <a href="javascript:void(0)" class="a-link" @click="delBlog(row)"
            >删除</a
          >
          <el-divider direction="vertical" />
          <!-- 如果是第一个 不能上移 not-allow -->
          <a
            href="javascript:void(0)"
            class="a-link"
            @click="showDetail(row.blogId)"
            >预览</a
          >
        </div>
      </template>
    </Table>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/blog/loadRecoveryList",
  delBlog: "/blog/delBlog",
  reductionBlog: "/blog/reductionBlog",
};

// 搜索
const searchformData = reactive({});
const categoryList = ref();

const loadCategoryList = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
  });
  // console.log(result);
  categoryList.value = result.data;
};
loadCategoryList();

//列表
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "文章信息",
    prop: "blogInfo",
    scopedSlots: "blogInfo",
  },
  {
    label: "评论",
    prop: "allowCommentTypeName",
    width: 100,
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    scopedSlots: "statusName",
  },
  {
    label: "时间",
    prop: "time",
    width: 300,
    scopedSlots: "time",
  },
  {
    label: "操作",
    prop: "op",
    width: 200,
    scopedSlots: "op",
  },
];
const searchForm = reactive({});
const tableData = reactive({});
const tableOptions = {
  exHeight: 50,
};
// 加载数据
const loadDataList = async () => {
  let params = {
    pageNo: tableData.pageNo,
    pageSize: tableData.pageSize,
  };
  Object.assign(params, searchformData);
  let result = await proxy.Request({
    url: api.loadDataList,
    params: params,
  });
  if (!result) {
    return;
  }
  // console.log(result);
  Object.assign(tableData, result.data);
};
// 新增博客
const blogEditRef = ref(null);
const showEdict = (type, data) => {
  blogEditRef.value.init(type, data); // 调用子组件方法
};

// 展示详情
const blogDetailRef = ref(null);
const showDetail = (blogId) => {
  // console.log(blogDetailRef.value);
  blogDetailRef.value.showDetail(blogId);
};
// 删除
const delBlog = (data) => {
  proxy.Confirm(`你确定要删除【${data.title}】吗？`, async () => {
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
    currentCategoryId.value = null;
  });
};
</script>

<style lang="scss">
.blogInfo {
  font-size: 1px;
}
</style>
