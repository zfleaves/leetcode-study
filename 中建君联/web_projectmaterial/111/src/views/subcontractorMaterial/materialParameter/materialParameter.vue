<!--
 * @Author: your name
 * @Date: 2021-04-19 11:00:30
 * @LastEditTime: 2022-07-11 16:35:42
 * @LastEditors: wumaoxia 1805428335@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \web_projectmaterial\src\views\subcontractorMaterial\materialParameter\materialParameter.vue
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
  name: 'materialParameter',
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
  async created() {
    await this._getTableDataList();
  },
  methods: {
    // 获取表单
    _getTableDataList() {
      this.handleGetTableDataList('materialParameter/getPageList', true, () => {
        for (const item of this.pageConfig.mainTable.tableData) {
          const onEnterQuantity = item.onEnterQuantity || 0;
          const includeUnitPrice = item.includeUnitPrice || 0;
          const onEnterQuantityAmount = Number((onEnterQuantity * includeUnitPrice).toFixed(2));
          this.$set(item, 'onEnterQuantityAmount', onEnterQuantityAmount);
        }
      });
    }
  }
};
</script>

<style scoped lang="scss"></style>
