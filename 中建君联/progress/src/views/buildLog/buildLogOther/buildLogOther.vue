<!--
 * @Author: your name
 * @Date: 2021-01-26 09:57:59
 * @LastEditTime: 2021-01-26 14:34:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\buildLog\buildLogOther\buildLogOther.vue
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
    name: 'buildLogOther',
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
            'applyDateFrom': '',
            'applyDateTo': '',
            'createByName': '',
            'flowStatus': [],
            'projectName': ''
        }
      };
    },
    async created () {
      const a = '-';
      console.log(a.split('-'));
      await this._getTableDataList();
    },
    methods: {
      // 获取表单
      _getTableDataList () {
        this.handleGetTableDataList('buildLogOther/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'buildLogApplyId',
          keyName: 'projectName',
          row,
          api: 'buildLogOther/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
