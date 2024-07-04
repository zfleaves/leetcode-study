<!--
 * @Author: your name
 * @Date: 2020-07-25 10:06:32
 * @LastEditTime: 2022-05-23 09:26:55
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\material\materialVarieties\materialVarieties.vue
-->
<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
        <div class="title">
          <div class="title-name">
            {{$t(varietiesTitle)}}
          </div>
          <el-input v-model.trim="varietiesName" prefix-icon="el-icon-search"
            :placeholder="`${$t('tips.pleaseEnter')}${$t('fConfig.varietiesNameSc')}`" size="small" clearable
            @keyup.enter.native="searchTableData('search')" maxlength="64"></el-input>
          <el-input v-model.trim="standards" prefix-icon="el-icon-search"
            :placeholder="`${$t('tips.pleaseEnter')}${$t('fConfig.standards')}`" size="small" clearable
            @keyup.enter.native="searchTableData('search')" maxlength="64" style="margin-left: 20px;"></el-input>
        </div>
        <g-query-table :config="mainTable" ref="mainTable" @tableList="getTableSeleList">
        </g-query-table>
        <div class="table_pages" v-if="planType === 'varieties'">
          <g-to-page ref="Page" :page-size="pageSize" :total="total" @sentPages="getPages">
          </g-to-page>
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
  name: 'materialVarieties',
  mixins: [search],
  data () {
    return {
      loading: false,
      mainTable: {
        rowKey: 'varietiesId',
        // 多选
        isCheckbox: true,
        selectedList: [],
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 材料品种编码
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode', minWidth: '120' },
          // 材料品种名称
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '80' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' },
          // 别名
          { show: true, prop: 'aliasName', label: 'fConfig.aliasName', minWidth: '100' }
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
          { show: true, prop: 'varietiesCode', label: 'fConfig.varietiesCode'},
          // 材料品种名称
          { show: true, prop: 'varietiesName', label: 'fConfig.varietiesName'},
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '80' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '60' },
          // 别名
          { show: true, prop: 'aliasName', label: 'fConfig.aliasName', minWidth: '100' }
        ]
      },
      varietiesName: '',
      standards: '',
      // =====================
      pageNo: 1,
      pageSize: 100,
      total: 0,
      temTableData: [],
      checkList: [],
      selectDialogList: []
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
    selectId: {
      default: () => []
    },
    selectList: {
      default: () => []
    },
    // 禁止选中的数据
    doNotCheck: {
      type: Array,
      default: () => []
    },
    // 区分需求总计划与年/季
    planType: {
      type: String,
      default: 'varieties'
    },
    projectId: {
      default: 0
    }
  },
  created () {
    // this.searchTableData();
    if (this.planType === 'varieties') {
      this._getTableDataList();
    } else {
      this._setTableDataList();
    }
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    if (this.planType === 'varieties') {
      this.mainTable.maxHeight = this.dialogHeight - 180;
    } else {
      this.mainTable.maxHeight = this.dialogHeight - 140;
    }
    const selectList = this.$clone(this.selectList);
    selectList.forEach((item, index) => {
      item.rowKey = `${item.varietiesId}${this.selectMainTable.tableData.length + 1}`;
      item.sort = selectList.length - index;
      this.checkList.push(item);
      this.selectDialogList.push(item);
      this.selectMainTable.tableData.push(item);
    });
  },
  methods: {
    async searchTableData (type = '') {
      this.$refs.Page && this.$refs.Page.setCurrentPage();
    },
    // 分页
    getPages (obj) {
      if (obj.isSzieChange) {
        this.pageSize = obj.pageSize;
      } else {
        this.pageNo = obj.pageNo;
      }
      if (this.planType === 'varieties') {
        this._getTableDataList();
      } else {
        this._setTableDataList();
      }
    },
    // 年/季
    _setTableDataList (type) {
      this.loading = true;
      const data = {
        projectId: this.projectId,
        queryType: this.planType,
        varietiesName: this.varietiesName
      };
      this.$store.dispatch('yearPlan/getVarietiesVaguePage', data).then(res => {
        if (res.status === 0) {
          let applyTotalQuantity = '';
          this.temTableData = [];
          if (this.planType === 'year') {
            applyTotalQuantity = 'yearApplyTotalQuantity';
          }
          if (this.planType === 'quarter') {
            applyTotalQuantity = 'quarterApplyTotalQuantity';
          }
          this.selectMainTable.tableList.push({
            show: true, prop: applyTotalQuantity, label: 'fConfig.applyTotalQuantity', minWidth: '100'
          });
          !type && (this.mainTable.selectedList = this.selectId);
          for (const item of res.results.masterPlanDetails) {
            this.doNotCheck.forEach(val => {
              if (item.id === val.varietiesId) {
                item.doNotCheck = true;
              }
            });
            if (this.checkList.length) {
              const index = this.checkList.findIndex(v => v.varietiesId === item.varietiesId);
              if (index >= 0) {
                this.checkList.splice(index, 1);
              }
            }
          }
          this.mainTable.tableData = res.results.masterPlanDetails;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 材料品种
    _getTableDataList (type) {
      this.loading = true;
      const data = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        varietiesName: this.varietiesName,
        standards: this.standards
      };
      this.$store.dispatch('masterPlan/getVarietiesVaguePage', data).then(res => {
        if (res.status === 0) {
          const checkList = [];
          res.results.records.forEach(item => {
            item.varietiesId = item.id;
            const index = this.selectId.findIndex(v => v.varietiesId === item.varietiesId);
            if (index >= 0) {
              checkList.push(item);
            }
          });
          !type && (this.mainTable.selectedList = this.selectId);
          for (const item of res.results.records) {
            this.doNotCheck.forEach(val => {
              if (item.id === val.varietiesId) {
                item.doNotCheck = true;
              }
            });
            if (this.checkList.length) {
              const index = this.checkList.findIndex(v => v.varietiesId === item.varietiesId);
              if (index >= 0) {
                this.checkList.splice(index, 1);
              }
            }
          }
          this.mainTable.tableData = res.results.records;
          this.total = res.results.total;
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 勾选
    getTableSeleList (val) {
      const data = val.concat(this.checkList);
      for (const item of data) {
        item.rowKey = `${item.varietiesId}${this.selectMainTable.tableData.length + 1}`;
        const index = this.selectDialogList.findIndex(val => val.varietiesId === item.varietiesId);
        item.sort = index >= 0 ? this.selectDialogList[index].sort : 0;
      }
      this.selectMainTable.tableData = data.sort(this.compare);
    },
    // 排序 比较大小
    compare (obj1, obj2) {
      const val1 = obj1.sort;
      const val2 = obj2.sort;
      if (val1 < val2) {
        return 1;
      } else if (val1 > val2) {
        return -1;
      } else {
        return 0;
      }
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
          min-width: 100px;
          width: 40%;
        }
      }
      .table_pages {
        text-align: center;
        margin-top: 10px;
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
.cons {
  background-color: #fff;
  color: #303133;
  padding: 10px;
  transition: 0.3s;
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
  border: 1px solid #ebeef5;
  background: #fafafa;
  line-height: 40px;
  color: #909399;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  .classifyName {
    width: calc(100% - 950px);
    padding-left: 10px;
    box-sizing: border-box;
  }
  .classifyCode {
    width: 150px;
  }
  .classifyDiscription {
    width: 200px;
  }
  .createByName {
    width: 100px;
  }
  .updateByName {
    width: 100px;
  }
  .updateTime {
    width: 120px;
  }
  .sorts {
    width: 100px;
  }
  .operate {
    width: 180px;
    text-align: center;
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
    // display: flex;
    flex-direction: row;
    height: 100%;
    flex: 1;
    text-align: left;
    .classifyName {
      float: left;
      height: 100%;
      width: calc(100% - 950px);
    }
    .classifyCode {
      width: 150px;
      height: 100%;
      float: left;
    }
    .classifyDiscription {
      width: 200px;
      height: 100%;
      float: left;
    }
    .createByName {
      width: 100px;
      height: 100%;
      float: left;
    }
    .updateByName {
      width: 100px;
      height: 100%;
      float: left;
    }
    .updateTime {
      width: 120px;
      height: 100%;
      float: left;
    }
    .sorts {
      width: 100px;
      height: 100%;
      float: left;
    }
    .operate {
      width: 180px;
      height: 100%;
    }
  }
}
.imgUrlList {
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
}
</style>
