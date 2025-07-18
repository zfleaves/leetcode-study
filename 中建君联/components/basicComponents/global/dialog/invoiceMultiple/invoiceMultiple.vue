<!--
 * @Author: your name
 * @Date: 2020-08-14 15:33:09
 * @LastEditTime: 2022-08-18 14:30:51
 * @LastEditors: zengqin 1058574586@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectlabour-项目劳务\src\components\projectlabourDetail\invoiceMultiple\invoiceMultiple.vue
-->
<template>
  <div style="height: 100%;">
    <query-page
        res="invoiceMultiple"
        :page-config="pageConfig"
        :loading.sync="loading"
        :tableSeleList.sync="tableSeleList"
        :dialogHeight="dialogHeight - 10"
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
    name: 'invoiceMultiple',
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
        projectId: {
            default: 0
        },
        contractId: {
            default: 0
        }
    },
    methods: {
        // 获取表单
        _getTableDataList () {
            this.pageConfig.searchControls.searchData.projectId = this.projectId;
            this.pageConfig.searchControls.searchData.contractId = this.contractId;
            this.handleGetTableDataList('publicApi/getInvoiceListPublicApi', false, () => {
                this.pageConfig.mainTable.tableData.forEach(item => {
                    item.invoiceId = item.id;
                });
                this.pageConfig.mainTable.selectedList = this.selectList;
            });
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
