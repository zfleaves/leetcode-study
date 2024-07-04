<!--
 * @Author: your name
 * @Date: 2020-08-03 11:07:22
 * @LastEditTime: 2021-11-22 15:14:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\material\outboundMaterials\outboundMaterials.vue
-->
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
        <div class="title">
          <div class="title-name">
            {{$t(varietiesTitle)}}
          </div>
          <el-input v-model.trim="materialName" prefix-icon="el-icon-search" :placeholder="$t('tips.varietiesNameTips')"
            size="small" clearable @keyup.enter.native="sysHandleSearch" maxlength="64"></el-input>
        </div>
        <div class="cons-table-t content" :style="{height: `${dialogHeight - 140}px`}">
          <div class="fixed-scroll" style="display: flex;flex-direction: column;">
            <div class="treeTitle">
              <div v-for="item in mainTable.tableList" :key="item.prop" :class="item.prop">
                {{$t(item.label)}}
              </div>
            </div>
            <div class="treeCons">
              <div class="fixed-scroll">
                <el-tree :data="mainTable.tableData" ref="tree" node-key="rowKey" :props='props' class="tree-content"
                  :default-expanded-keys="[1]" :filter-node-method="filterNode" :default-checked-keys="selectId"
                  show-checkbox @node-click="handleNodeCheckChange" @check-change="handleCheckChange">
                  <template slot="empty">
                    <no-data>
                    </no-data>
                  </template>
                  <div class="custom-tree-node" slot-scope="{node, data}" :class="'level' + data.level">
                    <div class="tree-node" v-if="node.level === 1">
                      <div class="materialName1">
                        <tooltips :value="`${data.docNo}-${data.warehouseName}-${data.mainOutboundMaterials}${data.mainOutboundMaterials}${data.mainOutboundMaterials}`">
                        </tooltips>
                      </div>
                    </div>
                    <div class="tree-node" v-else-if="node.level === 2">
                      <div class="materialName">
                        <tooltips :value="data.materialName">
                        </tooltips>
                      </div>
                      <div class="materialCode">
                        <tooltips :value="data.materialCode">
                        </tooltips>
                      </div>
                      <div class="standards">
                        <tooltips :value="data.standards">
                        </tooltips>
                      </div>
                      <div class="models">
                        <tooltips :value="data.models">
                        </tooltips>
                      </div>
                      <div class="brand">
                        <tooltips :value="data.brand">
                        </tooltips>
                      </div>
                      <div class="unit">
                        <tooltips :value="data.unit">
                        </tooltips>
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
        <div class="title">{{$t('tips.selected')}}</div>
        <g-query-table :config="selectMainTable">
        </g-query-table>
      </div>
    </div>
    <div class="footer">
      <el-button class="urgent" type="primary" icon="el-icon-circle-close" size="small"
        @click="handleDialogStatus('close')">{{$t('button.close')}}</el-button>
      <el-button size="small" type="primary" icon="el-icon-circle-check" @click="handleDialogStatus('save')"
        v-fast-click>{{$t('button.determine')}}</el-button>
    </div>
  </div>
</template>

<script>
import { search } from 'mixins/searchMixins';

export default {
  name: 'outboundMaterials',
  mixins: [search],
  data () {
    return {
      loading: false,
      props: {
        label: 'materialName',
        children: 'children',
        isLeaf: 'leaf'
      },
      mainTable: {
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'materialName', label: 'fConfig.materialName' },
          // 材料品种编码
          { show: true, prop: 'materialCode', label: 'fConfig.materialCode' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit' }
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
          // 材料品种编码
          { show: true, prop: 'materialCode', label: 'fConfig.materialCode', minWidth: '120' },
          // 材料品种名称
          { show: true, prop: 'materialName', label: 'fConfig.materialName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models', minWidth: '60' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand', minWidth: '60' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' }
        ]
      },
      materialName: '',
      // =====================
      tableSeleList: [],
      varietiesDateilUrl: '',
      selectId: [],
      temTableData: []
    };
  },
  props: {
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
    },
    // 项目id
    projectId: {
      default: 0
    },
    // 仓库id
    warehouseId: {
      default: ''
    }
  },
  async created () {
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.mainTable.maxHeight = this.dialogHeight - 140;
    this.varietiesDateilUrl = 'warReturn/getWarehouseOutboundMaterialsList';
    this.getVarietiesDateilList();
  },
  methods: {
    // 获取材料明细
    getVarietiesDateilList () {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        warehouseId: this.warehouseId,
        materialName: this.materialName
      };
      this.$store.dispatch(this.varietiesDateilUrl, data).then(res => {
        if (res.status === 0) {
          this.temTableData = [];
          const selectList = [];
          const selectIds = this.selectList.map(v => v.rowKey);
          this.selectId = selectIds; // 默认勾选
          res.results.forEach(item => {
            item.rowKey = item.id;
            item.children = item.outboundDetails;
            item.children.forEach(child => {
              child.warehouseId = item.warehouseId;
              child.warehouseName = item.warehouseName;
              child.leaf = true;
              child.pickingUnitId = item.pickingUnitId;
              child.pickingUnitName = item.pickingUnitName;
              child.outboundMainId = child.outboundId;
              child.eId = child.id;
              child.rowKey = `${child.hashColumn}-${child.outboundMainId}-${child.eId}-${child.materialId}`;
              const index = this.selectList.findIndex(v => `${v.hashColumn}-${v.outboundMainId}-${v.eId}-${v.materialId}` === child.rowKey);
              if (index >= 0) {
                selectList.push(child);
              }
            });
          });
          this.selectList.forEach(sele => {
            const key = selectList.findIndex(v => `${v.hashColumn}-${v.outboundMainId}-${v.eId}-${v.materialId}` ===
              `${sele.hashColumn}-${sele.outboundMainId}-${sele.eId}-${sele.materialId}`);
            if (key < 0) {
              this.temTableData.push(sele);
            }
          });
          this.selectId = selectIds;
          this.selectMainTable.tableData = selectList.concat(this.temTableData);
          this.mainTable.tableData = res.results;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 搜索
    sysHandleSearch () {
      this.$refs.tree.filter(this.materialName);
    },
    // 条件过滤
    filterNode (value, data) {
      if (!value) return true;
      const code = `${data.materialCode}${data.materialName}${data.standards}${data.unit}`;
      return code.indexOf(value) !== -1;
    },
    handleCheckChange (data, checked, indeterminate) {
      const selectVarietiesList = this.$refs.tree.getCheckedNodes().filter(v => v.materialId > 0);
      this.selectMainTable.tableData = selectVarietiesList.concat(this.temTableData);
    },
    // 点击行
    handleNodeCheckChange (data, node) {
      if (data.materialId > 0) {
        this.$refs.tree.setChecked(data.rowKey, !node.checked);
      }
    },
    // 传出
    handleDialogStatus (status) {
      if (status === 'close') {
        this.$emit('update:close', false);
      } else {
        if (!this.selectMainTable.tableData.length || (this.selectMainTable.tableData.length &&
        this.selectMainTable.tableData.every(sec => sec.warehouseId === this.selectMainTable.tableData[0].warehouseId))) {
          this.$emit('getData', this.selectMainTable.tableData);
        } else {
          this.$message.error(this.$t('warReturn.pleaseSecSameWarHouse'));
        }
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
  .materialName {
    min-width: 120px;
    width: calc(100% - 400px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .materialCode {
    width: 100px;
  }
  .standards {
    width: 100px;
  }
  .models {
    width: 60px;
  }
  .brand {
    width: 60px;
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
    .materialName {
      min-width: 100px;
      float: left;
      height: 100%;
      width: calc(100% - 400px);
    }
    .materialName1 {
      min-width: 100px;
      float: left;
      height: 100%;
      width: calc(100% - 50px);
    }
    .materialCode {
      width: 100px;
      height: 100%;
      float: left;
    }
    .standards {
      width: 100px;
      height: 100%;
      float: left;
    }
    .models {
      width: 60px;
      height: 100%;
      float: left;
    }
    .brand {
      width: 60px;
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
/deep/ .tooltip {
  max-width: 580px;
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis;/*隐藏后添加省略号*/
  white-space: nowrap;/*强制不换行*/
}
</style>
