<!--
 * @Author: your name
 * @Date: 2020-07-29 09:09:35
 * @LastEditTime: 2020-08-22 09:18:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\dialog\projectChildDialog\projectChildDialog.vue
-->
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
                                <div class="childProjectName">
                                  <el-checkbox
                                    @change="handleCurrentChange(data)"
                                    v-model="data.checked"
                                    style='margin-right:8px;'>
                                  </el-checkbox>
                                  <tooltips :value="data.childProjectName">
                                  </tooltips>
                                </div>
                                <div class="attributeName">
                                    <tooltips :value="data.attributeName">
                                    </tooltips>
                                </div>
                                <div class="describe">
                                    <tooltips :value="data.describe">
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
    name: 'projectChildDialog',
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
            projectId: 0,
            childProjectName: ''
        },
        selectData: {},
        selectList: []
      };
    },
    async created () {
      await this._getTableDataList();
      this.selectId && (this.selectData = {id: this.selectId});
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
      // 获取表单
      _getTableDataList () {
        this.pageConfig.searchControls.searchData.projectId = this.$clone(this.projectId);
        this.handleGetTableDataList('publicApi/getProjectChildTree', false, () => {
          this.setChecked(this.pageConfig.mainTable.tableData);
        });
      },
      setChecked(arr) {
        arr.forEach(item => {
          if (this.selectId === item.id) {
            this.$set(item, 'checked', true);
          } else {
            this.$set(item, 'checked', false);
          }
          if (item.children && item.children.length) {
            this.setChecked(item.children);
          }
        });
      },
      // 搜索
      searchEvent({eventName, params}) {
        if (eventName === 'search') {
          this.$refs.tree.filter(this.pageConfig.searchControls.searchData.childProjectName);
        }
        if (eventName === 'clear') {
          this.pageConfig.searchControls.searchData = this.$clone(params);
          this._getTableDataList();
        }
      },
      // 点击当前行
      handleCurrentChange (data) {
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
          if (!value) return true;
          return data.childProjectName.indexOf(value) !== -1;
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
    .childProjectName {
      width: calc(100% - 350px);
      padding-left: 10px;
      display: flex;
      box-sizing: border-box;
    }
    .attributeName {
      width: 150px;
    }
    .describe{
      width: 200px;
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
        .childProjectName {
          float: left;
          height: 100%;
          display: flex;
          width: calc(100% - 350px);
        }
        .attributeName {
          width: 150px;
          height: 100%;
          float: left;
        }
        .describe{
          width: 200px;
          height: 100%;
          float: left;
        }
    }
}
</style>
