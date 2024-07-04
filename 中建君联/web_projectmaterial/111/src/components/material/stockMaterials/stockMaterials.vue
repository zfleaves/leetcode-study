<!--
 * @Author: your name
 * @Date: 2020-08-03 11:07:22
 * @LastEditTime: 2022-07-14 14:25:20
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\material\varietiesDetail\varietiesDetail.vue
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
        <g-query-table :config="mainTable" @tableList="getTableSeleList">
        </g-query-table>
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
  name: 'stockMaterials',
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
        rowKey: 'rowKey',
        // 多选
        isCheckbox: true,
        selectedList: [],
        // 表格数据
        tableData: [],
        // 子系统表头渲染参数
        tableList: [
          // 材料品种编码
          { show: true, prop: 'materialCode', label: 'fConfig.materialCode', minWidth: '140' },
          // 材料品种名称
          { show: true, prop: 'materialName', label: 'fConfig.materialName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards'},
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' }
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
          { show: true, prop: 'materialCode', label: 'fConfig.materialCode', minWidth: '140' },
          // 材料品种名称
          { show: true, prop: 'materialName', label: 'fConfig.materialName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards'},
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' }
        ]
      },
      materialName: '',
      // =====================
      tableSeleList: [],
      varietiesDateilUrl: '',
      selectId: [],
      temTableData: [],
      cloneSelectList: [],
      active: 0
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
    // 出库
    warTyppe: {
      type: String,
      default: 'warOutbound' // warOutbound 出库
    },
    type: {
      type: String,
      default: ''
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
      default: 0
    }
  },
  async created () {
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.mainTable.maxHeight = this.dialogHeight - 140;
    this.mainTable.selectedList = this.selectList;
    this.cloneSelectList = this.$clone(this.selectList);
    if (this.type === 'warOutbound') {
      // 可用库存
      this.mainTable.tableList.push(
        { show: true, prop: 'availableStock', label: 'dialog.availableStock'}
      );
    }
    if (this.warTyppe === 'warOutbound') {
      this.varietiesDateilUrl = 'warOutbound/getWarehouseStockMaterialsList';
    }
    if (this.warTyppe === 'warReturn') {
      this.varietiesDateilUrl = 'warReturn/getWarehouseOutboundMaterialsList';
    }
    this.getVarietiesDateilList();
  },
  methods: {
    // 获取材料明细
    getVarietiesDateilList (type) {
      this.loading = true;
      this.active = this.active + 1;
      const data = {
        projectId: this.projectId,
        warehouseId: this.warehouseId || '',
        materialName: this.materialName
      };
      this.$store.dispatch(this.varietiesDateilUrl, data).then(res => {
        if (res.status === 0) {
          const selectList = [];
          const selectIds = [];
          for (const item of this.cloneSelectList) {
            selectIds.push(`${item.hashColumn}-${item.materialId}`);
          }
          this.selectId = selectIds; // 默认勾选
          res.results.forEach(item => {
            item.rowKey = `${item.hashColumn}-${item.materialId}`;
            const index = this.cloneSelectList.findIndex(v => `${v.hashColumn}-${v.materialId}` === item.rowKey);
            if (index >= 0) {
              selectList.push(item);
            }
          });
          if (this.active === 1) {
            this.cloneSelectList.forEach(sele => {
              const key = selectList.findIndex(v => `${v.hashColumn}-${v.materialId}` ===
                `${sele.hashColumn}-${sele.materialId}`);
              if (key < 0) {
                this.temTableData.push(sele);
              }
            });
          }
          this.mainTable.tableData = res.results;
          this.mainTable.selectedList = selectList.concat(this.temTableData);
          !type && (this.selectMainTable.tableData = selectList.concat(this.temTableData));
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
      this.getVarietiesDateilList('search');
    },
    // 获取选中的数据
    getTableSeleList (arr) {
      const selectTable = this.temTableData.concat(arr);
      this.selectMainTable.tableData = this.unique(selectTable);
      this.cloneSelectList = this.$clone(this.selectMainTable.tableData);
    },
    unique (arr) {
      const list = []; // 选中
      arr.forEach(item => {
        const index = list.findIndex(v => v.rowKey === item.rowKey);
        if (index < 0) {
          list.push(item);
        }
      });
      return list;
    },
    // 传出
    handleDialogStatus (status) {
      if (status === 'close') {
        this.$emit('update:close', false);
      } else {
        this.$emit('getData', this.selectMainTable.tableData);
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
    width: calc(100% - 280px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .materialCode {
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
    .materialName {
      min-width: 100px;
      float: left;
      height: 100%;
      width: calc(100% - 280px);
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
