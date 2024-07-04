<!--
 * @Author: your name
 * @Date: 2020-08-13 10:56:46
 * @LastEditTime: 2022-12-29 10:31:05
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\purchaseContractLedger\purchaseContractLedger.vue
-->
<template>
  <div>
    <query-page
        res="sysQueryPage"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @searchEvent="searchEvent">
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            ref="multipleTable"
            :config="config.scope">
          </g-query-table>
        </template>
    </query-page>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'inAndOutFlow',
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
            materialName: '',
            occurDateFrom: '',
            occurDateTo: '',
            projectName: '',
            typeCodes: [],
            warehouseId: '',
            warehouseName: ''
        },
        typeCodeList: [
          {dataName: this.$t('inAndOutFlow.typeCode01'), dataCode: '01'},
          {dataName: this.$t('inAndOutFlow.typeCode02'), dataCode: '02'},
          {dataName: this.$t('inAndOutFlow.typeCode03'), dataCode: '03'},
          {dataName: this.$t('inAndOutFlow.typeCode04'), dataCode: '04'},
          {dataName: this.$t('inAndOutFlow.typeCode05'), dataCode: '05'},
          {dataName: this.$t('inAndOutFlow.typeCode06'), dataCode: '06'},
          {dataName: this.$t('inAndOutFlow.typeCode07'), dataCode: '07'}
        ]
      };
    },
    async created () {
      this.pageSize = 20;
      this.pageConfig.mainTable.summaryMethod = this.getSummaries;
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        const index = this.pageConfig.searchControls.formList.findIndex(v => v.prop === 'typeCodes');
        if (index >= 0) {
          this.pageConfig.searchControls.formList[index].selectList = this.typeCodeList;
        }
        const key = this.pageConfig.mainTable.tableList.findIndex(v => v.prop === 'typeCode');
        if (key >= 0) {
          this.pageConfig.mainTable.tableList[key].selectList = this.typeCodeList;
        }
        this.handleGetTableDataList('warehouseStatistics/inAndOutFlow');
      },
      // 合计
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        const list = ['quantity', 'includeTaxAmount'];
        columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = this.$t('fConfig.total');
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (list.indexOf(column.property) >= 0) {
                sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr || 0);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                }, 0);
                if (list.indexOf(column.property) >= 0) {
                  if (column.property === 'quantity') {
                    sums[index] = Number(sums[index].toFixed(4));
                  } else {
                    sums[index] = this.$utils.commonUtil.toQfw(Number(sums[index].toFixed(2)));
                  }
                }
            } else {
                sums[index] = '';
            }
        });
        this.$nextTick(() => {
            this.$refs.multipleTable.$refs.queryTable.doLayout();
        });
        return sums;
      }
    }
  };
</script>

<style scoped lang="scss">
// .instructionsForUse{
//   p{
//     padding: 10px 0;
//   }
// }
</style>
