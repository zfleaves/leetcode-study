<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div
        class="left"
        v-loading="loading"
        :element-loading-text="$t('tips.loadingText')">
        <div class="title">
          <div class="title-name">
            {{ $t(this.currentResources.label) }} {{ $t('dialog.budgetDetail') }}
          </div>
          <el-input
            v-model.trim="varietiesName"
            prefix-icon="el-icon-search"
            :placeholder="$t('tips.resourceNameTips')"
            size="small"
            clearable
            @keyup.enter.native="sysHandleSearch"
            maxlength="64"
          ></el-input>
        </div>
        <div
          class="cons-table-t content"
          :style="{ height: `${dialogHeight - 140}px` }">
          <div
            class="fixed-scroll"
            style="display: flex; flex-direction: column">
            <div class="treeTitle">
              <div v-for="item in mainTable.tableList" :key="item.prop"  :class="item.prop">
                {{ $t(item.label) }}
              </div>
            </div>
            <div class="treeCons">
              <div class="fixed-scroll">
                <el-tree
                  :data="mainTable.tableData"
                  ref="tree"
                  node-key="rowKey"
                  :props="props"
                  class="tree-content"
                  :filter-node-method="filterNode"
                  :default-checked-keys="selectId"
                  @node-click="handleNodeCheckChange">
                  <template slot="empty">
                    <no-data> </no-data>
                  </template>
                  <div class="custom-tree-node" slot-scope="{ node, data }" :class="'level' + data.level">
                    <div class="tree-node" v-if="node.level === 1">
                      <div class="varietiesName">
                        <tooltips :value="data.docNo"></tooltips>
                      </div>
                    </div>
                    <div class="tree-node" v-else-if="node.level === 2">
                      <div class="varietiesName">
                        <tooltips :value="data.resourceName"> </tooltips>
                      </div>
                      <div class="standards">
                        <tooltips :value="data.standards"> </tooltips>
                      </div>
                      <div class="unit">
                        <tooltips :value="data.unit"> </tooltips>
                      </div>
                      <div class="includeUnitPrice">
                        <tooltips :value="data.includeUnitPrice | setMoney"> </tooltips>
                      </div>
                    </div>
                  </div>
                </el-tree>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="title">{{ $t("tips.selected") }}</div>
        <g-query-table :config="selectMainTable"> </g-query-table>
      </div>
    </div>
    <div class="footer">
      <el-button
        class="urgent"
        type="primary"
        icon="el-icon-circle-close"
        size="small"
        @click="handleDialogStatus('close')">
        {{ $t("button.close") }}
        </el-button>
      <el-button
        size="small"
        type="primary"
        icon="el-icon-circle-check"
        @click="handleDialogStatus('save')"
        v-fast-click
        >{{ $t("button.determine") }}
        </el-button>
    </div>
  </div>
</template>

<script>
import { search } from 'mixins/searchMixins';

export default {
  name: 'outboundMaterials',
  mixins: [search],
  data() {
    return {
      loading: false,
      props: {
        label: 'varietiesName',
        children: 'children',
        isLeaf: 'leaf'
      },
      mainTable: {
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
          // 资源名称
          { show: true, prop: 'varietiesName', label: 'dialog.resourceName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' },
          // 单价(含税)
          { show: true, prop: 'includeUnitPrice', label: 'dialog.includeUnitPrice', filterName: 'setMoney', minWidth: '100' }
        ]
      },
      selectMainTable: {
        rowKey: 'rowKey',
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 资源名称
          { show: true, prop: 'resourceName', label: 'dialog.resourceName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' },
          // 单价(含税)
          { show: true, prop: 'includeUnitPrice', label: 'dialog.includeUnitPrice', filterName: 'setMoney', minWidth: '100' }
        ]
      },
      varietiesName: '',
      // =====================
      tableSeleList: [],
      varietiesDateilUrl: '',
      selectId: [],
      temTableData: [],
      selectTableData: [],
      childKey: ''
    };
  },
  props: {
    row: {
        type: Object,
        default: () => {}
    },
    currentResources: {
        type: Object,
        default: () => {}
    },
    projectId: {
        default: ''
    },
    dialogHeight: {
      type: Number,
      default: 300
    },
    // 左侧的展示标题
    varietiesTitle: {
      type: String,
      default: 'fConfig.varieties'
    },
    // 选中的品种
    selectList: {
      default: []
    }
  },
  async created() {
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.mainTable.maxHeight = this.dialogHeight - 140;
    this.selectTableData = this.$clone(this.selectList);
    this.selectMainTable.tableData = this.selectTableData.filter(v => v.dataSourceCode === '02');
    if (this.currentResources.code === '01') {
        this.varietiesDateilUrl = 'demMasterPlan/getProjectMasterLaboursInfo';
        this.childKey = 'details';
    } else if (this.currentResources.code === '02') {
        this.varietiesDateilUrl = 'demMasterPlan/getProjectMasterMaterialsInfo';
        this.childKey = 'masterPlanDetails';
    } else if (this.currentResources.code === '03') {
        this.varietiesDateilUrl = 'demMasterPlan/getProjectMasterMachineriesInfo';
        this.childKey = 'masterPlanDetails';
    } else if (this.currentResources.code === '04') {
        this.varietiesDateilUrl = 'demMasterPlan/getProjectMasterProoverInfo';
        this.childKey = 'details';
    }
    this.getVarietiesDateilList();
  },
  methods: {
    // 获取材料明细
    getVarietiesDateilList() {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        warehouseId: this.warehouseId
        // varietiesName: this.varietiesName
      };
      this.$store.dispatch(this.varietiesDateilUrl, data).then((res) => {
        if (res.status === 0) {
          const results = res.results;
          results.forEach((item) => {
            item.rowKey = item.id;
            item.children = item[this.childKey];
            item.resourceName = '';
            item.children.forEach((child) => {
              child.leaf = true;
              child.eId = child.id;
              child.isNew = true;
              child.dataSourceCode = '02';
              child.resourceName = child.varietiesName;
              child.dataSourceCode = '02';
              child.includeUnitPrice = child.budgetUnitPrice;
              if (this.currentResources.code === '01') { // 资源为劳务
                  child.includeUnitPrice = child.budgetPrice;
                  child.varietiesName = child.profession;
                  child.resourceName = child.profession;
              }
            });
          });
          this.mainTable.tableData = results;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch((e) => {
        console.log(e, 'e');
        this.loading = false;
      });
    },
    // 搜索
    sysHandleSearch() {
      this.$refs.tree.filter(this.varietiesName);
    },
    // 条件过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.resourceName.indexOf(value) !== -1;
    },
    // 点击行
    handleNodeCheckChange(data, node) {
      if (data.leaf) {
        // 点的是子集
        this.selectTableData.push(data);
        this.selectMainTable.tableData = this.selectTableData.filter(v => v.dataSourceCode === '02');
      }
    },
    // 传出
    handleDialogStatus(status) {
      if (status === 'close') {
        this.$emit('update:close', false);
      } else {
        this.$emit('getData', this.selectTableData);
        // this.$emit('getData', this.selectMainTable.tableData);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.materialVarieties {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  .materialVarieties-cont {
    width: 100%;
    display: flex;
    .left {
      flex: 5;
      max-width: 50%;
      margin-right: 20px;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0;
        .title-name {
          width: 40%;
          min-width: 100px;
        }
      }
      .content {
        position: relative;
        width: 100%;
      }
    }
    .right {
      flex: 5;
      max-width: 50%;
      .title {
        align-items: center;
        height: 36px;
        margin: 10px 0;
      }
    }
  }
}
.treeTitle {
  height: 40px;
  width: calc(100% - 2px);
  display: flex;
  border: 1px solid #ebeef5;
  background: #fafafa;
  line-height: 40px;
  color: #909399;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  .varietiesName {
    min-width: 120px;
    width: calc(100% - 280px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .includeUnitPrice {
    width: 100px;
  }
  .standards {
    width: 100px;
  }
  .unit {
    width: 80px;
  }
}
.treeCons {
  flex: 1;
  width: calc(100% - 2px);
  position: relative;
  // background: pink;
  border: 1px solid #ebeef5;
  border-top: 0;
  /deep/ .el-tree-node__content {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ebeef5;
  }
  .custom-tree-node {
    flex-direction: row;
    height: 100%;
    flex: 1;
    text-align: left;
    .tree-node {
      height: 100%;
    }
    .varietiesName {
      min-width: 100px;
      float: left;
      height: 100%;
      width: calc(100% - 280px);
    }
    .includeUnitPrice {
      width: 100px;
      height: 100%;
      float: left;
    }
    .standards {
      width: 100px;
      height: 100%;
      float: left;
    }
    .unit {
      width: 80px;
      height: 100%;
      float: left;
    }
  }
}
.imgUrlList {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
