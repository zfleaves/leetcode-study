
<template>
  <div style="height: 100%;">
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        :dialogHeight="dialogHeight"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @dialogEvent="dialogEvent"
        @searchEvent="searchEvent">
        <template slot="mainTable" slot-scope="config">
          <div class="cons-table-t content" :style="{height: `${dialogHeight - 160}px`}">
            <div class="fixed-scroll" style="display: flex;flex-direction: column;">
              <div class="treeTitle">
                <div v-for="item in config.scope.tableList" :key="item.prop" :class="item.prop">
                  {{$t(item.label)}}
                </div>
              </div>
              <div class="treeCons">
                  <div class="fixed-scroll">
                      <el-tree
                          :data="config.scope.tableData" ref="tree"
                          node-key="id" props='props'
                          :check-strictly="true"
                          :filter-node-method="filterNode"
                          :default-checked-keys="[selectId]"
                          default-expand-all
                          @node-click="handleCurrentChange"
                          :expand-on-click-node="false">
                          <template slot="empty">
                            <no-data>
                            </no-data>
                          </template>
                            <div class="custom-tree-node" slot-scope="{data }" :class="'level' + data.level">
                                <div class="projectDetailName">
                                  <el-checkbox
                                    :disabled="data.isDisable"
                                    @change="handleCurrentChange(data)"
                                    v-model="data.checked"
                                    style='margin-right:8px;'>
                                  </el-checkbox>
                                  <tooltips :value="data.projectDetailName">
                                  </tooltips>
                                </div>
                                <div class="projectDetailCode">
                                    <tooltips :value="data.projectDetailCode">
                                    </tooltips>
                                </div>
                                <div class="quantity">
                                    <tooltips :value="data.quantity">
                                    </tooltips>
                                </div>
                                <div class="price">
                                    <tooltips :value="data.price">
                                    </tooltips>
                                </div>
                            </div>
                      </el-tree>
                  </div>
              </div>
            </div>
          </div>
        </template>
    </query-page>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'usePlaceDialog',
    mixins: [search],
    data () {
      return {
        // 查询页面基础参数
        page: new Page(),
        pageConfig: {},
        loading: false,
        // =====================
        tableSeleList: [],
        // 搜索数据
        searchData: {
          projectDetailName: ''
        },
        selectData: {},
        selectList: [],
        parentCode: '-1',
        selectIds: 0
      };
    },
    async created () {
      await this._getTableDataList();
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        // 默认选中
        selectId: {
            default: 0
        },
        projectId: {
            default: 0
        }
    },
    methods: {
      _getTableDataList () {
            this.loading = true;
            const data = {
                projectId: this.projectId
            };
            this.$store.dispatch('publicApi/getProcostProjectCostDetail', data).then(res => {
                if (res.status === 0) {
                  this.selectList = [];
                  this.pageConfig.mainTable.tableData = this.filterArray(res.results, this.parentCode); // 第一层默认父级Code 为 -1
                } else {
                    this.$message.error(this.$t(`exception.${res.errorCode}`));
                }
                this.loading = false;
            }).catch(e => {
                this.loading = false;
            });
        },
      // 遍历形成树形数据
      filterArray(data, parent) {
          const tree = [];
          let temp;
          for (let i = 0; i < data.length; i++) {
              if (data[i].parentCode === parent) {
                  const obj = data[i];
                  if (obj.projectDetailCode === this.selectId) {
                    this.$set(obj, 'checked', true);
                    this.selectList.push(obj);
                  }
                  temp = this.filterArray(data, data[i].projectDetailCode);
                  if (temp.length > 0) {
                      obj.children = temp;
                      obj.isDisable = true;
                  } else {
                    obj.isDisable = false;
                  }
                  tree.push(obj);
              }
          }
          return tree;
      },
      // 搜索
      searchEvent({eventName, params}) {
        if (eventName === 'search') {
          this.$refs.tree.filter(this.pageConfig.searchControls.searchData);
        }
        if (eventName === 'clear') {
          for (const key in this.cloneSearchData) {
            this.$set(this.pageConfig.searchControls.searchData, key, this.cloneSearchData[key]);
          }
          this._getTableDataList();
        }
      },
      // 点击当前行
      handleCurrentChange (data) {
        if (data.isDisable) return;
        this.selectList = [];
        if (data.checked) {
          this.$set(data, 'checked', false);
        } else {
          this.checkRadio(this.pageConfig.mainTable.tableData);
          this.$set(data, 'checked', true);
          this.selectList.push(data);
        }
      },
      // 设置勾选
      checkRadio (arr) {
        for (const i in arr) {
          const item = arr[i];
          this.$set(item, 'checked', false);
          if (item.children && item.children.length) {
            this.checkRadio(item.children);
          }
        }
      },
      dialogEvent(event) {
        if (event === 'close') {
          this.$emit('update:close', false);
        } else {
          this.$emit('getData', this.selectList);
        }
      },
      // 条件过滤
      filterNode(value, data) {
          if (!value.projectDetailName) return true;
          return data.projectDetailName.indexOf(value.projectDetailName) !== -1;
      }
    }
  };
</script>

<style scoped lang="scss">
.cons {
  background-color: #fff;
  color: #303133;
  padding: 10px;
  transition: .3s;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  .content {
      position: relative;
      width: 100%;
  }
}
.treeTitle {
    height: 40px;
    width: calc(100% - 2px);
    display: flex;
    border: 1px solid #EBEEF5;
    background: #fafafa;
    line-height: 40px;
    text-align: left;
    color: #333333;
    font-size: 16px;
    font-weight: 500;
    .projectDetailName {
      width: calc(100% - 450px);
      padding-left: 10px;
      display: flex;
      box-sizing: border-box;
    }
    .projectDetailCode {
      width: 150px;
    }
    .quantity{
      width: 200px;
    }
    .price{
      width: 100px;
    }
}
.treeCons {
    flex: 1;
    width: calc(100% - 2px);
    position: relative;
    // background: pink;
    border: 1px solid #EBEEF5;
    border-top: 0;
    /deep/ .el-tree-node__content {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #EBEEF5;
    }
    .custom-tree-node {
        // display: flex;
        flex-direction: row;
        height: 100%;
        flex: 1;
        text-align: left;
        font-size: 16px;
        .projectDetailName {
          float: left;
          height: 100%;
          display: flex;
          width: calc(100% - 450px);
        }
        .projectDetailCode {
          width: 150px;
          height: 100%;
          float: left;
        }
        .quantity{
          width: 200px;
          height: 100%;
          float: left;
        }
        .price{
          width: 100px;
          height: 100%;
          float: left;
        }
    }
}
</style>
