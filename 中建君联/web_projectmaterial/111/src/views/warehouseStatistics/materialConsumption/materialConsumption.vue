<!--
 * @Author: your name
 * @Date: 2020-08-13 10:56:46
 * @LastEditTime: 2020-09-04 17:51:00
 * @LastEditors: Please set LastEditors
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
    name: 'materialConsumption',
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
            materialCode: '',
            materialName: '',
            projectName: '',
            warehouseId: '',
            warehouseName: '',
            pickingUnitName: ''
        }
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
        this.handleGetTableDataList('warehouseStatistics/materialConsumption');
      },
      // 合计
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        const list = ['totalConsumeQuantity', 'includeTaxAmount'];
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
                  if (column.property === 'totalConsumeQuantity') {
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
