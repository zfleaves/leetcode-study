<!--
 * @Author: your name
 * @Date: 2020-08-12 17:05:47
 * @LastEditTime: 2021-06-16 09:19:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\incomingMultiple\incomingMultiple.vue
-->
<template>
  <div style="height: 100%;">
    <query-page res="incomingMultiple" :page-config="pageConfig" :loading.sync="loading"
      :tableSeleList.sync="tableSeleList" :dialogHeight="dialogHeight" @searchData="getSearchData"
      @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @dialogEvent="dialogEvent" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
        </g-query-table>
      </template>
    </query-page>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';

export default {
  name: 'supplierMultiple',
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
        // applyDateFrom: '',
        // applyDateTo: '',
        // applyOrgName: '',
        // applyOrgId: '',
        // createByName: '',
        // createTimeFrom: '',
        // createTimeTo: '',
        // planStatus: '01',
        purchasingApplyName: '',
        supplierCategoryCode: '',
        unitNatureCode: '',
        supplierUscc: '',
        establishmentTimeFrom: '',
        establishmentTimeTo: '',
        supplierName: ''
      }
    };
  },
  async created () {
    this.$set(this.pageConfig.mainTable, 'isRadio', this.isRadio);
    this.$set(this.pageConfig.mainTable, 'isCheckbox', !this.isRadio);
    this.pageConfig.mainTable.selectedList = this.selectList;
    await this._getTableDataList();
  },
  props: {
    dialogHeight: {
      type: Number,
      default: 300
    },
    // 选中
    selectList: {
      default: () => []
    },
    isRadio: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.handleGetTableDataList('sysUserSupplier/getSupplierList', true, () => {
        for (const item of this.pageConfig.mainTable.tableData) {
          this.$set(item, 'supplierId', item.id);
          // this.$set(item, 'supplierUscc', item.uscc);
          this.selectList.forEach(val => {
              if (val.purInformationReleaseSupplierId && item.supplierId === val.supplierId) {
              this.$set(item, 'doNotCheck', true);
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
