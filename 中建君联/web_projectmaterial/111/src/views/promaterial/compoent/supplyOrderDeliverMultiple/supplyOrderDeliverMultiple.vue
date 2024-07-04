<!--
 * @Author: your name
 * @Date: 2021-10-26 18:15:28
 * @LastEditTime: 2021-10-27 09:30:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial-项目材料管理\src\views\promaterial\compoent\supplyOrderDeliverMultiple\supplyOrderDeliverMultiple.vue
-->
<template>
  <div style="height: 100%;">
    <query-page
        res="invoiceMultiple"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        :dialogHeight="dialogHeight"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @dialogEvent="dialogEvent"
        @searchEvent="searchEvent">
        <template slot="mainTable" slot-scope="config">
          <g-query-table
            :config="config.scope"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
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
    name: 'supplyOrderDeliverMultiple',
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
            contractId: 0,
            projectId: 0
        }
      };
    },
    async created () {
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
        supplyOrderId: {
          default: 0
        }
    },
    methods: {
        // 获取表单
        _getTableDataList () {
          this.pageConfig.searchControls.searchData.supplyOrderId = this.supplyOrderId;
          this.handleGetTableDataList('supplyOrder/getDeliverList', false, () => {
            this.pageConfig.mainTable.tableData.forEach(item => {
              item.supplyOrderDeliverDocNo = item.deliverCode;
            });
            this.pageConfig.mainTable.selectedList = this.selectList;
          });
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
