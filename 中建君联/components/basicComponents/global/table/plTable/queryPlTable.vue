<!--
 * @Author: your name
 * @Date: 2020-08-26 17:48:27
 * @LastEditTime: 2022-03-25 11:20:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\table\queryPlTable\queryPlTable.vue
-->
<template>
  <div class="queryPlTable">
    <pl-table ref="queryPlTable" style="width:100%;"
    :style="{height: config.maxHeight || '400px', 'max-height': config.maxHeight || '450px'}"
    use-virtual
    :row-height="40"
    :record-table-select="true"
    :pagination-show="false"
    :class="(config.isRadio || localConfig.isRadio) && 'radio'"
    :data="config.tableData || []"
    :stripe="config.stripe || localConfig.stripe"
    :border="config.border || localConfig.border"
    :resizable="config.resizable || localConfig.resizable"
    :size="config.size || localConfig.size"
    :height="config.maxHeight || localConfig.maxHeight"
    :maxHeight="config.maxHeight || localConfig.maxHeight"
    :fit="config.fit || localConfig.fit"
    :show-header="config.showHeader || localConfig.showHeader"
    :highlight-current-row="config.highlightCurrentRow || localConfig.highlightCurrentRow"
    :row-class-name="config.rowClassName || localConfig.rowClassName"
    :row-style="config.rowStyle || localConfig.rowStyle"
    :cell-class-name="config.cellClassName || cellClassName"
    :cell-style="config.cellStyle || localConfig.cellStyle"
    :header-row-class-name="config.headerRowClassName || localConfig.headerRowClassName"
    :header-row-style="config.headerRowStyle || localConfig.headerRowStyle"
    :header-cell-class-name="config.headerCellClassName || headerCellClassName"
    :header-cell-style="config.headerCellStyle || localConfig.headerCellStyle"
    :current-row-key="config.rowKey || localConfig.rowKey"
    :row-key="config.rowKey || localConfig.rowKey"
    :empty-text="config.emptyText || localConfig.emptyText"
    :default-expand-all="config.defaultExpandAll || localConfig.defaultExpandAll"
    :expand-row-keys="config.expandRowKeys || []"
    :tooltip-effect="config.tooltipEffect || localConfig.tooltipEffect"
    :show-summary="config.showSummary || localConfig.showSummary"
    :sum-text="config.sumText || localConfig.sumText"
    :summary-method="config.summaryMethod || localConfig.summaryMethod"
    :span-method="config.spanMethod || localConfig.spanMethod"
    :select-on-indeterminate="config.selectOnIndeterminate || localConfig.selectOnIndeterminate"
    :indent="config.indent || localConfig.indent"
    :lazy="config.lazy || localConfig.lazy"
    :load="config.load || localConfig.load"
    :tree-props="config.treeProps || localConfig.treeProps"
    @select="eventEmit('select', $event)"
    @select-all="eventEmit('select-all', $event)"
    @selection-change="selectionChange"
    @cell-mouse-enter="eventEmit('cell-mouse-enter', $event)"
    @cell-mouse-leave="eventEmit('cell-mouse-leave', $event)"
    @cell-click="eventEmit('cell-click', $event)"
    @cell-dblclick="eventEmit('cell-dblclick', $event)"
    @row-click="clickRow"
    @row-contextmenu="eventEmit('row-contextmenu', $event)"
    @row-dblclick="eventEmit('row-dblclick', $event)"
    @header-click="eventEmit('header-click', $event)"
    @header-contextmenu="eventEmit('header-contextmenu', $event)"
    @sort-change="eventEmit('sort-change', $event)"
    @filter-change="eventEmit('filter-change', $event)"
    @current-change="handleCurrentChange"
    @header-dragend="eventEmit('header-dragend', $event)"
    @expand-change="eventEmit('expand-change', $event)">
    <template slot="empty">
      <no-data>
      </no-data>
    </template>
    <pl-table-column v-if="config.isCheckbox || localConfig.isCheckbox" type="selection" :selectable="selectable" align="center" width="50">
    </pl-table-column>
    <pl-table-column v-if="config.isRadio || localConfig.isRadio" type="selection" :selectable="selectable" align="center" width="50">
    </pl-table-column>
    <!-- 序号 -->
    <pl-table-column v-if="config.isIndexShow === false ? false :localConfig.isIndexShow" align="center" type="index"
      :label="$t('fConfig.serialNumber')" width="80">
    </pl-table-column>
    <template v-for="item in ((config.tableList || []).filter(val => val.show))">
      <pl-table-column v-if="item.inputStatus !=='hide' && item.formType === 'expand'"
        :key="item.id" :fixed="item.fixed || false" :prop="item.prop" :label="$t(item.label)"
        :width="item.minWidth + '%'" type="expand" class="aaa1111"
        :align="item.formType === 'operate' ? 'center' : item.align || 'left'"
        :show-overflow-tooltip="item.formType !== 'operate'">
        <template slot-scope="props">
          <slot name="expand" :scope="props"></slot>
        </template>
      </pl-table-column>
      <pl-table-column v-if="item.inputStatus !=='hide' && item.formType !== 'expand'"
        :key="item.id" :fixed="item.fixed || false" :prop="item.prop"
        :width="item.minWidth + '%'"
        :align="item.formType === 'operate' ? 'center' : item.formType === 'setMoney' || item.filterName === 'setMoney' ? 'right' : item.align || 'left'"
        :show-overflow-tooltip="item.formType !== 'operate'">
        <template slot="header">
          <tooltips :value="$t(item.label)">
          </tooltips>
        </template>
        <template slot-scope="scope">
          <!-- 按钮 -->
          <div v-if="item.formType === 'operate'" style="text-align:center;">
            <slot name='table-buts-suffix' :scope="scope" :item='item'></slot>
            <!--根据不用的禁用条件禁用-->
            <template  v-for="but in item.buts">
              <el-button :key="but.id" :class="but.class"
                :disabled="handleFlowStatus(scope.row,but)"
                v-if="!but.noAuth ? authButtonList.indexOf(but.authCode) >= 0 : true"
                @click.stop.prevent="setFn(but, scope.row)" type="text" size="mini" v-fast-click>
                {{$t(but.name)}}
              </el-button>
            </template>
            <slot name='table-buts' :scope="scope.row"></slot>
          </div>
          <!-- 数据字典 -->
          <span v-else-if="item.formType === 'dicSelect'" :class="item.fn && 'midFont set'"
            @click.stop.prevent="setFn(item, scope.row)">
            {{setDicData(scope.row[item.prop], item.selectList)}}
          </span>
          <!-- 状态 -->
          <span v-else-if="item.formType === 'sysStatus'" :class="item.fn && 'midFont set'"
            @click.stop.prevent="setFn(item, scope.row)">
            {{statusFilter(scope.row[item.prop])}}
          </span>
          <!-- 金额 -->
          <div v-else-if="item.formType === 'setMoney'" :class="item.fn && 'midFont set'" class="ellipsis"
            @click.stop.prevent="setFn(item, scope.row)" style="text-align: right;">
            {{scope.row[item.prop] | systemFilters(item)}}
          </div>
          <!-- 附件 -->
          <span v-else-if="item.formType === 'attachment'" class="midFont set"
            @click.stop.prevent="handleViewAttachment(scope.row[item.prop])">
            附件{{scope.row[item.prop] ? scope.row[item.prop].split(',').length : 0}}个
          </span>
          <!-- 审批状态 -->
          <span v-else-if="item.formType === 'flowStatus'" class="flowStatus" :class="'flowStatus'+scope.row[item.prop]">
            {{$t(flowStatusFilter(scope.row[item.prop]))}}
          </span>
          <!-- 状态(启用/禁用) -->
          <span v-else-if="item.formType === 'status'" class="status" :class="'status'+scope.row[item.prop]">
            {{statusFilter(scope.row[item.prop])}}
          </span>
          <!-- html -->
          <span v-else-if="item.formType === 'html'" v-html="scope.row[item.prop]"></span>
          <!-- 插槽 -->
          <slot v-else-if="item.formType === 'slot'" :name="'table-' + item.prop" :row="scope.row" :item="item">
          </slot>
          <span v-else :class="item.fn && 'midFont set'">
            <span v-if="item.fn" @click.stop.prevent="setFn(item, scope.row)">{{scope.row[item.prop] | systemFilters(item)}}</span>
            <span v-else>{{scope.row[item.prop] | systemFilters(item)}}</span>
          </span>
        </template>
      </pl-table-column>
    </template>
  </pl-table>
  <!-- 附件弹框 -->
  <el-dialog
    v-dialogDrag
    class="el-dialog-auto" title="附件列表" append-to-body
    center
    v-if="dialogAttachment" :visible.sync="dialogAttachment"
    width="70%">
    <attachment :gridData="gridData">
    </attachment>
  </el-dialog>
  </div>
</template>
<script>
  import {PlTable, PlTableColumn} from 'pl-table';
  import LocalConfig from './defaultConfig';
  import Auth from 'util/auth';

  export default {
    name: 'queryPlTable',
    data () {
      return {
        localConfig: LocalConfig(),
        authButtonList: [],
        selectionChangeList: [],
        rowIndex: -1,
        dialogAttachment: false,
        gridData: []
      };
    },
    components: {
      attachment (resolve) {
        require(['../../upload/attachment'], resolve);
      },
      PlTable,
      PlTableColumn
    },
    created() {
      this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
      this.localConfig.cellClassName = this.getCellClassName;
    },
    props: {
      // 配置
      config: {
        type: Object,
        default: () => {
          const params = {
            tableList: [],
            doNotCheck: []
          };
          return params;
        }
      }
    },
    watch: {
      'config.tableData': {
        handler() {
          // 默认选中第一行
          if (this.config.defaultSeleFirstLine) {
            this.$nextTick(() => {
              if (this.rowIndex >= 0) {
                this.$refs.queryPlTable.setCurrentRow(this.config.tableData[this.rowIndex]);
              } else {
                this.$refs.queryPlTable.setCurrentRow(this.config.tableData[0]);
              }
            });
          }
          // 多选
          this.$nextTick(() => {
            this.toggleSelection(this.config.selectedList);
          });
        },
        immediate: true
      },
      // 多选
      'config.selectedList': {
        handler() {
          // this.$nextTick(() => {
          //   this.toggleSelection(this.config.selectedList);
          // });
        },
        immediate: true
      },
      // 多选是删除某一行后，取消勾选
      'config.deleteObj': {
        handler() {
          if (this.config.deleteObj && this.config.deleteObj[this.config.rowKey || this.localConfig.rowKey]) {
              this.$nextTick(() => {
                const index = this.config.tableData.findIndex(v => v[this.config.rowKey || this.localConfig.rowKey] === this.config.deleteObj[this.config.rowKey || this.localConfig.rowKey]);
                if (index >= 0) {
                  this.$refs.queryPlTable.toggleRowSelection([
                    {row: this.config.tableData[index], selected: false}
                  ]);
                }
              });
          }
        },
        immediate: true
      }
    },
    methods: {
      headerCellClassName({row, column, rowIndex, columnIndex}) {
        if (column.align === 'is-left') {
          return 'table-left';
        } else if (column.align === 'is-center') {
          return 'table-center';
        } else if (column.align === 'is-right') {
          return 'table-right';
        } else {
          return 'table-left';
        }
      },
      cellClassName({row, column, rowIndex, columnIndex}) {
        if (column.align === 'is-left') {
          return 'table-left';
        } else if (column.align === 'is-center') {
          return 'table-center';
        } else if (column.align === 'is-right') {
          return 'table-right';
        } else {
          return 'table-left';
        }
      },
      getCellClassName({row, column, rowIndex, columnIndex}) {
        if (column.property === 'operate') {
          return 'operate';
        }
        return '';
      },
      // 对 Table 进行重新布局
      tableDoLayout() {
        this.$refs.queryPlTable.doLayout();
      },
      // 展开行
      tableToggleRowExpansion(row, status) {
        this.$refs.queryPlTable.toggleRowExpansion(row, status);
        this.$refs.queryPlTable.doLayout();
      },
      // 禁止勾选
      selectable(row, index) {
        if (this.config.selectable) {
          return this.config.selectable(row, index);
        }
        if (row.doNotCheck) {
          return false;
        } else {
          return true;
        }
      },
      // 勾选
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.toggleSelectionChildren(row[this.config.rowKey || this.localConfig.rowKey], this.config.tableData);
          });
        } else {
          this.$refs.queryPlTable.clearSelection();
        }
      },
      toggleSelectionChildren (rowKey, arr) {
        for (const v of arr) {
          if (rowKey === v[this.config.rowKey || this.localConfig.rowKey]) {
            this.$refs.queryPlTable.toggleRowSelection(
              [{row: v, selected: true}]
            );
          } else if (v.children && v.children.length) {
            this.toggleSelectionChildren(rowKey, v.children);
          }
        }
      },
      selectionChange (val) {
        if (this.config.isRadio) { // 单选
          if (val.length > 1) {
            this.$refs.queryPlTable.clearSelection();
            this.$refs.queryPlTable.toggleRowSelection(
              [
                {row: val[val.length - 1], selected: true}
              ]
            );
          }
          if (val.length > 1) {
            this.selectionChangeList = [val[val.length - 1]];
          } else {
            this.selectionChangeList = val;
          }
          this.$emit('update:tableList', this.selectionChangeList);
          this.$emit('tableList', this.selectionChangeList);
        } else if (this.config.isCheckbox) {
          this.selectionChangeList = this.unique(val);
          const tableList = this.selectionChangeList;
          this.$emit('update:tableList', tableList);
          this.$emit('tableList', tableList);
        }
      },
      clickRow (row) {
        if (this.config.selectable) {
          if (!this.config.selectable(row)) return; // 自定义禁止勾选
        }
        if (row.doNotCheck) {
          return;
        }
        if (this.config.doNotCheck && this.config.doNotCheck.length) {
          for (const item of this.config.doNotCheck) {
            if (row[this.config.rowKey || this.localConfig.rowKey] === item[this.config.rowKey || this.localConfig.rowKey]) {
              return;
            }
          }
          this.$emit('rowClick', row);
          if (this.config.isRadio) { // 单选
            this.$refs.queryPlTable.clearSelection();
            this.$refs.queryPlTable.toggleRowSelection(
              [
                {row, selected: true}
              ]
            );
          } else if (this.config.isCheckbox) {
            this.$refs.queryPlTable.toggleRowSelection(
              [
                {row, selected: true}
              ]
            );
          }
        } else {
          this.$emit('rowClick', row);
          if (this.config.isRadio) { // 单选
            this.$refs.queryPlTable.clearSelection();
            this.$refs.queryPlTable.toggleRowSelection(
              [
                {row, selected: true}
              ]
            );
          } else if (this.config.isCheckbox) {
            this.$refs.queryPlTable.toggleRowSelection(
              [
                {row, selected: true}
              ]
            );
          }
        }
      },
      unique (arr) {
        const list = []; // 选中
        arr.forEach(item => {
          const index = list.findIndex(v => v[this.config.rowKey || this.localConfig.rowKey] === item[this.config.rowKey || this.localConfig.rowKey]);
          if (index < 0) {
            list.push(item);
          }
        });
        return list;
      },
      // 操作
      setFn (btnParameter, row) {
        this.$emit('fnName', {
          row,
          btnParameter
        });
      },
      // 查看附件
      handleViewAttachment(value) {
        if (!value) return;
        const attachmentIdList = value.split(',');
        const data = {
          fileIds: attachmentIdList.map((item) => (item = Number(item)))
        };
        this.$store.dispatch('publicApi/getFilepath', data).then(res => {
          this.gridData = res.results;
          this.dialogAttachment = true;
        });
      },
      // 数据字典
      setDicData (value, selectList) {
        const index = selectList && selectList.findIndex(v => String(v.dataCode) === String(value));
        if (index < 0) return '';
        return selectList ? selectList[index].dataName : '';
      },
      // 系统状态
      statusFilter(status) {
          const index = this.$store.state.constant.statusList.findIndex(v => v.dataCode === status);
          if (index >= 0) {
              return this.$t(this.$store.state.constant.statusList[index].dataName);
          } else {
              return '';
          }
      },
      // 审批状态
      flowStatusFilter(flowStatus) {
        const index = this.$store.state.constant.flowStatusList.findIndex(v => v.dataCode === flowStatus);
        if (index >= 0) {
            return this.$t(this.$store.state.constant.flowStatusList[index].dataName);
        } else {
            return '';
        }
      },
      // 默认选中第一行
      handleCurrentChange (val) {
        this.rowIndex = (this.config.tableData && this.config.rowKey) && this.config.tableData.findIndex(v => v[this.config.rowKey] === val[this
          .config.rowKey]);
        this.$emit('update:tableRow', val);
      },
      // 有流程时禁用,
      handleFlowStatus (row, but) {
        if (but.enable) return false;
        if (!this.disbaleCreateBy(row, but)) return true;
        if (but.code === 'sysHandleInfo') return false;
        if (!row.flowStatus) return false;
        if (row.flowStatus === '0') return false;
        return true;
      },

      // 表格事件
      eventEmit(eventName, params) {
        this.$emit('onTableEvent', { event: eventName, params });
      },
      // 操作列业务事件
      onEvent(option, row) {
        this.$store.commit('saveOperationId', option.id);
        this.$emit('onEvent', { event: option.event, option, params: row });
      },
      // 按钮禁用的方法
      // 是否是本人禁用
      disbaleCreateBy(row, but) {
        if (!but.isCreateBy) return true;
        if (!row.createBy) return true;
        const createBy = row.createBy;
        const userId = Auth.hasUserInfo().userId;
        return createBy === userId;
      },
      // 流程状态禁用
      disableFlowStatus(row, but) {
        if (!row.flowStatus) return false;
        if (row.flowStatus === '0') return false;
        return true;
      }
      // 启用
    }
  };

</script>
<style lang="scss" scoped>
.queryPlTable {
  /deep/ .table-left {
    text-align: left !important;
  }
  /deep/ .table-center {
    text-align: center !important;
  }
  /deep/ .table-right {
    text-align: right !important;
  }
  /deep/ {
    .el-table--small td, .el-table--small th, .el-table td, .el-table th {
      border-bottom: 1px solid #EBEEF5 !important;
      border-right: 1px solid #EBEEF5 !important;
      box-sizing: border-box;
    }
  }
}
/deep/ .pl-table {
  thead {
    .cell{
      height: 23px;
    }
  }
  tbody {
      .cell{
      min-height: 23px;
      height: auto;
    }
  }
}
</style>
