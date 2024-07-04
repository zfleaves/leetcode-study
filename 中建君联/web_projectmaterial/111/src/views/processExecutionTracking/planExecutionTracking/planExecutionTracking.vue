<!--
 * @Author: wumaoxia 1805428335@qq.com
 * @Date: 2022-06-29 09:09:49
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @LastEditTime: 2022-07-07 17:22:57
 * @FilePath: \web_projectmaterial\src\views\processExecutionTracking\planExecutionTracking\planExecutionTracking.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
            :config="config.scope"
            :getRowClassName="getRowClassNameMain"
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
            <template slot="expand" slot-scope="{scope}">
                <g-query-table
                style="margin-left: 40px;"
                :getRowClassName="getRowClassName"
                :config="{
                  tableList: pageConfig.childrenMainTable.tableList,
                  tableData: scope.row.masterPlanDetails
                }"
                @fnName="pageConfigEmitQueryTableButtonFnName">
                </g-query-table>
            </template>
          </g-query-table>
        </template>
    </query-page>
  </div>
</template>

<script>
  import Page from './config.js';
  import {search} from 'mixins/searchMixins';

  export default {
    name: 'planExecutionTracking',
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
            docNo: '',
            projectIds: [],
            projectName: '',
            schemeContent: '',
            varietiesName: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
      this.setButStatus();
    },
    methods: {
        // 获取表单
        _getTableDataList () {
          this.handleGetTableDataList('planExecutionTracking/getPageList');
        },
        getRowClassNameMain({row}) {
          for (const item of row.masterPlanDetails) {
            if ((item.demandQuantity || 0) > (item.changeAfterQuantity || 0)) {
              this.$set(row, 'isError', true);
            }
          }
          return row.isError > 0 ? 'error-active' : '';
        },
        getRowClassName({row}) {
          if ((row.demandQuantity || 0) > (row.changeAfterQuantity || 0)) {
            return 'error-active';
          } else {
            return '';
          }
        },
        handleSetRouter(row, type) {
           const translateType = type;
           type = this.$base64.encode(type);
           const id = this.$base64.encode(row.id || 0);
           const routeName = 'masterPlan';
           const RouteTitleObj = { name: `${routeName}Edit`, loadRouteName: routeName, translateType };
           localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
           this.$router.push(`/${routeName}Edit/${type}/${id}/${routeName}`);
        },
        handleInfo(row, type = 'info') {
          this.handleSetRouter(row, type);
        },


        //  此操作对成本控制有直接影响，请您务必确认：

        //  1.我知悉此操作是我的权责范围

        //  2.我知悉此操作的作用与造成影响

        //  3.我知悉此操作是不可逆、不可撤销、不审批，直接影响已经审批的单据数据

        //  4.我知悉此操作系统不会进行明细记录留痕，且无法追溯的

        handleRenew(row, type = 'renew') {
          const tips = [];
          const tips0 = `${this.$t('planExecutionTracking.title')}`;
          const tips1 = `1、${this.$t('planExecutionTracking.oneTips1')}`;
          const tips2 = `2、${this.$t('planExecutionTracking.oneTips2')}`;
          const tips3 = `3、${this.$t('planExecutionTracking.oneTips3')}`;
          const tips4 = `4、${this.$t('planExecutionTracking.oneTips4')}`;
          tips.push(tips0, tips1, tips2, tips3, tips4);
          this.$confirm(`<span style="color:red">${tips.join('<br>')}</span>`, this.$t('tips.tips'), {
            confirmButtonText: this.$t('button.determine'),
            cancelButtonText: this.$t('button.close'),
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
             this.handleSetRouter(row, type);
          });
        },
        // 设置操作按钮状态
        setButStatus() {
            this.authButtonList = this.$route.meta.authButtonList && this.$route.meta.authButtonList.map(v => v.resUrl);
            console.log(this.authButtonList, 'authButtonList');
            const tableList = this.pageConfig.mainTable.tableList;
            const index = this.authButtonList.findIndex(v => v === 'renew');
            if (index < 0) {
              const i = tableList.findIndex(v => v.formType === 'operate');
              this.$set(tableList[i], 'show', false);
            }
        }
    }
  };
</script>

<style scoped lang="scss">
.generalPage{
  .table_title{
    float: left;
    font-size: 14px;
    text-align: left;
    .tips{
      color: #f73535;
    }
  }
}
</style>
