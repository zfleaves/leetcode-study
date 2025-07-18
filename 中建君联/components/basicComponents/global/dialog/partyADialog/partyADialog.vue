<!--
 * @Author: your name
 * @Date: 2020-07-24 17:48:57
 * @LastEditTime: 2021-12-21 15:26:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\components\basicComponents\global\dialog\partyADialog\partyADialog.vue
-->
<template>
  <div style="height: 100%;">
    <query-page
        :page-config="pageConfig"
        :loading.sync="loading"
        :dialogHeight="dialogHeight"
        @searchData="getSearchData"
        @fnName="pageConfigBtnFnName"
        @resetTableConfigList="pageConfigResetTableConfigList"
        @onRefresh="pageConfigOnRefresh"
        @pages="pageConfigPages"
        @dialogEvent="dialogEvent"
        @searchEvent="searchEvent">
        <template slot="search" slot-scope="{configForm, searchFormValue}">
          <g-search-form :configForm="configForm"
                          :searchFormValue="searchFormValue">
          </g-search-form>
        </template>
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
    name: 'partyADialog',
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
          appraiseStatus: '',
          createTimeEnd: '',
          createTimeStart: '',
          flowStatus: ['02'],
          partyACode: '',
          partyAName: '',
          propertyCode: '',
          tagCode: '',
          unitPartATypeId: ''
        }
      };
    },
    props: {
        dialogHeight: {
            type: Number,
            default: 300
        },
        // 选中的单位
        selectId: {
            default: 0
        },
        isCheckbox: {
          type: Boolean,
          default: false
        }
    },
    async created () {
      if (this.isCheckbox) {
        this.pageConfig.mainTable.isCheckbox = this.isCheckbox;
        this.pageConfig.mainTable.isRadio = false;
        this.pageConfig.mainTable.selectedList = this.selectId;
      } else {
        this.pageConfig.mainTable.isCheckbox = this.isCheckbox;
        this.pageConfig.mainTable.isRadio = true;
        this.pageConfig.mainTable.selectedList = [{id: this.selectId}];
      }
      await this._getTableDataList();
    },
    methods: {
        // 获取表单
        _getTableDataList () {
          this.handleGetTableDataList('publicApi/getPartyAPageList');
            // this.loading = true;
            // const data = {
            //     pageNo: this.pageNo,
            //     pageSize: this.pageSize,
            //     ...this.pageConfig.searchControls.searchData
            // };
            // this.$store.dispatch('publicApi/getPartyAPageList', data).then(res => {
            //   if (res.status === 0) {
            //       this.pageConfig.mainTable.tableData = res.results.records;
            //       this.pageConfig.mainTable.total = res.results.total;
            //   } else {
            //       this.$message.error(this.$t(`exception.${res.errorCode}`));
            //   }
            //   this.loading = false;
            // }).catch(e => {
            //   this.loading = false;
            // });
        }
    }
  };
</script>

<style scoped lang="scss">
</style>
