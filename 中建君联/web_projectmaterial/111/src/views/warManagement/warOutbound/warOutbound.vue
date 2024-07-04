<!--
 * @Author: your name
 * @Date: 2020-07-30 10:35:01
 * @LastEditTime: 2022-08-15 14:39:50
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\promaterial\warOutbound\warOutbound.vue
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
            <template slot="table-pickingUnitName" slot-scope="{row}">
              <span>{{`${row.pickingUnitName}-${row.unitContactName}-${row.unitContactMobile}`}}</span>
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
    name: 'warOutbound',
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
            docNo: '',
            flowStatus: '',
            mainOutboundMaterials: '',
            outboundDateFrom: '',
            outboundDateTo: '',
            outboundTypeCode: '',
            projectName: '',
            pickingUnitName: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('warOutbound/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'outboundId',
          keyName: 'projectName',
          row,
          api: 'warOutbound/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      },
      // 增、改、查 路由跳转设置
      handleSetRouter(type, row = {}) {
        if (row.id) {
          if (!this.judgeSamePerson(row) && type === 'edit') {
            this.editError(this.$t('button.edit'));
            return;
          }
        }
        const translateType = type;
        type = this.$base64.encode(type);
        const id = this.$base64.encode(row.id || 0);
        const inComingId = this.$base64.encode(0);
        const RouteTitleObj = {name: `${this.$route.name}Edit`, loadRouteName: this.$route.name, translateType};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${this.$route.name}Edit/${type}/${id}/${inComingId}/${this.$route.name}`);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
