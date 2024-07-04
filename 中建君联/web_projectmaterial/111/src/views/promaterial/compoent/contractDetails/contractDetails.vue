<template>
  <div class="materialVarieties">
    <div class="materialVarieties-cont">
      <div class="left" v-loading="loading" :element-loading-text="$t('tips.loadingText')">
        <div class="title">
          <div class="title-name">
            {{$t(varietiesTitle)}}
          </div>
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
  name: 'contractDetails',
  mixins: [search],
  data () {
    return {
      loading: false,
      mainTable: {
        rowKey: 'eId',
        // 多选
        isCheckbox: true,
        selectedList: [],
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'materialName', label: 'fConfig.varietiesNameSc' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models', minWidth: '60' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand', minWidth: '60' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '80' }
        ]
      },
      selectMainTable: {
        rowKey: 'eId',
        // 表格数据
        tableData: [],
        // 表格高度
        maxHeight: 500,
        // 子系统表头渲染参数
        tableList: [
          // 材料品种名称
          { show: true, prop: 'materialName', label: 'fConfig.varietiesNameSc' },
          // 规格
          { show: true, prop: 'standards', label: 'fConfig.standards', minWidth: '100' },
          // 型号
          { show: true, prop: 'models', label: 'fConfig.models', minWidth: '60' },
          // 品牌
          { show: true, prop: 'brand', label: 'fConfig.brand', minWidth: '60' },
          // 单位
          { show: true, prop: 'unit', label: 'fConfig.unit', minWidth: '80' }
        ]
      },
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
      default: 'tips.contractDetails'
    },
    // 选中的品种
    selectList: {
      default: () => []
    },
    expendRegisterId: {
      default: ''
    }
  },
  async created () {
    await this._setTableDataList();
    this.selectMainTable.maxHeight = this.dialogHeight - 140;
    this.mainTable.maxHeight = this.dialogHeight - 140;
    const selectList = this.$clone(this.selectList);
    selectList.forEach((item, index) => {
      item.sort = selectList.length - index;
      this.checkList.push(item);
      this.selectDialogList.push(item);
      this.selectMainTable.tableData.push(item);
    });
  },
  methods: {
    _setTableDataList (type) {
      this.loading = true;
      const data = {
        expendRegisterId: this.expendRegisterId
      };
      this.$store.dispatch('publicApi/getContractInfoPublicApi', data).then(res => {
        if (res.status === 0) {
            const detailsList = res.results.registerDetails;
            for (const item of detailsList) {
            this.$set(item, 'materialName', item.itemName);
            this.$set(item, 'eId', item.id);
            console.log(item.taxRate, 'taxRate');
                if (this.checkList.length) {
                    const index = this.checkList.findIndex(v => v.eId === item.eId);
                    if (index >= 0) {
                    this.checkList.splice(index, 1);
                    }
                }
            }
            if (type === 'search') {
                this.mainTable.tableData = detailsList;
            } else {
                this.mainTable.tableData = detailsList;
                this.mainTable.selectedList = this.selectList;
            }
        } else {
          this.$message.error(this.$t(`exception.${res.errorCode}`));
        }
        this.loading = false;
      }).catch(e => {
        this.loading = false;
      });
    },
    // 获取选中的数据
    getTableSeleList (arr) {
      const data = arr.concat(this.checkList);
      for (const item of data) {
        const index = this.selectDialogList.findIndex(val => val.eId === item.eId);
        item.sort = index >= 0 ? this.selectDialogList[index].sort : 0;
      }
      this.selectMainTable.tableData = data.sort(this.compare);
    },
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
</style>
