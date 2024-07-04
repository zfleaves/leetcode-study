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
          <div class="cons-table-t content" :style="{height: `${dialogHeight - 250}px`}">
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
                          class="tree-content"
                          :check-strictly="true"
                          :default-expanded-keys="defaultExpanded"
                          :filter-node-method="filterNode"
                          :default-checked-keys="[selectClassifyId]"
                          show-checkbox
                          @check-change="handleCheckChange"
                          @node-click="handleNodeClickChange">
                          <template slot="empty">
                            <no-data>
                            </no-data>
                          </template>
                            <div class="custom-tree-node" slot-scope="{data}" :class="'level' + data.level">
                                <div class="classifyName">
                                    <tooltips :value="data.classifyName">
                                    </tooltips>
                                </div>
                                <div class="classifyCode">{{data.classifyCode}}</div>
                                <div class="sorts">{{data.sorts}}</div>
                                <div class="classifyDiscription">
                                    <tooltips :value="data.classifyDiscription">
                                    </tooltips>
                                </div>
                                <div class="createByName">
                                    <tooltips :value="data.createByName">
                                    </tooltips>
                                </div>
                                <div class="updateByName">
                                    <tooltips :value="data.updateByName">
                                    </tooltips>
                                </div>
                                <div class="updateTime">
                                    <tooltips :value="data.updateTime | setDate">
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
    name: 'selectClassify',
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
          classifyCode: '',
          classifyDiscription: '',
          classifyName: '',
          createByName: ''
        },
        selectData: 0,
        defaultExpanded: []
      };
    },
    async created () {
      await this._getTableDataList();
      this.selectClassifyId && (this.selectData = this.selectClassifyId);
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        // 默认选中
        selectClassifyId: {
            default: 0
        }
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('classifyWarehouse/getClassifyTree', false, () => {
          this.defaultExpanded = [this.pageConfig.mainTable.tableData[0].id];
          this.setClassifyName(this.pageConfig.mainTable.tableData, {});
        });
      },
      setClassifyName(arr, parentItem) {
        arr.forEach(item => {
          if (!item.classifyCode) {
            item.disabled = true;
          }
          if (!item.levels) {
            item.parentClassifyName = item.classifyName;
          } else {
            item.parentClassifyName = `${parentItem.parentClassifyName}/${item.classifyName}`;
          }
          if (item.children.length) {
            this.setClassifyName(item.children, item);
          }
        });
      },
      // 搜索
      searchEvent({eventName, params}) {
        if (eventName === 'search') {
          this.$refs.tree.filter(this.pageConfig.searchControls.searchData);
        }
        if (eventName === 'clear') {
          this.pageConfig.searchControls.searchData = this.$clone(params);
          this._getTableDataList();
        }
      },
      async handleCheckChange(data, checked, indeterminate) {
        if (!checked || data.disabled) return;
        await this.selectData && this.$refs.tree.setCheckedKeys([this.selectData], false);
        await (this.selectData = this.$clone(data.id));
        await this.$refs.tree.setCheckedKeys([data.id], true);
      },
      async handleNodeClickChange(data, node, indeterminate) {
        if (data.disabled) return;
        node.checked = !node.checked;
      },
      dialogEvent(event) {
        if (event === 'close') {
          this.$emit('update:close', false);
        } else {
          const data = this.$refs.tree.getCheckedNodes().length ? this.$refs.tree.getCheckedNodes()[0] : {};
          this.$emit('getData', data);
        }
      },
      // 条件过滤
      filterNode(value, data) {
          if (!value.classifyCode && !value.classifyDiscription && !value.classifyName && !value.createByName) return true;
          const code = `${data.classifyCode}${data.classifyDiscription}${data.classifyName}${data.createByName}`;
          const codeValue = `${value.classifyCode}${value.classifyDiscription}${value.classifyName}${value.createByName}`;
          return code.indexOf(codeValue) !== -1;
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
    color: #909399;
    text-align: left;
    font-size: 14px;
    font-weight: bold;
    .classifyName {
      width: calc(100% - 770px);
      padding-left: 10px;
      box-sizing: border-box;
    }
    .classifyCode {
      width: 150px;
    }
    .classifyDiscription{
      width: 200px;
    }
    .createByName{
      width: 100px;
    }
    .updateByName{
      width: 100px;
    }
    .updateTime{
      width: 120px;
    }
    .sorts{
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
        .classifyName {
          float: left;
          height: 100%;
          width: calc(100% - 770px);
        }
        .classifyCode {
          width: 150px;
          height: 100%;
          float: left;
        }
        .classifyDiscription{
          width: 200px;
          height: 100%;
          float: left;
        }
        .createByName{
          width: 100px;
          height: 100%;
          float: left;
        }
        .updateByName{
          width: 100px;
          height: 100%;
          float: left;
        }
        .updateTime{
          width: 120px;
          height: 100%;
          float: left;
        }
        .sorts{
          width: 100px;
          height: 100%;
          float: left;
        }
    }
}
</style>
