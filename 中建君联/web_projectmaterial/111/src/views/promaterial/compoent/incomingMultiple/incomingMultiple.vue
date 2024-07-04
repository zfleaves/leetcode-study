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
    <query-page
        res="incomingMultiple"
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
    name: 'incomingMultiple',
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
            projectId: 0,
            materialName: '',
            sourceType: '',
            contractId: ''
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
        sourceType: {
          default: '01'
        },
        contractId: {
          default: ''
        }
    },
    methods: {
        // 获取表单
        _getTableDataList () {
            this.pageConfig.searchControls.searchData.projectId = this.projectId;
            this.pageConfig.searchControls.searchData.sourceType = this.sourceType;
            this.pageConfig.searchControls.searchData.contractId = this.contractId;
            this.handleGetTableDataList('purchaseSettlement/getIncomingList', false, () => {
                this.pageConfig.mainTable.tableData.forEach(item => {
                  item.incomingDocNo = item.docNo;
                  item.incomingId = item.id;
                });
                this.pageConfig.mainTable.selectedList = this.selectList;
            });
        },
        handleInfo(row) {
          const type = 'info';
          this.handleSetRouter(type, row);
        },
      // 增、改、查 路由跳转设置
      handleSetRouter(type, row) {
        if (row.id) {
          if (!this.judgeSamePerson(row) && type === 'edit') {
            this.editError(this.$t('button.edit'));
            return;
          }
        }
        const translateType = type;
        type = this.$base64.encode(type);
        const id = this.$base64.encode(row.id || 0);
        const checkArrivalId = this.$base64.encode(0);
        const routeName = 'warIncoming';
        const RouteTitleObj = {name: `${routeName}Edit`, loadRouteName: routeName, translateType};
        localStorage.setItem('RouteTitle', JSON.stringify(RouteTitleObj));
        this.$router.push(`/${routeName}Edit/${type}/${id}/warIncoming/${checkArrivalId}/${routeName}`);
        this.$emit('update:close', false);
      },
      judgeSamePerson(row) {
        const createBy = row.createBy;
        const userId = Auth.hasUserInfo().userId;
        return createBy === userId;
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
