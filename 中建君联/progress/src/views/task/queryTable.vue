<!--
 * @Author: your name
 * @Date: 2020-07-24 18:55:35
 * @LastEditTime: 2020-07-24 18:55:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_contract-合同管理\src\views\task\queryTable.vue
-->
<template>
  <el-table ref="queryTable" v-loading="loading" style="width:100%" :class="toConfigure.choice"
    :data="tableData" :height="maxHeight" :size="toConfigure.size" :stripe="toConfigure.stripe"
    :border="toConfigure.border" :highlight-current-row="toConfigure.highlightCurrentRow"
    :row-key="getRowId"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    @selection-change="selectionChange" @row-click="clickRow" @current-change="handleCurrentChange">
    <template slot="empty">
      <no-data>
      </no-data>
    </template>
    <el-table-column type="selection" align="center" :reserve-selection='true'
      v-if="toConfigure.choice!=='noChoice'" width="50">
    </el-table-column>
    <el-table-column align="center" type="index" :label="$t('fConfig.serialNumber')" width="60">
    </el-table-column>
    <template v-for="item in cloneTableHeaderCon">
      <el-table-column v-if="item.inputStatus !=='hide' && item.formType === 'expand'"
        :key="item.id" :fixed="item.fixed || false" :prop="item.prop" :label="item.label"
        :min-width="item.minWidth" type="expand"
        :align="item.formType === 'operate' ? 'center' : ''"
        :show-overflow-tooltip="item.formType !== 'operate'">
        <template slot-scope="props">
          <slot name="expand" :scope="props"></slot>
        </template>
      </el-table-column>
      <el-table-column v-if="item.inputStatus !=='hide' && item.formType !== 'expand'"
        :key="item.id" :fixed="item.fixed || false" :prop="item.prop" :label="item.label"
        :min-width="item.minWidth" :align="item.formType === 'operate' ? 'center' : ''"
        :show-overflow-tooltip="item.formType !== 'operate'">
        <template slot-scope="scope">
          <!-- 按钮 -->
          <div v-if="item.formType === 'operate'">
            <!--根据不用的禁用条件禁用-->
            <!-- v-has="but.has" -->
            <el-button :key="but.id" v-for="but in item.buts" :class="but.class"
              :disabled="handleFlowStatus(scope.row,but)"
              @click.stop.prevent="setFn(but, scope.row)" type="text" size="mini" v-fast-click>
              {{but.name}}
            </el-button>
            <slot name='table-buts' :scope="scope.row"></slot>
          </div>
          <!-- 数据字典 -->
          <span v-else-if="item.formType === 'dicSelect'" :class="item.fn && 'smallFont set'"
            @click.stop.prevent="setFn(item, scope.row)">
            {{setDicData(scope.row[item.prop], item.selectList)}}
          </span>
          <!-- 千分位 -->
          <span v-else-if="item.formType === 'setMoney'" :class="item.fn && 'smallFont set'"
            style="text-align: right;" @click.stop.prevent="setFn(item, scope.row)">
            {{scope.row[item.prop] | systemFilters(item)}}
          </span>
          <!-- 插槽 -->
          <slot v-else-if="item.formType === 'slot'" :name="'table-' + item.prop" :scope="scope.row" :item="item">
          </slot>
          <span v-else :class="item.fn && 'smallFont set'"
            @click.stop.prevent="setFn(item, scope.row)">
            {{scope.row[item.prop] | systemFilters(item)}}
          </span>
        </template>
      </el-table-column>
    </template>
  </el-table>
</template>
<script>
  export default {
    name: 'queryTable',
    data() {
      return {
        selectionChangeList: [],
        cloneTableHeaderCon: [],
        rowIndex: -1
      };
    },
    props: {
      // 加载数据
      loading: {
        default: false,
        type: Boolean
      },
      // 表格数据
      tableData: {
        default: () => [],
        type: Array
      },
      // 表格配置
      toConfigure: {
        default: () => {
          const params = {
            size: 'small', // 表格的尺寸
            border: false, // 是否显示边框
            stripe: false, // 是否显示斑马纹
            highlightCurrentRow: true, // 当前行高亮
            choice: 'noChoice', // radio => 单选  checkbox => 多选
            spanMethod: '', // 表格合并函数,
            getRowId: 'id' // row-key
          };
          return params;
        },
        type: Object
      },
      // 表头配置
      tableHeaderCon: {
        default: () => [],
        type: Array
      },
      maxHeight: {
        type: Number,
        default: 500 // 默认子表最大高度
      },
      deleteObj: {
        type: Object,
        default: () => {}
      },
      defaultSeleOne: {
        type: Boolean,
        default: false // 是否默认选中第一行
      },
      // 选中的数据
      selectedUsers: {
        type: Array,
        default: () => []
      },
      // 表单选中的id
      selectionId: {
        type: Number,
        default: 0
      }
    },
    watch: {
      tableHeaderCon: {
        handler() {
          this.cloneTableHeaderCon = JSON.parse(JSON.stringify(this.tableHeaderCon)).filter(column => column.show);
        },
        immediate: true
      },
      deleteObj: {
        handler() {
          const index = this.tableData.findIndex(v => v[this.toConfigure.getRowId] === this.deleteObj[
            this.toConfigure.getRowId]);
          if (index >= 0) {
            this.$refs.queryTable.toggleRowSelection(this.tableData[index], false);
          }
        },
        deep: true
      },
      tableData: {
        handler() {
          if (this.defaultSeleOne) {
            this.$nextTick(() => {
              if (this.rowIndex >= 0) {
                this.$refs.queryTable.setCurrentRow(this.tableData[this.rowIndex]);
              } else {
                this.$refs.queryTable.setCurrentRow(this.tableData[0]);
              }
            });
          }
          if (this.selectedUsers.length > 0) {
            this.$nextTick(() => {
              this.toggleSelection(this.selectedUsers);
            });
          }
          if (this.tableData.length && this.defaultSeleOne) {
            this.$emit('rowClick', this.tableData[0]);
            this.$refs.queryTable.setCurrentRow(this.tableData[0], true);
          } else {
            this.$emit('rowClick', '');
          }
          if (this.selectionId) {
            const index = this.tableData.findIndex(v => v.id === this.selectionId);
            if (index >= 0) {
              this.$emit('rowClick', this.tableData[index]);
              this.$refs.queryTable.setCurrentRow(this.tableData[index], true);
            }
          }
        },
        immediate: true
      },
      selectionId: {
        handler() {
          if (this.selectionId) {
            const index = this.tableData.findIndex(v => v.id === this.selectionId);
            if (index >= 0) {
              this.$emit('rowClick', this.tableData[index]);
              this.$refs.queryTable.setCurrentRow(this.tableData[index], true);
            }
          }
        },
        immediate: true
      }
    },
    methods: {
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            const index = this.tableData.findIndex(v => v[this.toConfigure.getRowId] === row[this
              .toConfigure.getRowId]);
            if (index >= 0) {
              this.$refs.queryTable.toggleRowSelection(this.tableData[index], true);
            }
          });
        } else {
          this.$refs.queryTable.clearSelection();
        }
      },
      getRowId(row) {
        return row[this.toConfigure.getRowId];
      },
      selectionChange(val) {
        if (this.$route.name === 'businessMenuConfig' || this.$route.name === 'businessMenu') {
          return;
        }
        if (this.toConfigure.choice === 'noChoice') return; // 不选
        if (this.toConfigure.choice === 'radio') { // 单选
          if (val.length > 1) {
            this.$refs.queryTable.clearSelection();
            this.$refs.queryTable.toggleRowSelection(val[val.length - 1]);
          }
          if (val.length > 1) {
            this.selectionChangeList = [val[val.length - 1]];
          } else {
            this.selectionChangeList = val;
          }
          this.$emit('update:tableList', this.selectionChangeList);
          return;
        }
        this.selectionChangeList = this.unique(val);
        const tableList = this.selectionChangeList;
        this.$emit('update:tableList', tableList);
      },
      clickRow(row) {
        if (this.$route.name === 'businessMenuConfig' || this.$route.name === 'businessMenu') {
          return;
        }
        this.$emit('rowClick', row);
        if (this.toConfigure.choice === 'noChoice') return; // 不选
        if (this.toConfigure.choice === 'radio') { // 单选
          this.$refs.queryTable.clearSelection();
          this.$refs.queryTable.toggleRowSelection(row);
          return;
        }
        this.$refs.queryTable.toggleRowSelection(row);
      },
      unique(arr) {
        const list = [];
        arr.forEach(item => {
          const index = list.findIndex(v => v[this.toConfigure.getRowId] === item[this.toConfigure
            .getRowId]);
          if (index < 0) {
            list.push(item);
          }
        });
        return list;
      },
      // 操作
      setFn(btnParameter, row) {
        this.$emit('fnName', {
          row,
          btnParameter
        });
      },
      // 数据字典
      setDicData(value, selectList) {
        const index = selectList && selectList.findIndex(v => v.dataCode === value);
        if (index < 0) return '';
        return selectList[index].dataName;
      },
      // 默认选中第一行
      handleCurrentChange(val) {
        this.rowIndex = this.tableData.findIndex(v => v[this.toConfigure.getRowId] === val[this
          .toConfigure.getRowId]);
        this.$emit('update:tableRow', val);
      },
      // 有流程时禁用,
      handleFlowStatus(row, but) {
        if (but.code === 'sysHandleInfo') return false;
        if (!row.flow_status) return false;
        if (row.flow_status === '0') return false;
        return true;
      }
    }
  };

</script>
<style lang="scss" scoped>
</style>
