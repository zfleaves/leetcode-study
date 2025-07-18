<template>
  <div style="height: 100%;">
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      :dialogHeight="dialogHeight" @searchData="getSearchData" @fnName="pageConfigBtnFnName"
      @resetTableConfigList="pageConfigResetTableConfigList" @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages"
      @dialogEvent="dialogEvent" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <div class="cons-table-t content" :style="{ height: `${dialogHeight - 250}px` }">
          <div class="fixed-scroll" style="display: flex;flex-direction: column;">
            <div class="treeTitle">
              <div v-for="item in config.scope.tableList" :key="item.prop" :class="item.prop">
                {{ $t(item.label) }}
              </div>
            </div>
            <div class="treeCons">
              <div class="fixed-scroll">
                <el-tree :data="config.scope.tableData" ref="tree" node-key="id" props='props' class="tree-content"
                  :check-strictly="false" :default-expanded-keys="defaultExpanded" :filter-node-method="filterNode"
                  :default-checked-keys="[selectClassifyId]" show-checkbox @check-change="handleCheckChange"
                  @node-click="handleNodeClickChange">
                  <template slot="empty">
                    <no-data>
                    </no-data>
                  </template>
                  <div class="custom-tree-node" slot-scope="{data}" :class="'level' + data.level">
                    <div class="businessFormatName">
                      <tooltips :value="data.businessFormatName"></tooltips>
                    </div>
                    <div class="reaches">
                      <tooltips :isCustomWidth="true"
                        :value="data.reaches === '1' ? '一级' : data.reaches === '2' ? '二级' : ''">
                      </tooltips>
                    </div>
                    <div class="companyAssetsValue">
                      <tooltips :value="data.companyAssetsValue">
                      </tooltips>
                    </div>
                    <div class="illustrate">
                      <tooltips :value="data.illustrate">
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
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';

export default {
  name: 'estimateBudget',
  mixins: [search],
  data() {
    return {
      // 查询页面基础参数
      page: new Page(),
      pageConfig: {},
      loading: false,
      // =====================
      tableSeleList: [],
      // 搜索数据
      searchData: {
        status: 0,
        businessFormatName: '',
        companyAssetsValue: ''
      },
      selectData: 0,
      defaultExpanded: [],
      selectClassifyId: null
    };
  },
  async created() {
    await this._getTableDataList();
    this.selectClassifyId = this.$clone(this.costBusinessFormatId);
  },
  props: {
    dialogHeight: {
      type: Number,
      default: 300
    },
    // 默认选中
    costBusinessFormatId: {
      type: Number,
      default: 0
    },
    projectId: {
      typdataSourcee: Number,
      default: 0
    }
  },
  methods: {
    // 获取表单
    _getTableDataList() {
      this.searchData.projectId = this.projectId;
      this.handleGetTableDataList('costBusinessFormat/getTree', false, () => {
        this.defaultExpanded = this.pageConfig.mainTable.tableData.length > 0 ? this.pageConfig.mainTable.tableData.map(v => v.id) : [];
        this.pageConfig.mainTable.tableData.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(val => {
              this.$set(val, 'secondBusinessFormatValue', val.businessFormatName);
              this.$set(val, 'secondBusinessFormatId', val.id);
              this.$set(val, 'firstBusinessFormatValue', item.businessFormatName);
              this.$set(val, 'firstBusinessFormatId', item.id);
            });
          }
        });
      });
    },
    // 搜索
    searchEvent({ eventName, params }) {
      if (eventName === 'search') {
        this.$refs.tree.filter(this.pageConfig.searchControls.searchData);
      }
      if (eventName === 'clear') {
        this.$set(this.pageConfig.searchControls.searchData, 'businessFormatName', '');
        this.$set(this.pageConfig.searchControls.searchData, 'companyAssetsValue', '');
        this._getTableDataList();
      }
    },
    handleCheckChange(node, list) {
      // console.log(node, list, 'node, list');
      // }
    },
    async handleNodeClickChange(data, node, indeterminate) {
      if (data.disabled) return;
      node.checked = !node.checked;
      if (data.id > 0) {
        node.checked && this.$refs.tree.setCheckedKeys([data.id]);
      }
    },
    dialogEvent(event) {
      if (event === 'close') {
        this.$emit('update:close', false);
      } else {
        const data = this.$refs.tree.getCheckedNodes().length ? this.$refs.tree.getCheckedNodes().filter(v => v.secondBusinessFormatId > 0) : [];
        this.$emit('getData', data);
      }
    },
    // 条件过滤
    filterNode(value, data) {
      if (!value.businessFormatName && !value.companyAssetsValue) return true;
      const code = `${data.businessFormatName}${data.companyAssetsValue}`;
      const codeValue = `${value.businessFormatName}${value.companyAssetsValue}`;
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
  text-align: left;
  color: #333333;
  font-size: 16px;
  font-weight: 500;

  .businessFormatName {
    width: calc(100% - 600px);
    padding-left: 10px;
    box-sizing: border-box;
  }

  .companyAssetsValue {
    width: 200px;
  }

  .reaches {
    width: 100px;
  }

  .illustrate {
    width: 300px;
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

    .businessFormatName {
      float: left;
      height: 100%;
      width: calc(100% - 600px);
    }

    .companyAssetsValue {
      width: 200px;
      height: 100%;
      float: left;
    }

    .reaches {
      width: 100px;
      height: 100%;
      float: left;
    }

    .illustrate {
      width: 300px;
      height: 100%;
      float: left;
    }
  }
}
</style>
