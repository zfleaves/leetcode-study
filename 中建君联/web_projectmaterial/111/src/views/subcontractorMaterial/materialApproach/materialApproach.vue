<!--
 * @Author: your name
 * @Date: 2021-04-19 11:00:19
 * @LastEditTime: 2021-07-28 09:24:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\subcontractorMaterial\materialApproach\materialApproach.vue
-->
<template>
  <div>
    <query-page res="sysQueryPage" :page-config="pageConfig" :loading.sync="loading" :tableSeleList.sync="tableSeleList"
      @searchData="getSearchData" @fnName="pageConfigBtnFnName" @resetTableConfigList="pageConfigResetTableConfigList"
      @onRefresh="pageConfigOnRefresh" @pages="pageConfigPages" @searchEvent="searchEvent">
      <template slot="mainTable" slot-scope="config">
        <g-query-table :config="config.scope" :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName">
        </g-query-table>
      </template>
    </query-page>
  </div>
</template>

<script>
import Page from './config.js';
import { search } from 'mixins/searchMixins';
import Auth from 'util/auth';

export default {
  name: 'materialApproach',
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
        enterTimeFrom: '',
        enterTimeTo: '',
        flowStatus: [],
        mainEnterMaterial: '',
        projectName: '',
        registerName: '',
        projectUnitName: ''
      }
    };
  },
  async created () {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList () {
      this.handleGetTableDataList('materialApproach/getPageList');
    },
    // 删除
    handleDelete (row) {
      const statusConfig = {
        keyId: 'subcontractMaterialEnterId',
        keyName: 'projectName',
        row,
        api: 'materialApproach/setDelete'
      };
      this.setDataDelete(statusConfig, row);
    }
  }
};
</script>

<style scoped lang="scss"></style>
