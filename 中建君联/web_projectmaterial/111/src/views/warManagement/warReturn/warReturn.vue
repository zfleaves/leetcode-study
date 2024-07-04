<!--
 * @Author: your name
 * @Date: 2020-08-05 09:15:37
 * @LastEditTime: 2020-08-25 15:08:12
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\warManagement\warReturn\warReturn.vue
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
    name: 'warReturn',
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
            mainReturnMaterials: '',
            projectName: '',
            remarks: '',
            returnDateFrom: '',
            returnDateTo: ''
        }
      };
    },
    async created () {
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('warReturn/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'returnId',
          keyName: 'projectName',
          row,
          api: 'warReturn/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
