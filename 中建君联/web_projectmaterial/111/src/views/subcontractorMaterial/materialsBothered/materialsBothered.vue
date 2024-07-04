<!--
 * @Author: your name
 * @Date: 2021-04-19 11:00:44
 * @LastEditTime: 2021-04-19 16:03:31
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\subcontractorMaterial\materialsBothered\materialsBothered.vue
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
      @searchEvent="searchEvent"
    >
      <template slot="mainTable" slot-scope="config">
        <g-query-table
          :config="config.scope"
          :tableList.sync="tableSeleList"
          @fnName="pageConfigEmitQueryTableButtonFnName"
        >
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
  name: 'materialsBothered',
  mixins: [search],
  data() {
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
        exitTimeFrom: '',
        exitTimeTo: '',
        flowStatus: [],
        mainExitMaterial: '',
        projectName: '',
        registerName: '',
        projectUnitName: ''
      }
    };
  },
  async created() {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList() {
      this.handleGetTableDataList('materialsBothered/getPageList');
    },
    // 删除
    handleDelete(row) {
      const statusConfig = {
        keyId: 'subcontractMaterialExitId',
        keyName: 'projectName',
        row,
        api: 'materialsBothered/setDelete'
      };
      this.setDataDelete(statusConfig, row);
    }
  }
};
</script>

<style scoped lang="scss"></style>
