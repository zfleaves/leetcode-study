<!--
 * @Author: your name
 * @Date: 2020-08-13 10:56:46
 * @LastEditTime: 2021-12-20 10:11:22
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
        <template slot="mainOperateBtnTips">
          <el-tooltip placement="top-start">
            <div slot="content" class="tips-popper">
              <div>{{$t('realTimeInventory.explainTips1')}}</div>
              <div>{{$t('realTimeInventory.explainTips2')}}</div>
              <div>{{$t('realTimeInventory.explainTips3')}}</div>
              <div>{{$t('realTimeInventory.explainTips4')}}</div>
              <div>{{$t('realTimeInventory.explainTips5')}}</div>
              <div>{{$t('realTimeInventory.explainTips6')}}</div>
              <div>{{$t('realTimeInventory.explainTips7')}}</div>
            </div>
            <!-- 说明？ -->
            <span class="tips">{{$t('tips.explainTips')}}<i class="el-icon-question"></i></span>
          </el-tooltip>
        </template>
        <template slot="mainTable" slot-scope="config">
          <g-query-pl-table
            :config="config.scope">
          </g-query-pl-table>
        </template>
    </query-page>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';
  import Auth from 'util/auth';

  export default {
    name: 'realTimeInventory',
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
            warrantyExpiredDateFrom: '',
            warrantyExpiredDateTo: '',
            models: ''
        }
      };
    },
    async created () {
      this.pageSize = 20;
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.pageConfig.mainTable.rowStyle = this.rowStyle;
        const value = this.pageConfig.searchControls.searchData.warrantyExpiredDateTo;
        this.pageConfig.searchControls.searchData.warrantyExpiredDateTo = value ? value.replace('00:00:00', '23:59:59') : '';
        this.handleGetTableDataList('warehouseStatistics/realTimeInventory', true, () => {
        const tableData = this.pageConfig.mainTable.tableData;
        if (tableData.length > 0) {
          const realExcludeTaxAmount = tableData.reduce((a, b, c) => {
            return a += Number(b.realExcludeTaxAmount);
          }, 0);
          const realIncludeTaxAmount = tableData.reduce((a, b, c) => {
            return a += Number(b.realIncludeTaxAmount);
          }, 0);

           const totalOutboundQuantity = tableData.reduce((a, b, c) => {
            return a += Number(b.totalOutboundQuantity);
          }, 0);
          const availableStock = tableData.reduce((a, b, c) => {
            return a += Number(b.availableStock);
          }, 0);

          const frozenStock = tableData.reduce((a, b, c) => {
            return a += Number(b.frozenStock);
          }, 0);
          tableData.push({
            projectName: this.$t('fConfig.summary'),
            totalOutboundQuantity: Math.round(totalOutboundQuantity * Math.pow(10, 2)) / Math.pow(10, 2),
            availableStock: Math.round(availableStock * Math.pow(10, 2)) / Math.pow(10, 2),
            frozenStock: Math.round(frozenStock * Math.pow(10, 2)) / Math.pow(10, 2),
            realExcludeTaxAmount: Math.round(realExcludeTaxAmount * Math.pow(10, 2)) / Math.pow(10, 2), id: -1,
            realIncludeTaxAmount: Math.round(realIncludeTaxAmount * Math.pow(10, 2)) / Math.pow(10, 2)
          });
        }
        });
      },
      //
      rowStyle({row, column, rowIndex, columnIndex}) {
        // 绿（90天-61天）、蓝（60天-31天）、橙（30天-7天）、红（6天-0天）
        // 已过期
        if (row.differDays === -1) {
          return 'color: #999999';
        } else if (row.differDays === 1) {
          // 0 - 6
          return 'color: #f73535';
        } else if (row.differDays === 2) {
          // 7 - 30
          return 'color: #f55e14;opacity: 0.8;';
        } else if (row.differDays === 3) {
          // 31 - 60
          return 'color: #2b74ec';
        } else if (row.differDays === 4) {
          // 61 - 90
          return 'color: #24b568';
        } else if (row.differDays === 5) {
          // > 90
          return 'color: #24b568';
        }
      }
    }
  };
</script>

<style scoped lang="scss">
.instructionsForUse{
  p{
    padding: 10px 0;
  }
}
.tips{
  position: absolute;
  left: 0;
  font-size: 14px;
  line-height: 36px;
  color: #248bfe;
}
.tips-popper{
  line-height: 30px;
}
</style>
