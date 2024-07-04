<!--
 * @Author: your name
 * @Date: 2020-07-30 10:43:17
 * @LastEditTime: 2020-08-08 14:42:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\paymentApply\paymentApply.vue
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
            :tableList.sync="tableSeleList"
            @fnName="pageConfigEmitQueryTableButtonFnName">
            <template slot="table-buts-suffix" slot-scope="{scope}">
              <el-button
               :disabled="scope.row.flowStatus !== '02'"
                v-if="authButtonList.indexOf('renew') >= 0 ? true :false"
                 @click.stop.prevent="handleRenew(scope.row)"
                type="text" size="mini" v-fast-click>
                {{$t('button.renew')}}
              </el-button>
            </template>
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
    name: 'paymentApply',
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
            applyDateFrom: '',
            applyDateTo: '',
            contractName: '',
            docNo: '',
            flowStatus: '',
            partyBUnitName: '',
            projectName: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('paymentApply/getPageList');
      },
      // 更新
      handleRenew (row, type = 'renew') {
        const translateType = type;
        type = this.$base64.encode(type);
        const id = this.$base64.encode(row.id || 0);
        const RouteTitleObj = { name: `${this.$route.name}Edit`, loadRouteName: this.$route.name, translateType };
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${this.$route.name}Edit/${type}/${id}/${this.$route.name}`);
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'paymentId',
          keyName: 'projectName',
          row,
          api: 'paymentApply/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
