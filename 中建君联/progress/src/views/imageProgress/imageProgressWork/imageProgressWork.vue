<!--
 * @Author: your name
 * @Date: 2021-01-26 10:14:45
 * @LastEditTime: 2021-01-26 17:06:43
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \web_projectprogress-项目进度管理云\src\views\imageProgress\imageProgressWork\imageProgressWork.vue
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
    name: 'imageProgressWork',
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
          'createByName': '',
          'flowStatus': [],
          'createTimeFrom': '',
          'createTimeTo': '',
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
        this.handleGetTableDataList('imageProgressWork/getPageList');
      },
      // 删除
      handleDelete(row) {
        const statusConfig = {
          keyId: 'imageProgressWorkId',
          keyName: 'projectName',
          row,
          api: 'imageProgressWork/setDelete'
        };
        this.setDataDelete(statusConfig, row);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
