<template>
  <el-table
    ref="queryTable"
    :data="tableData"
    :height="treeTableConfig.maxHeight"
    size="small"
    stripe
    :row-key="getRowId"
    :default-expand-all="treeTableConfig.expandAll"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <template slot="empty">
      <no-data>
      </no-data>
    </template>
    <el-table-column align="center" type="index"
                     :label="$t('fConfig.serialNumber')" width="60">
    </el-table-column>
    <template v-for="item in cloneTableHeaderCon">
      <el-table-column
        v-if="item.inputStatus !=='hide'"
        :key="item.id" :fixed="item.fixed || false"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth"
        :align="item.formType === 'operate' ? 'center' : ''"
        :show-overflow-tooltip="item.formType !== 'operate'">
        <template slot-scope="scope">
          <!-- 按钮 -->
          <div v-if="item.formType === 'operate'">
            <!--根据不用的禁用条件禁用-->
            <!-- v-has="but.has" -->
            <el-button
              :key="but.id"
              v-for="but in item.buts"
              :class="but.class"
              :disabled="handleFlowStatus(scope.row,but)"
              @click.stop.prevent="setFn(but, scope.row)"
              type="text" size="mini" v-fast-click>
              {{but.name}}
            </el-button>
          </div>
          <!-- 数据字典 -->
          <span v-else-if="item.formType === 'dicSelect'" :class="item.fn && 'smallFont set'"
                @click.stop.prevent="setFn(item, scope.row)">
            {{setDicData(scope.row[item.prop], item.selectList)}}
          </span>
          <!-- 千分位 -->
          <span v-else-if="item.formType === 'setMoney'"
                :class="item.fn && 'smallFont set'"
                style="text-align: right;"
                @click.stop.prevent="setFn(item, scope.row)">
            {{scope.row[item.prop] | systemFilters(item)}}
          </span>
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
    name: 'treeTable',
    data () {
      return {
        selectionChangeList: [],
        cloneTableHeaderCon: [],
        rowIndex: -1
      };
    },
    props: {
        treeTableConfig: {
            type: Object,
            default: () => {
                const params = {
                    tableHeaderCon: [], // 表头配置
                    maxHeight: 500, // 默认子表最大高度
                    expandAll: false, // 默认不全部展开
                    getRowId: 'id' // 唯一值
                };
                return params;
            }
        },
        // 表格数据
        tableData: {
            default: () => [],
            type: Array
        }
    },
    watch: {
      tableData: {
        handler () {
        },
        immediate: true
      },
      treeTableConfig: {
        handler () {
          this.cloneTableHeaderCon = JSON.parse(JSON.stringify(this.treeTableConfig.tableHeaderCon));
        },
        immediate: true
      }
    },
    methods: {
      getRowId (row) {
        return row[this.treeTableConfig.getRowId];
      },
      // 操作
      setFn (btnParameter, row) {
        this.$emit('fnName', {row, btnParameter});
      },
      // 数据字典
      setDicData (value, selectList) {
        const index = selectList && selectList.findIndex(v => v.dataCode === value);
        if (index < 0) return '';
        return selectList[index].dataName;
      },
      // 有流程时禁用,
      handleFlowStatus (row, but) {
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
