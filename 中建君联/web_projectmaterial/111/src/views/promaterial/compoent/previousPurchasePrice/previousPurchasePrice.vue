<!--
 * @Author: your name
 * @Date: 2020-07-31 09:18:48
 * @LastEditTime: 2022-07-14 14:51:34
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\compoent\expendRegister\expendRegister.vue
-->
<template>
  <div style="height: 100%;">
    <query-page
        res="sysQueryPage"
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
    name: 'expendRegister',
    mixins: [search],
    data () {
      return {
        // 查询页面基础参数
        page: new Page(),
        pageConfig: {},
        loading: false,
        // =====================
        tableSeleList: [],
        partyATypeTitle: '',
        dialogVisible: false,
        // 搜索数据
        searchData: {
          varietiesId: '',
          projectId: ''
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
        projectId: {
            default: ''
        },
        frequencyVarietiesId: {
            default: ''
        },
        type: {
            default: ''
        }
    },
    methods: {
        // 获取表单
        _getTableDataList () {
            this.pageConfig.searchControls.searchData.projectId = this.projectId;
            this.pageConfig.searchControls.searchData.varietiesId = this.frequencyVarietiesId;
            this.handleGetTableDataList(`${this.type}/getPreviousPeriodPage`, true, () => {
                if (this.type === 'sporadicPurchase') {
                    for (const item of this.pageConfig.mainTable.tableData) {
                        this.$set(item, 'unitPrice', item.estimateUnitPrice);
                  }
                }
                if (this.type === 'promaterialPurchaseApply') {
                    for (const item of this.pageConfig.mainTable.tableData) {
                        this.$set(item, 'unitPrice', item.purchaseUnitPrice);
                  }
                }
            });
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
